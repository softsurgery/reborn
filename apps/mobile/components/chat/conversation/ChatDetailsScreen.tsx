"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import {
  User,
  Bell,
  Type,
  Users,
  Image as ImageIcon,
  Download,
  Pin,
  Search,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Clock,
  Eye,
  Keyboard as KeyboardIcon,
  Slash,
  Ban,
  AlertTriangle,
  Trash2,
  X,
  ArrowLeft,
  MoreVertical,
} from "lucide-react-native";
import { Icon } from "~/components/ui/icon";
import { cn } from "~/lib/utils";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { useServerImage } from "~/hooks/content/useServerImage";
import { router } from "expo-router";
import axios from "api/axios";
import { message as messageApi } from "api/chat/message";
import { storageManager } from "~/lib/storage-manager";
import { MediaViewerModal } from "~/components/chat/conversation/media-viewer-modal"; 
import { SoundSettingsModal } from "~/components/chat/conversation/sound-settings-modal";
import { MessagePermissionsModal } from "~/components/chat/conversation/message-permissions-modal";
import { EphemeralMessagesModal } from "~/components/chat/conversation/ephemeral-messages-modal";
import { useMessageNotifications } from "~/hooks/content/chat/use-message-notifications";
import { TypingIndicator } from "~/components/chat/conversation/typing-indicator";

// --------------------------------------
// SettingItem Component
// --------------------------------------
interface SettingItemProps {
  icon: any;
  label: string;
  value?: string;
  showChevron?: boolean;
  destructive?: boolean;
  onPress?: () => void;
  description?: string;
  toggleValue?: boolean; 
  onToggle?: (value: boolean) => void; 
}

const SettingItem = ({
  icon,
  label,
  value,
  showChevron = true,
  destructive,
  onPress,
  description,
  toggleValue,
  onToggle,
}: SettingItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center px-4 py-3 active:bg-zinc-800/50"
  >
    <View
      className={cn(
        "w-10 items-center",
        destructive ? "text-red-500" : "text-white"
      )}
    >
      <Icon as={icon} size={22} color={destructive ? "#ef4444" : "#ffffff"} />
    </View>
    <View className="flex-1 ml-2">
      <Text
        className={cn(
          "text-[17px]",
          destructive ? "text-red-500" : "text-white"
        )}
      >
        {label}
      </Text>
      {description && (
        <Text className="text-zinc-500 text-sm mt-0.5">{description}</Text>
      )}
    </View>
    <View className="flex-row items-center">
      {toggleValue !== undefined ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#767577", true: "#3b82f6" }}
          thumbColor={toggleValue ? "#ffffff" : "#f4f3f4"}
        />
      ) : (
        <>
          {value && (
            <Text className="text-zinc-500 text-[17px] mr-2">{value}</Text>
          )}
          {showChevron && <Icon as={ChevronRight} size={20} color="#52525b" />}
        </>
      )}
    </View>
  </TouchableOpacity>
);

// --------------------------------------
// Message Result Item Component
// --------------------------------------
interface MessageResultItemProps {
  message: any;
  searchQuery: string;
  onPress: () => void;
}
const MessageResultItem = ({
  message,
  searchQuery,
  onPress,
}: MessageResultItemProps) => {
  const highlightText = (text: string, query: string) => {
    if (!text || !query.trim())
      return <Text className="text-white">{text || ""}</Text>;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <Text className="text-white">
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={index} className="bg-yellow-500/30 font-semibold">
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  const senderName = message.sender?.profile?.firstName || "Utilisateur";
  const content = message.content || "";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-4 py-3 border-b border-zinc-800 active:bg-zinc-800/30"
    >
      <View className="flex-row items-start">
        <View className="w-8 h-8 rounded-full bg-zinc-700 items-center justify-center mr-3 mt-1">
          <Text className="text-zinc-300 text-xs font-medium">
            {senderName.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-white font-medium mr-2">{senderName}</Text>
            <Text className="text-zinc-500 text-xs">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          {highlightText(content, searchQuery)}
          <Text className="text-zinc-500 text-xs mt-2">
            {new Date(message.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --------------------------------------
// Main Screen
// --------------------------------------
interface ChatDetailsScreenProps {
  user: any;
}

export const ChatDetailsScreen = ({ user }: ChatDetailsScreenProps) => {
  const displayNameDefault = identifyUser(user);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  const { jsx: profilePicture } = useServerImage({
    id: user?.profile?.pictureId,
    fallback: identifyUserAvatar(user),
    size: { width: 90, height: 90 },
    enabled: !!user,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [nickname, setNickname] = useState(displayNameDefault);

  const [messages, setMessages] = useState<any[]>([]);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [messagePermissions, setMessagePermissions] = useState({
    canEdit: true,
    canDelete: true,
    canShare: true,
    canReact: true,
  });
  const [isUserBlocked, setIsUserBlocked] = useState(false);

  const [soundSettingsVisible, setSoundSettingsVisible] = useState(false);
  const [messagePermissionsVisible, setMessagePermissionsVisible] =
    useState(false);
  const [ephemeralVisible, setEphemeralVisible] = useState(false);
  const [mediaViewerVisible, setMediaViewerVisible] = useState(false);

  const [ephemeralEnabled, setEphemeralEnabled] = useState(false);
  const [ephemeralDuration, setEphemeralDuration] = useState(60);

  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);
  const [typingIndicatorEnabled, setTypingIndicatorEnabled] = useState(true);
  const [autoSavePhotos, setAutoSavePhotos] = useState(false);
useEffect(() => {
  const loadSettings = async () => {
    const settings = await storageManager.loadSettings();

    setReadReceiptsEnabled(settings.readReceiptsEnabled);
    setTypingIndicatorEnabled(settings.typingIndicatorEnabled);
    setAutoSavePhotos(settings.autoSavePhotos);
    setEphemeralEnabled(settings.ephemeralEnabled);
    setEphemeralDuration(settings.ephemeralDuration);
  };

  loadSettings();
}, []);
const handleReadReceiptsToggle = async (value: boolean) => {
  setReadReceiptsEnabled(value);
  await storageManager.updateReadReceipts(value);
};

const handleTypingIndicatorToggle = async (value: boolean) => {
  setTypingIndicatorEnabled(value);
  await storageManager.updateTypingIndicator(value);
};

const handleAutoSavePhotosToggle = async (value: boolean) => {
  setAutoSavePhotos(value);
  await storageManager.updateAutoSavePhotos(value);
};

const handleEphemeralStateChange = async (
  enabled: boolean,
  duration: number
) => {
  setEphemeralEnabled(enabled);
  setEphemeralDuration(duration);
  await storageManager.updateEphemeralMessages(enabled, duration);
};

  const { triggerNotification } = useMessageNotifications();

  const handleUserStartTyping = useCallback(() => {
    setIsUserTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log(" Chargement des messages pour l'ID:", user.id);
        const response = await messageApi.findPaginatedConversationMessages(
          user.id,
          {
            page: "1",
            limit: "100",
            sort: "DESC",
          }
        );
        // On vérifie si response est Paginated ou directement un tableau (fallback)
        const data = Array.isArray(response)
          ? response
          : (response as any).data;
        console.log("[ Messages chargés avec succès, nombre:", data?.length);
        setMessages(data || []);
      } catch (error: any) {
        console.log(" Erreur lors du chargement des messages :", error.message);
        if (error.response) {
          console.log("[Données d'erreur API:", error.response.data);
        }
      }
    };
    fetchMessages();
  }, [user.id]);

  // Fonction de recherche sur messages réels
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setLoadingSearch(true);

    const results = messages
      .filter((msg) => msg.content?.toLowerCase().includes(query.toLowerCase()))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setSearchResults(results);
    setLoadingSearch(false);
  };

  // Recherche optimisée avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isSearching) handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isSearching, messages]);

  // Naviguer vers le message sélectionné
  const handleResultPress = (message: any) => {
    setIsSearching(false);
    setSearchQuery("");
    Alert.alert(
      "Naviguer",
      `Aller au message: ${message.content.substring(0, 50)}...`
    );
  };

  // Supprimer la conversation
  const handleDeleteConversation = () => {
    Alert.alert(
      "Supprimer la discussion",
      "Êtes-vous sûr de vouloir supprimer cette discussion ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`/conversation/${user.id}`);
              Alert.alert("Succès", "La conversation a été supprimée.");
              router.back();
            } catch (error) {
              console.error("Erreur lors de la suppression :", error);
              Alert.alert("Erreur", "Impossible de supprimer la conversation.");
            }
          },
        },
      ]
    );
  };

  const handleSaveNickname = () => {
    if (!nickname.trim()) return;
    setModalVisible(false);
    Alert.alert("Succès", `Pseudo changé en "${nickname}"`);
  };

  // ------------------- MODE RECHERCHE -------------------
  if (isSearching) {
    return (
      <View className="flex-1 bg-zinc-950">
        {/* Header de recherche */}
        <View className="pt-12 px-4 pb-3 border-b border-zinc-800">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                setIsSearching(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="p-2 mr-2"
            >
              <Icon as={ArrowLeft} size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-1 flex-row items-center bg-zinc-800 rounded-lg px-4 py-2">
              <Icon as={Search} size={20} color="#a1a1aa" />
              <TextInput
                ref={searchInputRef}
                className="flex-1 text-white ml-3 text-base"
                placeholder="Rechercher dans la conversation"
                placeholderTextColor="#a1a1aa"
                value={searchQuery}
                autoFocus
                selectionColor="#3b82f6"
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Icon as={X} size={20} color="#a1a1aa" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity className="p-2 ml-2">
              <Icon as={MoreVertical} size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Résultats */}
        <FlatList
          data={searchResults}
          keyExtractor={(item: { id: any }) => item.id}
          renderItem={({ item }: { item: any }) => (
            <MessageResultItem
              message={item}
              searchQuery={searchQuery}
              onPress={() => handleResultPress(item)}
            />
          )}
          ListHeaderComponent={() => (
            <View className="px-4 py-3 border-b border-zinc-800">
              <Text className="text-zinc-400 text-sm">
                {loadingSearch
                  ? "Recherche..."
                  : `${searchResults.length} résultat${
                      searchResults.length !== 1 ? "s" : ""
                    }`}
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center py-20">
              {loadingSearch ? (
                <Text className="text-zinc-400">Recherche en cours...</Text>
              ) : searchQuery ? (
                <>
                  <Icon as={Search} size={60} color="#52525b" />
                  <Text className="text-zinc-400 text-lg mt-4 font-medium">
                    Aucun résultat pour "{searchQuery}"
                  </Text>
                  <Text className="text-zinc-500 text-center mt-2 px-10">
                    Vérifiez l'orthographe ou essayez d'autres mots-clés
                  </Text>
                </>
              ) : (
                <Text className="text-zinc-400">
                  Entrez un mot-clé pour rechercher dans la conversation
                </Text>
              )}
            </View>
          )}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    );
  }

  // ------------------- MODE NORMAL -------------------
  return (
    <>
      <View className="flex-1 bg-zinc-950">
        <FlatList
          data={messages}
          keyExtractor={(item: { id: any }) =>
            item.id || Math.random().toString()
          }
          renderItem={({ item }: { item: any }) => (
            <View className="px-4 py-3 border-b border-zinc-800">
              <View className="flex-row items-start gap-3">
                <View className="w-10 h-10 rounded-full bg-zinc-700" />
                <View className="flex-1">
                  <Text className="text-white font-semibold text-sm">
                    {item.sender?.name || "Unknown"}
                  </Text>
                  <Text className="text-zinc-300 text-sm mt-1">
                    {item.content}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            typingIndicatorEnabled && isUserTyping ? (
              <View className="px-4 py-3 border-t border-zinc-800">
                <Text className="text-zinc-400 text-xs mb-2">
                  {user?.firstName} est en train d'écrire...
                </Text>
                <TypingIndicator isTyping={true} />
              </View>
            ) : null
          }
        />

        {/* Header Profile */}
        <View className="items-center pt-8 pb-6">
          <View className="relative">
            {profilePicture}
            <View className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-black rounded-full" />
          </View>
          <Text className="text-white text-2xl font-bold mt-4">{nickname}</Text>
          <View className="flex-row items-center bg-zinc-800 px-3 py-1 rounded-full mt-2">
            <Icon as={ShieldCheck} size={14} color="#a1a1aa" />
            <Text className="text-zinc-400 text-xs ml-1 font-medium">
              Chiffrée de bout en bout
            </Text>
          </View>
        </View>

        {/* Main Actions */}
        <View className="flex-row justify-center gap-8 mb-4">
          <View className="items-center">
            <TouchableOpacity className="w-12 h-12 bg-zinc-800 rounded-full items-center justify-center mb-1">
              <Icon as={User} size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-zinc-400 text-xs">Profil</Text>
          </View>
          <View className="items-center">
            <TouchableOpacity className="w-12 h-12 bg-zinc-800 rounded-full items-center justify-center mb-1">
              <Icon as={Bell} size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-zinc-400 text-xs">Mettre en sourdine</Text>
          </View>
        </View>

        {/* Personnalisation */}
        <View className="px-4 pt-6 pb-2">
          <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
            Personnalisation
          </Text>
        </View>
        <View className="bg-zinc-900/50 mx-4 rounded-2xl overflow-hidden">
          <SettingItem
            icon={Type}
            label="Pseudos"
            value={nickname}
            onPress={() => setModalVisible(true)}
          />
        </View>

        {/* Autres Actions */}
        <View className="px-4 pt-6 pb-2">
          <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
            Autres actions
          </Text>
        </View>
        <View className="bg-zinc-900/50 mx-4 rounded-2xl overflow-hidden">
          <SettingItem
            icon={Users}
            label={`Créer une discussion de groupe avec ${nickname}`}
            showChevron={false}
          />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem
            icon={ImageIcon}
            label="Voir les contenus multimédias, les fichiers et les liens"
            onPress={() => setMediaViewerVisible(true)}
          />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
    <SettingItem
  icon={Download}
  label="Enregistrer automatiquement les photos"
  toggleValue={autoSavePhotos}
  onToggle={handleAutoSavePhotosToggle}
  showChevron={false}
/>


          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem icon={Pin} label="Messages épinglés" />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem
            icon={Search}
            label="Rechercher dans la conversation"
            onPress={() => setIsSearching(true)}
          />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem
            icon={Bell}
            label="Sons et notifications"
            onPress={() => setSoundSettingsVisible(true)}
          />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem
            icon={MessageSquare}
            label="Autorisations de messages"
            onPress={() => setMessagePermissionsVisible(true)}
          />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem
            icon={Clock}
            label="Messages éphémères"
            value={
              ephemeralEnabled
                ? ephemeralDuration === 5
                  ? "5 secondes"
                  : ephemeralDuration === 30
                  ? "30 secondes"
                  : ephemeralDuration === 60
                  ? "1 minute"
                  : ephemeralDuration === 300
                  ? "5 minutes"
                  : "1 heure"
                : "Désactivé"
            }
            onPress={() => setEphemeralVisible(true)}
          />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
     <SettingItem
  icon={Eye}
  label="Confirmations de lecture"
  toggleValue={readReceiptsEnabled}
  onToggle={handleReadReceiptsToggle}
/>


          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem
  icon={KeyboardIcon}
  label="Indicateur de saisie"
  toggleValue={typingIndicatorEnabled}
  onToggle={handleTypingIndicatorToggle}
/>

          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem icon={Slash} label="Restreindre" />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem icon={Ban} label="Bloquer" />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem icon={AlertTriangle} label="Signaler" />
        </View>

        {/* Confidentialité et assistance */}
        <View className="px-4 pt-6 pb-2">
          <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
            Confidentialité et assistance
          </Text>
        </View>
        <View className="bg-zinc-900/50 mx-4 rounded-2xl overflow-hidden mb-6">
          <SettingItem
            icon={ShieldCheck}
            label="Vérifier le chiffrement de bout en bout"
          />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem
            icon={Trash2}
            label="Supprimer la discussion"
            destructive
            onPress={handleDeleteConversation}
          />
        </View>
      </View>

      {/* Modal pour Pseudo */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center bg-black/60">
            <TouchableWithoutFeedback>
              <View className="bg-zinc-900 rounded-2xl p-6 w-80">
                <Text className="text-white text-lg mb-4">
                  Changer le pseudo
                </Text>
                <TextInput
                  placeholder="Nouveau pseudo"
                  placeholderTextColor="#888"
                  className="bg-zinc-800 text-white p-3 rounded-xl mb-4"
                  value={nickname}
                  onChangeText={setNickname}
                />
                <View className="flex-row justify-end gap-4">
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text className="text-zinc-400">Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveNickname}>
                    <Text className="text-blue-500 font-semibold">
                      Enregistrer
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal MediaViewerModal */}
      <MediaViewerModal
        visible={mediaViewerVisible}
        onClose={() => setMediaViewerVisible(false)}
        messages={messages}
      />

      <SoundSettingsModal
        visible={soundSettingsVisible}
        onClose={() => setSoundSettingsVisible(false)}
      />

      <MessagePermissionsModal
        visible={messagePermissionsVisible}
        onClose={() => setMessagePermissionsVisible(false)}
      />

      <EphemeralMessagesModal
        visible={ephemeralVisible}
        onClose={() => setEphemeralVisible(false)}
        onEphemeralStateChange={handleEphemeralStateChange}
      />
    </>
  );
};
