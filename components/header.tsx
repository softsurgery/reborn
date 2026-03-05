import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Image src="/reborn.svg" alt="Logo" width={40} height={40} />
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline">
            reborn
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how"
            className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Testimonials
          </Link>
        </div>
      </nav>
    </header>
  );
}
