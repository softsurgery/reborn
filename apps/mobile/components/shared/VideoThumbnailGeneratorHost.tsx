import { onThumbnailPlayerStatusChange, setThumbnailPlayer } from "@/lib/video";
import { useEvent } from "expo";
import { useVideoPlayer } from "expo-video";
import React from "react";

export const VideoThumbnailGeneratorHost = () => {
  const player = useVideoPlayer(null, (nextPlayer) => {
    nextPlayer.muted = true;
    nextPlayer.pause();
  });

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });

  React.useEffect(() => {
    setThumbnailPlayer(player);
    return () => setThumbnailPlayer(null);
  }, [player]);

  React.useEffect(() => {
    onThumbnailPlayerStatusChange(status);
  }, [status]);

  return null;
};
