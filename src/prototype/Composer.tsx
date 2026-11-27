import { useRef } from 'react';
import { Control, Icon } from './controls';
import { INTENTS, SAMPLES } from './data';

export default function Composer({text,intent,onText,onRun,onImage,onVoice,recording}:{text:string;intent:string|null;onText:(v:string)=>void;onRun:(text:string,intent?:string)=>void;onImage:(file:File)=>void;onVoice:()=>void;recording:boolean}) {
  const input=useRef<HTMLInputElement>(null);
  const selected=INTENTS.find(i=>i.id===intent);
  return <>
    <form className="composer" onSubmit={e=>{e.preventDefault();onRun(text,intent || undefined);}}>
      {selected && <p className="eyebrow">Checking: {selected.b}</p>}
      <label className="sr-only" htmlFor="msg">Message to check</label>
      <textarea id="msg" value={text} onChange={e=>onText(e.target.value)} placeholder="Paste a message, a listing or describe the deal. For example: seller wants a R1,000 deposit via PayShap before I see the phone." />
      <input ref={input} type="file" hidden accept="image/png,image/jpeg,image/webp" aria-label="Upload screenshot" onChange={e=>{const file=e.target.files?.[0];if(file)onImage(file);e.target.value='';}} />
      <div className="composer-row">
        <Control type="button" className="tool" onClick={()=>input.current?.click()}><Icon name="image"/>Screenshot</Control>
        <Control type="button" className="tool" onClick={onVoice}><Icon name="mic"/>{recording?'Stop recording':'Voice note'}</Control>
        <Control type="submit" className="go"><Icon name="scan-search"/>Check it</Control>
      </div>
    </form>
    <div className="samples">{SAMPLES.map(s=><Control key={s.label} className="sample" onClick={()=>onRun(s.text,s.intent)}>Try: {s.label}</Control>)}</div>
    <p className="privacy-line"><Icon name="lock"/>No account needed. Text checks stay on this device unless you save them.</p>
  </>;
}

export function IntentGrid({onSelect}:{onSelect:(intent:string)=>void}) {
  return <div className="intents">{INTENTS.map(i=><Control key={i.id} className="intent" onClick={()=>onSelect(i.id)}><span className={`ic ${i.cls}`}><Icon name={i.icon}/></span><span><b>{i.b}</b><span>{i.s}</span></span></Control>)}</div>;
}