import os

os.makedirs('src/app/robots.txt', exist_ok=True)
os.makedirs('src/app/sitemap.xml', exist_ok=True)

robots_code = """export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pentacourse.com';
  
  const content = `# Robots.txt for PentaCourse Adaptive Learning Platform
User-agent: *
Allow: /
Allow: /learn
Allow: /courses
Allow: /domains
Allow: /adaptive-learning
Allow: /how-it-works
Allow: /pricing
Allow: /certifications
Allow: /certificates/
Allow: /about
Allow: /terms
Allow: /privacy
Allow: /refund
Allow: /contact

# Protect private learner sessions and internal workbench
Disallow: /dashboard
Disallow: /learner/
Disallow: /admin/
Disallow: /missions/private
Disallow: /account
Disallow: /checkout
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200'
    }
  });
}
"""

sitemap_code = """export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pentacourse.com';
  const now = new Date().toISOString();

  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: '/learn', changefreq: 'daily', priority: '0.9' },
    { url: '/courses', changefreq: 'weekly', priority: '0.8' },
    { url: '/domains', changefreq: 'weekly', priority: '0.8' },
    { url: '/adaptive-learning', changefreq: 'monthly', priority: '0.7' },
    { url: '/how-it-works', changefreq: 'monthly', priority: '0.7' },
    { url: '/pricing', changefreq: 'weekly', priority: '0.8' },
    { url: '/certifications', changefreq: 'monthly', priority: '0.7' },
    { url: '/about', changefreq: 'monthly', priority: '0.5' },
    { url: '/terms', changefreq: 'yearly', priority: '0.3' },
    { url: '/privacy', changefreq: 'yearly', priority: '0.3' },
    { url: '/refund', changefreq: 'yearly', priority: '0.3' },
    { url: '/contact', changefreq: 'yearly', priority: '0.4' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200'
    }
  });
}
"""

with open('src/app/robots.txt/route.js', 'w', encoding='utf-8') as f:
    f.write(robots_code)

with open('src/app/sitemap.xml/route.js', 'w', encoding='utf-8') as f:
    f.write(sitemap_code)

print('Created robots.txt/route.js and sitemap.xml/route.js!')
