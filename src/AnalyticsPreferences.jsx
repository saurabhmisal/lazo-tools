import {useEffect,useState} from 'react';
import {getAnalytics} from './analytics.js';
export function AnalyticsPreferences(){
 const[state,setState]=useState({configured:false});
 useEffect(()=>{const a=getAnalytics();setState(a.snapshot());return a.subscribe(setState);},[]);
 if(!state.configured)return null;
 return <div className="analytics-preferences" aria-label="Analytics preferences">
 {state.excluded||state.privacySignal?<span>Analytics off{state.excluded?' · this browser is excluded':' · browser privacy preference'}</span>:<button type="button" className="text-link" onClick={()=>getAnalytics().setConsent(state.choice==='granted'?'denied':'granted')}>Analytics: {state.choice==='granted'?'on · Turn off':'off · Turn on'}</button>}
 {state.excluded&&!state.automated&&<button type="button" className="text-link" onClick={()=>getAnalytics().setExcluded(false)}>Remove browser exclusion</button>}
 <a href="https://accounts.lazo.tools/privacy#analytics">Cookie-free counts · Privacy</a>
 </div>;
}
