import  {CardContent}  from "./ui/cardContent"
import { Card } from "./ui/card"

const features = [
  {
    icon: "🎓",
    title: "Student Profiles & Skill Matching",
    description:
      "Create comprehensive profiles and get matched with opportunities that align with your skills and interests.",
  },
  {
    icon: "🏭",
    title: "Industry Internship Listings",
    description: "Access real-world projects and internship opportunities posted directly by industry partners.",
  },
  {
    icon: "👨‍🏫",
    title: "Faculty Mentorship",
    description: "Connect with experienced faculty mentors who guide your learning journey and career development.",
  },
  {
    icon: "🔐",
    title: "Secure Authentication",
    description: "Advanced security measures ensure your data and interactions remain safe and private.",
  },
  {
    icon: "⚡",
    title: "Real-time Notifications",
    description: "Stay updated with instant notifications about new opportunities, messages, and important updates.",
  },
  {
    icon: "🤝",
    title: "Collaboration Tools",
    description: "Built-in tools for seamless communication and collaboration between all platform participants.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Key Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
