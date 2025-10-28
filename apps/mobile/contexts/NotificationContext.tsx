import React from "react";
import { ResponseNotificationDto } from "~/types/notifications";

interface NotificationContextProps {
  notifications: ResponseNotificationDto[];
  newCount: number;
  resetCount: () => void;
}

export const NotificationContext =
  React.createContext<NotificationContextProps>({
    notifications: [],
    newCount: 0,
    resetCount: () => {},
  });

export const useNotificationContext = () =>
  React.useContext(NotificationContext);
