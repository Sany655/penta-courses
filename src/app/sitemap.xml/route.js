export async function GET() {
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
