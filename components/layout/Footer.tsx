import React from "react";
import Link from "next/link";
import { Phone, ExternalLink, Instagram, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-alt border-t border-hairline pt-16 pb-12 text-ink-2 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-hairline">
          {/* Col 1: ARSA name + short tagline */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary-soft border border-primary/20 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="font-heading font-bold text-base text-ink tracking-tight">
                ARSA
              </span>
            </Link>
            <p className="text-ink-2 text-xs leading-relaxed">
              Automation & Robotics Student Association. Department of Automation & Robotics, JSPM&apos;s Rajarshi Shahu College of Engineering, Pune.
            </p>
            <p className="text-ink-3 text-xs italic">
              Automate. Innovate. Build.
            </p>
            <div className="pt-2">
              <a
                href="https://www.instagram.com/arsa.rscoe/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-hairline text-ink-2 hover:text-primary hover:border-primary/40 transition-colors shadow-subtle"
                aria-label="ARSA Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">@arsa.rscoe</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink mb-3.5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/past-events" className="hover:text-primary transition-colors">
                  Past Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: More Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink mb-3.5">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-primary transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/join" className="hover:text-primary transition-colors">
                  Join
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: College Link & Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink mb-3.5">
              Institution & Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.jspmrscoe.edu.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-ink hover:text-primary font-medium transition-colors group"
                >
                  <span>JSPM&apos;s Rajarshi Shahu College of Engineering</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li className="flex items-center gap-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                <a
                  href="tel:+918595515962"
                  className="text-ink hover:text-primary font-medium transition-colors"
                >
                  +91 85955 15962
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-[11px] text-ink-3 hover:text-ink transition-colors"
                >
                  <span>Organiser Admin</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-3">
          <p>
            © 2026–27 ARSA, Dept. of Automation & Robotics, JSPM&apos;s RSCOE, Pune
          </p>
          <p className="text-[11px]">
            Dept. of Automation & Robotics • Tathawade, Pune
          </p>
        </div>
      </div>
    </footer>
  );
}
