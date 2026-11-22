import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import {
  ARSAEvent,
  Registration,
  MemberApplication,
  ProjectItem,
  TeamMember,
  GalleryItem,
  ContactMessage,
} from "@/types";
import {
  SEED_EVENTS,
  SEED_PROJECTS,
  SEED_TEAM,
  SEED_GALLERY,
} from "@/data/seed/seed-data";

const LOCAL_STORAGE_KEYS = {
  EVENTS: "arsa_events_store",
  REGISTRATIONS: "arsa_registrations_store",
  MEMBERS: "arsa_members_store",
  PROJECTS: "arsa_projects_store",
  TEAM: "arsa_team_store",
  GALLERY: "arsa_gallery_store",
  MESSAGES: "arsa_messages_store",
};

// Safe local storage helpers (runs in browser, returns defaults in SSR)
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

// -------------------------------------------------------------
// EVENTS
// -------------------------------------------------------------

export async function getEvents(): Promise<ARSAEvent[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, "events");
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ARSAEvent));
      }
    } catch (e) {
      console.warn("Firestore error reading events, falling back to local:", e);
    }
  }

  // Fallback to local storage or seed data
  const local = getLocalItem<ARSAEvent[]>(LOCAL_STORAGE_KEYS.EVENTS, []);
  if (local.length > 0) return local;

  setLocalItem(LOCAL_STORAGE_KEYS.EVENTS, SEED_EVENTS);
  return SEED_EVENTS;
}

export async function getEventBySlug(slug: string): Promise<ARSAEvent | null> {
  const events = await getEvents();
  return events.find((e) => e.slug === slug || e.id === slug) || null;
}

export async function saveEvent(event: ARSAEvent): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "events", event.id);
      await setDoc(docRef, { ...event, updatedAt: new Date().toISOString() });
      return;
    } catch (e) {
      console.warn("Firestore error saving event:", e);
    }
  }

  const events = await getEvents();
  const index = events.findIndex((e) => e.id === event.id);
  const updated = [...events];
  if (index >= 0) {
    updated[index] = { ...event, updatedAt: new Date().toISOString() };
  } else {
    updated.unshift({ ...event, createdAt: new Date().toISOString() });
  }
  setLocalItem(LOCAL_STORAGE_KEYS.EVENTS, updated);
}

export async function deleteEvent(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "events", id));
      return;
    } catch (e) {
      console.warn("Firestore delete failed:", e);
    }
  }

  const events = await getEvents();
  const filtered = events.filter((e) => e.id !== id);
  setLocalItem(LOCAL_STORAGE_KEYS.EVENTS, filtered);
}

// -------------------------------------------------------------
// REGISTRATIONS
// -------------------------------------------------------------

export async function getRegistrations(eventId?: string): Promise<Registration[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, "registrations");
      const q = eventId
        ? query(colRef, where("eventId", "==", eventId), orderBy("createdAt", "desc"))
        : query(colRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Registration));
    } catch (e) {
      console.warn("Firestore error reading registrations:", e);
    }
  }

  const list = getLocalItem<Registration[]>(LOCAL_STORAGE_KEYS.REGISTRATIONS, []);
  if (eventId) {
    return list.filter((r) => r.eventId === eventId);
  }
  return list;
}

export async function createRegistration(reg: Registration): Promise<Registration> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "registrations", reg.id);
      await setDoc(docRef, reg);

      // Increment registration count on event if available
      try {
        const evtRef = doc(db, "events", reg.eventId);
        const evtSnap = await getDoc(evtRef);
        if (evtSnap.exists()) {
          const currentCount = evtSnap.data().totalRegistrations || 0;
          await updateDoc(evtRef, { totalRegistrations: currentCount + 1 });
        }
      } catch (err) {
        console.warn("Could not increment count:", err);
      }
      return reg;
    } catch (e) {
      console.warn("Firestore registration submission fallback:", e);
    }
  }

  const list = getLocalItem<Registration[]>(LOCAL_STORAGE_KEYS.REGISTRATIONS, []);
  list.unshift(reg);
  setLocalItem(LOCAL_STORAGE_KEYS.REGISTRATIONS, list);

  // Update total registrations in local events store
  const events = await getEvents();
  const evtIdx = events.findIndex((e) => e.id === reg.eventId);
  if (evtIdx >= 0) {
    events[evtIdx].totalRegistrations = (events[evtIdx].totalRegistrations || 0) + 1;
    setLocalItem(LOCAL_STORAGE_KEYS.EVENTS, events);
  }

  return reg;
}

export async function updatePaymentStatus(
  registrationId: string,
  status: "Pending" | "Verified" | "Rejected",
  options?: { verifiedBy?: string; rejectionReason?: string }
): Promise<void> {
  const verifiedAt = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "registrations", registrationId);
      await updateDoc(docRef, {
        "payment.status": status,
        "payment.verifiedAt": verifiedAt,
        "payment.verifiedBy": options?.verifiedBy || "Admin",
        "payment.rejectionReason": options?.rejectionReason || "",
      });
      return;
    } catch (e) {
      console.warn("Firestore payment update fallback:", e);
    }
  }

  const list = getLocalItem<Registration[]>(LOCAL_STORAGE_KEYS.REGISTRATIONS, []);
  const idx = list.findIndex((r) => r.id === registrationId);
  if (idx >= 0) {
    list[idx].payment.status = status;
    list[idx].payment.verifiedAt = verifiedAt;
    list[idx].payment.verifiedBy = options?.verifiedBy || "Admin";
    if (options?.rejectionReason) {
      list[idx].payment.rejectionReason = options.rejectionReason;
    }
    setLocalItem(LOCAL_STORAGE_KEYS.REGISTRATIONS, list);
  }
}

// -------------------------------------------------------------
// PROJECTS
// -------------------------------------------------------------

export async function getProjects(): Promise<ProjectItem[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "projects"));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectItem));
      }
    } catch (e) {
      console.warn("Firestore projects fallback:", e);
    }
  }

  const local = getLocalItem<ProjectItem[]>(LOCAL_STORAGE_KEYS.PROJECTS, []);
  if (local.length > 0) return local;

  setLocalItem(LOCAL_STORAGE_KEYS.PROJECTS, SEED_PROJECTS);
  return SEED_PROJECTS;
}

export async function saveProject(project: ProjectItem): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "projects", project.id), project);
      return;
    } catch (e) {
      console.warn("Firestore save project error:", e);
    }
  }

  const list = await getProjects();
  const idx = list.findIndex((p) => p.id === project.id);
  const updated = [...list];
  if (idx >= 0) updated[idx] = project;
  else updated.unshift(project);
  setLocalItem(LOCAL_STORAGE_KEYS.PROJECTS, updated);
}

export async function deleteProject(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "projects", id));
      return;
    } catch (e) {
      console.warn("Firestore delete project error:", e);
    }
  }

  const list = await getProjects();
  setLocalItem(LOCAL_STORAGE_KEYS.PROJECTS, list.filter((p) => p.id !== id));
}

// -------------------------------------------------------------
// TEAM
// -------------------------------------------------------------

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "team"));
      if (!snap.empty) {
        return snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as TeamMember))
          .sort((a, b) => a.order - b.order);
      }
    } catch (e) {
      console.warn("Firestore team fallback:", e);
    }
  }

  const local = getLocalItem<TeamMember[]>(LOCAL_STORAGE_KEYS.TEAM, []);
  if (local.length > 0) return local.sort((a, b) => a.order - b.order);

  setLocalItem(LOCAL_STORAGE_KEYS.TEAM, SEED_TEAM);
  return SEED_TEAM;
}

export async function saveTeamMember(member: TeamMember): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "team", member.id), member);
      return;
    } catch (e) {
      console.warn("Firestore team save error:", e);
    }
  }

  const list = await getTeamMembers();
  const idx = list.findIndex((m) => m.id === member.id);
  const updated = [...list];
  if (idx >= 0) updated[idx] = member;
  else updated.push(member);
  setLocalItem(LOCAL_STORAGE_KEYS.TEAM, updated);
}

export async function deleteTeamMember(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "team", id));
      return;
    } catch (e) {
      console.warn("Firestore team delete error:", e);
    }
  }

  const list = await getTeamMembers();
  setLocalItem(LOCAL_STORAGE_KEYS.TEAM, list.filter((m) => m.id !== id));
}

// -------------------------------------------------------------
// GALLERY
// -------------------------------------------------------------

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "gallery"));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));
      }
    } catch (e) {
      console.warn("Firestore gallery fallback:", e);
    }
  }

  const local = getLocalItem<GalleryItem[]>(LOCAL_STORAGE_KEYS.GALLERY, []);
  if (local.length > 0) return local;

  setLocalItem(LOCAL_STORAGE_KEYS.GALLERY, SEED_GALLERY);
  return SEED_GALLERY;
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "gallery", item.id), item);
      return;
    } catch (e) {
      console.warn("Firestore gallery save error:", e);
    }
  }

  const list = await getGalleryItems();
  const idx = list.findIndex((g) => g.id === item.id);
  const updated = [...list];
  if (idx >= 0) updated[idx] = item;
  else updated.unshift(item);
  setLocalItem(LOCAL_STORAGE_KEYS.GALLERY, updated);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "gallery", id));
      return;
    } catch (e) {
      console.warn("Firestore gallery delete error:", e);
    }
  }

  const list = await getGalleryItems();
  setLocalItem(LOCAL_STORAGE_KEYS.GALLERY, list.filter((g) => g.id !== id));
}

// -------------------------------------------------------------
// MEMBERSHIP APPLICATIONS (JOIN ARSA)
// -------------------------------------------------------------

export async function getMemberApplications(): Promise<MemberApplication[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "members"));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MemberApplication));
    } catch (e) {
      console.warn("Firestore members fallback:", e);
    }
  }

  return getLocalItem<MemberApplication[]>(LOCAL_STORAGE_KEYS.MEMBERS, []);
}

export async function createMemberApplication(app: MemberApplication): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "members", app.id), app);
      return;
    } catch (e) {
      console.warn("Firestore application submission error:", e);
    }
  }

  const list = getLocalItem<MemberApplication[]>(LOCAL_STORAGE_KEYS.MEMBERS, []);
  list.unshift(app);
  setLocalItem(LOCAL_STORAGE_KEYS.MEMBERS, list);
}

export async function updateApplicationStatus(
  id: string,
  status: "Pending" | "Interviewed" | "Selected" | "Rejected"
): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, "members", id), { status });
      return;
    } catch (e) {
      console.warn("Firestore update status error:", e);
    }
  }

  const list = getLocalItem<MemberApplication[]>(LOCAL_STORAGE_KEYS.MEMBERS, []);
  const idx = list.findIndex((m) => m.id === id);
  if (idx >= 0) {
    list[idx].status = status;
    setLocalItem(LOCAL_STORAGE_KEYS.MEMBERS, list);
  }
}

export const updateMemberStatus = updateApplicationStatus;

// -------------------------------------------------------------
// CONTACT MESSAGES
// -------------------------------------------------------------

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "messages"));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage));
    } catch (e) {
      console.warn("Firestore contact messages fallback:", e);
    }
  }

  return getLocalItem<ContactMessage[]>(LOCAL_STORAGE_KEYS.MESSAGES, []);
}

export async function createContactMessage(msg: ContactMessage): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "messages", msg.id), msg);
      return;
    } catch (e) {
      console.warn("Firestore message save error:", e);
    }
  }

  const list = getLocalItem<ContactMessage[]>(LOCAL_STORAGE_KEYS.MESSAGES, []);
  list.unshift(msg);
  setLocalItem(LOCAL_STORAGE_KEYS.MESSAGES, list);
}

// -------------------------------------------------------------
// DATABASE SEEDER (Used from Admin or setup CLI)
// -------------------------------------------------------------

export async function seedAllData(): Promise<{ success: boolean; count: number }> {
  let count = 0;

  // 1. Seed Events
  for (const evt of SEED_EVENTS) {
    await saveEvent(evt);
    count++;
  }

  // 2. Seed Projects
  for (const proj of SEED_PROJECTS) {
    await saveProject(proj);
    count++;
  }

  // 3. Seed Team
  for (const tm of SEED_TEAM) {
    await saveTeamMember(tm);
    count++;
  }

  // 4. Seed Gallery
  for (const gal of SEED_GALLERY) {
    await saveGalleryItem(gal);
    count++;
  }

  return { success: true, count };
}
