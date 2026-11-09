import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {build} from 'esbuild';
const{outputFiles}=await build({entryPoints:['src/family-analytics.js'],bundle:true,write:false,format:'iife'});
test('shared analytics is a quiet footer opt-out with no banner or Google tag',()=>{
 const requests=[],storage=new Map();function node(tag){return{tag,children:[],handlers:{},textContent:'',append(...children){this.children.push(...children);},replaceChildren(){this.children=[];},setAttribute(){},addEventListener(name,fn){this.handlers[name]=fn;}}}
 const footer=node('footer'),document={body:node('body'),cookie:'',createElement:node,querySelector:()=>footer,addEventListener(){}};
 const window={location:{hostname:'pencil.lazo.tools',protocol:'https:',pathname:'/',href:'https://pencil.lazo.tools/'},navigator:{},fetch:(url,options)=>{requests.push({url,options});return Promise.resolve({});},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},addEventListener(){}};
 vm.runInNewContext(outputFiles[0].text,{window,document,URL,Date,Set,Object,JSON,Number,Promise});
 const all=()=>{const flatten=n=>[n,...n.children.flatMap(flatten)];return flatten(footer);};const button=text=>all().find(n=>n.tag==='button'&&n.textContent===text);
 assert.equal(requests.length,1);assert(button('Analytics: on · Turn off'));assert(!all().some(n=>/Allow analytics|Decline analytics/.test(n.textContent)));assert(!requests.some(r=>/google/.test(r.url)));
 button('Analytics: on · Turn off').handlers.click();assert(button('Analytics: off · Turn on'));assert.equal(requests.length,1);assert.equal(JSON.parse(storage.get('lazo.analytics-consent.v1')).choice,'denied');
});
