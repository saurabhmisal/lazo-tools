import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { build } from 'esbuild';

const { outputFiles } = await build({ entryPoints:['src/family-analytics.js'], bundle:true, write:false, format:'iife', define:{'import.meta.env.VITE_GA_MEASUREMENT_ID':'"G-B3WTD82CQ0"'} });
function fixture() {
  const scripts=[], store=new Map();
  function node(tag) { return { tag, children:[], handlers:{}, textContent:'', append(...children){this.children.push(...children);}, appendChild(child){this.append(child);}, replaceChildren(){this.children=[];}, setAttribute(){}, addEventListener(event,fn){this.handlers[event]=fn;} }; }
  const document={ body:node('body'), head:{appendChild:value=>scripts.push(value)}, cookie:'', createElement:node, addEventListener(){} };
  const window={location:{hostname:'everyday.lazo.tools',protocol:'https:',pathname:'/',href:'https://everyday.lazo.tools/'},navigator:{},localStorage:{getItem:key=>store.get(key),setItem:(key,value)=>store.set(key,value)},addEventListener(){}};
  vm.runInNewContext(outputFiles[0].text, {window,document,URL,Date,Set,Object,JSON,Number});
  const flatten=(node)=>[node,...node.children.flatMap(flatten)];
  const button=label=>flatten(document.body).find(item=>item.tag==='button'&&item.textContent===label);
  return {document,scripts,button};
}
test('shared notice offers keyboard-native allow, decline and change controls without an early Google request',()=>{
 const f=fixture(); assert.equal(f.scripts.length,0);
 assert(f.button('Allow analytics')); assert(f.button('Decline analytics'));
 f.button('Decline analytics').handlers.click(); assert.equal(f.scripts.length,0);
 f.button('Analytics: off · Change').handlers.click();
 f.button('Allow analytics').handlers.click(); assert.equal(f.scripts.length,1);
 f.button('Analytics: on · Change').handlers.click();
 f.button('Decline analytics').handlers.click(); assert(f.button('Analytics: off · Change'));
});
