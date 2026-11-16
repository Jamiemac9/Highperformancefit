import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "../src/data/blog-posts-cms.generated.json");
const endpoint = new URL("https://ugoppjyanqvrldwatgvq.supabase.co/rest/v1/posts");
endpoint.search = new URLSearchParams({
  status: "eq.published",
  select: "slug,title,excerpt,intro,sections,faq,tags,meta_title,meta_description,related_service,read_time,published_at,updated_at",
  order: "published_at.desc",
}).toString();

const publishableKey = "sb_publishable_ldv24VMgt2cH6I4_CEhdUg_ZSwO66xU";

try {
  const response = await fetch(endpoint, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Supabase returned HTTP ${response.status}`);
  const posts = await response.json();
  if (!Array.isArray(posts)) throw new Error("Supabase returned an unexpected response");
  fs.writeFileSync(outputPath, `${JSON.stringify(posts, null, 2)}\n`);
  console.log(`[blog CMS] Fetched ${posts.length} published post(s).`);
} catch (error) {
  fs.writeFileSync(outputPath, "[]\n");
  console.warn(`[blog CMS] Could not fetch posts; continuing with hard-coded posts. ${error.message}`);
}
