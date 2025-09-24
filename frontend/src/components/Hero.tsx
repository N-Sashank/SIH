import Link from "next/link"
import Button  from "./ui/button"

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            Bridging Students, Industries & Faculty for <span className="text-primary">Smarter Internships</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto text-pretty leading-relaxed">
            A unified platform that connects students with industry opportunities and faculty mentorship to shape
            future-ready talent.
          </p>
          <Button
            variant="primary"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
