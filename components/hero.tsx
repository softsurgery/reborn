import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -top-40 opacity-40 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 pt-12">
          <div className="inline-block bg-accent/30 px-4 py-2 rounded-full border border-accent">
            <span className="text-sm font-medium text-secondary">🚀 Now open for workers everywhere</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance leading-tight">
            Work That Brings <span className="text-primary">Renewal</span>
          </h1>

          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Find meaningful gig opportunities that fit your life. Earn on your terms, grow at your pace, and connect with opportunities that matter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group">
              Start Earning
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-primary text-primary px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary/5 transition-colors">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-16 max-w-2xl mx-auto">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <p className="text-sm text-foreground/60">Active Workers</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">15K+</div>
              <p className="text-sm text-foreground/60">Monthly Opportunities</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">$2.5M+</div>
              <p className="text-sm text-foreground/60">Paid Out</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
