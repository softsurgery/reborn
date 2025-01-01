import { create } from "zustand";
import { Feedback } from "~/types/Feedback";
import { FEEDBACK_CATEGORIES } from "~/constants/feedback-categories";

interface FeedbackManager {
  rating?: string;
  category?: string;
  message?: string;
  set: (attribute: keyof Omit<FeedbackManager, "set">, value: any) => void;
  getFeedback: () => Feedback;
  reset: () => void;
}

const FeedbackManagerDefaults: Omit<
FeedbackManager, 
"set" | "getFeedback" | "reset"
> = {
  rating: '',
  category: FEEDBACK_CATEGORIES[0],
  message: "",
};

export const useFeedbackManager = create<FeedbackManager>((set, get) => ({
  ...FeedbackManagerDefaults,
  set: (attribute: keyof Omit<FeedbackManager,"set">, value: string) => {
    set((state) => ({ 
        ...state, 
        [attribute]: value 
    }));
  },
  getFeedback: (): Feedback=> {
    const data = get();
    return { 
        rating: data.rating ,
        category: data.category, 
        message: data.message, 
    };
  },
  reset: () => {
    set(FeedbackManagerDefaults);
  },
}));
