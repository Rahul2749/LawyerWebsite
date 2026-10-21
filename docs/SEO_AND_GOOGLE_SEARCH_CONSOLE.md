# Nyaysaathi SEO and Google Search Console setup

Prepared 20 October 2026. Production URL: **https://nyaysaathi.in**.

The changes in this checkout must be deployed before Google can see them. Search Console does not deploy code and does not let you assign keywords or buy organic rankings. No SEO implementation guarantees first position. [Google's SEO guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

Read-only production checks on 20 October 2026 found a healthy homepage response, with both `/robots.txt` and `/sitemap.xml` returning HTTP 404. These are observations of the currently deployed version, before these changes are published.

## What is implemented

- Unique titles, descriptions, canonical URLs, Open Graph and Twitter metadata on public pages.
- A production sitemap at `/sitemap.xml` containing 38 indexable pages, and `/robots.txt` advertising it. Booking query variants canonicalize to `/consultation`.
- Organization and WebSite structured data, absolute breadcrumb URLs, service structured data, and safe JSON-LD serialization. The website name includes the spelling variant “Nyaysathi” in structured data; visible copy uses the official name.
- 18 service guides at `/legal-services/[slug]`, linked from home service cards and both desktop and mobile service menus. Each has its own preparation checklist and questions, with a direct booking link.
- A `/lawyer-fees` guide using the existing service price data. The table displays services and fees, without a duration column. The booking/payment amount remains the amount to review before paying.
- A nationwide `/legal-help` guide explaining consultation preparation. Marketing copy and metadata do not name specific cities or states, as requested. Yatharth's supplied biography retains “Hon’ble Bombay High Court, Nagpur Bench”. The previous regional URL redirects to this guide.
- Homepage headings and supporting content explaining the real service and coverage.
- The consultation page heading renders in initial HTML; only the query-dependent form waits for client rendering.
- The homepage heading and introduction are visible immediately, without waiting for an entrance animation.
- The contact page explains the absence of a walk-in office. The previous office map was removed. No office address, branch, public phone number, ratings or advocate registration information was invented.
- Permanent redirect from `www.nyaysaathi.in` to `https://nyaysaathi.in`, preserving paths and queries. HTTP-to-HTTPS must also be enabled at the production proxy/CDN.
- Admin and appointment tracking responses carry `X-Robots-Tag: noindex, nofollow`. These URLs stay crawlable so Google can read that directive. Noindex is not authentication.
- Existing hidden sample articles and placeholder video pages have `noindex` and are excluded from the sitemap. Placeholder videos no longer emit misleading VideoObject markup. Sample author credentials were reduced to “Advocate”; Indian practice pages no longer refer to federal courts or jury trials.
- A generated social sharing image at `/opengraph-image`.
- A repeatable production crawl: `npm run build`, then `npm run test:seo`. It checks all sitemap URLs, metadata, headings, JSON-LD, internal links, exclusions, the redirect and image response.

## Before Search Console: deploy and verify

1. Review the changes, including service descriptions, existing prices and consultation hours. Use the existing [production deployment guide](DOCKER_UBUNTU_DEPLOYMENT_GUIDE.md) to deploy this checkout through your normal process. This work does not itself publish the changes.
2. Open `https://nyaysaathi.in/robots.txt`. It should allow `/`, disallow `/api/`, and include `Sitemap: https://nyaysaathi.in/sitemap.xml`.
3. Open `https://nyaysaathi.in/sitemap.xml`. It should be XML containing the homepage, service guides, fees guide and coverage page. Admin, tracking, articles and placeholder videos should be absent.
4. Open `/legal-services/criminal-defence`, `/legal-help` and `/lawyer-fees` on a phone and computer. Confirm the booking links select the right service.
5. Confirm the public domain uses HTTPS with a valid certificate. Test both `http://nyaysaathi.in` and `https://www.nyaysaathi.in`; each should reach the HTTPS non-www domain. Keep the TLS certificate valid for **both** hostnames so the www redirect works. Enable HTTP-to-HTTPS at Nginx/your CDN using the existing deployment setup; do not create a redirect loop behind a TLS-terminating proxy.
6. Confirm the production `NEXT_PUBLIC_BACKEND_URL` points to the deployed API, rather than localhost. Test a real booking only when you intend to make one; the SEO crawl does not submit bookings or payments.
7. Check that your host/CDN is not blocking Googlebot, requiring a login, or returning a challenge to ordinary visitors. Browser accessibility alone does not establish crawler accessibility.

## Google Search Console: step by step

### 1. Add the domain property

1. Open [Google Search Console](https://search.google.com/search-console/) and sign in with the Google account that should own the site.
2. Open the property selector at the upper left and choose **Add property**.
3. Choose **Domain** and enter `nyaysaathi.in`, without `https://` and without a path.
4. Click **Continue**. Copy the TXT record Google provides, including `google-site-verification=` and the exact token.
5. Open the DNS provider that manages this domain's nameservers. This may differ from your domain registrar or hosting company.
6. Add a **TXT** record at the domain root. Use `@` or a blank Host/Name field according to the DNS provider. Paste Google's complete value into the value/content field. Leave existing DNS records intact and use the provider's default TTL.
7. Save, return to Search Console and click **Verify**. If the record is not detected yet, allow DNS propagation and try again. Keep this TXT record after verification.

A Domain property covers HTTP/HTTPS and subdomains. If you already have verified access, use the existing property. If DNS access is unavailable, the alternative is a URL-prefix property for `https://nyaysaathi.in/` and one of Google's offered verification methods; Domain verification specifically needs DNS. [Add a property](https://support.google.com/webmasters/answer/34592?hl=en), [verify ownership](https://support.google.com/webmasters/answer/9008080?hl=en).

### 2. Submit the sitemap

1. Select your verified `nyaysaathi.in` property.
2. Choose **Sitemaps** under **Indexing** in the left menu.
3. In **Add a new sitemap**, submit `https://nyaysaathi.in/sitemap.xml`. If using a URL-prefix property with the origin already displayed, enter `sitemap.xml`.
4. Open the submitted row and check for **Success**. If Google cannot fetch it, check the exact public URL, status code, TLS, host firewall and robots rules first.
5. A successful sitemap submission confirms Google read the file; it does not mean every listed page is indexed. [Sitemaps report instructions](https://support.google.com/webmasters/answer/7451001?hl=en).

### 3. Inspect the important pages

Use the search/inspection bar at the top of Search Console, one URL at a time:

- `https://nyaysaathi.in/`
- `https://nyaysaathi.in/legal-services`
- `https://nyaysaathi.in/legal-help`
- `https://nyaysaathi.in/lawyer-fees`
- `https://nyaysaathi.in/legal-services/criminal-defence`
- `https://nyaysaathi.in/legal-services/property-real-estate`
- `https://nyaysaathi.in/legal-services/family-law`
- `https://nyaysaathi.in/consultation`
- `https://nyaysaathi.in/advocates/raja-agrawal`

For each priority page:

1. Paste the full URL and press Enter.
2. Click **Test live URL**.
3. Check that the page fetch succeeds, crawling is allowed and indexing is allowed.
4. Open **View tested page**, where available, and review the rendered screenshot and HTML. Confirm the main content appears.
5. If the test passes, click **Request indexing**. Requests are subject to quotas; you do not need to submit all 38 pages manually because the sitemap and internal links expose them.
6. After Google indexes it, compare the user-declared and Google-selected canonical. Root-domain URLs with and without a final `/` are equivalent; a different host or unrelated page warrants investigation.

The live test checks the current page; indexed information can reflect Google's previous crawl. Repeated requests do not guarantee faster indexing. [URL Inspection documentation](https://support.google.com/webmasters/answer/9012289?hl=en).

### 4. Check indexing, security and performance

1. Open **Indexing → Pages**. Inspect unexpected server errors, missing URLs, crawl blocks or exclusions affecting the 38 public sitemap pages. Google can choose not to index an otherwise eligible page; strengthen its usefulness before repeatedly resubmitting it.
2. Exclusions marked **noindex** for admin, appointment tracking, hidden sample articles and placeholder videos are intentional. Do not request indexing for them. [How noindex works](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
3. Check **Security & Manual Actions → Security issues** and **Manual actions**. If a problem is reported, follow its specific instructions.
4. Review **Experience → Core Web Vitals** and HTTPS reporting where available. New or low-traffic sites may lack sufficient field data. Use [PageSpeed Insights](https://pagespeed.web.dev/) on the homepage, a service guide and consultation page for diagnostic checks.
5. Open **Performance → Search results**, select Web search and filter **Country: India**. Track clicks, impressions, CTR and average position. Use the available comparison periods as data accumulates.
6. Review query groups: brand (`nyaysaathi`, `nyaysathi`), city terms (`Nagpur`, `Gondia`, `Bhandara`, `Tumsar`, `Wardha`, `Amravati`), service terms (`criminal lawyer`, `property lawyer`, `family lawyer`, `legal consultation`) and costs (`lawyer fees`, `consultation charges`). If the UI offers a custom query regex, `nyaysaathi|nyaysathi` is useful for the brand group.
7. Compare pages and queries over several weeks rather than judging daily changes. Search Console can omit low-volume queries, and average position is not a guaranteed position for every searcher.

## Keyword coverage and practical limits

| Search intent | Main destination |
| --- | --- |
| Nyaysaathi / Nyaysathi | Homepage, site-name structured data |
| Lawyer consultancy / online legal help / legal services India | Homepage and `/legal-services` |
| Location-qualified lawyer queries | Nationwide service information remains truthful; dedicated city/state targeting is not implemented through hidden text |
| Criminal, property, divorce, family, civil or business lawyer | Corresponding `/legal-services/[slug]` guide |
| Lawyer fees / legal consultation charges | `/lawyer-fees` |
| Lawyer near me | Coverage information and suitability/availability enquiries; results also depend on the searcher's location |
| Best lawyers in India | Useful selection guidance; no unsupported “best” ranking claims |

Do not add blocks of misspellings such as “laywer” and “laywers”, repeat cities in every heading, or create cloned pages with only the city name changed. Google's systems can understand query variants. Meta keywords do not improve Google rankings. “Vakeelsaab” has not been confirmed as your business name, so it was not added as an alternate brand or an affiliation. [SEO guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies).

Technical SEO remains in metadata, canonical URLs, crawl settings and structured data. Structured service coverage identifies India. Hidden blocks of city names, fabricated branches or keyword-stuffed metadata are not used; removing visible location-specific content limits how directly the site can target those regional queries.

## Google Maps / Business Profile: match the real business

Search Console and Google Business Profile are separate products. You confirmed that Nyaysaathi has no actual office address. An online-only consultancy is not eligible for a Business Profile merely because it serves clients nationwide. If the actual business regularly makes in-person contact with customers and meets Google's rules, an eligible service-area profile may be possible with its real base hidden from public display. Do not invent offices or create profiles in each target city. Check eligibility before applying. [Business eligibility](https://support.google.com/business/answer/13763036?hl=en), [service-area rules](https://support.google.com/business/answer/9157481?hl=en).

## Content and trust work still needed from the business

- Confirm each advocate's qualifications, enrolment details and actual practice scope before adding those credentials publicly. The current team biographies remain the supplied source of experience information.
- Verify the authenticity and permission for the existing homepage testimonials and any numerical success/experience claims. No review ratings were added to structured data.
- Replace stock imagery with authentic, permitted team and consultation images when available. Do not label stock images as actual offices or client work.
- Existing hidden articles include foreign-jurisdiction material and old sample dates. Have an advocate review, rewrite and source them for the intended Indian audience before making them indexable. Add truthful publication/review dates and author information, then add reviewed pages to the sitemap. Do not update dates without a substantive review.
- The admin blog and video editors currently save to browser `localStorage`, while public pages use `src/data/blogPosts.ts` and `src/data/videos.ts`. Publishing through those admin editors does **not** publish crawlable public content. Use the source files and a deployment for now, or implement a real publishing backend separately.
- Start with useful, reviewed answers to real client questions: preparing for a property consultation, what to bring to a family-law discussion, understanding consultation versus case fees, and arranging online legal help. Add service/location-specific facts only when verified.
- Keep the business name, email, service details and fees consistent on genuine professional profiles. Seek relevant editorial mentions and authentic recommendations; avoid purchased backlinks or fabricated reviews.

Search indexing and ranking changes are gradual and uncertain. Technical readiness is the starting point; useful reviewed content, demonstrated expertise, service quality and legitimate reputation determine sustained progress.


## Brand, favicon and advocate search update — 21 October 2026

- Live checks found that the previous `favicon.ico` response was a bare 32px PNG served with an ICO content type. It was crawlable, but the file format was inconsistent. The generic globe in a search result can also reflect Google's cached processing; the technical fix does not establish the only cause.
- Replaced it with a real multi-size ICO and a 192px PNG, with transparent corners around a circular rendering of the existing brand artwork. Original source artwork is preserved. Header/footer logos and organization-logo markup use the circular brand asset as well.
- Next.js file-based metadata owns the icon links, avoiding conflicting manual entries. Regenerate the assets with `node scripts/build-brand-assets.mjs` after an approved source-logo update.
- The homepage title begins with Nyaysaathi. Its description naturally includes Nyaysathi and legal consultancy, and refers to the firm's advocates collectively. Individual names remain on team profiles. Organization/WebSite markup identifies the brand, alternate spelling, team and actual service catalog. No bulk meta-keyword tag or hidden location block was added.
- Added crawlable advocate profiles at `/advocates/raja-agrawal`, `/advocates/yatharth-badwaik` and `/advocates/prashant-shankar-dahiwale`. These reuse the supplied biographies and portraits, retain Yatharth's court designation, link from the homepage team cards and are included in the 38-page sitemap.
- After deployment, inspect the homepage and Raja's profile in Search Console, test each live URL and request indexing once. Google may take several days to several weeks to refresh favicon/site-name information and does not guarantee display or ranking position.
- The logo in Organization structured data and the favicon beside an ordinary search result serve different purposes. Correcting both improves the information available to Google; it does not reserve first position or give control over similarly named domains.

Sources: [Google favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search), [site-name guidance](https://developers.google.com/search/docs/appearance/site-names), [organization markup](https://developers.google.com/search/docs/appearance/structured-data/organization), [meta keywords and keyword stuffing](https://developers.google.com/search/docs/fundamentals/seo-starter-guide#things-we-believe-you-shouldnt-focus-on).
