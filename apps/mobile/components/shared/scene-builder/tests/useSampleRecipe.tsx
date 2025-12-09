import { DynamicScene, DynamicSceneRowVariant } from "../types";

interface useSampleRecipeProps {}

export const useSampleRecipe = ({}: useSampleRecipeProps) => {
  const recipe: DynamicScene = {
    name: "Edit Experiences",
    content: {
      "section-1": {
        name: "My Section",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        rows: [
          {
            label: "Row 1",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
            variant: DynamicSceneRowVariant.TAPPABLE,
          },
          {
            label: "Row 2",
            variant: DynamicSceneRowVariant.SWITCH,
          },
        ],
      },
      "section-2": {
        name: "My Section 2",
        rows: [
          {
            label: "My Row",
            variant: DynamicSceneRowVariant.NON_TAPPABLE,
            props: {
              text: "Non-tappable",
            },
          },
        ],
      },
      "section-3": {
        name: "My Section 3",
        rows: [
          {
            label: "My Row",
            variant: DynamicSceneRowVariant.TAPPABLE,
          },
        ],
      },
      "section-4": {
        name: "My Section",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        rows: [
          {
            label: "Row 1",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
            variant: DynamicSceneRowVariant.TAPPABLE,
          },
          {
            label: "Row 2",
            variant: DynamicSceneRowVariant.TAPPABLE,
          },
        ],
      },
      "section-5": {
        name: "My Section",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        rows: [
          {
            label: "Row 1",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
            variant: DynamicSceneRowVariant.TAPPABLE,
          },
          {
            label: "Row 2",
            variant: DynamicSceneRowVariant.TAPPABLE,
          },
        ],
      },
    },
  };
  return {
    recipe,
  };
};
