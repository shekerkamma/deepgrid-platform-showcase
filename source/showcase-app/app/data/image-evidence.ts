// Picks the image to show beside an answer. The links were made offline by a multimodal embedding model comparing
// each image's pixels with the passages, themes and products (scripts/build-image-links.py, thresholded on two answer keys:
// deck slides, 99% right, and film frames, 95% right); captions are what a vision model read off the image (scripts/describe-images.py). Nothing
// here matches keywords: an image appears only if it was linked to something the answer rests on, or chosen for a theme.
import catalogFile from './image-catalog.json';

export interface LinkedImage {
  id: string;
  title: string;
  type: string;
  filePath: string;
  caption: string;
  source?: { label: string; hash: string };
  size?: [number, number];
}

type Entry = {
  id: string;
  file: string;
  size: [number, number];
  kind: string;
  caption: string;
  source: { label: string; hash: string };
  links: [string, number][];
};
const catalog = (catalogFile as unknown as { images: Entry[] }).images;
const themeImage = (
  catalogFile as unknown as { themes: Record<string, string> }
).themes;
const toEvidence = (e: Entry): LinkedImage => ({
  id: e.id,
  title: e.source.label,
  type: e.kind.toUpperCase(),
  filePath: e.file,
  caption: e.caption,
  source: e.source,
  size: e.size,
});

// Curated themes take their image from knowledge/theme-images.json: for themes the embeddings picked the right image
// 34% of the time (themeTop1 in app/data/image-links.json), so a checked choice, or none, beats a guess.
export function imageForTheme(title: string): LinkedImage | undefined {
  const id = themeImage[title];
  const e = id ? catalog.find((x) => x.id === id) : undefined;
  return e ? toEvidence(e) : undefined;
}

// targets in the order the answer weighs them: the first is the primary source
export function imageFor(targets: string[]): LinkedImage | undefined {
  if (!targets.length) return undefined;
  const weight = new Map(targets.map((t, i) => [t, 1 - Math.min(i, 5) * 0.04]));
  let best: { e: Entry; score: number } | null = null;
  for (const e of catalog) {
    for (const [target, score] of e.links) {
      const w = weight.get(target);
      if (w !== undefined && (!best || score * w > best.score))
        best = { e, score: score * w };
    }
  }
  if (!best) return undefined;
  return toEvidence(best.e);
}
