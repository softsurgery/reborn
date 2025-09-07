import { useScrollIntoView as useRNScrollIntoView } from "react-native-scroll-into-view";

export function useStableScrollIntoView() {
  let scrollIntoView: ReturnType<typeof useRNScrollIntoView> | undefined;

  try {
    scrollIntoView = useRNScrollIntoView();
  } catch {
    scrollIntoView = undefined;
  }

  return scrollIntoView;
}
