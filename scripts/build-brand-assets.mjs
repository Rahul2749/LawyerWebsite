import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Use the renderer shipped with our pinned Next.js version. The original brand
// artwork stays intact: SVG defines the circular presentation and is rasterized
// for browsers/search crawlers that need PNG or a real ICO container.
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const root = new URL("../", import.meta.url);
const original = await readFile(new URL("public/nyaysaathi_logo.png", root));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 160 160">
  <title>Nyaysaathi</title>
  <defs><clipPath id="circle"><circle cx="80" cy="80" r="79"/></clipPath></defs>
  <g clip-path="url(#circle)">
    <circle cx="80" cy="80" r="79" fill="#fff"/>
    <image x="-16" y="-16" width="192" height="192" href="data:image/png;base64,${original.toString("base64")}"/>
  </g>
</svg>\n`;

async function png(size) {
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

const logo = await png(192);
await writeFile(new URL("public/brand-logo.svg", root), svg);
await writeFile(new URL("public/brand-logo.png", root), logo);
for (const path of ["src/app/icon.png", "public/icon.png"]) {
  await writeFile(new URL(path, root), logo);
}
await writeFile(new URL("src/app/apple-icon.png", root), await png(180));

// ICO directory entries must point at complete PNG payloads, not a renamed PNG.
const sizes = [32, 48, 64, 192, 256];
const images = await Promise.all(sizes.map(png));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (let index = 0; index < images.length; index++) {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index] === 256 ? 0 : sizes[index];
  directory[entry + 1] = directory[entry];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(images[index].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += images[index].length;
}
const ico = Buffer.concat([directory, ...images]);
for (const path of ["src/app/favicon.ico", "public/favicon.ico"]) {
  await writeFile(new URL(path, root), ico);
}
console.log(`Rendered circular brand assets in ${fileURLToPath(root)}`);
