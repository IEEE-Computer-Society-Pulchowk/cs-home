export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

export interface Committee {
  title: string;
  members: TeamMember[];
}

export interface Person {
  id: string;
  name: string;
  membership: number;
  imageUrl?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

export interface CommitteeMemberRef {
  personId: string;
  role: string;
  sort?: number;
}

export interface TeamCommittee {
  id: string;
  title: string;
  sort: number;
  members: CommitteeMemberRef[];
}

export interface TeamYear {
  year: string;
  sort: number;
  committees: TeamCommittee[];
}

export enum EventCategory {
  WORKSHOP = "Workshop",
  SEMINAR = "Seminar",
  COMPETITION = "Competition",
  SOCIAL = "Social",
}

export interface EventPhase {
  phase?: string | number;
  title: string;
  date?: string;
  location?: string;
  duration?: string;
  body: string;
  registrationUrl?: string;
  sort?: number;
}

export interface EventYearDetail {
  title: string;
  slogan?: string;
  registrationUrl?: string;
  sort?: number;
  phases?: EventPhase[];
}

export interface EventMetadata {
  title?: string;
  description?: string;
  category?: EventCategory | string;
  imageUrl?: string;
  thumbnail?: string;
  registrationUrl?: string;
  recurrence?: string;
  years?: Record<string, EventYearDetail>;
}

export interface IeeeEvent {
  id: string;
  title: string;
  date?: string;
  displayDate?: string;
  sortDate?: string;
  description: string;
  location?: string;
  category: EventCategory;
  imageUrl?: string;
  isUpcoming?: boolean;
  registrationUrl?: string;
  recurrence?: string;
  years?: Record<string, EventYearDetail>;
}

export interface NavLink {
  label: string;
  path: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId?: string;
  authorRole?: string;
  authorProfilePath?: string;
  date: string;
  category: string;
  imageUrl?: string;
  readTime: string;
}

export enum GalleryCategory {
  MEETUP = "Meetup",
  EVENT = "Event",
  WORKSHOP = "Workshop",
  COMPETITION = "Competition",
  TALK = "Talk",
}

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  category: GalleryCategory;
  imageUrl: string;
}
