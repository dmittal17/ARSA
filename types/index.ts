export type EventCategory = 'Workshop' | 'Competition' | 'Hackathon' | 'Talk' | 'Expo';
export type EventStatus = 'Upcoming' | 'Ongoing' | 'Past';
export type RegistrationMode = 'inbuilt' | 'external';
export type AcademicYear = 'FE' | 'SE' | 'TE' | 'BE';
export type PaymentStatus = 'Pending' | 'Verified' | 'Rejected' | 'Free';

export interface ARSAEvent {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: EventCategory;
  status: EventStatus;
  posterUrl: string;
  startDate: string; // ISO format: e.g. "2026-12-15T10:00:00Z"
  endDate: string;
  registrationDeadline: string;
  venue: string;
  fee: number; // in INR, 0 means Free
  teamSize: {
    min: number;
    max: number;
  };
  registrationMode: RegistrationMode;
  externalFormUrl?: string;
  isRegistrationOpen: boolean;
  description: string;
  rules: string[];
  schedule: Array<{
    time: string;
    activity: string;
    speaker?: string;
  }>;
  prizes: Array<{
    position: string;
    reward: string;
    description?: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  organizers: Array<{
    name: string;
    role: string;
    phone: string;
    email: string;
  }>;
  featured: boolean;
  totalRegistrations?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMemberEntry {
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
}

export interface Registration {
  id: string;
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  registrationNumber: string; // e.g. ARSA-2027-WKS-0142
  createdAt: string;
  primaryParticipant: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    department: string;
    year: AcademicYear;
    division: string;
    rollNumber: string;
  };
  teamName?: string;
  teamMembers?: TeamMemberEntry[];
  payment: {
    amount: number;
    required: boolean;
    status: PaymentStatus;
    utrNumber?: string;
    screenshotUrl?: string;
    verifiedAt?: string;
    verifiedBy?: string;
    rejectionReason?: string;
  };
}

export interface MemberApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  year: AcademicYear;
  branch: string;
  division: string;
  rollNumber: string;
  preferredDomain: 'Technical Robotics' | 'Software & Web' | 'Design & Media' | 'Event Management' | 'Sponsorship & PR';
  pastExperience?: string;
  whyJoin: string;
  status?: 'Pending' | 'Interviewed' | 'Selected' | 'Rejected';
  submittedAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  team: string; // e.g., "ARSA Member Projects" or "ARSA Lab"
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  year?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  domain: string;
  year: string;
  photoUrl: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  eventTitle: string;
  year: string;
  category?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  description?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}
