export interface Job {
  id: string;
  title: string;
  price: string;
  proposals: string;
  paymentVerified: boolean;
  spent: string;
  description: string;
  tags: string[];
  postedAgo: string;
  clientName?: string;
  clientRating?: number;
  clientLocation?: string;
  clientJobsPosted?: number;
  clientHireRate?: number;
  skillsRequired?: string[];
  projectType?: "Fixed" | "Hourly";
  duration?: string;
  experienceLevel?: "Entry" | "Intermediate" | "Expert";
}
