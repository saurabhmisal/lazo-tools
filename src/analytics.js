import { POWER_CHORDS_PAGES } from './analytics-pages.js';
export const CTA_IDS = Object.freeze(['header_launch_updates','hero_launch_updates','open_google_form','open_playbooks','open_faq','signup','download','product_website']);
export const ANALYTICS_NOTICE = 'Optional GA4 measures visits, clicks and campaign sources after permission.';
const CHOICE_KEY='lazo.analytics-consent.v1',EXCLUSION_KEY='lazo.analytics-excluded.v1';
const ENDPOINT='https://accounts.lazo.tools/api/metrics';
const FAMILY={'lazo.tools':'Lazo','pencil.lazo.tools':'Pencil','powerchords.lazo.tools':'Power Chords','accounts.lazo.tools':'Lazo account'};
const canonical=(page_location,page_title)=>({page_location,page_title,page_referrer:''});
export function analyticsPageForPath(pathname){
 for(const[slug,name]of [['power-chords','Power Chords'],['terms','Terms & Conditions']])if([`/${slug}`,`/${slug}/`,`/${slug}/index.html`].includes(pathname))return canonical(`https://lazo.tools/${slug}/`,`${name} | Lazo`);
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
// Aggregate counters stay separate. GA4 loads only after explicit permission.
export function createAnalytics({window:win,document:doc,now=Date.now}){
 const page=analyticsPageForHost(win?.location?.hostname,win?.location?.pathname);
 const configured=win?.location?.protocol==='https:'&&Boolean(page);
 const automated=win?.navigator?.webdriver===true;
 const privacySignal=win?.navigator?.globalPrivacyControl===true||win?.navigator?.doNotTrack==='1';
 let gaChoice='pending',gaLoaded=false;
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

 }
 const GA_ID='G-B3WTD82CQ0';
 const GA_KEY='lazo.ga-consent.v2';
 const gaCookie=()=>String(doc?.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('lazo_ga_consent='))?.split('=')[1];
 try{const saved=JSON.parse(win.localStorage.getItem(GA_KEY));if(saved&&now()-saved.at<15552000000)gaChoice=saved.choice;}catch{}
 if(['granted','denied'].includes(gaCookie())){gaChoice=gaCookie();choice=gaChoice;}
 function cleanCampaign(){const result={};try{const query=new URL(win.location.href).searchParams;for(const key of ['source','medium','campaign','id','term','content']){const value=query.get('utm_'+key);if(value&&/^[a-zA-Z0-9_. -]{1,80}$/.test(value)&&!/(email|phone|@)/i.test(value))result['campaign_'+(key==='campaign'?'name':key)]=value;}}catch{}return result;}
 function referrer(){try{const u=new URL(doc.referrer);return u.protocol==='https:'&&!u.hostname.endsWith('lazo.tools')?u.origin+'/':'';}catch{return '';}}
 const campaign=cleanCampaign();
 function gaAllowed(){return configured&&!excluded&&!privacySignal&&choice==='granted'&&gaChoice==='granted';}
 function gaEvent(name,params={}){if(!gaAllowed()||!gaLoaded)return false;win.gtag('event',name,{send_to:GA_ID,page_location:page.page_location,page_title:page.page_title,page_referrer:referrer(),product:({'pencil.lazo.tools':'pencil','powerchords.lazo.tools':'power-chords','accounts.lazo.tools':'accounts'})[win.location.hostname]||'lazo',...params});return true;}
 function activateGa(){
  if(!gaAllowed()||gaLoaded)return;
  gaLoaded=true;win['ga-disable-'+GA_ID]=false;
  win.dataLayer=win.dataLayer||[];win.gtag=function(){win.dataLayer.push(arguments);};
  win.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  win.gtag('consent','update',{analytics_storage:'granted'});
  win.gtag('js',new Date());
  win.gtag('config',GA_ID,{page_location:page.page_location,page_title:page.page_title,page_referrer:referrer(),send_page_view:false,cookie_domain:'lazo.tools',allow_google_signals:false,allow_ad_personalization_signals:false,ignore_referrer:!referrer(),...campaign});
  const script=doc.createElement('script');script.async=true;script.id='lazo-ga4';script.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;doc.head.appendChild(script);
  gaEvent('page_view');
 }
 function stopGa(){if(gaLoaded){win.gtag('consent','update',{analytics_storage:'denied'});win['ga-disable-'+GA_ID]=true;}for(const entry of String(doc.cookie||'').split(';')){const key=entry.trim().split('=')[0];if(key==='_ga'||key.startsWith('_ga_'))for(const domain of ['','; Domain=lazo.tools'])doc.cookie=key+'=; Max-Age=0; Path=/'+domain+'; SameSite=Lax; Secure';}}
 function setGaConsent(next){if(!configured||excluded||privacySignal||!['granted','denied'].includes(next))return false;gaChoice=next;try{win.localStorage.setItem(GA_KEY,JSON.stringify({choice:next,at:now()}));}catch{}doc.cookie='lazo_ga_consent='+next+'; Max-Age=15552000; Path=/; Domain=lazo.tools; SameSite=Lax; Secure';setConsent(next);if(next==='granted'){if(gaLoaded){win['ga-disable-'+GA_ID]=false;win.gtag('consent','update',{analytics_storage:'granted'});}else activateGa();}else stopGa();notify();return true;}
 const snapshot=()=>({configured,choice,gaChoice,excluded,exclusionPersistent,automated,privacySignal});
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
 function trackCta(id){if(!CTA_IDS.includes(id))return false;gaEvent('cta_click',{action_id:id});return send(id);}
 if(configured){
  doc.addEventListener('click',event=>{
   const el=event.target?.closest?.('a,button,summary,[role="button"]');if(!el||el.closest?.('.analytics-preferences'))return;
   const action=el.getAttribute?.('data-analytics-cta');if(action)trackCta(action);
   let destination='',product='';try{const u=new URL(el.href,win.location.href);if(el.href&&u.protocol==='https:'){const target=analyticsPageForHost(u.hostname,u.pathname);destination=target?.page_location||u.origin+'/';if(u.hostname==='accounts.lazo.tools'){const value=u.searchParams.get('product');if(['pencil','power-chords'].includes(value))product=value;}}}catch{}
   gaEvent('ui_click',{action_id:CTA_IDS.includes(action)?action:(el.tagName?.toLowerCase()==='summary'?'expand_section':destination?'navigate':'button'),element_type:String(el.tagName||'button').toLowerCase(),element_index:Array.from(doc.querySelectorAll?.('a,button,summary,[role="button"]')||[]).indexOf(el)+1,...(destination?{link_url:destination}:{}),...(product?{product}: {})});
  });
  win.addEventListener('focus',()=>{if(cookieExcluded()){excluded=true;exclusionPersistent=true;}if(cookieOptout())choice='denied';if(gaCookie()==='denied'){gaChoice='denied';stopGa();}else if(gaCookie()==='granted'&&!excluded&&!privacySignal){gaChoice='granted';choice='granted';if(!gaLoaded)activateGa();else{win['ga-disable-'+GA_ID]=false;win.gtag('consent','update',{analytics_storage:'granted'});}}if(excluded||choice==='denied')stopGa();notify();});
  win.addEventListener('storage',event=>{
   if(event.key===null){choice='denied';gaChoice='denied';stopGa();}
   if(event.key===GA_KEY){try{gaChoice=JSON.parse(event.newValue)?.choice||'denied';}catch{gaChoice='denied';}if(gaChoice==='denied')stopGa();else activateGa();}
   if(event.key===EXCLUSION_KEY||event.key===null){excluded=automated||event.newValue==='true'||cookieExcluded();exclusionPersistent=excluded&&!automated;}
   if(event.key===CHOICE_KEY){try{choice=JSON.parse(event.newValue)?.choice==='granted'?'granted':'denied';}catch{choice='denied';}}
   if(excluded||choice==='denied')stopGa();activate();notify();
  });
  activate();activateGa();
 }
 return Object.freeze({setGaConsent,gaEvent,snapshot,subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},setConsent,trackCta,setExcluded(next){
  if(!configured||automated||typeof next!=='boolean')return false;
  excluded=next;rememberExclusion(next);choice='denied';stopGa();
  try{win.localStorage.setItem(CHOICE_KEY,JSON.stringify({choice,at:now()}));if(!next){const url=new URL(win.location.href);url.searchParams.delete('analytics');win.history?.replaceState(null,'',`${url.pathname}${url.search}${url.hash}`);}}catch{}
  notify();return true;
 }});
}
let instance;
export function getAnalytics(){return instance||=createAnalytics({window,document});}
