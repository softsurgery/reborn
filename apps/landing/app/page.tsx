"use client";

import Header from "@/components/header";
import HeroSection from "@/components/hero";
import FeaturesSection from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import TestimonialSection from "@/components/testimonials";
import CTASection from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
