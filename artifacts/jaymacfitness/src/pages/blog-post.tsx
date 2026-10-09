import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Phone, ArrowRight, ArrowLeft, Clock, Tag } from "lucide-react";
import NotFound from "./not-found";
import {
  getPostBySlug,
  type BlogParagraph,
  type BlogSegment,
} from "../data/blog-posts";

function Segment({ segment }: { segment: BlogSegment }) {
  if (typeof segment === "string") return <>{segment}</>;
  return (
    <Link to={segment.href} className="text-[#C9A45C] font-semibold hover:underline">
      {segment.text}
    </Link>
  );
}

function Paragraph({ paragraph }: { paragraph: BlogParagraph }) {
  if (typeof paragraph === "string") {
    return <p className="text-[#E6DFD2]/80 leading-relaxed text-lg mb-5">{paragraph}</p>;
  }
  return (
    <p className="text-[#E6DFD2]/80 leading-relaxed text-lg mb-5">
      {paragraph.map((seg, i) => (
        <Segment key={i} segment={seg} />
      ))}
    </p>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) return <NotFound />;

  return (
    <main className="min-h-screen bg-[#100E0C] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="max-w-3xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-[#E6DFD2]/60 hover:text-[#C9A45C] transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back to blog
            </Link>
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-[#C9A45C]/10 border border-[#C9A45C]/20 text-[#C9A45C] rounded px-2 py-1">
                  <Tag className="h-3 w-3" /> {tag}
                </span>
              ))}
            </div>
            <h1 className="headline text-4xl md:text-6xl leading-[1.05] mb-6">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-[#E6DFD2]/50">
              <span>{post.date}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <p className="text-[#E6DFD2] leading-relaxed text-xl md:text-2xl font-medium border-l-2 border-[#C9A45C] pl-5 mb-12">
            {post.intro}
          </p>

          {post.sections.map((section, i) => (
            <section key={i} className="mb-10">
              {section.heading && (
                <h2 className="headline text-2xl md:text-3xl mb-5 text-white">{section.heading}</h2>
              )}
              {section.paragraphs?.map((p, j) => (
                <Paragraph key={j} paragraph={p} />
              ))}
              {section.list && (
                <ul className="space-y-3 mb-5">
                  {section.list.map((item, k) => (
                    <li key={k} className="flex gap-3 text-[#E6DFD2]/80 leading-relaxed text-lg">
                      <span className="text-[#C9A45C] font-bold mt-0.5">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Related service callout */}
          <aside className="mt-14 bg-[#17140F] border border-[#C9A45C]/30 rounded-xl p-6 md:p-8">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-xs mb-3">Related service</p>
            <h3 className="headline text-2xl md:text-3xl mb-3">{post.relatedService.label}</h3>
            <p className="text-[#E6DFD2]/75 leading-relaxed mb-6">{post.relatedService.blurb}</p>
            <Link
              to={post.relatedService.href}
              className="bg-[#C9A45C] text-[#1A1610] font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-[#E3C88F] transition-all inline-flex items-center gap-2"
            >
              Learn more <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </article>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-[#0F0D0B] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-4xl md:text-5xl leading-none mb-6">READY TO <span className="text-[#C9A45C]">GET STARTED?</span></h2>
          <p className="text-[#E6DFD2]/75 text-lg leading-relaxed mb-8">
            Book a free consultation and let's build a plan around your goals, your body and your life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#C9A45C] text-[#1A1610] font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#E3C88F] transition-all inline-flex items-center gap-2">
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
