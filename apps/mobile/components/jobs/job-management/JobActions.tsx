import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import {
  Edit,
  Trash2,
  Share2,
  PauseCircle,
  Copy,
  Rocket,
  Download,
  Mail,
  Sliders,
  Calendar,
  Link,
  Archive,
  ChevronRight,
} from "lucide-react-native";
import { useState } from "react";

export const JobActions = () => {
  const [isActive, setIsActive] = useState(true);
  const [autoScreening, setAutoScreening] = useState(true);

  return (
    <ScrollView
      className="flex-1 bg-background p-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Quick Status Control Card */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">
        <Text className="text-foreground text-base font-bold mb-3">
          Job Listing Controls
        </Text>

        <View className="flex-row items-center justify-between py-3 border-b border-border/50">
          <View className="flex-row items-center gap-3">
            <View
              className={`w-3 h-3 rounded-full ${isActive ? "bg-emerald-500" : "bg-amber-500"}`}
            />
            <View>
              <Text className="text-foreground font-semibold text-sm">
                {isActive ? "Listing Status: Active" : "Listing Status: Paused"}
              </Text>
              <Text className="text-muted-foreground text-xs">
                {isActive
                  ? "Visible to job seekers in search"
                  : "Hidden from search results"}
              </Text>
            </View>
          </View>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: "#71717a", true: "#10b981" }}
          />
        </View>

        <View className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <Sliders size={18} className="text-primary" />
            <View>
              <Text className="text-foreground font-semibold text-sm">
                AI Candidate Auto-Screening
              </Text>
              <Text className="text-muted-foreground text-xs">
                Automatically score candidate match
              </Text>
            </View>
          </View>
          <Switch
            value={autoScreening}
            onValueChange={setAutoScreening}
            trackColor={{ false: "#71717a", true: "#3b82f6" }}
          />
        </View>
      </View>

      {/* Featured / Sponsor Banner */}
      <TouchableOpacity className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/30 rounded-2xl p-4 mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3.5 flex-1">
          <View className="w-10 h-10 rounded-xl bg-primary/20 items-center justify-center">
            <Rocket size={20} className="text-primary" />
          </View>
          <View className="flex-1">
            <Text className="text-foreground font-bold text-sm">
              Boost Listing Reach
            </Text>
            <Text className="text-muted-foreground text-xs">
              Get up to 3x more views by featuring this job
            </Text>
          </View>
        </View>
        <ChevronRight size={18} className="text-muted-foreground" />
      </TouchableOpacity>

      {/* Primary Management Actions */}
      <View className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
        <Text className="text-foreground text-xs font-bold uppercase tracking-wider px-5 pt-4 pb-2 text-muted-foreground">
          Core Actions
        </Text>

        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border/40 active:bg-muted/40">
          <View className="flex-row items-center gap-3.5">
            <View className="w-9 h-9 rounded-xl bg-blue-500/10 items-center justify-center">
              <Edit size={18} className="text-blue-500" />
            </View>
            <View>
              <Text className="text-foreground font-semibold text-sm">
                Edit Job Posting
              </Text>
              <Text className="text-muted-foreground text-xs">
                Update title, requirements & salary
              </Text>
            </View>
          </View>
          <ChevronRight size={18} className="text-muted-foreground" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border/40 active:bg-muted/40">
          <View className="flex-row items-center gap-3.5">
            <View className="w-9 h-9 rounded-xl bg-purple-500/10 items-center justify-center">
              <Copy size={18} className="text-purple-500" />
            </View>
            <View>
              <Text className="text-foreground font-semibold text-sm">
                Duplicate Listing
              </Text>
              <Text className="text-muted-foreground text-xs">
                Create a copy for a similar opening
              </Text>
            </View>
          </View>
          <ChevronRight size={18} className="text-muted-foreground" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-muted/40">
          <View className="flex-row items-center gap-3.5">
            <View className="w-9 h-9 rounded-xl bg-amber-500/10 items-center justify-center">
              <PauseCircle size={18} className="text-amber-500" />
            </View>
            <View>
              <Text className="text-foreground font-semibold text-sm">
                Pause Applications
              </Text>
              <Text className="text-muted-foreground text-xs">
                Stop accepting new candidate submissions
              </Text>
            </View>
          </View>
          <ChevronRight size={18} className="text-muted-foreground" />
        </TouchableOpacity>
      </View>

      {/* Candidate Pipeline Tools */}
      <View className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
        <Text className="text-foreground text-xs font-bold uppercase tracking-wider px-5 pt-4 pb-2 text-muted-foreground">
          Candidate Pipeline Tools
        </Text>

        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border/40 active:bg-muted/40">
          <View className="flex-row items-center gap-3.5">
            <View className="w-9 h-9 rounded-xl bg-emerald-500/10 items-center justify-center">
              <Download size={18} className="text-emerald-500" />
            </View>
            <View>
              <Text className="text-foreground font-semibold text-sm">
                Export Applicants (CSV/PDF)
              </Text>
              <Text className="text-muted-foreground text-xs">
                Download full application database
              </Text>
            </View>
          </View>
          <ChevronRight size={18} className="text-muted-foreground" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border/40 active:bg-muted/40">
          <View className="flex-row items-center gap-3.5">
            <View className="w-9 h-9 rounded-xl bg-sky-500/10 items-center justify-center">
              <Mail size={18} className="text-sky-500" />
            </View>
            <View>
              <Text className="text-foreground font-semibold text-sm">
                Broadcast Message
              </Text>
              <Text className="text-muted-foreground text-xs">
                Send updates to all 58 applicants
              </Text>
            </View>
          </View>
          <ChevronRight size={18} className="text-muted-foreground" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-muted/40">
          <View className="flex-row items-center gap-3.5">
            <View className="w-9 h-9 rounded-xl bg-indigo-500/10 items-center justify-center">
              <Calendar size={18} className="text-indigo-500" />
            </View>
            <View>
              <Text className="text-foreground font-semibold text-sm">
                Interview Batch Scheduler
              </Text>
              <Text className="text-muted-foreground text-xs">
                Set available calendar slots for interviews
              </Text>
            </View>
          </View>
          <ChevronRight size={18} className="text-muted-foreground" />
        </TouchableOpacity>
      </View>

      {/* Share & Distribution */}
      <View className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
        <Text className="text-foreground text-xs font-bold uppercase tracking-wider px-5 pt-4 pb-2 text-muted-foreground">
          Distribution & Share
        </Text>

        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border/40 active:bg-muted/40">
          <View className="flex-row items-center gap-3.5">
            <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
              <Link size={18} className="text-primary" />
            </View>
            <View>
              <Text className="text-foreground font-semibold text-sm">
                Copy Direct Link
              </Text>
              <Text className="text-muted-foreground text-xs">
                Share custom referral or landing page link
              </Text>
            </View>
          </View>
          <ChevronRight size={18} className="text-muted-foreground" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-muted/40">
          <View className="flex-row items-center gap-3.5">
            <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
              <Share2 size={18} className="text-primary" />
            </View>
            <View>
              <Text className="text-foreground font-semibold text-sm">
                Share on Social Media
              </Text>
              <Text className="text-muted-foreground text-xs">
                Publish post to LinkedIn, X, or Facebook
              </Text>
            </View>
          </View>
          <ChevronRight size={18} className="text-muted-foreground" />
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View className="bg-card rounded-2xl border border-destructive/30 shadow-sm overflow-hidden mb-6">
        <Text className="text-destructive text-xs font-bold uppercase tracking-wider px-5 pt-4 pb-2">
          Danger Zone
        </Text>

        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border/40 active:bg-destructive/10">
          <View className="flex-row items-center gap-3.5">
            <View className="w-9 h-9 rounded-xl bg-muted items-center justify-center">
              <Archive size={18} className="text-muted-foreground" />
            </View>
            <View>
              <Text className="text-foreground font-semibold text-sm">
                Archive Job Listing
              </Text>
              <Text className="text-muted-foreground text-xs">
                Move to archive without deleting data
              </Text>
            </View>
          </View>
          <ChevronRight size={18} className="text-muted-foreground" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-4 active:bg-destructive/10">
          <View className="flex-row items-center gap-3.5">
            <View className="w-9 h-9 rounded-xl bg-destructive/10 items-center justify-center">
              <Trash2 size={18} className="text-destructive" />
            </View>
            <View>
              <Text className="text-destructive font-bold text-sm">
                Delete Job Permanently
              </Text>
              <Text className="text-muted-foreground text-xs">
                Irreversibly remove listing & applicant records
              </Text>
            </View>
          </View>
          <ChevronRight size={18} className="text-muted-foreground" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
