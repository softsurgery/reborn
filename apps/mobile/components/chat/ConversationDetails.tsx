import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  useColorScheme,
} from "react-native";
import { LegendList } from "@legendapp/list";
import {
  User,
  Bell,
  Type,
  Image as ImageIcon,
  Download,
  Search,
  ChevronRight,
  ShieldCheck,
  Slash,
  Ban,
  AlertTriangle,
  Trash2,
  X,
  ArrowLeft,
  MoreVertical,
} from "lucide-react-native";
import { Icon } from "~/components/ui/icon";
import { Toggle } from "~/components/ui/toggle";
import { cn } from "~/lib/utils";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { useServerImage } from "~/hooks/content/useServerImage";
import { router } from "expo-router";
import axios from "api/axios";
import { message as messageApi } from "api/chat/message";
import { storageManager } from "~/lib/storage-manager";
import { MediaViewerModal } from "~/components/chat/conversation/media-viewer-modal";
import { SoundSettingsModal } from "~/components/chat/conversation/sound-settings-modal";
import { useIdentifiedUser } from "~/hooks/content/user/useIdentifiedUser";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { StableScrollView } from "../shared/StableScrollView";

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
}: SettingItemProps) => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const destructiveColor = colorScheme === "dark" ? "#FF6B6B" : "#DC2626";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-3 active:bg-muted/50"
    >
      <View
        className={cn(
          "w-10 items-center",
          destructive ? "text-destructive" : "text-foreground",
        )}
      >
        <Icon
          as={icon}
          size={22}
          color={destructive ? destructiveColor : iconColor}
        />
      </View>
      <View className="flex-1 ml-2">
        <Text
          className={cn(
            "text-[17px]",
            destructive ? "text-destructive" : "text-foreground",
          )}
        >
          {label}
        </Text>
        {description && (
          <Text className="text-muted-foreground text-sm mt-0.5">
            {description}
          </Text>
        )}
      </View>
      <View className="flex-row items-center">
        {toggleValue !== undefined ? (
          <Toggle pressed={toggleValue} onPressedChange={onToggle} />
        ) : (
          <>
            {value && (
              <Text className="text-muted-foreground text-[17px] mr-2">
                {value}
              </Text>
            )}
            {showChevron && (
              <Icon as={ChevronRight} size={20} color={iconColor} />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

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
      return <Text className="text-foreground">{text || ""}</Text>;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <Text className="text-foreground">
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={index} className="bg-accent font-semibold">
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          ),
        )}
      </Text>
    );
  };

  const senderName = message.sender?.profile?.firstName || "Utilisateur";
  const content = message.content || "";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-4 py-3 border-b border-border active:bg-muted/30"
    >
      <View className="flex-row items-start">
        <View className="w-8 h-8 rounded-full bg-muted items-center justify-center mr-3 mt-1">
          <Text className="text-muted-foreground text-xs font-medium">
            {senderName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-foreground font-medium mr-2">
              {senderName}
            </Text>
            <Text className="text-muted-foreground text-xs">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          {highlightText(content, searchQuery)}
          <Text className="text-muted-foreground text-xs mt-2">
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
interface ConversationDetailsProps {
  id: string;
}

export const ConversationDetails = ({ id }: ConversationDetailsProps) => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const mutedIconColor = colorScheme === "dark" ? "#A1A1AA" : "#71717A";

  const { user } = useIdentifiedUser({
    id,
  });
  const identification = identifyUser(user);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  const { jsx: profilePicture } = useServerImage({
    id: user?.pictureId,
    fallback: identifyUserAvatar(user),
    size: { width: 90, height: 90 },
    enabled: !!user,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [nickname, setNickname] = useState(identification);

  const [messages, setMessages] = useState<any[]>([]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [soundSettingsVisible, setSoundSettingsVisible] = useState(false);
  const [mediaViewerVisible, setMediaViewerVisible] = useState(false);
  const [autoSavePhotos, setAutoSavePhotos] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await storageManager.loadSettings();
      setAutoSavePhotos(settings.autoSavePhotos);
    };

    loadSettings();
  }, []);

  const handleAutoSavePhotosToggle = async (value: boolean) => {
    setAutoSavePhotos(value);
    await storageManager.updateAutoSavePhotos(value);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await messageApi.findPaginatedConversationMessages(0, {
          page: "1",
          limit: "100",
          sort: "DESC",
        });
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
  }, [id]); // Ajouter id comme dépendance pour recharger si l'ID change

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
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
      `Aller au message: ${message.content.substring(0, 50)}...`,
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
              await axios.delete(`/conversation/${id}`); // Utiliser id au lieu de user?.id pour cohérence
              Alert.alert("Succès", "La conversation a été supprimée.");
              router.back();
            } catch (error) {
              console.error("Erreur lors de la suppression :", error);
              Alert.alert("Erreur", "Impossible de supprimer la conversation.");
            }
          },
        },
      ],
    );
  };

  // ------------------- MODE RECHERCHE -------------------
  if (isSearching) {
    return (
      <StableSafeAreaView className="flex-1 bg-background">
        <ApplicationHeader
          title=""
          shortcuts={[
            {
              key: "back",
              icon: ArrowLeft,
              onPress: () => router.back(),
            },
          ]}
          reverse
          className="border-b border-border pb-2 bg-transparent"
        />
        {/* Header de recherche */}
        <View className="pt-12 px-4 pb-3 border-b border-border bg-background">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                setIsSearching(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="p-2 mr-2"
            >
              <Icon as={ArrowLeft} size={24} color={iconColor} />
            </TouchableOpacity>
            <View className="flex-1 flex-row items-center bg-muted rounded-lg px-4 py-2">
              <Icon as={Search} size={20} color={mutedIconColor} />
              <TextInput
                ref={searchInputRef}
                className="flex-1 text-foreground ml-3 text-base"
                placeholder="Rechercher dans la conversation"
                placeholderTextColor={mutedIconColor}
                value={searchQuery}
                autoFocus
                selectionColor={colorScheme === "dark" ? "#3b82f6" : "#2563eb"}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Icon as={X} size={20} color={mutedIconColor} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity className="p-2 ml-2">
              <Icon as={MoreVertical} size={24} color={iconColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Résultats */}
        <LegendList
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
            <View className="px-4 py-3 border-b border-border">
              <Text className="text-muted-foreground text-sm">
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
                <Text className="text-muted-foreground">
                  Recherche en cours...
                </Text>
              ) : searchQuery ? (
                <>
                  <Icon as={Search} size={60} color={mutedIconColor} />
                  <Text className="text-muted-foreground text-lg mt-4 font-medium">
                    Aucun résultat pour "{searchQuery}"
                  </Text>
                  <Text className="text-muted-foreground text-center mt-2 px-10">
                    Vérifiez l'orthographe ou essayez d'autres mots-clés
                  </Text>
                </>
              ) : (
                <Text className="text-muted-foreground">
                  Entrez un mot-clé pour rechercher dans la conversation
                </Text>
              )}
            </View>
          )}
          keyboardShouldPersistTaps="handled"
        />
      </StableSafeAreaView>
    );
  }

  // ------------------- MODE NORMAL -------------------
  return (
    <StableSafeAreaView className="flex-1 bg-card">
      <ApplicationHeader
        title=""
        shortcuts={[
          {
            key: "back",
            icon: ArrowLeft,
            onPress: () => router.back(),
          },
        ]}
        reverse
        className="border-b border-border pb-2 bg-card"
      />
      <StableScrollView className="bg-background">
        {/* Header Profile */}
        <View className="items-center pt-8 pb-6">
          <View className="relative">
            {profilePicture}
            <View className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-background rounded-full" />
          </View>
          <Text className="text-foreground text-2xl font-bold mt-4">
            {nickname}
          </Text>
          <View className="flex-row items-center bg-muted px-3 py-1 rounded-full mt-2">
            <Icon as={ShieldCheck} size={14} color={mutedIconColor} />
            <Text className="text-muted-foreground text-xs ml-1 font-medium">
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
          <Text className="text-primary text-xs font-semibold uppercase tracking-wider">
            Personnalisation
          </Text>
        </View>
        <View className="bg-card mx-3 rounded-2xl">
          <SettingItem
            icon={Type}
            label="Pseudos"
            value={nickname}
            onPress={() => setModalVisible(true)}
          />
        </View>

        {/* Autres Actions */}
        <View className="px-4 pt-6 pb-2">
          <Text className="text-primary text-xs font-semibold uppercase tracking-wider">
            Autres actions
          </Text>
        </View>
        <View className="bg-card mx-3 rounded-2xl overflow-hidden">
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
        </View>

        {/* Confidentialité et assistance */}
        <View className="px-4 pt-6 pb-2">
          <Text className="text-primary text-xs font-semibold uppercase tracking-wider">
            Confidentialité et assistance
          </Text>
        </View>

        <View className="bg-card mx-3 rounded-2xl mb-12">
          <SettingItem icon={Slash} label="Restreindre" />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem icon={Ban} label="Bloquer" />
          <View className="h-[0.5px] bg-zinc-800 ml-14" />
          <SettingItem icon={AlertTriangle} label="Signaler" />
          <SettingItem
            icon={Trash2}
            label="Supprimer la discussion"
            destructive
            onPress={handleDeleteConversation}
          />
        </View>
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
      </StableScrollView>
    </StableSafeAreaView>
  );
};
