// Job Posters 
export interface Job {
  //!id: string;
  //!title: string;
  //!price: string;
  //!description: string;
  //!tags: string[];
  // !postedAgo: string;
  //!clientLocation?: string; // region
  skillsRequired?: string[];
  proposals: string; //? nested
  paymentVerified: boolean; //? nested
  spent: string; //? nested
  clientName?: string;
  clientRating?: number;
  clientJobsPosted?: number; //* statistics
  clientHireRate?: number; //* statistics
  projectType?: "Fixed" | "Hourly";
  duration?: string;
  experienceLevel?: "Entry" | "Intermediate" | "Expert"; // Rating (extra)
}
