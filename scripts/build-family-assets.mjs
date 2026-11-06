import { build } from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('family-assets', { recursive:true });
await build({entryPoints:['src/family-analytics.js'],bundle:true,minify:true,format:'iife',define:{'import.meta.env.VITE_GA_MEASUREMENT_ID':'"G-B3WTD82CQ0"'},outfile:'family-assets/analytics.js'});
await copyFile('src/family-theme.css','family-assets/brand-theme.css');
