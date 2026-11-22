# ARSA Events Portal 🤖⚡

> **Official Digital & Events Portal** for the **Automation & Robotics Student Association (ARSA)**  
> *Department of Automation & Robotics, JSPM's Rajarshi Shahu College of Engineering, Pune*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Cloud%20Firestore%20%26%20Auth-ffca28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

---

## 🌟 Overview

The **ARSA Events Portal** is the centralized digital gateway for the **Automation & Robotics Student Association (ARSA)** at JSPM's Rajarshi Shahu College of Engineering (RSCOE), Pune. Designed with an aerospace-grade, modern robotics aesthetic, the platform connects engineering students across Maharashtra with premier state-level hackathons, autonomous robotics bootcamps, and technical workshops.

The portal streamlines the end-to-end event experience — from real-time discovery and seamless registrations with automated UPI payments, to live project showcases and historical tournament recaps. Organizers and faculty mentors can manage the entire operational lifecycle through an integrated administrative suite.

---

## 🎨 Visual Identity & Color Theme

The website is crafted around the official brand identity of the ARSA club:

* **Theme Palette**:
  * **Primary Accent**: Crimson / Robotics Red (`#dc2626` / `#ef4444`) — representing propulsion, energy fields, and active telemetry.
  * **Surfaces**: Crisp white (`#ffffff`) and dark carbon-fiber slate (`#15161f`).
  * **Neutrals**: Sleek stratospheric black (`#090a0f`, `#111827`) and brushed aerospace grays (`#f1f3f5`, `#4b5563`, `#9ca3af`).
* **Dual Theme Engine**: Clean, high-contrast light mode by default with an instant dark mode toggle.
* **Typography**:
  * **Headings**: *Space Grotesk* — an aerospace-inspired geometric sans-serif engineered for high-impact technical titles.
  * **Body**: *Inter* — a clean, modern typeface tuned for effortless readability of rules, schedules, and specifications.
  * **Monospace**: *JetBrains Mono* — for telemetry data, timecodes, and verification IDs.
* **Responsive Architecture**: Fully mobile-first with smooth transitions, tactile hover micro-interactions, and accessible WCAG AA color contrast.

---

## 🧭 What The Website Contains

### 🏛️ 1. Public Student & Visitor Experience

* **Interactive Home (`/`)**:
  * Animated hero section highlighting the departmental motto: *"Automate. Innovate. Build."*
  * Department telemetry badge and quick call-to-action buttons (*Explore Events*, *Join ARSA*).
  * Real-time metrics counters: **1,200+ Active Members**, **45+ Events Hosted**, **8,500+ Participants**, **₹2.5L+ Annual Prize Pool**.
  * Horizontal swipeable upcoming events carousel with instant registration access.
  * Departmental overview, student innovations spotlight, and university affiliations.

* **Events & Competitions Catalog (`/events`)**:
  * Searchable card grid displaying all upcoming, ongoing, and past events.
  * Multi-tag filtering by Category:
    * 🛠️ **Workshops** (e.g., *Arduino & ESP32 IoT Prototyping*, *ROS 2 & Gazebo Autonomous Navigation*, *RoboVision YOLO & OpenCV*)
    * 🏎️ **Competitions** (e.g., *Line Follower & Mesh Solver RoboRace*, *RoboQuest All-Terrain Obstacle Challenge*, *RoboSoccer Premier League 3v3 Clash*, *Micromouse Autonomous Maze Challenge*)
    * 💻 **Hackathons** (e.g., *Automate-It 36hr Hardware-Software Hackathon*)
    * 🎤 **Tech Talks & Industry Expos**
  * Instant search bar querying titles, tags, and venues in real time.

* **Event Detail Deep-Dives (`/events/[slug]`)**:
  * Live countdown clock ticking down to the registration deadline.
  * Event specifications: Venue, dates, fee, permitted team size, and organizer hotlines.
  * Chronological itinerary timeline with session descriptions and speaker profiles.
  * Comprehensive prize distribution tiers, rulebook, and expandable FAQs.
  * **Add to Calendar**: Instant generation of `.ics` calendar events and Google Calendar links.
  * **Direct Sharing**: WhatsApp share button and QR code generator for easy peer-to-peer distribution.
  * Sticky registration bar for smooth mobile enrollment.

* **Frictionless Registration Engine**:
  * **Two Registration Modes** (configurable per event):
    * **Inbuilt Form**: Direct in-site registration for solo participants or dynamic multi-member squads (capturing student names, emails, phones, college, year, division, and roll numbers).
    * **External Mode**: Seamless redirection to Google Forms or external portals when required.
  * **UPI QR Payment Gateway**: Dynamic UPI payment intent and QR code generation (`arsa.rscoe@okaxis`) with automated transaction ID (UTR) input and payment screenshot upload preview.
  * **Digital Entry Pass**: Issues a unique alphanumeric ticket code (`ARSA-2027-XXX-XXXX`) with confetti confirmation and printable entry slips.

* **Member Projects Showcase (`/projects`)**:
  * Gallery of autonomous machines, rovers, and systems built by ARSA student engineers:
    * *ARSA Autonomous Planetary Rover* (6-wheel rocker-bogie with stereo vision)
    * *Warehouse Autonomous Mobile Robot (AMR)* (LiDAR SLAM & Nav2)
    * *RoboCanine 12-DOF Quadruped Biomimetic Robot*
    * *Precision Agritech NDVI Quadcopter*
  * Complete with system architecture descriptions, hardware tags, and direct GitHub links.

* **Past Events & Podium Archive (`/past-events`)**:
  * Historical tournament records with participation stats, cash prizes distributed, and winning college teams across Maharashtra.

* **Media Gallery (`/gallery`)**:
  * High-resolution masonry grid capturing robotics arena heats, hardware soldering sessions, and induction ceremonies.
  * Categorized filtering with an interactive full-screen image lightbox.

* **Core Leadership Directory (`/team`)**:
  * Roster of Faculty Mentors, President, Vice President, Technical Heads, and Domain Leads with direct Instagram and GitHub profiles.

* **Membership Recruitment (`/join`)**:
  * Application portal for undergraduate engineering students to apply for technical, management, design, and media domains in ARSA.

* **Contact & Campus Map (`/contact`)**:
  * Direct inquiry form, official contact hotline (`+91 85955 15962`), department email, and interactive campus map for JSPM RSCOE Tathawade.

* **Universal Footer**:
  * Department branding, quick navigation links, direct college link ([jspmrscoe.edu.in](https://www.jspmrscoe.edu.in)), ARSA Instagram profile ([@arsa.rscoe](https://www.instagram.com/arsa.rscoe/)), phone hotline, and academic copyright.

---

### 🛡️ 2. Organiser Control Suite (`/admin`)

A private administration panel designed for faculty coordinators and student leads:

* **Secure Authentication**: Protected by Firebase Authentication and an authorized email whitelist.
* **Live Overview Metrics**: Real-time summary of total events, active registrations, pending fee verifications, and total fees collected.
* **Events Manager (`/admin/events`)**: Complete visual CRUD interface to create, edit, or archive events, upload cover posters, toggle registration status, and configure registration modes.
* **Registrations Manifest (`/admin/registrations`)**: Searchable and filterable table of registered participants, payment slip viewer, one-click verify/reject controls, and one-click **CSV export** for arena check-in desks.
* **Recruitment Manager (`/admin/members`)**: Candidate tracking board to review student membership applications and log interview decisions.
* **Content Management**: Direct controls to manage showcase projects, gallery images, and team listings without code modifications.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14** (App Router, React 18) | Server-side rendering, static site generation, and optimized client navigation |
| **Language** | **TypeScript 5** | Strict type safety for data models, events, registrations, and components |
| **Styling & Design** | **Tailwind CSS 3.4** | Atomic CSS utility system with custom ARSA color tokens and responsive breakpoints |
| **Icons & Visuals** | **Lucide Icons** | Clean, lightweight icon suite |
| **Motion & Micro-interactions** | **Framer Motion** & **Canvas Confetti** | Smooth layout animations, page transitions, and registration completion effects |
| **Database & Backend** | **Google Cloud Firestore** | Scalable real-time NoSQL database with rule-level security |
| **Authentication** | **Firebase Auth** | Secure admin login and session management |
| **Media Storage** | **Firebase Storage** | Cloud storage for high-resolution event posters and payment proof receipts |
| **Notifications** | **Sonner** | Modern toast notification system |
| **Theming** | **next-themes** | Persistent dark/light mode toggle |
| **Hosting & Edge Delivery** | **Vercel** | Edge network deployment, automated CI/CD builds, and high availability |

---

## 🗂️ Data Architecture

The portal's data model encompasses 7 primary collections:

* **Events**: Title, slug, category, status, start/end dates, deadline, venue, fee, team limits, schedule timeline, prizes, rules, FAQs, and organizers.
* **Registrations**: Participant details, roll numbers, team roster, payment mode, transaction UTR ID, verification status, and unique pass ID.
* **Members**: Recruitment applicants with technical domain preferences and portfolios.
* **Projects**: Student innovations with hardware tags, descriptions, and repository URLs.
* **Team**: Leadership roster, designations, order, and social links.
* **Gallery**: Curated event imagery tagged by academic year and category.
* **Messages**: Direct feedback and inquiries submitted via the contact desk.

---

## 🏛️ Institutional Information

* **Organization**: Automation & Robotics Student Association (ARSA)
* **Department**: Department of Automation & Robotics Engineering
* **College**: JSPM's Rajarshi Shahu College of Engineering (RSCOE), Tathawade, Pune – 411033
* **Affiliation**: Savitribai Phule Pune University (SPPU) & Approved by AICTE
* **College Website**: [www.jspmrscoe.edu.in](https://www.jspmrscoe.edu.in)
* **Official Contact**: `+91 85955 15962` | `arsa@jspmrscoe.edu.in`

---

## 📜 License

This project is open-source under the [MIT License](LICENSE) for educational, student community, and institutional use.
