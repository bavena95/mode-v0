"use client";
import { MagnetIcon as Magic } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: ["Features", "Pricing", "Updates", "API"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Support: ["Help Center", "Community", "Status"],
  Legal: ["Privacy Policy", "Terms of Service"],
};

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
             <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-secondary to-primary">
                    <Magic className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Mode Design</h3>
              </Link>
              <p className="text-sm text-muted-foreground">Supercharge your productivity.</p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mode Design, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}