#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_PATH = resolve(__dirname, "../src/data/seed.json");
const OUTPUT_PATH = resolve(__dirname, "../src/data/tabelog-data.json");
const DELAY_SEARCH = 2500;
const DELAY_PAGE = 2000;
const BATCH_SAVE = 10;

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function searchStartpage(name, area) {
  const firstArea = area.split("/")[0].trim();
  const q = encodeURIComponent(`${name} ${firstArea} site:tabelog.com`);
  const url = `https://www.startpage.com/do/dsearch?query=${q}&language=japanese`;
  try {
    const r = await fetch(url, { headers: HEADERS });
    if (!r.ok) {
      console.log(`  Startpage HTTP ${r.status}`);
      return null;
    }
    const t = await r.text();
    const links = [...new Set(
      [...t.matchAll(/tabelog\.com\/([a-z_]+\/A\d+\/A\d+\/\d+)\//g)]
        .map(m => `https://tabelog.com/${m[1]}/`)
    )];
    return links[0] || null;
  } catch (e) {
    console.log(`  Search error: ${e.message}`);
    return null;
  }
}

async function getOgImage(pageUrl) {
  try {
    const r = await fetch(pageUrl, { headers: HEADERS, redirect: "follow" });
    if (!r.ok) return "";
    const t = await r.text();
    const og = t.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
    if (og) return og[1].replace(/&amp;/g, "&");
    return "";
  } catch (e) {
    console.log(`  Image error: ${e.message}`);
    return "";
  }
}

async function main() {
  const seed = JSON.parse(readFileSync(SEED_PATH, "utf-8"));
  let data = {};
  try { data = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8")); } catch {}

  const total = seed.length;
  const alreadyDone = Object.keys(data).filter(k => data[k].url).length;
  console.log(`Total: ${total}, Already found: ${alreadyDone}`);

  for (let i = 0; i < total; i++) {
    const [name, area] = seed[i];

    if (data[name] && data[name].url) {
      continue;
    }

    console.log(`[${i + 1}/${total}] ${name} (${area})`);

    const tabelogUrl = await searchStartpage(name, area);
    await sleep(DELAY_SEARCH);

    let imageUrl = "";
    if (tabelogUrl) {
      console.log(`  URL: ${tabelogUrl}`);
      imageUrl = await getOgImage(tabelogUrl);
      console.log(`  IMG: ${imageUrl ? "OK" : "not found"}`);
      await sleep(DELAY_PAGE);
    } else {
      console.log(`  Not found`);
    }

    data[name] = { url: tabelogUrl || "", img: imageUrl };

    if ((i + 1) % BATCH_SAVE === 0 || i === total - 1) {
      writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
      const found = Object.keys(data).filter(k => data[k].url).length;
      console.log(`  --- Saved (${found}/${total} found) ---`);
    }
  }

  console.log("\nDone!");
  const found = Object.keys(data).filter(k => data[k].url).length;
  console.log(`Found ${found}/${total} restaurants.`);
}

main().catch(console.error);
