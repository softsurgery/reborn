import { create } from "zustand";
import { generateDeviceInfo } from "~/lib/device-info";
import { DeviceInfo, Feedback } from "~/types";

interface FeedbackManager extends Partial<Feedback> {
  set: (attribute: keyof Omit<FeedbackManager, "set">, value: any) => void;
  getFeedback: () => Partial<Feedback>;
  reset: () => void;
}

const FeedbackManagerDefaults: Omit<
  FeedbackManager,
  "set" | "getFeedback" | "reset"
> = {
  rating: 0,
  category: "FeatureRequest",
  message: "",
};

export const useFeedbackManager = create<FeedbackManager>((set, get) => ({
  ...FeedbackManagerDefaults,
  set: (attribute: keyof Omit<FeedbackManager, "set">, value: string) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  getFeedback: (): Partial<Feedback> => {
    const data = get();
    return {
      rating: data.rating,
      category: data.category,
      message: data.message,
      device: generateDeviceInfo() as DeviceInfo,
    };
  },
  reset: () => {
    set(FeedbackManagerDefaults);
  },
}));
