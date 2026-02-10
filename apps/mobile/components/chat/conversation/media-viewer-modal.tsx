"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Linking,
  Share,
  Alert,
} from "react-native";
import {
  X,
  Download,
  Share2,
  FileText,
  Music,
  File,
  Loader,
  Eye,
} from "lucide-react-native";
import { Icon } from "~/components/ui/icon";
import { cn } from "~/lib/utils";

interface MediaItem {
  id: string;
  type: "image" | "video" | "audio" | "file" | "link";
  url?: string;
  name?: string;
  size?: string;
  timestamp: string;
  sender: {
    firstName: string;
  };
  link?: string;
  title?: string;
  description?: string;
}

interface MediaViewerModalProps {
  visible: boolean;
  onClose: () => void;
  messages: any[];
}

export const MediaViewerModal = ({
  visible,
  onClose,
  messages,
}: MediaViewerModalProps) => {
  const [selectedTab, setSelectedTab] = useState<
    "all" | "photos" | "videos" | "files" | "links"
  >("all");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Extraire tous les médias des messages
  const extractMediaItems = (): MediaItem[] => {
    const items: MediaItem[] = [];

    messages.forEach((message) => {
      // Vérifier les attachements d'images
      if (
        message.attachments?.images &&
        Array.isArray(message.attachments.images)
      ) {
        message.attachments.images.forEach((img: any, index: number) => {
          items.push({
            id: `${message.id}-image-${index}`,
            type: "image",
            url: img.url || img.path,
            name: img.name || `Image ${index + 1}`,
            size: img.size,
            timestamp: message.createdAt,
            sender: message.sender?.profile || { firstName: "Utilisateur" },
          });
        });
      }

      // Vérifier les attachements vidéo
      if (
        message.attachments?.videos &&
        Array.isArray(message.attachments.videos)
      ) {
        message.attachments.videos.forEach((video: any, index: number) => {
          items.push({
            id: `${message.id}-video-${index}`,
            type: "video",
            url: video.url || video.path,
            name: video.name || `Vidéo ${index + 1}`,
            size: video.size,
            timestamp: message.createdAt,
            sender: message.sender?.profile || { firstName: "Utilisateur" },
          });
        });
      }

      // Vérifier les attachements audio
      if (
        message.attachments?.audio &&
        Array.isArray(message.attachments.audio)
      ) {
        message.attachments.audio.forEach((audio: any, index: number) => {
          items.push({
            id: `${message.id}-audio-${index}`,
            type: "audio",
            url: audio.url || audio.path,
            name: audio.name || `Audio ${index + 1}`,
            size: audio.size,
            timestamp: message.createdAt,
            sender: message.sender?.profile || { firstName: "Utilisateur" },
          });
        });
      }

      // Vérifier les autres fichiers
      if (
        message.attachments?.files &&
        Array.isArray(message.attachments.files)
      ) {
        message.attachments.files.forEach((file: any, index: number) => {
          items.push({
            id: `${message.id}-file-${index}`,
            type: "file",
            url: file.url || file.path,
            name: file.name || `Fichier ${index + 1}`,
            size: file.size,
            timestamp: message.createdAt,
            sender: message.sender?.profile || { firstName: "Utilisateur" },
          });
        });
      }

      // Extraire les liens du contenu
      if (message.content) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = message.content.match(urlRegex);
        if (matches) {
          matches.forEach((url: string, index: any) => {
            items.push({
              id: `${message.id}-link-${index}`,
              type: "link",
              link: url,
              title: new URL(url).hostname,
              description: message.content,
              timestamp: message.createdAt,
              sender: message.sender?.profile || { firstName: "Utilisateur" },
            });
          });
        }
      }
    });

    return items;
  };

  const allMediaItems = extractMediaItems();

  // Filtrer selon l'onglet sélectionné
  const filteredItems = allMediaItems.filter((item) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "photos") return item.type === "image";
    if (selectedTab === "videos") return item.type === "video";
    if (selectedTab === "files")
      return item.type === "file" || item.type === "audio";
    if (selectedTab === "links") return item.type === "link";
    return false;
  });

  // Ouvrir un lien
  const handleOpenLink = (link: string) => {
    Linking.openURL(link).catch(() => {
      Alert.alert("Erreur", "Impossible d'ouvrir le lien");
    });
  };

  // Télécharger un fichier
  const handleDownload = (url: string, name: string) => {
    Alert.alert("Téléchargement", `Télécharger: ${name}?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Télécharger",
        onPress: () => {
          Linking.openURL(url).catch(() => {
            Alert.alert("Erreur", "Impossible de télécharger le fichier");
          });
        },
      },
    ]);
  };

  // Partager un élément
  const handleShare = async (url: string, name: string) => {
    try {
      await Share.share({
        message: `Partager: ${name}`,
        url: url,
      });
    } catch (error) {
      console.error("Erreur de partage:", error);
    }
  };

  const renderTabButton = (tab: typeof selectedTab, label: string) => (
    <TouchableOpacity
      onPress={() => setSelectedTab(tab)}
      className={cn(
        "px-4 py-2 rounded-full mx-1",
        selectedTab === tab ? "bg-blue-500" : "bg-zinc-800"
      )}
    >
      <Text
        className={cn(
          "text-sm font-medium",
          selectedTab === tab ? "text-white" : "text-zinc-400"
        )}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderMediaItem = ({ item }: { item: MediaItem }) => {
    if (item.type === "image") {
      return (
        <TouchableOpacity
          onPress={() => setSelectedMedia(item)}
          className="flex-1 m-1 bg-zinc-800 rounded-xl overflow-hidden"
        >
          <Image
            source={{ uri: item.url }}
            className="w-full h-32"
            onError={() => (
              <View className="w-full h-32 bg-zinc-700 items-center justify-center">
                <Icon as={Loader} size={24} color="#a1a1aa" />
              </View>
            )}
          />
          <View className="p-2">
            <Text className="text-white text-xs truncate">{item.name}</Text>
            <Text className="text-zinc-500 text-xs">
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item.type === "video") {
      return (
        <TouchableOpacity
          onPress={() => handleOpenLink(item.url!)}
          className="flex-1 m-1 bg-zinc-800 rounded-xl p-3 items-center justify-center"
        >
          <View className="w-16 h-16 bg-zinc-700 rounded-lg items-center justify-center mb-2">
            <Icon as={Eye} size={32} color="#3b82f6" />
          </View>
          <Text className="text-white text-xs truncate text-center">
            {item.name}
          </Text>
          <Text className="text-zinc-500 text-xs mt-1">
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      );
    }

    if (item.type === "audio") {
      return (
        <View className="bg-zinc-800 rounded-xl p-3 m-1 flex-row items-center">
          <Icon as={Music} size={24} color="#3b82f6" />
          <View className="flex-1 ml-3">
            <Text className="text-white font-medium">{item.name}</Text>
            <Text className="text-zinc-500 text-xs">
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleOpenLink(item.url!)}>
            <Icon as={Download} size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      );
    }

    if (item.type === "file") {
      return (
        <View className="bg-zinc-800 rounded-xl p-3 m-1 flex-row items-center">
          <Icon as={FileText} size={24} color="#3b82f6" />
          <View className="flex-1 ml-3">
            <Text className="text-white font-medium">{item.name}</Text>
            <Text className="text-zinc-500 text-xs">
              {item.size} • {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDownload(item.url!, item.name!)}
          >
            <Icon as={Download} size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      );
    }

    if (item.type === "link") {
      return (
        <TouchableOpacity
          onPress={() => handleOpenLink(item.link!)}
          className="bg-zinc-800 rounded-xl p-3 m-1 border-l-2 border-blue-500"
        >
          <Text className="text-blue-400 font-medium text-sm">
            {item.title}
          </Text>
          <Text className="text-zinc-400 text-xs mt-1 truncate">
            {item.link}
          </Text>
          <Text className="text-zinc-500 text-xs mt-2">
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Icon as={File} size={60} color="#52525b" />
      <Text className="text-zinc-400 text-lg mt-4 font-medium">
        {selectedTab === "links"
          ? "Aucun lien partagé"
          : selectedTab === "photos"
          ? "Aucune photo"
          : selectedTab === "videos"
          ? "Aucune vidéo"
          : selectedTab === "files"
          ? "Aucun fichier"
          : "Aucun contenu multimédia"}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-zinc-950">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 pt-12 border-b border-zinc-800">
          <Text className="text-white text-lg font-bold">
            Contenus partagés
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon as={X} size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Onglets */}
        <View className="flex-row py-3 px-2 border-b border-zinc-800 overflow-x-auto">
          {renderTabButton("all", "Tous")}
          {renderTabButton(
            "photos",
            `Photos (${allMediaItems.filter((i) => i.type === "image").length})`
          )}
          {renderTabButton(
            "videos",
            `Vidéos (${allMediaItems.filter((i) => i.type === "video").length})`
          )}
          {renderTabButton(
            "files",
            `Fichiers (${
              allMediaItems.filter(
                (i) => i.type === "file" || i.type === "audio"
              ).length
            })`
          )}
          {renderTabButton(
            "links",
            `Liens (${allMediaItems.filter((i) => i.type === "link").length})`
          )}
        </View>

        {/* Contenu */}
        {selectedTab === "photos" || selectedTab === "videos" ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderMediaItem}
            numColumns={selectedTab === "photos" ? 3 : 1}
            key={selectedTab}
            columnWrapperStyle={
              selectedTab === "photos" ? { flex: 1 } : undefined
            }
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={{
              paddingVertical: 10,
              paddingHorizontal: selectedTab === "photos" ? 2 : 4,
            }}
          />
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderMediaItem}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={{
              paddingVertical: 10,
              paddingHorizontal: 4,
            }}
          />
        )}
      </View>

      {/* Aperçu du média sélectionné */}
      {selectedMedia && selectedMedia.type === "image" && (
        <Modal visible={!!selectedMedia} animationType="fade">
          <View className="flex-1 bg-black">
            <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 py-3 pt-12 bg-black/50">
              <TouchableOpacity onPress={() => setSelectedMedia(null)}>
                <Icon as={X} size={28} color="white" />
              </TouchableOpacity>
              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() =>
                    handleShare(selectedMedia.url!, selectedMedia.name!)
                  }
                >
                  <Icon as={Share2} size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleDownload(selectedMedia.url!, selectedMedia.name!)
                  }
                >
                  <Icon as={Download} size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-1 items-center justify-center">
              <Image
                source={{ uri: selectedMedia.url }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
};
