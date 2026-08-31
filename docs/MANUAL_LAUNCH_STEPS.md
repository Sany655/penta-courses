# Manual Launch Steps (External Accounts & Dashboards)

Follow these external steps prior to initiating public traffic:

---

## 1. Domain & DNS Configuration (Cloudflare)
1. In your Cloudflare Dashboard:
   - Add Apex domain: `pentacourse.com` $\to$ CNAME to Vercel (`cname.vercel-dns.com`)
   - Add API subdomain: `api.pentacourse.com` $\to$ CNAME to Railway/Render service URL
   - Set SSL/TLS mode to **Full (Strict)**.

---

## 2. Stripe Live Mode Setup
1. In Stripe Dashboard:
   - Complete business verification.
   - Switch toggle from Test to **Live Mode**.
   - Copy **Live Secret Key** (`sk_live_...`) to production environment.
   - Add Webhook Endpoint: `https://api.pentacourse.com/api/v1/commerce/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`.
   - Copy **Signing Secret** (`whsec_...`) to `STRIPE_WEBHOOK_SECRET`.

---

## 3. bKash Merchant Portal Setup
1. In bKash Merchant Portal:
   - Retrieve Live App Key & App Secret.
   - Set IPN / Webhook Callback URL: `https://api.pentacourse.com/api/v1/commerce/webhooks/bkash`.
   - Set `BKASH_BASE_URL="https://tokenized.pay.bka.sh/v1.2.0-beta"`.

---

## 4. Google Gemini API Key
1. In Google AI Studio:
   - Create a production API key.
   - Enable rate tier / billing.
   - Set `GEMINI_API_KEY` in production environment.

---

## 5. Google Search Console & Bing Webmaster
1. Submit sitemap URL: `https://pentacourse.com/sitemap.xml`
2. Verify ownership via DNS TXT record.
