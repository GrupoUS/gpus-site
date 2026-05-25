# Baseline Performance — `feat/cinematic-home` start

> Captured 2026-05-25 antes de inserir capítulos cinematográficos. Comparar contra estado pós-merge.

## Build summary
- Pages built: 9 (`/`, `/sobre`, `/contato`, `/curso-auriculo`, `/mentoria-black-neon`, `/otb`, redirects: `/comunidade-us`, `/na-mesa-certa`, `/neon-dash`, `/trintae3`, legal: `/termos`, `/politica-de-privacidade`, `/404`).
- Build time: ~2.8s (Bun + Astro 6).
- Sitemap emitted, redirects honored.

## Top JS chunks (uncompressed `dist/_astro/`)
| Bytes | File | Origin (likely) |
|---|---|---|
| 185 761 | `client.DsE3fG9-.js` | React 19 client runtime |
| 77 449 | `use-reduced-motion.BBazf_qI.js` | `motion/react` core |
| 44 803 | `proxy.gd4ET4HG.js` | `motion` proxy hooks |
| 26 677 | `utils.C8nBGPD0.js` | shared utils |
| 9 323 | `JourneyTimeline.dQWnXAsR.js` | island |
| 8 449 | `background-beams.-0aDRZtN.js` | island |
| 7 739 | `index.DrBtkhmp.js` | island entry |
| **7 058** | **`use-scroll.BTo1jZYn.js`** | **already shipped — useScroll in use** |
| 6 449 | `index.Bc2qFOf6.js` | island entry |
| 4 562 | `lamp.CHQxlfY7.js` | island |

## Implication for cinematic chapters
- `useScroll` + `useTransform` already in bundle → marginal cost ≈ 0 for new `NarrativeChapters` island reusing same chunk.
- Single consolidated island stays inside existing chunk graph; no new top-level chunk expected.
- React + motion shared modules already shipped to home; adding capítulos does NOT add the heavy 184K + 77K floor.

## Lighthouse
Skip Lighthouse formal capture pre-change (CI not configured for diff). Run `bun run lighthouse:audit` at TASK-09 against built `dist/` to compare.
