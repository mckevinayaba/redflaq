import jsPDF from 'jspdf';

interface TimelineEntry {
  id: string;
  entry_date: string;
  entry_time: string;
  incident_description: string;
  about_person?: string | null;
  abuse_types?: string[] | null;
  weapon_involved?: boolean | null;
  weapon_description?: string | null;
  medical_attention?: boolean | null;
  medical_details?: string | null;
  police_reported?: boolean | null;
  police_case_number?: string | null;
  children_present?: boolean | null;
  location?: string | null;
  witnesses?: string | null;
  injuries_damage?: string | null;
  emotional_state?: string | null;
  statement_hash?: string | null;
  hash_generated_at?: string | null;
  addendum_notes?: string | null;
  last_edited_at?: string | null;
}

interface TimelineOptions {
  entries: TimelineEntry[];
  userName: string;
  filterPerson?: string;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function generateTimelinePDF(options: TimelineOptions): void {
  const { entries, userName, filterPerson } = options;
  if (entries.length === 0) return;

  const doc = new jsPDF('p', 'mm', 'a4');
  const pw = 210, margin = 20, cw = pw - margin * 2;
  let y = 0;

  const sorted = [...entries].sort((a, b) => `${a.entry_date}${a.entry_time}`.localeCompare(`${b.entry_date}${b.entry_time}`));
  const verified = sorted.filter(e => e.statement_hash);
  const unverified = sorted.filter(e => !e.statement_hash);
  const policeCount = sorted.filter(e => e.police_reported).length;
  const medicalCount = sorted.filter(e => e.medical_attention).length;
  const childrenCount = sorted.filter(e => e.children_present).length;
  const weaponCount = sorted.filter(e => e.weapon_involved).length;

  // Cover page
  doc.setFontSize(28);
  doc.setTextColor(124, 58, 237);
  doc.setFont('helvetica', 'bold');
  doc.text('RedFlaq', pw / 2, 60, { align: 'center' });

  doc.setFontSize(18);
  doc.text('INCIDENT TIMELINE REPORT', pw / 2, 75, { align: 'center' });

  doc.setDrawColor(124, 58, 237);
  doc.setLineWidth(1);
  doc.line(60, 80, 150, 80);

  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prepared for: ${userName}`, pw / 2, 95, { align: 'center' });
  doc.text(`Report generated: ${new Date().toLocaleString('en-ZA')}`, pw / 2, 102, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60);
  doc.text('SUMMARY', pw / 2, 120, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryLines = [
    `Period covered: ${fmtDate(sorted[0].entry_date)} to ${fmtDate(sorted[sorted.length - 1].entry_date)}`,
    `Total incidents documented: ${sorted.length}`,
    `Person involved: ${filterPerson || 'All entries'}`,
    `Verified entries: ${verified.length} | Unverified: ${unverified.length}`,
  ];
  let sy = 130;
  for (const line of summaryLines) {
    doc.text(line, pw / 2, sy, { align: 'center' });
    sy += 7;
  }

  // Legal notice on cover
  const lny = 170;
  doc.setDrawColor(124, 58, 237);
  doc.setLineWidth(1.5);
  doc.line(margin, lny, margin, lny + 35);
  doc.setFillColor(245, 243, 255);
  doc.rect(margin + 2, lny, cw - 2, 35, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text('LEGAL NOTICE', margin + 5, lny + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const legalLines = doc.splitTextToSize(
    'This timeline is compiled from RedFlaq My Safety Journal entries. Entries marked "Verified" have cryptographic hash verification under ECTA Section 15. This document is for private use and does not replace formal legal processes. Always consult Legal Aid SA (0800 110 110) or a qualified attorney. To report GBV: Call 0800 428 428 (24/7) or 10111 (SAPS).',
    cw - 12
  );
  let lly = lny + 13;
  for (const l of legalLines) { doc.text(l, margin + 5, lly); lly += 3.5; }

  // Entry pages
  sorted.forEach((entry, idx) => {
    doc.addPage();
    y = 15;

    // Entry header
    doc.setFillColor(124, 58, 237);
    doc.rect(margin, y, cw, 10, 'F');
    doc.setTextColor(255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`ENTRY #${idx + 1} — ${fmtDate(entry.entry_date)} at ${entry.entry_time?.slice(0, 5) || ''}`, margin + 4, y + 7);

    // Verification badge
    if (entry.statement_hash) {
      doc.setTextColor(16, 185, 129);
      doc.text('✓ VERIFIED', pw - margin - 4, y + 7, { align: 'right' });
    } else {
      doc.setTextColor(180);
      doc.text('Unverified', pw - margin - 4, y + 7, { align: 'right' });
    }
    y += 16;

    doc.setTextColor(40);
    doc.setFontSize(9);

    const addF = (label: string, val: string | null | undefined) => {
      if (!val) return;
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, margin, y);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(val, cw - 40);
      doc.text(lines, margin + 40, y);
      y += Math.max(5, lines.length * 4) + 2;
    };

    addF('Person', entry.about_person || 'Not specified');
    addF('Abuse Type', entry.abuse_types?.join(' • ') || undefined);

    // Description
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.text('Incident Description:', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(entry.incident_description, cw);
    for (const line of descLines) {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, margin, y);
      y += 4.5;
    }
    y += 3;

    addF('Weapon', entry.weapon_involved ? `Yes — ${entry.weapon_description || ''}` : 'No');
    addF('Medical', entry.medical_attention ? `Yes — ${entry.medical_details || ''}` : 'No');
    addF('Police', entry.police_reported ? `Yes — ${entry.police_case_number || 'Pending'}` : 'No');
    addF('Children Present', entry.children_present ? 'Yes' : 'No');
    addF('Location', entry.location);
    addF('Witnesses', entry.witnesses);
    addF('Injuries', entry.injuries_damage);
    addF('Emotional State', entry.emotional_state);

    if (entry.addendum_notes) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFillColor(245, 245, 245);
      const anLines = doc.splitTextToSize(entry.addendum_notes, cw - 10);
      doc.rect(margin, y, cw, anLines.length * 4 + 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text(`Addendum (${entry.last_edited_at ? fmtDate(entry.last_edited_at) : ''})`, margin + 3, y + 7);
      doc.setFont('helvetica', 'normal');
      let ay = y + 12;
      for (const l of anLines) { doc.text(l, margin + 3, ay); ay += 4; }
      y = ay + 4;
    }

    if (entry.statement_hash) {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(7);
      doc.setTextColor(120);
      doc.text(`Hash: ${entry.statement_hash.slice(0, 24)}...${entry.statement_hash.slice(-12)}`, margin, y);
      y += 4;
      if (entry.hash_generated_at) {
        doc.text(`Verified: ${new Date(entry.hash_generated_at).toLocaleString('en-ZA')}`, margin, y);
      }
    }
  });

  // Summary page
  doc.addPage();
  y = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(60);
  doc.text('TIMELINE SUMMARY', pw / 2, y, { align: 'center' });
  y += 15;

  doc.setFontSize(10);
  const stats = [
    ['Total Incidents Documented', sorted.length],
    ['Verified Entries', verified.length],
    ['Unverified Entries', unverified.length],
    ['Police Reports Made', policeCount],
    ['Medical Attention Sought', medicalCount],
    ['Incidents with Children', childrenCount],
    ['Incidents with Weapons', weaponCount],
  ];

  for (const [label, val] of stats) {
    doc.setFont('helvetica', 'normal');
    doc.text(String(label), margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(String(val), pw - margin, y, { align: 'right' });
    y += 7;
  }

  y += 5;
  // Abuse type counts
  const abuseCounts: Record<string, number> = {};
  sorted.forEach(e => e.abuse_types?.forEach(t => { abuseCounts[t] = (abuseCounts[t] || 0) + 1; }));
  if (Object.keys(abuseCounts).length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Types of Abuse Recorded:', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    for (const [type, count] of Object.entries(abuseCounts)) {
      doc.text(`• ${type}: ${count} incident(s)`, margin + 5, y);
      y += 6;
    }
  }

  // Footer on all pages
  const pg = doc.getNumberOfPages();
  for (let i = 2; i <= pg; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(128);
    doc.text('RedFlaq Incident Timeline', margin, 287);
    doc.text(`${userName} — Private & Confidential`, pw / 2, 287, { align: 'center' });
    doc.text(`Page ${i - 1} of ${pg - 1}`, pw - margin, 287, { align: 'right' });
    doc.text(`Generated ${new Date().toLocaleString('en-ZA')} · redflaq.com`, pw / 2, 292, { align: 'center' });
  }

  doc.save(`RedFlaq_Timeline_${new Date().toISOString().split('T')[0]}.pdf`);
}
