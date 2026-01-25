#!/usr/bin/env node
/*
 Automated diagnostic: opens a URL in headless Chromium, captures console errors
 and network requests related to Supabase/cards, and writes a JSON report.

 Usage:
   node scripts/diag-vercel-cards.js https://your-deployment-url

 Requires: `playwright` installed (devDependency). Run `npm ci` or `npm i -D playwright`.
*/
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

async function run() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node scripts/diag-vercel-cards.js <url>');
    process.exit(2);
  }

  const out = { url, timestamp: new Date().toISOString(), console: [], network: [] };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', (msg) => {
    out.console.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', (err) => {
    out.console.push({ type: 'pageerror', text: String(err) });
  });

  page.on('requestfinished', async (request) => {
    try {
      const url = request.url();
      if (/supabase|rest\/v1|cards/.test(url)) {
        const response = request.response();
        const status = response ? response.status() : null;
        const text = response ? await safeText(response) : null;
        out.network.push({ url, method: request.method(), status, bodySnippet: snippet(text) });
      }
    } catch (e) {
      out.network.push({ url: request.url(), error: String(e) });
    }
  });

  page.on('requestfailed', (request) => {
    const url = request.url();
    if (/supabase|rest\/v1|cards/.test(url)) {
      out.network.push({ url, method: request.method(), status: 'failed' });
    }
  });

  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});

  // wait a bit for client requests to fire
  await page.waitForTimeout(3000);

  // Save report
  const reportPath = path.resolve('scripts', 'diag-vercel-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(out, null, 2));
  console.log('Report saved to', reportPath);

  await browser.close();
}

function snippet(text) {
  if (!text) return null;
  return text.length > 1000 ? text.slice(0, 1000) + '... (truncated)' : text;
}

async function safeText(response) {
  try {
    return await response.text();
  } catch (e) {
    return null;
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
