# ARSA Events Portal 🤖⚡

**Official Events, Hackathons & Registration Portal** for **ARSA (Automation & Robotics Student Association)**, Department of Automation & Robotics, JSPM's Rajarshi Shahu College of Engineering, Pune.

A production-ready Next.js 14 web application allowing students to browse robotics events, register in one click, submit UPI fees, receive passes, and enabling organizers to manage events, verify payments, and export attendee manifests without writing code.

---

## 🌟 Key Features

### 🏛️ Public Student Experience
- **Animated Hero & Telemetry**: Dynamic robotics hero banner with live statistics counters (1,200+ Members, 45+ Events, 8,500+ Participants, ₹2.5L+ Prize Pool).
- **Interactive Events Catalog (`/events`)**: Search and filter by category (*Workshop*, *Competition*, *Hackathon*, *Talk*, *Expo*) and status (*Upcoming*, *Ongoing*, *Past*).
- **Event Detail Deep-Dives (`/events/[slug]`)**:
  - Live countdown timer to deadline.
  - Interactive schedule timeline with speakers.
  - Prize breakdown and reward cards.
  - Eligibility rules and FAQs accordion.
  - Organizers direct call/email contacts.
  - **Add to Calendar (.ics)** and Google Calendar integration.
  - **WhatsApp Share** and Event QR code modal.
- **Dynamic Registration Flow**:
  - Supports both **Inbuilt** registrations and **External** Google Forms (admin configurable per event).
  - Handles **Solo** and **Team** events (dynamic team members up to limit).
  - **Interoperable UPI QR Generation**: Generates standard UPI payment intent with pre-filled amount and payee name (`arsa.rscoe@okaxis`).
  - UTR / Transaction ID verification and payment screenshot upload preview.
  - Unique Pass ID generation (`ARSA-2027-XXX-XXXX`) with confetti celebration and print pass support.
  - Confirmation email dispatch with registration ticket.
- **Robotics Showcase Pages**:
  - **Gallery (`/gallery`)**: Masonry grid with year filters and full-screen lightbox modal.
  - **Past Events (`/past-events`)**: Highlights, recaps, and podium winners showcase.
  - **Projects (`/projects`)**: ARSA student and member robotics projects with GitHub links and tech tags.
  - **Core Team (`/team`)**: Leadership directory with LinkedIn, Instagram, and GitHub profiles.
  - **Join ARSA (`/join`)**: Recruitment application form with domain selection.
  - **Contact (`/contact`)**: Message inbox and embedded campus map of JSPM RSCOE Tathawade.

### 🛡️ Organiser Admin Panel (`/admin`)
- **Protected Access**: Firebase Auth + Email Allowlist (`ADMIN_EMAILS`).
- **Dashboard**: Live metrics (Total Events, Active Registrations, Pending Payments, Verified Treasury Revenue, Applications).
- **Events Manager (`/admin/events`)**: Full CRUD (create, edit, delete, auto-slug, toggle registration open/closed).
- **Registrations Manager (`/admin/registrations`)**: Searchable table, filter by payment status, screenshot slip viewer, one-click Approve/Reject, and one-click **Export to CSV**.
- **Members Manager (`/admin/members`)**: Review recruitment candidates, update status (*Selected*, *Interviewed*, *Rejected*), and CSV export.
- **Gallery & Projects & Team Managers**: Add, edit, or delete items without touching code.
- **One-Click Seeder**: Built-in seed button to populate realistic events from Dec 2026 to May 2027.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Cyber/Robotics dark palette, blueprint grid, and glassmorphism
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Storage) + Dual-mode offline fallback store
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) (Dark mode default with light toggle)

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/arsa-events-portal.git
cd arsa-events-portal
npm install
```

### 2. Configure Environment Variables

Create `.env.local` by copying `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your configuration:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Configuration (Comma-separated authorized email addresses)
NEXT_PUBLIC_ADMIN_EMAILS=admin@arsa.org,hod.robotics@jspmrscoe.edu.in,faculty.advisor@jspmrscoe.edu.in

# ARSA Official UPI Treasury Details
NEXT_PUBLIC_ARSA_UPI_ID=arsa.rscoe@okaxis
NEXT_PUBLIC_ARSA_PAYEE_NAME=ARSA JSPM RSCOE

# Email Service (Optional: Resend API Key)
RESEND_API_KEY=re_1234567890
```

> [!NOTE]
> **Zero-Setup Run**: If you don't have Firebase keys yet, the portal will automatically run in **Offline Seed Store Mode**. Everything works out-of-the-box including registration, UPI QR generation, admin CRUD, and seeding!

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Firebase Setup & Security Rules

### 1. Create Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named `arsa-events-portal`.
3. Enable **Authentication** -> Sign-in method -> Email/Password & Google.
4. Enable **Cloud Firestore** in Production mode.
5. Enable **Firebase Storage**.

### 2. Deploy Firestore Security Rules
Deploy `firestore.rules` using the Firebase CLI or paste into the Firestore Rules tab:

```bash
firebase deploy --only firestore:rules
```

The rules enforce:
- **Events, Gallery, Projects, Team**: Public read, write restricted to authorized administrators.
- **Registrations & Applications**: Public create-only, read/update/delete restricted to administrators.

---

## 🗄️ Database Collections Schema

```
/events/{eventId}            -> Event details, schedule, prizes, rules, deadline
/registrations/{regId}       -> Participant details, team members, UTR, payment status
/members/{memberId}          -> Student recruitment applications (/join)
/gallery/{photoId}           -> Photos tagged with event & year
/projects/{projectId}        -> ARSA member & student robotics projects
/team/{memberId}             -> Core leadership & domain heads
/messages/{messageId}        -> Contact messages submitted via /contact
```

---

## 🏛️ Department Credits

- **Department**: Automation & Robotics Engineering
- **Institute**: JSPM's Rajarshi Shahu College of Engineering, Tathawade, Pune - 411033
- **Student Body**: ARSA (Automation & Robotics Student Association)
