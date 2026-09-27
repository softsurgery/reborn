import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building,
  CheckCircle2,
  Users,
  Sparkles,
  Award,
  Mail,
  MessageSquare,
  ShieldCheck,
} from "lucide-react-native";

export const JobSummary = ({ job }: { job?: any }) => {
  const jobTitle = job?.title || "Senior Full-Stack Mobile Engineer";
  const companyName = job?.company?.name || "TechCorp Innovations";
  const location = job?.location || "San Francisco, CA (Remote)";
  const salaryRange = job?.salary || "$130,000 - $165,000 / year";
  const jobType = job?.type || "Full-Time";
  const experienceLevel = job?.experienceLevel || "Senior Level (5+ yrs)";
  const postedDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : "2 days ago";

  const skills = [
    "React Native",
    "TypeScript",
    "Expo",
    "Node.js",
    "GraphQL",
    "Tailwind CSS",
    "REST APIs",
    "State Management",
  ];

  const benefits = [
    "Comprehensive Health, Dental & Vision",
    "Unlimited Paid Time Off (PTO)",
    "401(k) Matching up to 5%",
    "$1,500 Annual Learning & Conference Budget",
    "Home Office Setup Allowance ($1,000)",
    "Flexible Working Hours & Remote-first culture",
  ];

  const responsibilities = [
    "Architect, build, and maintain high-performance mobile applications using React Native and Expo.",
    "Collaborate closely with UI/UX designers, product managers, and backend engineers to craft intuitive user experiences.",
    "Write clean, scalable, and well-tested code while maintaining software engineering best practices.",
    "Optimize application performance, solve complex technical challenges, and ensure cross-platform compatibility.",
    "Participate in code reviews, mentor junior developers, and contribute to technical documentation.",
  ];

  const pipelineSteps = [
    {
      title: "Application Review",
      status: "Completed",
      count: "58 Applicants",
    },
    { title: "Screening Call", status: "In Progress", count: "24 Candidates" },
    {
      title: "Technical Assessment",
      status: "Upcoming",
      count: "12 Candidates",
    },
    {
      title: "System Design Interview",
      status: "Pending",
      count: "5 Candidates",
    },
    { title: "Final Offer", status: "Pending", count: "1 Position" },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background p-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Banner / Main Info */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <View className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                ● Active Listing
              </Text>
            </View>
            <View className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-semibold">
                Featured
              </Text>
            </View>
          </View>
          <Text className="text-muted-foreground text-xs font-medium">
            ID: #{job?.id?.slice(0, 8) || "8F3A29B1"}
          </Text>
        </View>

        <Text className="text-foreground text-xl font-bold mb-1">
          {jobTitle}
        </Text>
        <View className="flex-row items-center gap-1.5 mb-4">
          <Building size={16} className="text-muted-foreground" />
          <Text className="text-muted-foreground text-sm font-medium">
            {companyName}
          </Text>
          <Text className="text-muted-foreground text-xs">
            • Engineering Dept
          </Text>
        </View>

        {/* Quick Highlights Bar */}
        <View className="flex-row items-center justify-between bg-muted/40 rounded-xl p-3 border border-border/50">
          <View className="items-center flex-1 border-r border-border/50">
            <Text className="text-foreground font-bold text-base">58</Text>
            <Text className="text-muted-foreground text-[10px] uppercase font-semibold">
              Applicants
            </Text>
          </View>
          <View className="items-center flex-1 border-r border-border/50">
            <Text className="text-foreground font-bold text-base">1.2k</Text>
            <Text className="text-muted-foreground text-[10px] uppercase font-semibold">
              Views
            </Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-emerald-500 font-bold text-base">94%</Text>
            <Text className="text-muted-foreground text-[10px] uppercase font-semibold">
              Match Score
            </Text>
          </View>
        </View>
      </View>

      {/* Key Job Specifications */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">
        <Text className="text-foreground text-base font-bold mb-4">
          Job Specifications
        </Text>

        <View className="flex-row flex-wrap -mx-2">
          <View className="w-1/2 px-2 mb-4 flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
              <Briefcase size={18} className="text-primary" />
            </View>
            <View>
              <Text className="text-muted-foreground text-xs">Employment</Text>
              <Text className="text-foreground font-semibold text-sm">
                {jobType}
              </Text>
            </View>
          </View>

          <View className="w-1/2 px-2 mb-4 flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
              <MapPin size={18} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="text-muted-foreground text-xs">Location</Text>
              <Text
                className="text-foreground font-semibold text-sm"
                numberOfLines={1}
              >
                {location}
              </Text>
            </View>
          </View>

          <View className="w-1/2 px-2 mb-4 flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
              <DollarSign size={18} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="text-muted-foreground text-xs">
                Salary Range
              </Text>
              <Text
                className="text-foreground font-semibold text-sm"
                numberOfLines={1}
              >
                {salaryRange}
              </Text>
            </View>
          </View>

          <View className="w-1/2 px-2 mb-4 flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
              <Award size={18} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="text-muted-foreground text-xs">Experience</Text>
              <Text
                className="text-foreground font-semibold text-sm"
                numberOfLines={1}
              >
                {experienceLevel}
              </Text>
            </View>
          </View>

          <View className="w-1/2 px-2 flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
              <Clock size={18} className="text-primary" />
            </View>
            <View>
              <Text className="text-muted-foreground text-xs">Posted Date</Text>
              <Text className="text-foreground font-semibold text-sm">
                {postedDate}
              </Text>
            </View>
          </View>

          <View className="w-1/2 px-2 flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
              <ShieldCheck size={18} className="text-primary" />
            </View>
            <View>
              <Text className="text-muted-foreground text-xs">Security</Text>
              <Text className="text-foreground font-semibold text-sm">
                Background Check
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Description & Responsibilities */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">
        <Text className="text-foreground text-base font-bold mb-3">
          Overview & Responsibilities
        </Text>
        <Text className="text-muted-foreground text-sm leading-6 mb-4">
          We are seeking an experienced Senior Mobile Engineer to spearhead the
          development of our next-generation mobile applications. In this role,
          you will lead end-to-end feature implementation, drive architectural
          decisions, and build high-impact products used by thousands of daily
          active users.
        </Text>

        <Text className="text-foreground text-sm font-semibold mb-2">
          Key Responsibilities:
        </Text>
        {responsibilities.map((resp, idx) => (
          <View key={idx} className="flex-row items-start gap-2.5 mb-2.5">
            <CheckCircle2 size={16} className="text-primary mt-0.5" />
            <Text className="text-muted-foreground text-sm flex-1 leading-5">
              {resp}
            </Text>
          </View>
        ))}
      </View>

      {/* Required Skills & Technologies */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">
        <View className="flex-row items-center gap-2 mb-3">
          <Sparkles size={18} className="text-amber-500" />
          <Text className="text-foreground text-base font-bold">
            Required Tech Stack
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <View
              key={idx}
              className="bg-muted px-3 py-1.5 rounded-xl border border-border/60"
            >
              <Text className="text-foreground font-medium text-xs">
                {skill}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Hiring Process Pipeline */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">
        <Text className="text-foreground text-base font-bold mb-4">
          Recruitment Pipeline Stages
        </Text>
        {pipelineSteps.map((step, idx) => (
          <View
            key={idx}
            className="flex-row items-center justify-between py-2.5 border-b border-border/40 last:border-b-0"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-6 h-6 rounded-full bg-primary/10 items-center justify-center">
                <Text className="text-primary font-bold text-xs">
                  {idx + 1}
                </Text>
              </View>
              <View>
                <Text className="text-foreground font-medium text-sm">
                  {step.title}
                </Text>
                <Text className="text-muted-foreground text-xs">
                  {step.count}
                </Text>
              </View>
            </View>
            <View className="bg-muted px-2.5 py-1 rounded-md">
              <Text className="text-muted-foreground text-xs font-semibold">
                {step.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Benefits & Perks */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">
        <Text className="text-foreground text-base font-bold mb-3">
          Benefits & Perks
        </Text>
        {benefits.map((benefit, idx) => (
          <View key={idx} className="flex-row items-center gap-2.5 mb-2">
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text className="text-muted-foreground text-sm font-medium">
              {benefit}
            </Text>
          </View>
        ))}
      </View>

      {/* Hiring Manager Card */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-6">
        <Text className="text-foreground text-base font-bold mb-3">
          Hiring Manager
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-muted items-center justify-center border border-border">
              <Users size={22} className="text-muted-foreground" />
            </View>
            <View>
              <Text className="text-foreground font-bold text-base">
                Sarah Jenkins
              </Text>
              <Text className="text-muted-foreground text-xs">
                VP of Engineering • TechCorp
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="w-9 h-9 rounded-full bg-muted items-center justify-center border border-border">
              <Mail size={18} className="text-foreground" />
            </TouchableOpacity>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-primary items-center justify-center">
              <MessageSquare size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
