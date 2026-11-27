import { useState } from 'react';
import { Control, Icon } from './controls';
import { CATS, type LocalResult } from './engine';
import type { EvidenceCard } from '@/hooks/useAnalyseTrust';

export function downloadEvidence(text:string) {
  const blob=new Blob([text],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download='redflaq-evidence.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export default function Evidence({result,ai,onVerify,onSafe,onRecover,onSave,onAgain,onFeedback}:{result:LocalResult;ai?:EvidenceCard|null;onVerify:()=>void;onSafe:()=>void;onRecover:()=>void;onSave:()=>void;onAgain:()=>void;onFeedback:(v:boolean)=>void}) {
  const [checked,setChecked]=useState<number[]>([]);
  const cat=CATS[result.cat];
  const cls=ai ? ai.verdict==='STOP'?'stop':ai.verdict==='PAUSE'?'pause':'go' : result.verdict.cls;
  const headline=ai?.headline || result.verdict.label;
  const observations=ai?ai.signals.map(s=>({obs:s.observation,match:s.category})):result.hits.map(h=>({obs:h.r.obs,match:h.m[0]}));
  const actions=ai?.next_steps.map(s=>s.action) || Array.from(new Set([cat.verify+'.',...result.hits.map(h=>h.r.act)]));
  if(actions.length===1)actions.push('Confirm the person through a channel you already trust before paying or meeting.');
  return <section className="page"><article className="paper" aria-labelledby="vh">
    <div className={`verdict ${cls}`}><p className="eyebrow">RedFlaq evidence card · {result.catName}</p><h2 id="vh">{headline}</h2><p>{ai?.context_note || result.verdict.why}</p><div className="ctx"><span>{observations.length} signals found</span><span>Checked {result.at.toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'})}</span><span>Not a judgement of any person</span></div></div>
    <div className="ev"><h4><Icon name="eye"/>What we noticed</h4><p className="message-quote">{result.text}</p><ul>{observations.length ? observations.map((h,i)=><li key={i}><span className="k red"/><span>{h.obs}<span className="prov">{ai?'Analysis signal':'Pattern match on'} “{h.match}”</span></span></li>):<li><span className="k grey"/><span>No known scam pattern matched in this text.</span></li>}</ul></div>
    <div className="ev"><h4><Icon name="badge-check"/>Verified facts</h4><ul><li><span className="k grey"/><span>Nothing in this message has been verified yet.<span className="prov">RedFlaq only marks a fact as verified when an approved source confirms it, with a time stamp.</span></span></li></ul></div>
    <div className="ev"><h4><Icon name="circle-help"/>Still unknown</h4><ul>{(ai?.questions_to_ask || cat.unknown).map(u=><li key={u}><span className="k grey"/><span>{u}</span></li>)}</ul></div>
    <div className="ev todo"><h4><Icon name="list-checks"/>Do this next</h4><ul>{actions.map((t,i)=><li key={i} className={checked.includes(i)?'checked':''}><input type="checkbox" checked={checked.includes(i)} onChange={e=>setChecked(prev=>e.target.checked?[...prev,i]:prev.filter(n=>n!==i))} aria-label={`Mark step ${i+1} done`}/><span>{t}</span></li>)}</ul></div>
    <div className="paper-actions"><Control className="btn wa" onClick={onVerify}><Icon name="lock"/>Run a confidential public-record check</Control><Control className="btn primary" onClick={onSafe}><Icon name="map-pin"/>Plan a safe handover</Control><Control className="btn ghost" onClick={onRecover}><Icon name="life-buoy"/>I already paid. Help me now</Control><Control className="btn ghost" onClick={onSave}><Icon name="bookmark"/>Save to my deals</Control><Control className="btn ghost" onClick={()=>downloadEvidence(`REDFLAQ EVIDENCE CARD\n${result.at.toISOString()}\n${headline}\n\nMessage\n${result.text}\n\nWhat we noticed\n${observations.map(o=>o.obs).join('\n')}\n\nVerified facts\nNone verified.\n\nStill unknown\n${cat.unknown.join('\n')}\n\nNext steps\n${actions.join('\n')}\n\nGuidance only, not a judgement of any person. Do not confront anyone based on this check.`)}><Icon name="download"/>Download evidence card</Control></div>
    <p className="disclaimer">{ai?.limitations || 'Pattern guidance, not verification or a verdict about any person.'} Always confirm payments in your own banking app. Do not confront anyone based on this result. If you are in immediate danger, call SAPS 10111 or the GBV Command Centre 0800 428 428.</p>
  </article><div className="feedback"><span>Was this useful?</span><Control onClick={()=>onFeedback(true)}>Yes</Control><Control onClick={()=>onFeedback(false)}>Not really</Control><Control onClick={onAgain}>Check something else</Control></div></section>;
}