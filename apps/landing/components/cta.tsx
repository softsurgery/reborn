import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-primary">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground leading-tight">
          Ready to Restart Your Career?
        </h2>

        <p className="text-xl text-primary-foreground/90 leading-relaxed">
          Join thousands of workers who are earning more, working flexibly, and doing meaningful work. Start your journey with reborn today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button className="bg-primary-foreground text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-foreground/90 transition-colors flex items-center justify-center gap-2 group">
            Get Started for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-foreground/10 transition-colors">
            Schedule a Demo
          </button>
        </div>

        <p className="text-sm text-primary-foreground/70 pt-4">
          No credit card required. Start earning in minutes.
        </p>
      </div>
    </section>
  );
}
