import { build } from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';
await import('./build-brand-assets.mjs');
await mkdir('family-assets', { recursive:true });
await build({entryPoints:['src/family-analytics.js'],bundle:true,minify:true,format:'iife',outfile:'family-assets/analytics.js'});
await copyFile('src/family-theme.css','family-assets/brand-theme.css');

await copyFile('src/brand-type.css','family-assets/brand-type.css');
await mkdir('family-assets/assets/fonts',{recursive:true});
for(const name of ['commissioner-cyrillic-ext.woff2', 'commissioner-cyrillic.woff2', 'commissioner-greek.woff2', 'commissioner-vietnamese.woff2', 'commissioner-latin-ext.woff2', 'commissioner-latin.woff2', 'Commissioner-OFL.txt']) await copyFile('src/assets/fonts/'+name,'family-assets/assets/fonts/'+name);
await copyFile('docs/DESIGN_PRINCIPLES.md','family-assets/DESIGN_PRINCIPLES.md');

for(const name of ['favicon.svg','favicon.ico','favicon-32.png','apple-touch-icon.png'])await copyFile('public/'+name,'family-assets/'+name);
await mkdir('family-assets/assets',{recursive:true});
await copyFile('public/assets/lazo-mark.svg','family-assets/assets/lazo-mark.svg');
