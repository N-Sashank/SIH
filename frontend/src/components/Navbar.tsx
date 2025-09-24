import Link from "next/link"
import Button  from "./ui/button"

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">IC</span>
              </div>
            </div>
            <span className="ml-3 text-xl font-semibold text-foreground">InternConnect</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="#home" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="secondary"  className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="primary" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
