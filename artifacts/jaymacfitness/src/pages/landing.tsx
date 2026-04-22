import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Dumbbell, ArrowRight, CheckCircle2, Instagram, Twitter, MapPin, Mail, Phone, Send, Star, Trophy, Zap, Target, Heart, Users, MonitorPlay, Calendar, Clock, Award, Activity } from "lucide-react";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Link } from "react-router-dom";

export default function Landing() {
  const { data: packages } = useQuery({
    queryKey: ["public-packages"],
    queryFn: () => apiGet("/api/packages"),
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      source: "landing",
    };

    try {
      await apiPost("/api/leads", data);
      toast({ title: "Message sent! Jay will be in touch soon." });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast({ title: "Error sending message", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-24 md:py-32 lg:py-40">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl xl:text-7xl/none">
                  Build strength. <br />
                  <span className="text-primary">No excuses.</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed leading-relaxed">
                  Expert personal training designed for your lifestyle. Whether in the gym, outdoors, or online, get the guidance you need to hit your goals.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Start Your Journey
                </Button>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full min-[400px]:w-auto">
                    Client Login
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Expert Coaching</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Custom Plans</div>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-[500px] items-center justify-center lg:max-w-none">
              <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl bg-muted border-8 border-background shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                  <Dumbbell className="h-32 w-32 opacity-20" />
                  <span className="sr-only">Trainer Image Placeholder</span>
                </div>
                {/* Simulated image gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-bold text-2xl">Jay Mac</p>
                  <p className="text-white/80">Head Coach & Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Training Options</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto md:text-lg">Choose the environment that works best for your goals and lifestyle.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Gym Training", desc: "Access to top-tier equipment and focused 1-on-1 coaching in a premium facility.", icon: Dumbbell },
              { title: "Outdoor Sessions", desc: "High-intensity functional training in local parks. Fresh air, hard work.", icon: MapPin },
              { title: "Online Coaching", desc: "Custom programming, form checks, and weekly check-ins from anywhere in the world.", icon: MonitorPlay },
            ].map((service, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl border bg-card hover:border-primary/50 transition-colors hover:shadow-lg">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <service.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Investment In Yourself</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto md:text-lg">Simple pricing. No hidden fees. Just results.</p>
          </div>
          
          {(!packages || packages.length === 0) ? (
            <div className="text-center text-muted-foreground">Packages coming soon.</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {packages.map((pkg: any) => (
                <div key={pkg.id} className="flex flex-col p-8 rounded-2xl border bg-card relative shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-primary">£{pkg.price}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    <li className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {pkg.sessions} Personal Training Sessions
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> Custom Nutrition Guide
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> 24/7 WhatsApp Support
                    </li>
                    {pkg.description && (
                      <li className="flex items-start gap-2 text-sm text-muted-foreground mt-4 pt-4 border-t">
                        <span className="italic">{pkg.description}</span>
                      </li>
                    )}
                  </ul>
                  <Button className="w-full group" variant="outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                    Enquire Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 md:py-32">
        <div className="container px-4 md:px-6 max-w-xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to start?</h2>
            <p className="text-muted-foreground md:text-lg">Fill out the form below and Jay will get back to you within 24 hours.</p>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-6 bg-card p-8 rounded-2xl border shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+44 7700 900000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Goals</Label>
              <Textarea 
                id="message" 
                name="message" 
                required 
                placeholder="Tell me a bit about what you want to achieve..." 
                className="min-h-[120px]"
              />
            </div>
            <Button type="submit" size="lg" className="w-full text-base h-12" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Enquiry"}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span>JayMac<span className="text-primary">Fitness</span></span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} JayMacFitness. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
