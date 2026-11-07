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
