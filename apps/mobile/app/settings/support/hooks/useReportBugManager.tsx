import { create } from "zustand";
import { BUG_CATEGORIES } from "~/constants/bug-categories";
import { Bug } from "~/types/Bug";

interface ReportBugManager {
  title?: string;
  description?: string;
  category?: string;
  set: (attribute: keyof Omit<ReportBugManager, "set">, value: any) => void;
  getBug: () => Bug;
  reset: () => void;
}

const ReportBugManagerDefaults: Omit<
  ReportBugManager,
  "set" | "getBug" | "reset"
> = {
  title: "",
  description: "",
  category: BUG_CATEGORIES[0],
};

export const useReportBugManger = create<ReportBugManager>((set, get) => ({
  ...ReportBugManagerDefaults,
  set: (attribute: keyof Omit<ReportBugManager, "set">, value: string) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  getBug: (): Bug => {
    const data = get();
    return {
      title: data.title,
      description: data.description,
      category: data.category,
    };
  },
  reset: () => {
    set(ReportBugManagerDefaults);
  },
}));
