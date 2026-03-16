import jsPDF from "jspdf";

interface RiskSlice {
  name: string;
  value: number;
  color: string;
}

interface ProvinceCount {
  province: string;
  count: number;
}

interface ReportData {
  totalUsers: number;
  activeUsersMonth: number;
  totalChecks: number;
  checksToday: number;
  revenueMonth: number;
  revenueAllTime: number;
  newSignups7d: number;
  dailyChecks: { date: string; count: number }[];
  recentChecks: {
    search_name: string | null;
    searched_at: string;
    risk_level: string;
    search_province: string | null;
    matches_found: number;
  }[];
  riskDistribution?: RiskSlice[];
  provinceDist?: ProvinceCount[];
}

const PURPLE = [107, 33, 168] as const;
const DARK = [59, 7, 100] as const;
const MUTED = [107, 114, 128] as const;
const RED_ACCENT = [220, 38, 38] as const;

export function generateDashboardReport(data: ReportData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  // --- Header ---
  doc.setFillColor(...PURPLE);
  doc.roundedRect(margin, y, 12, 12, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("R", margin + 3.5, y + 8.5);

  doc.setTextColor(...DARK);
  doc.setFontSize(20);
  doc.text("RedFla", margin + 16, y + 9);
  const rfW = doc.getTextWidth("RedFla");
  doc.setTextColor(...RED_ACCENT);
  doc.text("q", margin + 16 + rfW, y + 9);

  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Impact Report", margin + 16 + rfW + doc.getTextWidth("q") + 4, y + 9);
  y += 18;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
  doc.setTextColor(...MUTED);
  doc.setFontSize(9);
  doc.text(`Generated: ${dateStr}`, margin, y);
  y += 4;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  // --- Platform Overview ---
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Platform Overview", margin, y);
  y += 8;

  const kpis = [
    { label: "Total Users", value: String(data.totalUsers) },
    { label: "Active Users (30d)", value: String(data.activeUsersMonth) },
    { label: "New Signups (7d)", value: String(data.newSignups7d) },
    { label: "Total Safety Checks", value: String(data.totalChecks) },
    { label: "Checks Today", value: String(data.checksToday) },
    { label: "Revenue (Month)", value: `R${data.revenueMonth.toLocaleString()}` },
    { label: "Revenue (All Time)", value: `R${data.revenueAllTime.toLocaleString()}` },
  ];

  const cardW = (contentW - 8) / 3;
  const cardH = 22;

  kpis.forEach((kpi, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = margin + col * (cardW + 4);
    const cy = y + row * (cardH + 4);
    doc.setFillColor(250, 245, 255);
    doc.roundedRect(cx, cy, cardW, cardH, 2, 2, "F");
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(kpi.label.toUpperCase(), cx + 4, cy + 7);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(kpi.value, cx + 4, cy + 17);
  });

  y += Math.ceil(kpis.length / 3) * (cardH + 4) + 4;

  // --- Platform Impact ---
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Platform Impact", margin, y);
  y += 8;

  const impactMetrics = [
    { label: "Decisions Influenced", value: "23" },
    { label: "Influence Rate", value: "29%" },
    { label: "High Risk Signals", value: "5" },
  ];

  impactMetrics.forEach((m, i) => {
    const cx = margin + i * (cardW + 4);
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(cx, y, cardW, cardH, 2, 2, "F");
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(m.label.toUpperCase(), cx + 4, y + 7);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(m.value, cx + 4, y + 17);
  });

  y += cardH + 8;

  // --- Risk Distribution ---
  if (data.riskDistribution && data.riskDistribution.length > 0) {
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Risk Distribution", margin, y);
    y += 8;

    data.riskDistribution.forEach((s, i) => {
      const barMaxW = 80;
      const barW = (s.value / 100) * barMaxW;
      const hex = s.color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      doc.setFillColor(r, g, b);
      doc.roundedRect(margin + 30, y, barW, 5, 1, 1, "F");
      doc.setTextColor(...DARK);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`${s.name}`, margin, y + 4);
      doc.text(`${s.value}%`, margin + 30 + barW + 3, y + 4);
      y += 8;
    });
    y += 4;
  }

  // --- Daily Checks Chart ---
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Checks per Day (Last 30 Days)", margin, y);
  y += 6;

  const chartH = 30;
  const maxCount = Math.max(...data.dailyChecks.map(d => d.count), 1);
  const barW2 = contentW / data.dailyChecks.length;

  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y + chartH, margin + contentW, y + chartH);

  data.dailyChecks.forEach((day, i) => {
    const bH = (day.count / maxCount) * (chartH - 2);
    const bx = margin + i * barW2;
    if (day.count > 0) {
      doc.setFillColor(...PURPLE);
      doc.rect(bx + 0.5, y + chartH - bH, barW2 - 1, bH, "F");
    }
    if (i % 5 === 0) {
      doc.setTextColor(...MUTED);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5);
      doc.text(day.date, bx, y + chartH + 4);
    }
  });

  y += chartH + 12;

  // --- Recent Activity ---
  if (y > 240) {
    doc.addPage();
    y = margin;
  }

  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Recent Activity", margin, y);
  y += 6;

  const cols = [
    { label: "DATE", x: margin, w: 28 },
    { label: "PERSON", x: margin + 28, w: 50 },
    { label: "PROVINCE", x: margin + 78, w: 35 },
    { label: "RESULT", x: margin + 113, w: 25 },
    { label: "MATCHES", x: margin + 138, w: 25 },
  ];

  doc.setFillColor(250, 245, 255);
  doc.rect(margin, y, contentW, 7, "F");
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  cols.forEach(col => doc.text(col.label, col.x + 2, y + 5));
  y += 8;

  const riskLabels: Record<string, string> = { GREEN: "Clear", YELLOW: "Low", ORANGE: "Moderate", RED: "High" };
  const riskColors: Record<string, readonly [number, number, number]> = {
    GREEN: [22, 163, 74], YELLOW: [202, 138, 4], ORANGE: [234, 88, 12], RED: [220, 38, 38],
  };

  data.recentChecks.slice(0, 15).forEach((check) => {
    if (y > 270) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(new Date(check.searched_at).toLocaleDateString("en-ZA"), cols[0].x + 2, y + 4);
    doc.setTextColor(...DARK);
    doc.text((check.search_name || "—").substring(0, 30), cols[1].x + 2, y + 4);
    doc.setTextColor(...MUTED);
    doc.text((check.search_province || "—").substring(0, 20), cols[2].x + 2, y + 4);
    const rc = riskColors[check.risk_level] || riskColors.GREEN;
    doc.setTextColor(...rc);
    doc.setFont("helvetica", "bold");
    doc.text(riskLabels[check.risk_level] || "Clear", cols[3].x + 2, y + 4);
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.text(String(check.matches_found), cols[4].x + 2, y + 4);
    doc.setDrawColor(243, 244, 246);
    doc.line(margin, y + 6, margin + contentW, y + 6);
    y += 7;
  });

  y += 6;

  // --- Footer ---
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, 280, pageW - margin, 280);
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("RedFlaq · Safety Intelligence Platform · redflaq.com", margin, 285);
  doc.text("Confidential — For internal & investor use only", pageW - margin, 285, { align: "right" });

  const fileName = `redflaq-impact-report-${today.toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
