export interface DynamicScene {
  name: string;
  content: Record<string, DynamicSceneSection>;
}

export interface DynamicSceneSection {
  name: string;
  description?: string;
  rows: DynamicSceneRow[];
}

export interface DynamicSceneRow<T = any> {
  label: string;
  className?: string;
  description?: string;
  variant: DynamicSceneRowVariant;
  props?: T;
}

export enum DynamicSceneRowVariant {
  TAPPABLE = "tappable",
  NON_TAPPABLE = "non-tappable",
  SWITCH = "switch",
  CUSTOM = "custom",
}

export interface DynamicSceneTappableProps {
  onPress: () => void;
}

export interface DynamicSceneNonTappableProps {
  text: string;
}

export interface DynamicSceneSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
