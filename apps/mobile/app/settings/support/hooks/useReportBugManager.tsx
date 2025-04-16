import { create } from "zustand";
import { BUG_CATEGORIES } from "~/constants/bug-categories";
import { generateDeviceInfo } from "~/lib/device-info";
import { DeviceInfo } from "~/types";
import { Bug } from "~/types/Bug";

interface ReportBugManager extends Partial<Bug> {
  set: (attribute: keyof Omit<ReportBugManager, "set">, value: any) => void;
  getBug: () => Partial<Bug>;
  reset: () => void;
}

const ReportBugManagerDefaults: Omit<
  ReportBugManager,
  "set" | "getBug" | "reset"
> = {
  title: "",
  description: "",
  category: "Crash",
};

export const useReportBugManger = create<ReportBugManager>((set, get) => ({
  ...ReportBugManagerDefaults,
  set: (attribute: keyof Omit<ReportBugManager, "set">, value: string) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  getBug: (): Partial<Bug>  => {
    const data = get();
    return {
      title: data.title,
      description: data.description,
      category: data.category,
      device: generateDeviceInfo() as DeviceInfo,

    };
  },
  reset: () => {
    set(ReportBugManagerDefaults);
  },
}));
