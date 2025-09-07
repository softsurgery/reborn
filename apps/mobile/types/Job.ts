// Job Posters 
export interface Job {
  //!id: string;
  //!title: string;
  //!price: string;
  //!description: string;
  //!tags: string[];
  // !postedAgo: string;
  //!clientLocation?: string; // --region
  //! skillsRequired?: string[]; --tags
  //! clientName?: string;
  //!projectType?: "Fixed" | "Hourly"; --Style
  //? proposals: string; nested
  //? paymentVerified: boolean;  nested
  //? spent: string; nested
  clientRating?: number;
  clientJobsPosted?: number; //* statistics
  clientHireRate?: number; //* statistics
  duration?: string;
  experienceLevel?: "Entry" | "Intermediate" | "Expert"; // Rating (extra)
}
