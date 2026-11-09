import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../src/family-theme.css',import.meta.url),'utf8');
const tokens=Object.fromEntries([...css.matchAll(/--(brand-[a-z-]+):\s*(#[a-f0-9]{6})/g)].map(m=>[m[1],m[2]]));
const luminance=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((n,c,i)=>n+c*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{let c=[luminance(a),luminance(b)].sort((a,b)=>b-a);return(c[0]+.05)/(c[1]+.05)};
test('shared palette supports normal reading and both primary-action variants',()=>{
 for(const [a,b] of [['brand-navy','brand-ivory'],['brand-green','brand-ivory'],['brand-ivory','brand-ink'],['brand-mint','brand-ink']]) assert(contrast(tokens[a],tokens[b])>=4.5,a+' on '+b);
});


test('Lazo favicons keep the same linked mark and valid platform sizes',()=>{
 const file=name=>readFileSync(new URL('../public/'+name,import.meta.url));
 const mark=file('assets/lazo-mark.svg').toString(),favicon=file('favicon.svg').toString();
 const paths=markup=>[...markup.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(paths(favicon),paths(mark));assert.equal(paths(mark).length,2);
 for(const[name,size]of [['favicon-32.png',32],['apple-touch-icon.png',180]]){
  const bytes=file(name);assert.equal(bytes.subarray(1,4).toString(),'PNG');assert.equal(bytes.readUInt32BE(16),size);assert.equal(bytes.readUInt32BE(20),size);
 }
 const ico=file('favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),2);
});
test('all Lazo HTML entries expose the shared favicon and the legal fallback is readable',()=>{
 for(const name of ['index.html','everyday/index.html','power-chords/index.html','terms/index.html']){
  const html=readFileSync(new URL('../'+name,import.meta.url),'utf8');assert.match(html,/favicon\.svg/);assert.match(html,/favicon\.ico/);assert.match(html,/apple-touch-icon\.png/);
 }
 const terms=JSON.parse(readFileSync(new URL('../src/terms-content.json',import.meta.url),'utf8'));
 const html=readFileSync(new URL('../terms/index.html',import.meta.url),'utf8');
 assert.equal(terms.version,'2026-11-09');for(const section of terms.sections)assert.ok(html.includes(section.title),section.title);
 assert.match(terms.sections.find(x=>x.title.toLowerCase().includes('liability')).text,/consumers/i);
});
