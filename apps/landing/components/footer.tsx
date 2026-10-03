import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Security", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Press", href: "#" },
  ],
  Resources: [
    { label: "Help Center", href: "#" },
    { label: "Community", href: "#" },
    { label: "Documentation", href: "#" },
    { label: "API", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "#" },
    { label: "Compliance", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Image src="/reborn.svg" alt="Logo" width={24} height={24} />
              </div>
              <span className="text-lg font-bold">reborn</span>
            </Link>
            <p className="text-sm text-primary-foreground/70">
              The gig platform for meaningful work and growth.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2025 reborn. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              LinkedIn
            </Link>
            <Link
              href="#"
              className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
