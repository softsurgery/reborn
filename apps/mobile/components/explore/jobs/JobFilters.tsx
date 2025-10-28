import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Settings2 } from "lucide-react-native";
import { Keyboard, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Checkbox } from "~/components/ui/checkbox";
import Select from "~/components/shared/Select";
import { Text } from "~/components/ui/text";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useJobCategories } from "~/hooks/content/job/useJobCategories";
import { Icon } from "~/components/ui/icon";

interface JobFiltersProps {
  className?: string;
}

export const JobFilters = ({ className }: JobFiltersProps) => {
  // States
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<{ [key: string]: boolean }>({
    Remote: false,
    "Full-time": false,
    "Part-time": false,
    Internship: false,
  });

  const { jobCategories } = useJobCategories();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    Keyboard.dismiss();
  };

  const closeDialog = () => {
    setOpen(false);
    Keyboard.dismiss();
  };

  const accordionTriggerClassName = "flex flex-row items-center";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"icon"} className={className}>
          <Icon as={Settings2} size={24} />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[80vw]" exit>
        <Accordion type="single" collapsible>
          {/* Date Range */}
          <AccordionItem value="date">
            <AccordionTrigger className={accordionTriggerClassName}>
              <View className="w-[90%]">
                <Text className="font-semibold">Date Range</Text>
                <Text className="text-muted-foreground text-xs">
                  Choose a start and end date to filter job postings.
                </Text>
              </View>
            </AccordionTrigger>
            <AccordionContent>
              <View className="flex flex-col gap-2 items-center">
                <View className="flex flex-row items-center justify-between w-full">
                  <Text className="font-medium">Start</Text>
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    onChange={(e, date) => setStartDate(date)}
                  />
                </View>
                <View className="flex flex-row items-center justify-between w-full">
                  <Text className="font-medium">End</Text>
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    onChange={(e, date) => setEndDate(date)}
                  />
                </View>
              </View>
            </AccordionContent>
          </AccordionItem>

          {/* Category */}
          <AccordionItem value="category">
            <AccordionTrigger className={accordionTriggerClassName}>
              <View className="w-[90%]">
                <Text className="font-semibold">Category</Text>
                <Text className="text-muted-foreground text-xs">
                  Narrow down jobs based on their main category.
                </Text>
              </View>
            </AccordionTrigger>
            <AccordionContent>
              <Select
                title="Select a category to filter with"
                value={category}
                onSelect={(itemValue) => setCategory(itemValue)}
                options={jobCategories.map((category) => ({
                  label: category.label,
                  value: category.id.toString(),
                }))}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Tags */}
          <AccordionItem value="tags">
            <AccordionTrigger className={accordionTriggerClassName}>
              <View className="w-[90%]">
                <Text className="font-semibold">Tags</Text>
                <Text className="text-muted-foreground text-xs">
                  Apply additional filters such as job type or work style.
                </Text>
              </View>
            </AccordionTrigger>
            <AccordionContent>
              {Object.keys(tags).map((tag) => (
                <View key={tag} className="flex-row items-center gap-2 mt-1">
                  <Checkbox
                    checked={tags[tag]}
                    onCheckedChange={(newValue) =>
                      setTags((prev) => ({ ...prev, [tag]: newValue }))
                    }
                  />
                  <Text>{tag}</Text>
                </View>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Actions */}
        <View className="flex-row justify-between w-full gap-2 mt-4">
          <Button
            className="w-[49%]"
            onPress={() => {
              closeDialog();
            }}
          >
            <Text>Apply Filters</Text>
          </Button>
          <Button
            className="w-[49%]"
            variant="outline"
            onPress={() => {
              setStartDate(undefined);
              setEndDate(undefined);
              setCategory(undefined);
              setTags({
                Remote: false,
                "Full-time": false,
                "Part-time": false,
                Internship: false,
              });
              closeDialog();
            }}
          >
            <Text>Reset</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
};
