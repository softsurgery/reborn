import { ResponseUserDto } from "~/types";

export const identifyUser = (user?: ResponseUserDto | null) => {
  if (!user) return "Unknown User";
  return user?.firstName && user?.lastName
    ? `${user?.firstName?.charAt(0).toUpperCase() + user?.firstName.slice(1)} ${
        user?.lastName?.charAt(0).toUpperCase() + user?.lastName.slice(1)
      }`
    : user?.username || "Unknown User";
};

export const identifyUserAvatar = (user?: ResponseUserDto | null) => {
  if (!user) return "?";
  return user?.firstName && user?.lastName
    ? `${user?.firstName?.charAt(0).toUpperCase()}${user?.lastName
        ?.charAt(0)
        .toUpperCase()}`
    : user?.username?.charAt(0).toUpperCase() || "?";
};
