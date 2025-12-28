"use client";

import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Switch,
  Keyboard,
  ScrollView,
  FlatList,
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
    setSoundSettings(settings.soundSettings);
    setLoading(false);
  };

  const handlePlayTone = (toneId: string) => {
    setPlayingTone(toneId);
    playTone(toneId as any, { vibration: soundSettings.vibrationEnabled });
    setTimeout(() => setPlayingTone(null), 500);
  };

  const handleNotificationMutedChange = async (value: boolean) => {
    const updated = { ...soundSettings, notificationMuted: value };
    setSoundSettings(updated);
    await storageManager.updateSoundSettings(updated);
    onSettingsChange?.(updated);
  };

  const handleCallMutedChange = async (value: boolean) => {
    const updated = { ...soundSettings, callMuted: value };
    setSoundSettings(updated);
    await storageManager.updateSoundSettings(updated);
    onSettingsChange?.(updated);
  };

  const handleNotificationToneChange = async (toneId: string) => {
    const updated = { ...soundSettings, notificationTone: toneId };
    setSoundSettings(updated);
    await storageManager.updateSoundSettings(updated);
    onSettingsChange?.(updated);
  };

  const handleMessageToneChange = async (toneId: string) => {
    const updated = { ...soundSettings, messageTone: toneId };
    setSoundSettings(updated);
    await storageManager.updateSoundSettings(updated);
    onSettingsChange?.(updated);
  };

  const handleVibrationChange = async (value: boolean) => {
    const updated = { ...soundSettings, vibrationEnabled: value };
    setSoundSettings(updated);
    await storageManager.updateSoundSettings(updated);
    onSettingsChange?.(updated);
  };

  if (loading) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              {/* Mettre les notifications en sourdine */}
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
                    marginBottom: 12,
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
                    <Text
                      style={{ color: "#a1a1a1", fontSize: 14, marginTop: 4 }}
                    >
                      Désactiver tous les sons de notification
                    </Text>
                  </View>
                  <Switch
                    value={soundSettings.notificationMuted}
                    onValueChange={handleNotificationMutedChange}
                    trackColor={{ false: "#52525b", true: "#ef4444" }}
                    thumbColor={
                      soundSettings.notificationMuted ? "#ffffff" : "#f4f3f4"
                    }
                  />
                </View>
              </View>

              {/* Tonalité des notifications */}
              {!soundSettings.notificationMuted && (
                <View
                  style={{
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: "#27272a",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 16,
                      marginBottom: 12,
                    }}
                  >
                    Tonalité des notifications
                  </Text>
                  <FlatList
                    scrollEnabled={false}
                    data={NOTIFICATION_TONES}
                    keyExtractor={(item: { id: any }) => item.id}
                    renderItem={({
                      item,
                    }: {
                      item: (typeof NOTIFICATION_TONES)[number];
                    }) => (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 12,
                          marginBottom: 8,
                          backgroundColor:
                            soundSettings.notificationTone === item.id
                              ? "#2563eb"
                              : "#27272a",
                        }}
                      >
                        <Text style={{ fontSize: 24, marginRight: 12 }}>
                          {item.tone}
                        </Text>
                        <Text
                          style={{
                            color:
                              soundSettings.notificationTone === item.id
                                ? "white"
                                : "#d4d4d8",
                            fontWeight:
                              soundSettings.notificationTone === item.id
                                ? "600"
                                : "400",
                            flex: 1,
                          }}
                        >
                          {item.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handlePlayTone(item.id)}
                          style={{
                            padding: 8,
                            backgroundColor:
                              playingTone === item.id
                                ? "#3b82f6"
                                : "rgba(59, 130, 246, 0.2)",
                            borderRadius: 8,
                            marginRight: 8,
                          }}
                        >
                          <Icon
                            as={Volume2}
                            size={18}
                            color={
                              playingTone === item.id ? "white" : "#60a5fa"
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleNotificationToneChange(item.id)}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor:
                              soundSettings.notificationTone === item.id
                                ? "#2563eb"
                                : "#52525b",
                            backgroundColor:
                              soundSettings.notificationTone === item.id
                                ? "#2563eb"
                                : "transparent",
                          }}
                        />
                      </View>
                    )}
                  />
                </View>
              )}

              {/* Mettre les appels en sourdine */}
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
                    marginBottom: 12,
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
                    <Text
                      style={{ color: "#a1a1a1", fontSize: 14, marginTop: 4 }}
                    >
                      Désactiver les sons d'appels entrants
                    </Text>
                  </View>
                  <Switch
                    value={soundSettings.callMuted}
                    onValueChange={handleCallMutedChange}
                    trackColor={{ false: "#52525b", true: "#ef4444" }}
                    thumbColor={soundSettings.callMuted ? "#ffffff" : "#f4f3f4"}
                  />
                </View>
              </View>

              {/* Tonalité des messages */}
              <View
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#27272a",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: 16,
                    marginBottom: 12,
                  }}
                >
                  Tonalité des messages
                </Text>
                <FlatList
                  scrollEnabled={false}
                  data={MESSAGE_TONES}
                  keyExtractor={(item: { id: any }) => item.id}
                  renderItem={({
                    item,
                  }: {
                    item: (typeof MESSAGE_TONES)[number];
                  }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 12,
                        marginBottom: 8,
                        backgroundColor:
                          soundSettings.messageTone === item.id
                            ? "#2563eb"
                            : "#27272a",
                      }}
                    >
                      <Text style={{ fontSize: 24, marginRight: 12 }}>
                        {item.tone}
                      </Text>
                      <Text
                        style={{
                          color:
                            soundSettings.messageTone === item.id
                              ? "white"
                              : "#d4d4d8",
                          fontWeight:
                            soundSettings.messageTone === item.id
                              ? "600"
                              : "400",
                          flex: 1,
                        }}
                      >
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handlePlayTone(item.id)}
                        style={{
                          padding: 8,
                          backgroundColor:
                            playingTone === item.id
                              ? "#3b82f6"
                              : "rgba(59, 130, 246, 0.2)",
                          borderRadius: 8,
                          marginRight: 8,
                        }}
                      >
                        <Icon
                          as={Volume2}
                          size={18}
                          color={playingTone === item.id ? "white" : "#60a5fa"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleMessageToneChange(item.id)}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor:
                            soundSettings.messageTone === item.id
                              ? "#2563eb"
                              : "#52525b",
                          backgroundColor:
                            soundSettings.messageTone === item.id
                              ? "#2563eb"
                              : "transparent",
                        }}
                      />
                    </View>
                  )}
                />
              </View>

              {/* Vibration */}
              <View style={{ paddingVertical: 16 }}>
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
                      Vibration
                    </Text>
                    <Text
                      style={{ color: "#a1a1a1", fontSize: 14, marginTop: 4 }}
                    >
                      Activer la vibration pour les notifications
                    </Text>
                  </View>
                  <Switch
                    value={soundSettings.vibrationEnabled}
                    onValueChange={handleVibrationChange}
                    trackColor={{ false: "#52525b", true: "#3b82f6" }}
                    thumbColor={
                      soundSettings.vibrationEnabled ? "#ffffff" : "#f4f3f4"
                    }
                  />
                </View>
              </View>
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              style={{
                marginHorizontal: 24,
                marginBottom: 24,
                backgroundColor: "#2563eb",
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
