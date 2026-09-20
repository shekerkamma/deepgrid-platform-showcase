'use client';
import {useEffect,useRef,useState} from 'react';
export type Route={view:string;params:URLSearchParams};
const views=['overview','portfolio','silicon','briefing','film','slides','investment'];
function parse(hash:string):Route{const [v,q='']=hash.replace(/^#/,'').split('?');return {view:views.includes(v)?v:'overview',params:new URLSearchParams(q)};}
export function useNavigation(){
 const [route,setRoute]=useState<Route>({view:'overview',params:new URLSearchParams()});
 const current=useRef('overview'),positions=useRef<Record<string,number>>({}),saved=useRef<Record<string,string>>({});
 const apply=(hash:string)=>{const r=parse(hash),target=hash.replace(/^#/,'');const y=positions.current[target]||0;current.current=target;setRoute(r);requestAnimationFrame(()=>requestAnimationFrame(()=>{scrollTo({top:y,behavior:'instant'});}));};
 useEffect(()=>{apply(location.hash||'#overview');const sync=()=>apply(location.hash||'#overview');const remember=()=>{positions.current[current.current]=scrollY;};addEventListener('popstate',sync);addEventListener('hashchange',sync);addEventListener('scroll',remember,{passive:true});return()=>{removeEventListener('popstate',sync);removeEventListener('hashchange',sync);removeEventListener('scroll',remember);};},[]);
 const go=(hash:string,replace=false)=>{const target=hash.replace(/^#/,'');positions.current[current.current]=scrollY;const previous=parse(current.current);saved.current[previous.view]=current.current;history[replace?'replaceState':'pushState']({deepgrid:true},'', '#'+target);apply(target);};
 const navigate=(view:string)=>{const remembered=saved.current[view];const params=new URLSearchParams(remembered?.split('?')[1]||'');params.delete('product');params.delete('from');go(view+(params.size?'?'+params:''));};
 const update=(changes:Record<string,string|undefined>,replace=true)=>{const params=new URLSearchParams(route.params);for(const [k,v] of Object.entries(changes)){if(v)params.set(k,v);else params.delete(k);}const hash=route.view+(params.size?'?'+params:'');if(replace){history.replaceState(history.state,'','#'+hash);positions.current[hash]=scrollY;current.current=hash;setRoute({...route,params});}else go(hash);};
 const openSlide=(n:number)=>{const params=new URLSearchParams({slide:String(n),from:current.current});go('slides?'+params);};
 return {route,navigate,go,update,openSlide};
}
