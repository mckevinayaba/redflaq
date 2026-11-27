export const RULES = [
  {id:'pop', w:3, re:/(proof of payment|\bpop\b|made the payment|payment (has been )?sent|take \d+ ?(hours|hrs) to reflect|check your (bank|email))/i,
    obs:'Claims a payment was made before money has cleared', act:'Open your own banking app and confirm the money has cleared before you hand anything over. A screenshot or email is not money.'},
  {id:'upfront', w:3, re:/(deposit|pay (first|upfront|before)|holding fee|admin fee|application fee|training (and uniform )?fee|uniform fee|registration fee)/i,
    obs:'Asks for money before you see or receive anything', act:'Do not pay a deposit or fee before you have seen the item, the property or a signed offer in person.'},
  {id:'urgent', w:2, re:/(urgent|today|asap|right now|many (people|buyers) (are )?interested|first come|last chance|relocating tomorrow|by today|kindly pay)/i,
    obs:'Creates time pressure', act:'Slow down. A genuine seller, landlord or employer will still be there tomorrow.'},
  {id:'offplatform', w:2, re:/(whatsapp me|my other number|move to whatsapp|telegram|text me on)/i,
    obs:'Moves the conversation off the platform', act:'Keep the conversation on the platform where the listing is. It keeps a record and protects you if you report.'},
  {id:'irreversible', w:2, re:/(payshap|e-?wallet|cash ?send|instant money|voucher|crypto|usdt|bitcoin)/i,
    obs:'Requests a payment method that is hard to reverse', act:'Instant and cash-send payments are usually irreversible. Only pay this way once you have the item or have verified the person.'},
  {id:'courier', w:2, re:/(courier|paxi|delivery fee|my driver|send a driver)/i,
    obs:'Avoids a face-to-face handover', act:'Prefer an in-person handover in a busy public place, or use a platform with buyer protection.'},
  {id:'remote', w:2, re:/(overseas|out of (the )?country|abroad|can'?t do a viewing|no viewing|deployed)/i,
    obs:'Says they cannot meet or show the property', act:'Insist on a viewing in person or by live video with the agent present. Check the agent with the PPRA.'},
  {id:'bankchange', w:3, re:/(bank(ing)? details (have )?changed|new account number|changed (our )?bank|update (the|our) account)/i,
    obs:'Announces changed banking details', act:'Call the supplier on a number you already have on file, not the one in this message, before paying into a new account.'},
  {id:'otp', w:4, re:/(\botp\b|one[- ]time pin|verification code)/i,
    obs:'Asks for a one-time PIN or code', act:'Never share an OTP. No bank, courier or platform will ask you for it.'},
  {id:'link', w:1, re:/(https?:\/\/|bit\.ly|tinyurl|wa\.me)/i,
    obs:'Contains a link RedFlaq has not opened', act:'Do not tap the link. Go to the official website or app directly.'},
  {id:'overpay', w:3, re:/(overpaid|sent too much|refund the difference|pay (back )?the difference)/i,
    obs:'Claims an overpayment and wants a refund', act:'This is a classic overpayment scam. Refund nothing until the full amount has cleared in your own account.'}
];

export const CATS = {
  pay:{name:'Buying from a stranger', unknown:['Whether the seller owns the item','Whether the item exists and works','Whether the account you would pay belongs to the seller'], verify:'Use the confidential RedFlaq public-record check and independently confirm their claims'},
  receive:{name:'Accepting a payment', unknown:['Whether the money has actually cleared','Whether the proof of payment is genuine','Who is collecting the item'], verify:'Use the confidential RedFlaq public-record check and independently confirm their claims'},
  rent:{name:'Renting a place', unknown:['Whether the person owns or manages the property','Whether the agent is registered','Whether the listing is copied from elsewhere'], verify:'Use the confidential RedFlaq public-record check and independently confirm their claims'},
  hire:{name:'Hiring someone', unknown:['Whether the person is who they say they are','Whether references are genuine','Whether they are qualified'], verify:'Use the confidential RedFlaq public-record check and independently confirm their claims'},
  meet:{name:'Meeting someone', unknown:['Whether the person is who they say they are','Whether the meeting place is safe'], verify:'Use the confidential RedFlaq public-record check and independently confirm their claims'},
  job:{name:'Accepting a job', unknown:['Whether the company is real','Whether the recruiter works for it','Whether the role exists'], verify:'Use the confidential RedFlaq public-record check and independently confirm their claims'},
  business:{name:'Business payment', unknown:['Whether the supplier actually changed banks','Whether the message came from the supplier'], verify:'Use the confidential RedFlaq public-record check and independently confirm their claims'},
  general:{name:'General check', unknown:['Who sent this','Whether the claims in the message are true'], verify:'Use the confidential RedFlaq public-record check and independently confirm their claims'}
};

export function guessIntent(t: string){
  if(/proof of payment|made the payment|reflect|my driver/i.test(t)) return 'receive';
  if(/flat|rent|landlord|viewing|apartment|room/i.test(t)) return 'rent';
  if(/job|shortlisted|recruit|interview|salary/i.test(t)) return 'job';
  if(/bank details|invoice|supplier/i.test(t)) return 'business';
  if(/plumber|nanny|electrician|helper|cleaner/i.test(t)) return 'hire';
  if(/meet|date|pick you up/i.test(t)) return 'meet';
  if(/available|selling|price|r\s?\d/i.test(t)) return 'pay';
  return 'general';
}

export function analyse(text: string, intent?: string){
  const hits = RULES.map(r => ({r, m:text.match(r.re)})).filter(x => x.m);
  const score = hits.reduce((a,x)=>a+x.r.w,0);
  const cat = CATS[intent] ? intent : guessIntent(text);
  let verdict;
  if(score>=8) verdict={cls:'stop', label:'Stop. Do not continue.', why:'This message matches several patterns seen in South African scams at the same time.'};
  else if(score>=3) verdict={cls:'pause', label:"Pause. Don't pay yet.", why:'Some signals here need checking before you send money or hand anything over.'};
  else verdict={cls:'go', label:'No known pattern. Still verify.', why:'RedFlaq did not find a known scam pattern. That does not mean this is safe; complete the checks below.'};
  return {text, cat, catName:CATS[cat].name, hits, score, verdict, at:new Date()};
}


export type LocalResult = ReturnType<typeof analyse>;
export function minutesRemaining(end: number, now: number) { return Math.max(0, Math.round((end-now)/1000)); }
export function extendTimer(end: number) { return end + 15 * 60000; }
