import { type ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { icons } from 'lucide-react';

const names: Record<string, keyof typeof icons> = {
  house:'House', 'scan-search':'ScanSearch', radio:'Radio', handshake:'Handshake', shield:'Shield',
  'circle-user-round':'CircleUserRound', 'building-2':'Building2', search:'Search', 'log-out':'LogOut',
  image:'Image', mic:'Mic', lock:'Lock', 'shopping-bag':'ShoppingBag', receipt:'Receipt', 'key-round':'KeyRound',
  wrench:'Wrench', 'map-pin':'MapPin', briefcase:'Briefcase', 'arrow-right':'ArrowRight', bookmark:'Bookmark',
  'share-2':'Share2', 'message-circle-question':'MessageCircleQuestion', eye:'Eye', 'badge-check':'BadgeCheck',
  'circle-help':'CircleHelp', 'list-checks':'ListChecks', send:'Send', 'life-buoy':'LifeBuoy', check:'Check',
  'clock-plus':'Clock', timer:'Timer', plus:'Plus', 'chevron-right':'ChevronRight', 'trash-2':'Trash2',
  'file-down':'FileDown', 'circle-check':'CircleCheck', x:'X', 'arrow-left':'ArrowLeft', download:'Download',
};
export function Icon({ name }: {name:string}) { const C = icons[names[name] || 'CircleHelp']; return <C aria-hidden="true" className="lucide" />; }
export function Control({className='', ...props}:ComponentProps<typeof Button>) {
  return <Button variant="ghost" {...props} className={`pt-control ${className}`} />;
}