const steps = [
  {
    number: "01",
    title: "Sign Up & Create Profile",
    description:
      "Register on the platform and build your comprehensive profile showcasing your skills, interests, and academic background.",
  },
  {
    number: "02",
    title: "Browse Industry Projects",
    description:
      "Explore real-world internship opportunities posted by industry partners that match your profile and career goals.",
  },
  {
    number: "03",
    title: "Apply & Connect with Faculty Mentors",
    description:
      "Submit applications for internships and get connected with faculty mentors who will guide your journey.",
  },
  {
    number: "04",
    title: "Track Internship Progress",
    description:
      "Monitor your internship progress, receive feedback, and build valuable industry connections for your future career.",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
