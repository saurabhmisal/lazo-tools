import fs from 'node:fs/promises';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Link2} from 'lucide-react';
import {createCanvas,loadImage} from '@napi-rs/canvas';
const svg=renderToStaticMarkup(createElement(Link2,{size:24,strokeWidth:2,'aria-hidden':true})).replace(/class="[^"]*" /,'').replace('stroke="currentColor"','stroke="#172b4d"');
await fs.mkdir('public/assets',{recursive:true});
await fs.writeFile('public/assets/lazo-mark.svg',svg+'\n');
const paths=svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1];
const favicon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#f7f5ee"/><g transform="translate(8 8) scale(2)" fill="none" stroke="#172b4d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+paths+'</g></svg>';
await fs.writeFile('public/favicon.svg',favicon+'\n');
async function png(size){const canvas=createCanvas(size,size);canvas.getContext('2d').drawImage(await loadImage(Buffer.from(favicon)),0,0,size,size);return canvas.toBuffer('image/png');}
const small=await png(16),large=await png(32);
await fs.writeFile('public/favicon-32.png',large);await fs.writeFile('public/apple-touch-icon.png',await png(180));
const header=Buffer.alloc(6+32);header.writeUInt16LE(1,2);header.writeUInt16LE(2,4);let offset=header.length;
for(const[index,bytes]of[small,large].entries()){const at=6+index*16,size=index?32:16;header[at]=size;header[at+1]=size;header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(bytes.length,at+8);header.writeUInt32LE(offset,at+12);offset+=bytes.length;}
await fs.writeFile('public/favicon.ico',Buffer.concat([header,small,large]));
