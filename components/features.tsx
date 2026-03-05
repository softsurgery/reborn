import { Briefcase, TrendingUp, Users, Globe, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Briefcase,
    title: 'Opportunity Matching',
    description: 'Smart matching connects you with gigs that fit your skills, schedule, and goals.'
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Earnings',
    description: 'Build your profile, earn better rates, and unlock premium opportunities as you grow.'
  },
  {
    icon: Users,
    title: 'Supportive Community',
    description: 'Connect with fellow workers, share tips, and grow together in our thriving community.'
  },
  {
    icon: Globe,
    title: 'Work from Anywhere',
    description: 'Flexible remote and local opportunities mean you choose where and when you work.'
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Verified employers, secure payments, and your protection is always our priority.'
  },
  {
    icon: Zap,
    title: 'Instant Payouts',
    description: 'Get paid on your schedule. Daily, weekly, or monthly—choose what works for you.'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Everything You Need
          </h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            We've built reborn with workers in mind. Full control, fair compensation, and real support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group p-8 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 space-y-4"
              >
                <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-foreground/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
