import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View } from "react-native";
import { HomePageHeader } from "./HomePageHeader";
import { JobCard } from "./JobCard";
import { useState, useMemo } from "react";
import { Text } from "../ui/text";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

// const mockJobs: Job[] = [
//   {
//     id: "1",
//     title: "Mobile App Designer",
//     price: "Fixed: TND20",
//     proposals: "Less than 10",
//     paymentVerified: true,
//     spent: "TND1k+ spent",
//     description:
//       "Create intuitive and visually appealing interfaces for mobile applications. Collaborate with product managers and developers to translate requirements into functional UI. Ensure consistency with design standards and contribute to our design system. Experience in Figma or Adobe XD is a plus. The ideal candidate has a strong portfolio, excellent communication skills, and attention to detail. Previous experience with cross-platform apps is preferred. Knowledge of accessibility and responsive design principles is essential.",
//     tags: [
//       "Designer",
//       "UserInterface",
//       "AppDevelopment",
//       "CreativeDesign",
//       "MobileAppDesign",
//     ],
//     postedAgo: "Posted 2 hours ago",
//     clientName: "Tech Solutions Inc.",
//     clientRating: 4.8,
//     clientLocation: "Tunisia, Tunis",
//     clientJobsPosted: 25,
//     clientHireRate: 85,
//     skillsRequired: [
//       "UI/UX Design",
//       "Figma",
//       "Adobe XD",
//       "Mobile Design",
//       "Prototyping",
//     ],
//     projectType: "Fixed",
//     duration: "1-3 months",
//     experienceLevel: "Intermediate",
//   },
//   {
//     id: "2",
//     title: "React Native Developer",
//     price: "Hourly: TND15-25",
//     proposals: "5-10",
//     paymentVerified: true,
//     spent: "TND5k+ spent",
//     description:
//       "Develop cross-platform mobile applications using React Native. Work with modern JavaScript frameworks and libraries. Collaborate with designers and backend developers to create seamless user experiences. The project involves creating a social media app with real-time messaging, user authentication, and media sharing capabilities.",
//     tags: [
//       "React Native",
//       "JavaScript",
//       "Mobile Development",
//       "Cross-platform",
//       "API Integration",
//     ],
//     postedAgo: "Posted 1 day ago",
//     clientName: "StartupTech",
//     clientRating: 4.5,
//     clientLocation: "Tunisia, Sfax",
//     clientJobsPosted: 15,
//     clientHireRate: 90,
//     skillsRequired: [
//       "React Native",
//       "JavaScript",
//       "TypeScript",
//       "API Integration",
//       "Mobile Testing",
//     ],
//     projectType: "Hourly",
//     duration: "3-6 months",
//     experienceLevel: "Intermediate",
//   },
//   {
//     id: "3",
//     title: "Data Analyst",
//     price: "Fixed: TND50",
//     proposals: "15-20",
//     paymentVerified: true,
//     spent: "TND3k+ spent",
//     description:
//       "Analyze business data to identify trends and insights. Create reports and dashboards using Excel, SQL, and data visualization tools. Present findings to stakeholders and provide actionable recommendations. Work with large datasets and help improve business decision-making processes.",
//     tags: [
//       "Data Analysis",
//       "Excel",
//       "SQL",
//       "Business Intelligence",
//       "Reporting",
//     ],
//     postedAgo: "Posted 5 hours ago",
//     clientName: "DataCorp Solutions",
//     clientRating: 4.9,
//     clientLocation: "Tunisia, Tunis",
//     clientJobsPosted: 30,
//     clientHireRate: 95,
//     skillsRequired: [
//       "Excel",
//       "SQL",
//       "Data Visualization",
//       "Statistical Analysis",
//       "Business Intelligence",
//     ],
//     projectType: "Fixed",
//     duration: "1-2 months",
//     experienceLevel: "Intermediate",
//   },
//   {
//     id: "4",
//     title: "Babysitter for 2 Kids",
//     price: "Hourly: TND12-18",
//     proposals: "Less than 5",
//     paymentVerified: true,
//     spent: "TND300+ spent",
//     description:
//       "Looking for a responsible and caring babysitter for my 2 children (ages 4 and 7). Must be available evenings and weekends. Experience with children required, references preferred. Need someone who can help with homework and engage in educational activities.",
//     tags: [
//       "Babysitting",
//       "Childcare",
//       "Evening",
//       "Weekend",
//       "References Required",
//     ],
//     postedAgo: "Posted 3 hours ago",
//     clientName: "Sarah Johnson",
//     clientRating: 4.7,
//     clientLocation: "Tunisia, Tunis",
//     clientJobsPosted: 8,
//     clientHireRate: 100,
//     skillsRequired: [
//       "Childcare Experience",
//       "First Aid",
//       "References",
//       "Reliability",
//       "Communication",
//     ],
//     projectType: "Hourly",
//     duration: "Ongoing",
//     experienceLevel: "Entry",
//   },
//   {
//     id: "5",
//     title: "Math & Science Tutor",
//     price: "Hourly: TND20-30",
//     proposals: "10-15",
//     paymentVerified: true,
//     spent: "TND2k+ spent",
//     description:
//       "Seeking an experienced tutor to help high school students with mathematics and science subjects. Must be patient, knowledgeable, and able to explain complex concepts clearly. Strong background in algebra, geometry, physics, and chemistry required.",
//     tags: ["Tutoring", "Mathematics", "Science", "Education", "High School"],
//     postedAgo: "Posted 6 hours ago",
//     clientName: "Education Center",
//     clientRating: 4.6,
//     clientLocation: "Tunisia, Sousse",
//     clientJobsPosted: 20,
//     clientHireRate: 85,
//     skillsRequired: [
//       "Mathematics",
//       "Science",
//       "Teaching",
//       "Patience",
//       "Communication",
//     ],
//     projectType: "Hourly",
//     duration: "3-6 months",
//     experienceLevel: "Intermediate",
//   },
//   {
//     id: "6",
//     title: "Logo Design for Startup",
//     price: "Fixed: TND150",
//     proposals: "20-30",
//     paymentVerified: false,
//     spent: "TND50+ spent",
//     description:
//       "Need a creative logo designer to create a modern, minimalist logo for my tech startup. Looking for multiple concepts and revisions included. Portfolio required. Must understand brand identity and modern design principles.",
//     tags: [
//       "Logo Design",
//       "Graphic Design",
//       "Startup",
//       "Minimalist",
//       "Brand Identity",
//     ],
//     postedAgo: "Posted 8 hours ago",
//     clientName: "TechStart Inc.",
//     clientRating: 4.2,
//     clientLocation: "Tunisia, Tunis",
//     clientJobsPosted: 3,
//     clientHireRate: 67,
//     skillsRequired: [
//       "Logo Design",
//       "Adobe Illustrator",
//       "Brand Identity",
//       "Creative Design",
//       "Portfolio",
//     ],
//     projectType: "Fixed",
//     duration: "2-4 weeks",
//     experienceLevel: "Intermediate",
//   },
//   {
//     id: "7",
//     title: "Pet Sitter",
//     price: "Hourly: TND8-15",
//     proposals: "5-10",
//     paymentVerified: true,
//     spent: "TND800+ spent",
//     description:
//       "Looking for a reliable pet sitter to take care of my dog and cat while I'm away for vacation. Must love animals and be available for overnight stays. Experience with pet care and emergency handling preferred.",
//     tags: ["Pet Sitting", "Animal Care", "Overnight", "Vacation", "Reliable"],
//     postedAgo: "Posted 12 hours ago",
//     clientName: "Animal Lover",
//     clientRating: 4.8,
//     clientLocation: "Tunisia, Monastir",
//     clientJobsPosted: 5,
//     clientHireRate: 80,
//     skillsRequired: [
//       "Pet Care",
//       "Animal Handling",
//       "Overnight Care",
//       "Reliability",
//       "Emergency Response",
//     ],
//     projectType: "Hourly",
//     duration: "1-2 weeks",
//     experienceLevel: "Entry",
//   },
//   {
//     id: "8",
//     title: "Full Stack Web Developer",
//     price: "Fixed: TND800",
//     proposals: "5-10",
//     paymentVerified: false,
//     spent: "TND500+ spent",
//     description:
//       "Need a full stack developer to create a modern e-commerce website with payment integration and admin dashboard. Must have experience with modern frameworks like React, Node.js, and database management. Clean, responsive design required.",
//     tags: [
//       "Full Stack",
//       "E-commerce",
//       "Payment Gateway",
//       "Admin Panel",
//       "Modern UI",
//     ],
//     postedAgo: "Posted 1 day ago",
//     clientName: "E-Commerce Solutions",
//     clientRating: 4.4,
//     clientLocation: "Tunisia, Tunis",
//     clientJobsPosted: 12,
//     clientHireRate: 75,
//     skillsRequired: [
//       "React",
//       "Node.js",
//       "Database",
//       "Payment Integration",
//       "Responsive Design",
//     ],
//     projectType: "Fixed",
//     duration: "2-4 months",
//     experienceLevel: "Expert",
//   },
// ];

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // const filteredJobs = useMemo(() => {
  //   if (!searchQuery.trim()) {
  //     return mockJobs;
  //   }

  //   const query = searchQuery.toLowerCase();
  //   return mockJobs.filter(
  //     (job) =>
  //       job.title.toLowerCase().includes(query) ||
  //       job.description.toLowerCase().includes(query) ||
  //       job.tags.some((tag) => tag.toLowerCase().includes(query))
  //   );
  // }, [searchQuery]);

  const allJobs = useQuery({
    queryKey: ["jobs"],
    queryFn: () => api.job.findAll(),
  });

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) {
      return allJobs.data || [];
    }

    const query = searchQuery.toLowerCase();
    return (allJobs.data || []).filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
    );
  }, [searchQuery, allJobs.data]);

  return (
    <KeyboardAwareScrollView>
      <HomePageHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultsCount={filteredJobs.length}
      />
      <View className="pb-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : searchQuery.trim() ? (
          <View className="px-4 py-8 items-center">
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              No jobs found matching "{searchQuery}"
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">
              Try different keywords or check your spelling
            </Text>
          </View>
        ) : null}
      </View>
    </KeyboardAwareScrollView>
  );
};
