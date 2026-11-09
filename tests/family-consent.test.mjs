import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {build} from 'esbuild';
const{outputFiles}=await build({entryPoints:['src/family-analytics.js'],bundle:true,write:false,format:'iife'});
test('shared analytics is a inline GA4 permission with no popup or pre-consent Google requests',()=>{
 const requests=[],storage=new Map();function node(tag){return{tag,children:[],handlers:{},textContent:'',append(...children){this.children.push(...children);},replaceChildren(){this.children=[];},setAttribute(){},addEventListener(name,fn){this.handlers[name]=fn;}}}
 const footer=node('footer'),document={head:{appendChild(){}},body:node('body'),cookie:'',createElement:node,querySelector:()=>footer,addEventListener(){}};
 const window={location:{hostname:'pencil.lazo.tools',protocol:'https:',pathname:'/',href:'https://pencil.lazo.tools/'},navigator:{},fetch:(url,options)=>{requests.push({url,options});return Promise.resolve({});},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},addEventListener(){}};
 vm.runInNewContext(outputFiles[0].text,{window,document,URL,Date,Set,Object,JSON,Number,Promise});
 const all=()=>{const flatten=n=>[n,...n.children.flatMap(flatten)];return flatten(footer);};const button=text=>all().find(n=>n.tag==='button'&&n.textContent===text);
 assert.equal(requests.length,1);assert(button('Allow analytics'));assert(button('Decline analytics'));assert.equal(window.dataLayer,undefined);
 button('Decline analytics').handlers.click();assert(button('Allow analytics'));assert.equal(window.dataLayer,undefined);assert.equal(JSON.parse(storage.get('lazo.ga-consent.v2')).choice,'denied');
 button('Allow analytics').handlers.click();assert(window.dataLayer);assert(button('Turn off analytics'));assert.equal([...window.dataLayer].filter(x=>x[0]==='event'&&x[1]==='page_view').length,1);
});
