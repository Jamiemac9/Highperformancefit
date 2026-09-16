import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, ArrowRight, Clock, Tag } from "lucide-react";
import { BLOG_POSTS as POSTS } from "../data/blog-posts";

export default function Blog() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-[#0A1628] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Blog</p>
            <h1 className="headline text-5xl md:text-7xl leading-none mb-6">TRAINING TIPS,<br /><span className="text-[#1E90FF]">INSIGHTS & ADVICE</span></h1>
            <p className="text-[#C8D8E8]/75 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
              Straight-talking fitness content from a coach who's been there. No clickbait, no shortcuts — just what actually works.
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            {POSTS.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="block group bg-[#112240] border border-[#1A3A5C] rounded-xl p-6 md:p-8 hover:border-[#1E90FF]/40 transition-colors"
              >
                <article>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs bg-[#1E90FF]/10 border border-[#1E90FF]/20 text-[#1E90FF] rounded px-2 py-1">
                        <Tag className="h-3 w-3" /> {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="headline text-2xl md:text-3xl mb-3 group-hover:text-[#1E90FF] transition-colors">{post.title}</h2>
                  <p className="text-[#C8D8E8]/70 leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-[#C8D8E8]/50">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {post.readTime}
                    </span>
                    <span className="flex items-center gap-1 text-[#1E90FF] font-semibold ml-auto">
                      Read more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-4xl md:text-5xl leading-none mb-6">WANT MORE PERSONALISED <span className="text-[#1E90FF]">GUIDANCE?</span></h2>
          <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
            Reading is great, but nothing beats a programme built specifically for your body and your goals. Book a free consultation and let's talk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> Call Jay
            </a>
            <a href="/?scrollTo=contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
              <ArrowRight className="h-4 w-4" /> Free Consultation
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
