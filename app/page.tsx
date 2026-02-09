import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, Calendar, TrendingUp, Shield, ArrowRight, Heart } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Family Members",
    description: "Keep track of all family members in one organized place",
    color: "bg-[oklch(0.94_0.02_145)] text-[oklch(0.35_0.06_145)]"
  },
  {
    icon: Calendar,
    title: "Shared Calendar",
    description: "Coordinate events and appointments with your entire family",
    color: "bg-[oklch(0.94_0.06_45)] text-[oklch(0.45_0.12_45)]"
  },
  {
    icon: TrendingUp,
    title: "Investments",
    description: "Monitor and manage your family's financial portfolio",
    color: "bg-[oklch(0.95_0.04_85)] text-[oklch(0.40_0.08_85)]"
  },
  {
    icon: Shield,
    title: "Secure Vault",
    description: "Store important documents with end-to-end encryption",
    color: "bg-[oklch(0.94_0.02_250)] text-[oklch(0.35_0.06_250)]"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-medium tracking-tight">Family Manager</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="rounded-xl">
            Sign in
          </Button>
          <Button className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-gentle-pulse" />
            Trusted by 10,000+ families
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium tracking-tight mb-6 animate-fade-in-up animation-delay-100">
            Everything your{" "}
            <span className="text-primary">family</span>
            <br />
            needs, in one place
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            Manage your family members, events, and assets with an elegant, 
            secure platform designed for modern families.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link href="/dashboard">
              <Button size="lg" className="rounded-xl px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300 group">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-base">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto mt-20 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-medium mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Family Manager. Built with care for families.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
