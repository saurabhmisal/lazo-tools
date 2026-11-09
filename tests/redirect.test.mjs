import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import vm from 'node:vm';
test('retired route immediately replaces history with Pencil and forwards only safe campaign/exclusion fields',()=>{
 const html=readFileSync(new URL('../everyday/index.html',import.meta.url),'utf8');assert.match(html,/<meta http-equiv="refresh" content="0;url=https:\/\/pencil.lazo.tools\//);assert.doesNotMatch(html,/Everyday|joining Pencil|data-tool/);
 const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];let destination;
 vm.runInNewContext(script,{URL,location:{href:'https://lazo.tools/everyday/?utm_source=linkedin&utm_medium=social&utm_campaign=launch&analytics=test&email=private@example.com&grant=SECRET',replace:x=>destination=x}});
 const url=new URL(destination);assert.equal(url.origin,'https://pencil.lazo.tools');assert.equal(url.searchParams.get('utm_campaign'),'launch');assert.equal(url.searchParams.get('analytics'),'test');assert.doesNotMatch(destination,/SECRET|private|grant|email/);
});
