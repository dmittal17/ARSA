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

## 🏛️ Department Credits

- **Department**: Automation & Robotics Engineering
- **Institute**: JSPM's Rajarshi Shahu College of Engineering, Tathawade, Pune - 411033
- **Student Body**: ARSA (Automation & Robotics Student Association)
