import Link from "next/link"
import Button  from "../components/ui/button"

export default function CTA() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-balance">
          Start Your Internship Journey Today!
        </h2>
        <Button variant="primary" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
          <Link href="/signup">Join Now</Link>
        </Button>
      </div>
    </section>
  )
}
