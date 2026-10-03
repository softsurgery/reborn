import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Freelance Designer',
    content: 'reborn transformed how I work. I found better opportunities, got paid fairly, and connected with amazing clients. My income doubled in 3 months.',
    rating: 5
  },
  {
    name: 'Marcus Johnson',
    role: 'Virtual Assistant',
    content: 'The flexibility is incredible. I work around my schedule, not the other way around. The platform is so intuitive and the support team is always there.',
    rating: 5
  },
  {
    name: 'Elena Rodriguez',
    role: 'Content Writer',
    content: 'As someone looking for a fresh start, reborn gave me exactly that. The opportunities are legitimate, the pay is competitive, and the community is supportive.',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Web Developer',
    content: 'I switched from freelancing on traditional platforms. reborn\'s matching algorithm is spot-on, and projects feel more meaningful. Highly recommended!',
    rating: 5
  }
];

export default function TestimonialSection() {
  return (
    <section id="testimonials" className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Loved by Workers
          </h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Join thousands of workers who are rebuilding their careers on reborn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all space-y-4"
            >
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              <p className="text-foreground/80 leading-relaxed text-lg">
                "{testimonial.content}"
              </p>

              <div>
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-foreground/60">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
