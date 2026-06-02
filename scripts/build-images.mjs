/**
 * build-images.mjs — Brand photo pipeline (Grupo US)
 *
 * Reads source editorial photography from docs/identidade-visual/fotos/,
 * emits optimized WebP crops into public/images/ (+ team/), and composites
 * 9 branded Open Graph cards (1200x630) into public/og/.
 *
 * Idempotent + re-runnable:  node scripts/build-images.mjs
 * Outputs are committed; the script does NOT run in CI (no build-time image
 * service — the project ships raw <img> + public/).
 *
 * Source files (docs/identidade-visual/**, incl. PDF/MOV) are NEVER copied
 * wholesale — only the selected, optimized outputs below.
 */

import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "docs", "identidade-visual", "fotos");
const OUT_IMAGES = join(ROOT, "public", "images");
const OUT_TEAM = join(OUT_IMAGES, "team");
const OUT_OG = join(ROOT, "public", "og");

for (const dir of [OUT_IMAGES, OUT_TEAM, OUT_OG]) {
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

/* Brand tokens (mirror src/styles/global.css @theme) */
const NAVY = "#1a1a2e";
const NAVY_LIGHT = "#2a2a40";
const GOLD = "#d4af37";
const GOLD_LIGHT = "#e8c96a";
const TEXT = "#fafaf9";
const TEXT_MUTED = "#94a3b8";

/* Resolve source files by substring (robust to UTF-8/accented filenames) */
const srcFiles = readdirSync(SRC);
function findSrc(...needles) {
	const hit = srcFiles.find((f) => needles.every((n) => f.includes(n)));
	if (!hit) throw new Error(`source not found for: ${needles.join(" + ")}`);
	return join(SRC, hit);
}

const PHOTOS = {
	sacha5243: findSrc("5243"), // navy blazer + gold jewelry (palette match)
	sacha5492: findSrc("5492"), // beige, studio light (bright lamp left)
	sacha5875: findSrc("5875"), // teal backdrop, gold necklace, laughing
	sacha6380: findSrc("6380"), // cream blazer, horizontal
	mauricio: findSrc("MESACERTA", "174357"), // Prof. Maurício, standing
};

/**
 * WebP outputs.
 * position: 'centre' for already-vertical portraits (avoids attention picking
 * the studio lamp in 5492); 'north' for square avatars (keeps the face).
 */
const WEBP = [
	// Home hero split portrait (above-fold LCP) — best palette match
	{ src: PHOTOS.sacha5243, out: join(OUT_IMAGES, "sacha-hero-portrait.webp"), w: 880, h: 1100, position: "centre", q: 82 },
	// Home AboutPreview (replaces the SVG placeholder)
	{ src: PHOTOS.sacha6380, out: join(OUT_IMAGES, "sacha-about-portrait.webp"), w: 840, h: 1120, position: sharp.strategy.attention, q: 80 },
	// Narrative ch4 — regen same filename (zero JSON edits)
	{ src: PHOTOS.sacha5492, out: join(OUT_IMAGES, "sacha-hero.webp"), w: 800, h: 1000, position: "centre", q: 80 },
	// Narrative ch3 — regen same filename
	{ src: PHOTOS.sacha5875, out: join(OUT_IMAGES, "sacha-about.webp"), w: 800, h: 1000, position: "north", q: 80 },
	// Founders round avatars (about page, order<=2)
	{ src: PHOTOS.sacha5243, out: join(OUT_TEAM, "sacha.webp"), w: 480, h: 480, position: "north", q: 82 },
	{ src: PHOTOS.mauricio, out: join(OUT_TEAM, "mauricio.webp"), w: 480, h: 480, position: "north", q: 82 },
];

async function buildWebp() {
	for (const it of WEBP) {
		const info = await sharp(it.src)
			.rotate() // honor EXIF orientation
			.resize(it.w, it.h, { fit: "cover", position: it.position })
			.webp({ quality: it.q })
			.toFile(it.out);
		const kb = (info.size / 1024).toFixed(0);
		console.log(`  webp  ${it.out.replace(ROOT, "")}  ${it.w}x${it.h}  ${kb}KB`);
	}
}

/* ── Open Graph cards (1200x630) ───────────────────────────────────────── */

function escapeXml(s) {
	return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);
}

/** naive word-wrap into <=maxChars lines, capped at maxLines */
function wrap(text, maxChars, maxLines) {
	const words = text.split(" ");
	const lines = [];
	let line = "";
	for (const w of words) {
		if ((line + " " + w).trim().length > maxChars && line) {
			lines.push(line.trim());
			line = w;
			if (lines.length === maxLines - 1) break;
		} else {
			line = (line + " " + w).trim();
		}
	}
	if (line) lines.push(line.trim());
	return lines.slice(0, maxLines);
}

const OG = [
	{ slug: "home", title: "Formação e negócios em saúde estética avançada" },
	{ slug: "sobre", title: "Sobre o Grupo US" },
	{ slug: "contato", title: "Fale com o Grupo US" },
	{ slug: "termos", title: "Termos de uso" },
	{ slug: "privacidade", title: "Política de privacidade" },
	{ slug: "404", title: "Página não encontrada" },
	{ slug: "curso-auriculo", title: "Curso de Auriculoterapia" },
	{ slug: "mentoria-black-neon", title: "Mentoria Black NEON" },
	{ slug: "otb", title: "OTB — Elite global em saúde estética" },
];

const OG_W = 1200;
const OG_H = 630;
const OG_PORTRAIT_W = 470;

/** Build the SVG overlay (text + gold rule + navy fade over portrait). */
function ogSvg(title) {
	const lines = wrap(title, 22, 3);
	const startY = 300 - (lines.length - 1) * 38;
	const tspans = lines
		.map(
			(ln, i) =>
				`<text x="80" y="${startY + i * 76}" font-family="Georgia, 'Times New Roman', serif" font-size="62" font-weight="700" fill="${TEXT}">${escapeXml(ln)}</text>`,
		)
		.join("");
	return Buffer.from(`
<svg width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0.55" stop-color="${NAVY}" stop-opacity="1"/>
      <stop offset="0.78" stop-color="${NAVY}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${NAVY}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${OG_W}" height="${OG_H}" fill="url(#fade)"/>
  <text x="80" y="120" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" letter-spacing="8" fill="${GOLD}">GRUPO US</text>
  <rect x="82" y="150" width="64" height="3" rx="1.5" fill="${GOLD}"/>
  ${tspans}
  <rect x="82" y="${startY + lines.length * 76 - 10}" width="120" height="2" fill="${GOLD_LIGHT}"/>
  <text x="80" y="560" font-family="Arial, Helvetica, sans-serif" font-size="24" letter-spacing="2" fill="${TEXT_MUTED}">grupous.com.br</text>
</svg>`);
}

async function buildOg() {
	// Portrait strip (right side), pre-rendered once
	const portrait = await sharp(PHOTOS.sacha5243)
		.rotate()
		.resize(OG_PORTRAIT_W, OG_H, { fit: "cover", position: "centre" })
		.toBuffer();

	for (const card of OG) {
		const base = sharp({
			create: { width: OG_W, height: OG_H, channels: 3, background: NAVY },
		});
		const info = await base
			.composite([
				{ input: portrait, left: OG_W - OG_PORTRAIT_W, top: 0 },
				{ input: ogSvg(card.title), left: 0, top: 0 },
			])
			.png()
			.toFile(join(OUT_OG, `${card.slug}.png`));
		const kb = (info.size / 1024).toFixed(0);
		console.log(`  og    /og/${card.slug}.png  ${OG_W}x${OG_H}  ${kb}KB`);
	}
}

console.log("Building brand images…");
await buildWebp();
console.log("Building OG cards…");
await buildOg();
console.log("Done.");
