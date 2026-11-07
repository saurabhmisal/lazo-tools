import { build } from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('family-assets', { recursive:true });
await build({entryPoints:['src/family-analytics.js'],bundle:true,minify:true,format:'iife',define:{'import.meta.env.VITE_GA_MEASUREMENT_ID':'"G-B3WTD82CQ0"'},outfile:'family-assets/analytics.js'});
await copyFile('src/family-theme.css','family-assets/brand-theme.css');

await copyFile('src/brand-type.css','family-assets/brand-type.css');
await mkdir('family-assets/assets/fonts',{recursive:true});
for(const name of ['commissioner-cyrillic-ext.woff2', 'commissioner-cyrillic.woff2', 'commissioner-greek.woff2', 'commissioner-vietnamese.woff2', 'commissioner-latin-ext.woff2', 'commissioner-latin.woff2', 'Commissioner-OFL.txt']) await copyFile('src/assets/fonts/'+name,'family-assets/assets/fonts/'+name);
await copyFile('docs/DESIGN_PRINCIPLES.md','family-assets/DESIGN_PRINCIPLES.md');
