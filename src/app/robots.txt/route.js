export async function GET() {
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
