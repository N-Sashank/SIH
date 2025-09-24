import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-muted py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">IC</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-foreground">InternConnect</span>
            </div>
            <p className="text-muted-foreground">
              Bridging the gap between students, industries, and faculty for smarter internships.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="#contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                LinkedIn
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                GitHub
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground">© 2025 InternConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
