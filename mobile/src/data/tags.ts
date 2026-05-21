export interface Tag {
  id: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  signalId?: string;
}

export const TAGS: Tag[] = [
  { id: 'control',       label: 'Control',          color: '#C0392B', bg: 'rgba(192,57,43,0.12)',  border: 'rgba(192,57,43,0.35)',  signalId: 'anger-control' },
  { id: 'intimidation',  label: 'Intimidation',     color: '#E67E22', bg: 'rgba(230,126,34,0.12)', border: 'rgba(230,126,34,0.35)', signalId: 'cycle-not-love' },
  { id: 'volatility',    label: 'Volatility',       color: '#E67E22', bg: 'rgba(230,126,34,0.12)', border: 'rgba(230,126,34,0.35)', signalId: 'anger-control' },
  { id: 'isolation',     label: 'Isolation',        color: '#6C35DE', bg: 'rgba(108,53,222,0.12)', border: 'rgba(108,53,222,0.35)', signalId: 'public-private-gap' },
  { id: 'gaslighting',   label: 'Gaslighting',      color: '#6C35DE', bg: 'rgba(108,53,222,0.12)', border: 'rgba(108,53,222,0.35)', signalId: 'gut-gaslit' },
  { id: 'threats',       label: 'Threats',          color: '#C0392B', bg: 'rgba(192,57,43,0.12)',  border: 'rgba(192,57,43,0.35)',  signalId: 'protection-order-truth' },
  { id: 'physical',      label: 'Physical',         color: '#C0392B', bg: 'rgba(192,57,43,0.12)',  border: 'rgba(192,57,43,0.35)',  signalId: 'document-for-court' },
  { id: 'verbal',        label: 'Verbal',           color: '#E67E22', bg: 'rgba(230,126,34,0.12)', border: 'rgba(230,126,34,0.35)' },
  { id: 'financial',     label: 'Financial Abuse',  color: '#C0392B', bg: 'rgba(192,57,43,0.12)',  border: 'rgba(192,57,43,0.35)' },
  { id: 'monitoring',    label: 'Monitoring',       color: '#6C35DE', bg: 'rgba(108,53,222,0.12)', border: 'rgba(108,53,222,0.35)' },
];

export function getTag(id: string): Tag | undefined {
  return TAGS.find(t => t.id === id);
}

export function detectPatterns(entries: { tags: string[] }[]): Array<{ tag: Tag; count: number }> {
  const counts: Record<string, number> = {};
  entries.forEach(e => e.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  return Object.entries(counts)
    .filter(([, c]) => c >= 3)
    .map(([id, count]) => ({ tag: TAGS.find(t => t.id === id)!, count }))
    .filter(p => p.tag)
    .sort((a, b) => b.count - a.count);
}
