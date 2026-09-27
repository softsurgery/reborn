import React from "react";

export const useImageCarouselModal = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const open = React.useCallback(() => {
    setIsVisible(true);
  }, []);

  const close = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    currentIndex,
    setCurrentIndex,
    open,
    close,
  };
};
