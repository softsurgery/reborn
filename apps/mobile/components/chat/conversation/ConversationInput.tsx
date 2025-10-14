import { Plus, SendHorizonal } from "lucide-react-native";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Textarea } from "~/components/ui/textarea";
import Icon from "~/lib/Icon";
import { cn } from "~/lib/utils";

interface ConversationInputProps {
  className?: string;
  input: string;
  setInput: (text: string) => void;
  sendMessage: () => void;
}

export const ConversationInput = ({
  className,
  input,
  setInput,
  sendMessage,
}: ConversationInputProps) => {
  return (
    <View
      className={cn(
        "flex flex-row items-end justify-between bg-background py-4 px-2",
        className
      )}
    >
      <StablePressable
        className="w-10 h-10 flex items-center justify-center"
        onPress={() => {}}
      >
        <Icon name={Plus} size={20} />
      </StablePressable>

      <Textarea
        value={input}
        onChangeText={setInput}
        placeholder="Aa"
        multiline
        style={{ minHeight: 42 }}
        className="flex-1 mx-1 rounded-lg"
      />

      <StablePressable
        className="w-10 h-10 flex items-center justify-center"
        onPress={sendMessage}
      >
        <Icon name={SendHorizonal} size={20} />
      </StablePressable>
    </View>
  );
};
