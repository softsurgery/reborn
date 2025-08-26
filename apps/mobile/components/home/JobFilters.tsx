import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Sliders } from "lucide-react-native";
import Icon from "~/lib/Icon";

interface JobFiltersProps {
  className?: string;
}

export const JobFilters = ({ className }: JobFiltersProps) => {
  return (
    <Dialog>
      <DialogTrigger className={className} asChild>
        <Button variant={"link"} className="w-fit">
          <Icon name={Sliders} size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
