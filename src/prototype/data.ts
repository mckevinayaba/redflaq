import marketplace from '@/assets/prototype/signal-marketplace.jpg.asset.json';
import rental from '@/assets/prototype/signal-rental.jpg.asset.json';
import payment from '@/assets/prototype/signal-payment.jpg.asset.json';
import meet from '@/assets/prototype/signal-meet.jpg.asset.json';
// Local Vite has no asset gateway; published and hosted preview URLs do.
const assetUrl = (url:string) => typeof window !== 'undefined' && ['localhost','127.0.0.1'].includes(window.location.hostname) ? new URL(url,'https://redflaq.com').href : url;
export const IMG = { marketplace:assetUrl(marketplace.url), rental:assetUrl(rental.url), payment:assetUrl(payment.url), meet:assetUrl(meet.url) };
export const SAMPLES = [
  {label:'Marketplace seller', intent:'pay', text:"Hi, the Canon 250D is still available. R4,800 because I'm relocating tomorrow. Many people are interested so pay a R1,000 deposit via PayShap today and I'll send it with my courier. WhatsApp me on my other number."},
  {label:'Buyer sent proof of payment', intent:'receive', text:"I've made the payment of R6,500, here is the proof of payment. Please check, it can take 24 hours to reflect. My driver is coming to collect now, it's urgent."},
  {label:'Rental with no viewing', intent:'rent', text:"The flat in Braamfontein is R5,200. I'm working overseas so I can't do a viewing. Pay the deposit and admin fee today and I'll courier the keys."},
  {label:'Job offer', intent:'job', text:"Congratulations, you have been shortlisted for a retail cashier job. Pay R350 training and uniform fee to confirm your spot by today."},
  {label:'Supplier bank change', intent:'business', text:"Please note our bank details have changed. Use the new account number for this month's invoice. Kindly pay urgently to avoid delays."}
];

export const INTENTS = [
  {id:'pay', icon:'shopping-bag', cls:'', b:'Pay a seller', s:'Marketplace, Gumtree, Instagram'},
  {id:'receive', icon:'receipt', cls:'a', b:'Accept a payment', s:'Proof of payment, EFT, PayShap'},
  {id:'rent', icon:'key-round', cls:'', b:'Rent a place', s:'Listings, agents, deposits'},
  {id:'hire', icon:'wrench', cls:'t', b:'Hire someone', s:'Plumber, nanny, driver'},
  {id:'meet', icon:'map-pin', cls:'t', b:'Meet someone', s:'Handover, viewing, date'},
  {id:'job', icon:'briefcase', cls:'a', b:'Accept a job', s:'Offers that ask for fees'}
];


export const SIGNALS = [
  {cat:'Marketplace', img:IMG.marketplace, alt:'Two people exchanging a camera in a parking lot at dusk', title:'A screenshot is not money.', body:'Fake proof of payment keeps catching Marketplace sellers. Check your own banking app before the item leaves your hands.', src:'RedFlaq Verified Public Records Network', url:'', intent:'receive'},
  {cat:'Rentals', img:IMG.rental, alt:'A young man in an empty apartment doorway looking at his phone', title:'No viewing, no deposit.', body:'Rental scammers copy real listings and ask for a deposit before you see the place. Insist on a viewing and check the agent.', src:'RedFlaq Verified Public Records Network', url:'', intent:'rent'},
  {cat:'Payments', img:IMG.payment, alt:'A woman in a small shop at night looking at her phone', title:'Names are not checked when you pay.', body:'South African banks do not confirm that the account name matches who you think you are paying. Verify the person first.', src:'RedFlaq Verified Public Records Network', url:'', intent:'pay'},
  {cat:'Safety', img:IMG.meet, alt:'A woman on a busy Johannesburg street checking her phone', title:'Meet where cameras are.', body:'For handovers, viewings and first meetings, choose a busy public place, tell someone and set a Meet Safe check-in.', src:'RedFlaq Verified Public Records Network', url:'', intent:'meet'}
];

