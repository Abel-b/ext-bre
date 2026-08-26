import puppeteer from "puppeteer-core";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import http from "http";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve("./public/proposal_screenshots");
const ARTIFACT_DIR = "C:\\Users\\Abel\\.gemini\\antigravity\\brain\\67b09491-ef59-4714-ada0-5b8c62d448ff";
const OUTPUT_PDF = path.resolve(ARTIFACT_DIR, "Extensions_Bremen_Proposal_Presentation.pdf");
const LOCAL_PDF = path.resolve("./Extensions_Bremen_Proposal_Presentation.pdf");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function waitForServer(url, timeout = 30000) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(check, 500);
        }
      }).on("error", () => {
        if (Date.now() - startTime > timeout) {
          reject(new Error("Server start timeout"));
        } else {
          setTimeout(check, 500);
        }
      });
    };
    check();
  });
}

async function captureSafe(page, url, outputPath, selector = null) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1200));
    if (selector) {
      const el = await page.$(selector);
      if (el) {
        await el.screenshot({ path: outputPath, type: "jpeg", quality: 90 });
        return;
      }
    }
    await page.screenshot({ path: outputPath, type: "jpeg", quality: 90 });
  } catch (err) {
    console.warn(`Warning capturing ${url}:`, err.message);
  }
}

async function main() {
  console.log("Starting Next.js server on port " + PORT + "...");
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    stdio: "inherit",
    shell: true,
  });

  try {
    await waitForServer(BASE_URL);
    console.log("Next.js server is ready at " + BASE_URL);

    const browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1920,1080"],
      defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
    });

    const page = await browser.newPage();

    console.log("Capturing screenshots of Extensions Bremen...");

    // 1. Homepage Hero
    await captureSafe(page, `${BASE_URL}/`, path.join(SCREENSHOT_DIR, "hero.jpg"));
    console.log("Captured Hero");

    // 2. Before/After section
    await captureSafe(page, `${BASE_URL}/`, path.join(SCREENSHOT_DIR, "before_after.jpg"), "section:nth-of-type(3)");
    console.log("Captured Before/After");

    // 3. Map Section
    await captureSafe(page, `${BASE_URL}/`, path.join(SCREENSHOT_DIR, "map.jpg"), "section:nth-of-type(7)");
    console.log("Captured Map Section");

    // 4. Configurator Page
    await captureSafe(page, `${BASE_URL}/configurator`, path.join(SCREENSHOT_DIR, "configurator.jpg"));
    console.log("Captured Configurator");

    // 5. Virtual Consultation Page
    await captureSafe(page, `${BASE_URL}/consultation`, path.join(SCREENSHOT_DIR, "consultation.jpg"));
    console.log("Captured Consultation");

    // 6. Services Page
    await captureSafe(page, `${BASE_URL}/services`, path.join(SCREENSHOT_DIR, "services.jpg"));
    console.log("Captured Services");

    // 7. Admin Security Gate
    await captureSafe(page, `${BASE_URL}/admin`, path.join(SCREENSHOT_DIR, "admin_security.jpg"));
    console.log("Captured Admin Security");

    // Read screenshots as Base64 for self-contained HTML
    const getBase64 = (filePath) => {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return `data:image/jpeg;base64,${data.toString("base64")}`;
      }
      return "";
    };

    const heroB64 = getBase64(path.join(SCREENSHOT_DIR, "hero.jpg"));
    const configB64 = getBase64(path.join(SCREENSHOT_DIR, "configurator.jpg"));
    const consultB64 = getBase64(path.join(SCREENSHOT_DIR, "consultation.jpg"));
    const mapB64 = getBase64(path.join(SCREENSHOT_DIR, "map.jpg"));
    const servicesB64 = getBase64(path.join(SCREENSHOT_DIR, "services.jpg"));
    const adminB64 = getBase64(path.join(SCREENSHOT_DIR, "admin_security.jpg"));

    // Build the presentation HTML
    const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Extensions Bremen - Digital Flagship & Growth Proposal</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Montserrat:wght@200;300;400;500;600;700&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #060606;
      color: #f9f6f0;
      font-family: 'Montserrat', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .slide {
      width: 100vw;
      height: 100vh;
      page-break-after: always;
      position: relative;
      padding: 55px 75px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      background: radial-gradient(circle at 80% 20%, rgba(223, 193, 156, 0.08) 0%, #060606 70%);
      border-bottom: 1px solid #1a1a1a;
    }

    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 1px solid rgba(223, 193, 156, 0.2);
      padding-bottom: 18px;
    }

    .brand-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 26px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      font-weight: 700;
      color: #ffffff;
    }

    .brand-logo span {
      display: block;
      font-family: 'Montserrat', sans-serif;
      font-size: 9px;
      letter-spacing: 0.45em;
      color: #dfc19c;
      font-weight: 400;
      margin-top: 2px;
    }

    .slide-tag {
      font-size: 10px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #dfc19c;
      font-weight: 600;
    }

    .slide-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 40px;
      font-weight: 400;
      line-height: 1.15;
      color: #ffffff;
      margin-top: 4px;
    }

    .slide-title em {
      font-style: italic;
      color: #dfc19c;
    }

    .slide-body {
      flex: 1;
      display: flex;
      gap: 45px;
      align-items: center;
      margin: 25px 0;
    }

    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
      color: rgba(255, 255, 255, 0.4);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 14px;
      letter-spacing: 0.1em;
    }

    /* Cover Slide */
    .cover-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      max-width: 900px;
    }

    .cover-badge {
      display: inline-block;
      padding: 6px 16px;
      border: 1px solid rgba(223, 193, 156, 0.4);
      border-radius: 50px;
      color: #dfc19c;
      font-size: 10px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin-bottom: 22px;
      width: fit-content;
    }

    .cover-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 60px;
      font-weight: 300;
      line-height: 1.1;
      color: #ffffff;
      margin-bottom: 22px;
    }

    .cover-desc {
      font-size: 14px;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 300;
      max-width: 700px;
      margin-bottom: 35px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      border-top: 1px solid rgba(223, 193, 156, 0.2);
      padding-top: 22px;
    }

    .meta-item span {
      display: block;
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 5px;
    }

    .meta-item p {
      font-size: 13px;
      color: #ffffff;
      font-weight: 500;
    }

    /* Content Cards & Screenshots */
    .screenshot-card {
      flex: 1.25;
      height: 100%;
      max-height: 480px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(223, 193, 156, 0.25);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(223, 193, 156, 0.08);
      background: #111;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .screenshot-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .text-column {
      flex: 0.85;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .feature-point {
      padding: 16px 18px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-left: 3px solid #dfc19c;
      border-radius: 12px;
    }

    .feature-point h4 {
      font-size: 12px;
      font-weight: 600;
      color: #dfc19c;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 5px;
    }

    .feature-point p {
      font-size: 11px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 300;
    }

    /* ROI Table */
    .roi-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 12px;
    }

    .roi-table th {
      text-align: left;
      padding: 14px 18px;
      background: rgba(223, 193, 156, 0.1);
      color: #dfc19c;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-bottom: 1px solid rgba(223, 193, 156, 0.3);
    }

    .roi-table td {
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.85);
      font-weight: 300;
    }

    .roi-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    /* Pricing Columns */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 25px;
      width: 100%;
    }

    .pricing-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 30px 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    .pricing-card.featured {
      background: linear-gradient(180deg, rgba(223, 193, 156, 0.08) 0%, rgba(10, 10, 10, 0.95) 100%);
      border: 1px solid #dfc19c;
      box-shadow: 0 0 40px rgba(223, 193, 156, 0.15);
    }

    .pricing-tag {
      font-size: 9px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #dfc19c;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .pricing-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 26px;
      color: #ffffff;
      margin-bottom: 12px;
    }

    .pricing-price {
      font-size: 30px;
      font-family: 'Cormorant Garamond', serif;
      color: #dfc19c;
      font-weight: 700;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .pricing-features {
      list-style: none;
      font-size: 11px;
      line-height: 2.1;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 20px;
    }

    .pricing-features li::before {
      content: "✓ ";
      color: #dfc19c;
      font-weight: bold;
    }
  </style>
</head>
<body>

  <!-- SLIDE 1: COVER -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        Extensions
        <span>Bremen</span>
      </div>
      <div class="slide-tag">Executive Presentation</div>
    </div>
    
    <div class="cover-container">
      <div class="cover-badge">Digital Flagship & Growth Strategy</div>
      <h1 class="cover-title">
        The Future of Luxury Hair Transformations in Bremen.
      </h1>
      <p class="cover-desc">
        A proposal to establish Extensions Bremen as the regional luxury authority—commanding higher appointment ticket sizes, capturing clients 24/7, and scaling social media visibility into confirmed bookings.
      </p>

      <div class="meta-grid">
        <div class="meta-item">
          <span>Client Target</span>
          <p>Extensions Bremen (Vegesack)</p>
        </div>
        <div class="meta-item">
          <span>Deliverable</span>
          <p>Next.js Flagship + Social Retainer</p>
        </div>
        <div class="meta-item">
          <span>Objective</span>
          <p>Eliminate No-Shows & Double High-Ticket Bookings</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>CONFIDENTIAL &bull; PREPARED FOR SALON LEADERSHIP</div>
      <div>SAGERSTRASSE 11 &bull; 28757 BREMEN-VEGESACK</div>
    </div>
  </div>

  <!-- SLIDE 2: THE HOMEPAGE & EDITORIAL BRANDING -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-tag">Digital Flagship Demo</div>
        <h2 class="slide-title">Cinematic Elegance & <em>High Perceived Value</em></h2>
      </div>
      <div class="brand-logo">Extensions<span>Bremen</span></div>
    </div>

    <div class="slide-body">
      <div class="screenshot-card">
        <img src="${heroB64}" alt="Homepage Hero Screenshot" />
      </div>
      <div class="text-column">
        <div class="feature-point">
          <h4>International Luxury Aesthetic</h4>
          <p>Replaces the generic "local salon" layout with editorial typography, obsidian gold styling, and cinematic motion worthy of Dior Beauty or Balmain Hair.</p>
        </div>
        <div class="feature-point">
          <h4>Adaptive Light & Dark Modes</h4>
          <p>Provides clients with an immersive evening browsing experience in luxury black, with seamless instant switching to warm ivory.</p>
        </div>
        <div class="feature-point">
          <h4>Instant Pre-Qualification</h4>
          <p>Establishes immediate high-ticket authority so clients never question €600–€900 extension transformation pricing.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>SLIDE 02 / 07</div>
      <div>HOMEPAGE & BRAND IDENTITY</div>
    </div>
  </div>

  <!-- SLIDE 3: INTERACTIVE CUSTOMIZER / CONFIGURATOR -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-tag">Autonomous Client Education</div>
        <h2 class="slide-title">Couture <em>Hair Configurator</em></h2>
      </div>
      <div class="brand-logo">Extensions<span>Bremen</span></div>
    </div>

    <div class="slide-body">
      <div class="screenshot-card">
        <img src="${configB64}" alt="Configurator Screenshot" />
      </div>
      <div class="text-column">
        <div class="feature-point">
          <h4>Zero Price Resistance</h4>
          <p>Clients configure length (40–70cm), density, shades, and application methods (Keratin, Tapes, Wefts) with real-time price transparency.</p>
        </div>
        <div class="feature-point">
          <h4>Pre-Loaded Booking Funnel</h4>
          <p>Clicking "Book this Configuration" immediately forwards customized specs into the appointment scheduler, saving 20 minutes of consultation time.</p>
        </div>
        <div class="feature-point">
          <h4>Photorealistic Studio Visuals</h4>
          <p>Eliminates artificial 3D hair renders in favor of high-fashion portrait photography that builds genuine client desire.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>SLIDE 03 / 07</div>
      <div>INTERACTIVE PRODUCT CUSTOMIZER</div>
    </div>
  </div>

  <!-- SLIDE 4: VIRTUAL CONSULTATION & LEAD CAPTURE -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-tag">24/7 Digital Assistant</div>
        <h2 class="slide-title">Virtual <em>Hair Diagnostic</em></h2>
      </div>
      <div class="brand-logo">Extensions<span>Bremen</span></div>
    </div>

    <div class="slide-body">
      <div class="screenshot-card">
        <img src="${consultB64}" alt="Consultation Screenshot" />
      </div>
      <div class="text-column">
        <div class="feature-point">
          <h4>5-Step Diagnostic Funnel</h4>
          <p>Guides prospective clients through questions regarding natural hair density, lifestyle activity, target volume, and photo matching.</p>
        </div>
        <div class="feature-point">
          <h4>Personalized Style Prescription</h4>
          <p>Generates tailored recommendations explaining exactly why a specific technique suits their hair, drastically boosting conversion rates.</p>
        </div>
        <div class="feature-point">
          <h4>Captures After-Hours Demand</h4>
          <p>Over 40% of luxury salon bookings occur between 8 PM and 7 AM. The virtual consultant works when your salon is closed.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>SLIDE 04 / 07</div>
      <div>VIRTUAL CONSULTATION & LEAD GEN</div>
    </div>
  </div>

  <!-- SLIDE 5: LOCATION, MAP & REPUTATION -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-tag">Local Authority & Trust</div>
        <h2 class="slide-title">Atelier Bremen-Vegesack <em>& 4.8★ Social Proof</em></h2>
      </div>
      <div class="brand-logo">Extensions<span>Bremen</span></div>
    </div>

    <div class="slide-body">
      <div class="screenshot-card">
        <img src="${mapB64}" alt="Location Map Screenshot" />
      </div>
      <div class="text-column">
        <div class="feature-point">
          <h4>Sagerstraße 11 Coordinates</h4>
          <p>Custom-styled Google Maps integration showing exact transit stops (Vegesack Station: 4 min walk) and parking (Haven Hööft: 3 min walk).</p>
        </div>
        <div class="feature-point">
          <h4>Integrated 4.8★ Reputation Badge</h4>
          <p>Highlights 33 verified 5-star Google Reviews directly on the map card, reassuring first-time clients of your five-star standards.</p>
        </div>
        <div class="feature-point">
          <h4>One-Touch Mobile Actions</h4>
          <p>Instant "Call Now" and "Get Directions" buttons streamlined for clients navigating on smartphones.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>SLIDE 05 / 07</div>
      <div>SAGERSTRASSE 11 LOCATION & MAPS</div>
    </div>
  </div>

  <!-- SLIDE 6: SOCIAL MEDIA SYNERGY & REVENUE MATH -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-tag">Growth Strategy</div>
        <h2 class="slide-title">Why <em>Social Media Management</em> is the Missing Engine</h2>
      </div>
      <div class="brand-logo">Extensions<span>Bremen</span></div>
    </div>

    <div class="slide-body" style="flex-direction: column; gap: 20px; align-items: stretch; justify-content: center;">
      <p style="font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.7; font-weight: 300;">
        A high-end website is your digital flagship store. But social media is the foot-traffic that fills your appointment book. By connecting your Instagram & TikTok directly to our interactive website customizer, we create a closed-loop client acquisition system:
      </p>

      <table class="roi-table">
        <thead>
          <tr>
            <th>Growth Metric</th>
            <th>Traditional Status Quo</th>
            <th>With Our Unified Funnel</th>
            <th>Monthly Revenue Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Appointment Value</strong></td>
            <td>€350 - €450 (Standard)</td>
            <td><strong>€650 - €850+ (Couture)</strong></td>
            <td>+€3,000 / month</td>
          </tr>
          <tr>
            <td><strong>No-Show Rate</strong></td>
            <td>15% Lost slots</td>
            <td><strong>0% (€50 Deposit Enforced)</strong></td>
            <td>+€1,200 saved / month</td>
          </tr>
          <tr>
            <td><strong>DM to Booking Speed</strong></td>
            <td>12-24 hr delay</td>
            <td><strong>Instant automated link</strong></td>
            <td>+40% lead conversion</td>
          </tr>
          <tr>
            <td><strong>Local Visibility</strong></td>
            <td>Word of mouth only</td>
            <td><strong>15,000+ Bremen reach/mo</strong></td>
            <td>Constant booked-out pipeline</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="slide-footer">
      <div>SLIDE 06 / 07</div>
      <div>SOCIAL MEDIA SYNERGIES & ROI</div>
    </div>
  </div>

  <!-- SLIDE 7: PACKAGES & NEXT STEPS -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-tag">Investment Options</div>
        <h2 class="slide-title">Partnership <em>Packages & Tiers</em></h2>
      </div>
      <div class="brand-logo">Extensions<span>Bremen</span></div>
    </div>

    <div class="slide-body">
      <div class="pricing-grid">
        
        <!-- Tier 1 -->
        <div class="pricing-card">
          <div>
            <div class="pricing-tag">Tier 1</div>
            <h3 class="pricing-title">The Flagship</h3>
            <div class="pricing-price">€149<span> / mo</span></div>
            <ul class="pricing-features">
              <li>Complete Next.js Flagship Website</li>
              <li>Interactive Hair Configurator</li>
              <li>Virtual Diagnostic Consultation</li>
              <li>Deposit Booking & CRM System</li>
              <li>Hosting, SSL, Security & Backups</li>
            </ul>
          </div>
          <div style="font-size: 10px; color: rgba(255,255,255,0.4); text-align: center;">One-time build setup required</div>
        </div>

        <!-- Tier 2 (Featured) -->
        <div class="pricing-card featured">
          <div>
            <div class="pricing-tag" style="color: #dfc19c;">Recommended &bull; Tier 2</div>
            <h3 class="pricing-title">Growth Accelerator</h3>
            <div class="pricing-price">€950<span> / mo</span></div>
            <ul class="pricing-features">
              <li><strong>Everything in Tier 1 (Website & CRM)</strong></li>
              <li>12 Custom High-Fashion Reels / Month</li>
              <li>Daily Instagram Stories & Curation</li>
              <li>Automated DM Lead Funnel to Website</li>
              <li>Monthly Analytics & Strategy Review</li>
            </ul>
          </div>
          <div style="font-size: 10px; color: #dfc19c; text-align: center; font-weight: 600;">Pays for itself with 2 clients/mo</div>
        </div>

        <!-- Tier 3 -->
        <div class="pricing-card">
          <div>
            <div class="pricing-tag">Tier 3</div>
            <h3 class="pricing-title">Market Dominance</h3>
            <div class="pricing-price">€1,750<span> / mo</span></div>
            <ul class="pricing-features">
              <li>Everything in Tier 2</li>
              <li>20 Custom Reels & TikTok Videos</li>
              <li>On-Site Monthly Video & Photo Shoot</li>
              <li>Meta Paid Ads Campaign Management</li>
              <li>Google Review Growth Automation</li>
            </ul>
          </div>
          <div style="font-size: 10px; color: rgba(255,255,255,0.4); text-align: center;">Full Digital Partnership</div>
        </div>

      </div>
    </div>

    <div class="slide-footer">
      <div>SLIDE 07 / 07</div>
      <div>READY FOR DEPLOYMENT & LAUNCH</div>
    </div>
  </div>

</body>
</html>
    `;

    const htmlPath = path.join(SCREENSHOT_DIR, "presentation.html");
    fs.writeFileSync(htmlPath, htmlContent, "utf-8");

    console.log("Rendering presentation to PDF with Puppeteer...");
    const pdfPage = await browser.newPage();
    await pdfPage.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1000));

    // Generate landscape PDF
    await pdfPage.pdf({
      path: OUTPUT_PDF,
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });

    // Copy to local repo for easy access
    fs.copyFileSync(OUTPUT_PDF, LOCAL_PDF);

    console.log("PDF successfully generated at: " + OUTPUT_PDF);
    console.log("Local PDF copy saved at: " + LOCAL_PDF);

    await browser.close();
  } catch (err) {
    console.error("Error generating PDF proposal:", err);
  } finally {
    console.log("Shutting down local server...");
    server.kill();
    process.exit(0);
  }
}

main();
