import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { X, Volume2 } from "lucide-react-native";
import { Icon } from "~/components/ui/icon";
import { useState, useEffect } from "react";
import { storageManager } from "~/lib/storage-manager";
import { playTone } from "~/lib/tone-generator";

interface SoundSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: any) => void;
}

const NOTIFICATION_TONES = [
  { id: "default", name: "Par défaut", tone: "📳" },
  { id: "bell", name: "Cloche", tone: "🔔" },
  { id: "digital", name: "Numérique", tone: "📱" },
  { id: "chime", name: "Carillon", tone: "🎵" },
  { id: "pop", name: "Pop", tone: "💥" },
];

const MESSAGE_TONES = [
  { id: "default", name: "Par défaut", tone: "📨" },
  { id: "bubble", name: "Bulle", tone: "💬" },
  { id: "swoosh", name: "Swoosh", tone: "💨" },
  { id: "ping", name: "Ping", tone: "🔊" },
  { id: "soft", name: "Douce", tone: "🎶" },
];

export function SoundSettingsModal({
  visible,
  onClose,
  onSettingsChange,
}: SoundSettingsModalProps) {
  const [soundSettings, setSoundSettings] = useState({
    notificationMuted: false,
    callMuted: false,
    notificationTone: "default",
    messageTone: "default",
    vibrationEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [playingTone, setPlayingTone] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    const settings = await storageManager.loadSettings();
    if (settings?.soundSettings) {
      setSoundSettings(settings.soundSettings);
    }
    setLoading(false);
  };

  const updateSettings = async (updated: any) => {
    setSoundSettings(updated);
    await storageManager.updateSoundSettings(updated);
    onSettingsChange?.(updated);
  };

  const handlePlayTone = (toneId: string) => {
    setPlayingTone(toneId);
    playTone(toneId as any, { vibration: soundSettings.vibrationEnabled });
    setTimeout(() => setPlayingTone(null), 500);
  };

  if (loading) {
    return (
      <Modal visible={visible} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Chargement...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
          <View style={{ flex: 1 }} />
          <View
            style={{
              backgroundColor: "#18181b",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "80%",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#27272a",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Sons et notifications
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Icon as={X} size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
              {/* Notifications muted */}
              <View
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#27272a",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 16,
                      }}
                    >
                      Mettre les notifications en sourdine
                    </Text>
                    <Text style={{ color: "#a1a1a1", fontSize: 14, marginTop: 4 }}>
                      Désactiver tous les sons de notification
                    </Text>
                  </View>
                  <Switch
                    value={soundSettings.notificationMuted}
                    onValueChange={(v) =>
                      updateSettings({ ...soundSettings, notificationMuted: v })
                    }
                    trackColor={{ false: "#52525b", true: "#ef4444" }}
                    thumbColor={soundSettings.notificationMuted ? "#ffffff" : "#f4f3f4"}
                  />
                </View>
              </View>

              {/* Notification tones */}
              {!soundSettings.notificationMuted &&
                NOTIFICATION_TONES.map((item) => {
                  const selected = soundSettings.notificationTone === item.id;
                  return (
                    <View
                      key={item.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 12,
                        marginBottom: 8,
                        borderRadius: 12,
                        backgroundColor: selected ? "#2563eb" : "#27272a",
                      }}
                    >
                      <Text style={{ fontSize: 24, marginRight: 12 }}>{item.tone}</Text>
                      <Text
                        style={{
                          color: selected ? "white" : "#d4d4d8",
                          fontWeight: selected ? "600" : "400",
                          flex: 1,
                        }}
                      >
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handlePlayTone(item.id)}
                        style={{
                          padding: 8,
                          backgroundColor: playingTone === item.id ? "#3b82f6" : "rgba(59,130,246,0.2)",
                          borderRadius: 8,
                          marginRight: 8,
                        }}
                      >
                        <Icon as={Volume2} size={18} color={playingTone === item.id ? "white" : "#60a5fa"} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          updateSettings({ ...soundSettings, notificationTone: item.id })
                        }
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: selected ? "#2563eb" : "#52525b",
                          backgroundColor: selected ? "#2563eb" : "transparent",
                        }}
                      />
                    </View>
                  );
                })}

              {/* Call muted */}
              <View
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#27272a",
                  marginTop: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 16,
                      }}
                    >
                      Mettre les appels en sourdine
                    </Text>
                    <Text style={{ color: "#a1a1a1", fontSize: 14, marginTop: 4 }}>
                      Désactiver les sons d'appels entrants
                    </Text>
                  </View>
                  <Switch
                    value={soundSettings.callMuted}
                    onValueChange={(v) =>
                      updateSettings({ ...soundSettings, callMuted: v })
                    }
                    trackColor={{ false: "#52525b", true: "#ef4444" }}
                    thumbColor={soundSettings.callMuted ? "#ffffff" : "#f4f3f4"}
                  />
                </View>
              </View>

              {/* Message tones */}
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 16,
                  marginVertical: 12,
                }}
              >
                Tonalité des messages
              </Text>
              {MESSAGE_TONES.map((item) => {
                const selected = soundSettings.messageTone === item.id;
                return (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 12,
                      marginBottom: 8,
                      borderRadius: 12,
                      backgroundColor: selected ? "#2563eb" : "#27272a",
                    }}
                  >
                    <Text style={{ fontSize: 24, marginRight: 12 }}>{item.tone}</Text>
                    <Text
                      style={{
                        color: selected ? "white" : "#d4d4d8",
                        fontWeight: selected ? "600" : "400",
                        flex: 1,
                      }}
                    >
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handlePlayTone(item.id)}
                      style={{
                        padding: 8,
                        backgroundColor: playingTone === item.id ? "#3b82f6" : "rgba(59,130,246,0.2)",
                        borderRadius: 8,
                        marginRight: 8,
                      }}
                    >
                      <Icon as={Volume2} size={18} color={playingTone === item.id ? "white" : "#60a5fa"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => updateSettings({ ...soundSettings, messageTone: item.id })}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: selected ? "#2563eb" : "#52525b",
                        backgroundColor: selected ? "#2563eb" : "transparent",
                      }}
                    />
                  </View>
                );
              })}

              {/* Close button */}
              <TouchableOpacity
                onPress={onClose}
                style={{
                  marginVertical: 24,
                  backgroundColor: "#2563eb",
                  paddingVertical: 12,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{ color: "white", textAlign: "center", fontWeight: "600" }}
                >
                  Fermer
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
