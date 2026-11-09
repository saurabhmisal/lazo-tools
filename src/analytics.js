import { POWER_CHORDS_PAGES } from './analytics-pages.js';
export const CTA_IDS = Object.freeze(['header_launch_updates','hero_launch_updates','open_google_form','open_playbooks','open_faq','signup','download','product_website']);
export const ANALYTICS_NOTICE = 'Cookie-free page and button counts. No visitor IDs or work content.';
const CHOICE_KEY='lazo.analytics-consent.v1',EXCLUSION_KEY='lazo.analytics-excluded.v1';
const ENDPOINT='https://accounts.lazo.tools/api/metrics';
const FAMILY={'lazo.tools':'Lazo','pencil.lazo.tools':'Pencil','everyday.lazo.tools':'Everyday','powerchords.lazo.tools':'Power Chords','accounts.lazo.tools':'Lazo account'};
const canonical=(page_location,page_title)=>({page_location,page_title,page_referrer:''});
export function analyticsPageForPath(pathname){
 for(const[slug,name]of [['power-chords','Power Chords'],['everyday','Everyday'],['terms','Terms & Conditions']])if([`/${slug}`,`/${slug}/`,`/${slug}/index.html`].includes(pathname))return canonical(`https://lazo.tools/${slug}/`,`${name} | Lazo`);
 return canonical('https://lazo.tools/','Lazo | You, but amplified!');
}
export function analyticsPageForHost(host,path){
 if(host==='www.lazo.tools')host='lazo.tools';
 if(!FAMILY[host])return null;
 if(host==='lazo.tools')return analyticsPageForPath(path);
 if(host==='powerchords.lazo.tools'){
  for(const[slug,title]of Object.entries(POWER_CHORDS_PAGES))if([`/capabilities/${slug}/`,`/capabilities/${slug}/index.html`].includes(path))return canonical(`https://${host}/capabilities/${slug}/`,`${title} | Power Chords`);
  if(['/workspace.html','/verification.html','/third-party-notices.html'].includes(path))return canonical(`https://${host}${path}`,'Power Chords | Lazo');
 }
 if(host==='pencil.lazo.tools'&&['/app/','/app/index.html'].includes(path))return canonical(`https://${host}/app/`,'Pencil workspace | Lazo');
 if(host==='accounts.lazo.tools'){
  if(!['/','/signup','/login','/download','/privacy','/terms'].includes(path))return null;
  return canonical(`https://${host}${path}`,'Lazo account | Lazo');
 }
 return canonical(`https://${host}/`,`${FAMILY[host]} | Lazo`);
}
// Fixed public page identities and action names only. No Google tag, IDs,
// cookies, referrers, queries, document content or form values are transmitted.
export function createAnalytics({window:win,document:doc,now=Date.now}){
 const page=analyticsPageForHost(win?.location?.hostname,win?.location?.pathname);
 const configured=win?.location?.protocol==='https:'&&Boolean(page);
 const automated=win?.navigator?.webdriver===true;
 const privacySignal=win?.navigator?.globalPrivacyControl===true||win?.navigator?.doNotTrack==='1';
 let choice=privacySignal?'denied':'granted',excluded=automated,exclusionPersistent=false,pageSent=false;
 const listeners=new Set();
 const cookieExcluded=()=>String(doc?.cookie||'').split(';').some(v=>v.trim()==='lazo_analytics_excluded=true');
 const cookieOptout=()=>String(doc?.cookie||'').split(';').some(v=>v.trim()==='lazo_analytics_optout=true');
 if(cookieOptout())choice='denied';
 try{exclusionPersistent=win.localStorage.getItem(EXCLUSION_KEY)==='true'||cookieExcluded();excluded||=exclusionPersistent;}catch{excluded||=cookieExcluded();}
 try{const saved=JSON.parse(win.localStorage.getItem(CHOICE_KEY));if(saved?.choice==='denied')choice='denied';}catch{}
 function rememberExclusion(value){
  try{win.localStorage.setItem(EXCLUSION_KEY,String(value));exclusionPersistent=value;}catch{}
  doc.cookie=`lazo_analytics_excluded=${value}; Max-Age=15552000; Path=/; Domain=lazo.tools; SameSite=Lax; Secure`;
 }
 if(configured){
  try{if(['exclude','test'].includes(new URL(win.location.href).searchParams.get('analytics'))){excluded=true;rememberExclusion(true);}}catch{}
  for(const entry of String(doc.cookie||'').split(';')){
   const key=entry.trim().split('=')[0];
   if(key==='_ga'||key.startsWith('_ga_'))for(const domain of ['','; Domain=lazo.tools','; Domain=.lazo.tools'])doc.cookie=`${key}=; Max-Age=0; Path=/${domain}; SameSite=Lax; Secure`;
  }
 }
 const snapshot=()=>({configured,choice,excluded,exclusionPersistent,automated,privacySignal});
 function send(event){
  if(!configured||excluded||privacySignal||choice!=='granted'||typeof win.fetch!=='function')return false;
  try{Promise.resolve(win.fetch(ENDPOINT,{method:'POST',mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:JSON.stringify({page:page.page_location,event}),keepalive:true})).catch(()=>{});return true;}catch{return false;}
 }
 function notify(){for(const listener of listeners)listener(snapshot());}
 function activate(){if(!pageSent&&send('page_view'))pageSent=true;}
 function setConsent(next){
  if(!configured||excluded||privacySignal||!['granted','denied'].includes(next))return false;
  choice=next;try{win.localStorage.setItem(CHOICE_KEY,JSON.stringify({choice,at:now()}));}catch{}
  doc.cookie=`lazo_analytics_optout=${choice==='denied'}; Max-Age=15552000; Path=/; Domain=lazo.tools; SameSite=Lax; Secure`;
  activate();notify();return true;
 }
 function trackCta(id){return CTA_IDS.includes(id)&&send(id);}
 if(configured){
  doc.addEventListener('click',event=>trackCta(event.target?.closest?.('[data-analytics-cta]')?.getAttribute('data-analytics-cta')));
  win.addEventListener('focus',()=>{if(cookieExcluded()){excluded=true;exclusionPersistent=true;}if(cookieOptout())choice='denied';notify();});
  win.addEventListener('storage',event=>{
   if(event.key===null)choice='denied';
   if(event.key===EXCLUSION_KEY||event.key===null){excluded=automated||event.newValue==='true'||cookieExcluded();exclusionPersistent=excluded&&!automated;}
   if(event.key===CHOICE_KEY){try{choice=JSON.parse(event.newValue)?.choice==='granted'?'granted':'denied';}catch{choice='denied';}}
   activate();notify();
  });
  activate();
 }
 return Object.freeze({snapshot,subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},setConsent,trackCta,setExcluded(next){
  if(!configured||automated||typeof next!=='boolean')return false;
  excluded=next;rememberExclusion(next);choice='denied';
  try{win.localStorage.setItem(CHOICE_KEY,JSON.stringify({choice,at:now()}));if(!next){const url=new URL(win.location.href);url.searchParams.delete('analytics');win.history?.replaceState(null,'',`${url.pathname}${url.search}${url.hash}`);}}catch{}
  notify();return true;
 }});
}
let instance;
export function getAnalytics(){return instance||=createAnalytics({window,document});}
