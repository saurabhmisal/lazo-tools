import {createAnalytics} from './analytics.js';
const analytics=createAnalytics({window,document});
if(analytics.snapshot().configured){
 const box=document.createElement('div');box.className='analytics-preferences';box.setAttribute('aria-label','Analytics preferences');
 function render(state){
  box.replaceChildren();
  if(state.excluded||state.privacySignal){
   const text=document.createElement('span');text.textContent=state.excluded?'Analytics off · this browser is excluded':'Analytics off · browser privacy preference';box.append(text);
   if(state.excluded&&!state.automated){const button=document.createElement('button');button.type='button';button.textContent='Remove browser exclusion';button.addEventListener('click',()=>analytics.setExcluded(false));box.append(button);}
  }else{const button=document.createElement('button');button.type='button';button.textContent=state.choice==='granted'?'Analytics: on · Turn off':'Analytics: off · Turn on';button.addEventListener('click',()=>analytics.setConsent(state.choice==='granted'?'denied':'granted'));box.append(button);}
  const link=document.createElement('a');link.href='https://accounts.lazo.tools/privacy#analytics';link.textContent='Cookie-free counts · Privacy';box.append(link);
 }
 render(analytics.snapshot());analytics.subscribe(render);(document.querySelector?.('footer')||document.body).append(box);
}
