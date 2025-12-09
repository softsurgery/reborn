import { DynamicScene } from "../shared/scene-builder/types";

interface useEditProfileRecipesProps {}

export const useEditProfileRecipes = ({}: useEditProfileRecipesProps) => {
  const experienceRecipe: DynamicScene = {
    name: "Edit Experiences",
    content: {},
  };
  return {
    experienceRecipe,
  };
};
