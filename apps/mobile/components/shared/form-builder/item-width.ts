export const getItemWidth = (count: number) => {
  if (count === 1) return "w-full";
  if (count === 2) return "w-full sm:w-[48%]";
  if (count === 3) return "w-full sm:w-[48%] md:w-[31%]";
  if (count === 4) return "w-full sm:w-[48%] md:w-[31%] lg:w-[23%]";
  return "w-full";
};
