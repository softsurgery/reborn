import React from "react";
import { ResponseNotificationDto } from "~/types/notifications";

interface NotificationContextProps {
  notifications: ResponseNotificationDto[];
  newCount: number;
  resetCount: () => void;
}

export const NotificationContext = React.createContext<
  Partial<NotificationContextProps>
>({});

export const useNotificationContext = () =>
  React.useContext(NotificationContext);
