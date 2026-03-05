import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Sign up and tell us about your skills, experience, and what kind of work interests you.'
  },
  {
    number: '02',
    title: 'Browse Opportunities',
    description: 'Explore gigs from verified employers in your area or work remotely. Filter by pay, schedule, and skills.'
  },
  {
    number: '03',
    title: 'Apply & Connect',
    description: 'Apply to opportunities that match your profile. Connect directly with employers and discuss details.'
  },
  {
    number: '04',
    title: 'Work & Earn',
    description: 'Complete the gig and get paid instantly. Build your reputation with every successful project.'
  }
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-32 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Getting started is simple. Join thousands of workers earning on their own terms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Connecting line for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/20 to-transparent" />
              )}

              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-foreground/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
