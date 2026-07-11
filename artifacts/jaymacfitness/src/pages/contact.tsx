import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Instagram, Facebook, ArrowRight, CheckCircle2 } from "lucide-react";
import { apiPost } from "../lib/api";

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      message: `Goal: ${String(fd.get("goal") || "Not specified")}\n\n${String(fd.get("message") || "")}`,
      source: "contact-page",
    };
    try {
      await apiPost("/api/enquiries", payload);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again or call directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A1628] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Get In Touch</p>
            <h1 className="headline text-5xl md:text-7xl leading-none mb-6">CONTACT<br /><span className="text-[#1E90FF]">HIGH PERFORMANCE FIT</span></h1>
            <p className="text-[#C8D8E8]/75 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
              Ready to start? Have a question? Send a message, call or text — I'll reply within 24 hours. No pressure, no spam, just a conversation about your goals.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a href="mailto:hello@highperformancefit.co.uk" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Form */}
            <div>
              <h2 className="headline text-3xl md:text-4xl mb-6">SEND A MESSAGE</h2>
              <p className="text-[#C8D8E8]/70 mb-8">Fill in the form below and I'll get back to you within 24 hours to book your free consultation.</p>
              <form onSubmit={onSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
                {success ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#1E90FF]/10 border border-[#1E90FF]/30 mb-6">
                      <CheckCircle2 className="h-8 w-8 text-[#1E90FF]" />
                    </div>
                    <h3 className="headline text-3xl md:text-4xl mb-3">MESSAGE SENT</h3>
                    <p className="text-[#C8D8E8]/75 mb-6">Thanks for reaching out. I'll be in touch within 24 hours to book your free consultation.</p>
                    <button type="button" onClick={() => setSuccess(false)} className="text-[#1E90FF] font-bold uppercase tracking-wider text-sm hover:underline">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="c-name" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Name</label>
                      <input id="c-name" name="name" required placeholder="Your full name" className="w-full bg-[#0A1628]/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1E90FF] transition-colors min-h-[44px]" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="c-email" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Email</label>
                        <input id="c-email" name="email" type="email" required placeholder="you@example.com" className="w-full bg-[#0A1628]/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1E90FF] transition-colors min-h-[44px]" />
                      </div>
                      <div>
                        <label htmlFor="c-phone" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Phone</label>
                        <input id="c-phone" name="phone" type="tel" placeholder="+44 ..." className="w-full bg-[#0A1628]/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1E90FF] transition-colors min-h-[44px]" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="c-goal" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Primary Goal</label>
                      <div className="relative">
                        <select id="c-goal" name="goal" required defaultValue="" className="w-full bg-[#0A1628]/70 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-[#1E90FF] transition-colors appearance-none min-h-[44px]">
                          <option value="" disabled>Select your goal</option>
                          <option value="Lose Weight">Lose Weight</option>
                          <option value="Build Muscle">Build Muscle</option>
                          <option value="Improve Fitness">Improve Fitness</option>
                          <option value="Sport Specific">Sport Specific</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="c-message" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Message</label>
                      <textarea id="c-message" name="message" required rows={4} placeholder="Tell me a bit about where you are now and what you want to achieve..." className="w-full bg-[#0A1628]/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1E90FF] transition-colors resize-none" />
                    </div>
                    {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</div>}
                    <button type="submit" disabled={submitting} className="w-full bg-[#1E90FF] text-white font-bold uppercase tracking-wider py-4 rounded-full hover:bg-[#4DAAFF] hover:shadow-[0_8px_32px_rgba(30,144,255,0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
                      {submitting ? "Sending..." : "Send Message"}
                      {!submitting && <ArrowRight className="h-4 w-4" />}
                    </button>
                    <p className="text-xs text-white/40 text-center">By submitting, you agree to be contacted by High Performance Fit about your enquiry.</p>
                  </>
                )}
              </form>
            </div>

            {/* Contact info */}
            <div>
              <h2 className="headline text-3xl md:text-4xl mb-6">CONTACT INFO</h2>
              <div className="space-y-6">
                <a href="mailto:hello@highperformancefit.co.uk" className="flex items-center gap-4 text-white/80 hover:text-[#1E90FF] transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-[#1E90FF]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Email</p>
                    <p className="font-bold">hello@highperformancefit.co.uk</p>
                  </div>
                </a>
                <a href="tel:+447753226214" className="flex items-center gap-4 text-white/80 hover:text-[#1E90FF] transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-[#1E90FF]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Phone</p>
                    <p className="font-bold">07753 226 214</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#1E90FF]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Location</p>
                    <p className="font-bold">Foundry Gym, Kings Heath, Birmingham</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Instagram className="h-6 w-6 text-[#1E90FF]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Instagram</p>
                    <a href="https://instagram.com/jaymacjm" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#1E90FF] transition-colors">@jaymacjm</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Facebook className="h-6 w-6 text-[#1E90FF]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Facebook</p>
                    <a href="https://www.facebook.com/jay.pt.58" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#1E90FF] transition-colors">jay.pt.58</a>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 aspect-video bg-white/5">
                <iframe
                  title="Foundry Gym Kings Heath"
                  src="https://www.google.com/maps?q=Foundry+Gym+Kings+Heath+Birmingham&output=embed"
                  className="w-full h-full grayscale contrast-125"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
