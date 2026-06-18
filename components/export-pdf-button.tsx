"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface Entry {
  id: string;
  date: string;
  riders: number;
  shift: string;
  extras: number;
  notes: string | null;
}

interface ExportPdfButtonProps {
  clientName: string;
  rate: number;
  startDate: string;
  endDate: string;
  entries: Entry[];
  settings: Record<string, string>;
}

export function ExportPdfButton({
  clientName,
  rate,
  startDate,
  endDate,
  entries,
  settings,
}: ExportPdfButtonProps) {
  async function handleExport() {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    let y = 15;
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(settings.businessName || "Invoice", 15, y);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    y += 7;
    if (settings.businessAddress) { doc.text(settings.businessAddress, 15, y); y += 5; }
    if (settings.businessPhone) { doc.text(settings.businessPhone, 15, y); y += 5; }
    if (settings.businessEmail) { doc.text(settings.businessEmail, 15, y); y += 5; }

    // Client + period info on right side
    const rightX = pageWidth - 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Bill To: ${clientName}`, rightX, 15, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      `Period: ${new Date(startDate).toLocaleDateString()} – ${new Date(endDate).toLocaleDateString()}`,
      rightX,
      22,
      { align: "right" }
    );
    doc.text(`Rate: $${rate}/rider`, rightX, 28, { align: "right" });

    y = Math.max(y, 40);
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, pageWidth - 15, y);
    y += 8;

    // Entries
    const tableBody: string[][] = [];
    let grandTotal = 0;

    for (const entry of entries) {
      const riderTotal = entry.riders * rate;
      const dayTotal = riderTotal + entry.extras;
      grandTotal += dayTotal;

      tableBody.push([
        new Date(entry.date).toLocaleDateString(),
        entry.shift,
        entry.riders.toString(),
        `$${riderTotal}`,
        entry.extras > 0 ? `$${Number.isInteger(entry.extras) ? entry.extras : entry.extras.toFixed(2)}` : "—",
        entry.notes || "—",
        `$${Number.isInteger(dayTotal) ? dayTotal : dayTotal.toFixed(2)}`,
      ]);
    }

    autoTable(doc, {
      startY: y,
      head: [["Date", "Shift", "Riders", "Rider Total", "Extras", "Notes", "Day Total"]],
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [30, 30, 30], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 14, halign: "center" },
        2: { cellWidth: 15, halign: "center" },
        3: { cellWidth: 22, halign: "right" },
        4: { cellWidth: 20, halign: "right" },
        5: { cellWidth: "auto" },
        6: { cellWidth: 22, halign: "right", fontStyle: "bold" },
      },
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Total Due: $${Number.isInteger(grandTotal) ? grandTotal : grandTotal.toFixed(2)}`, pageWidth - 15, finalY, { align: "right" });

    const periodLabel = `${new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}-${new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    doc.save(`${clientName.replace(/\s+/g, "_")}_${periodLabel}.pdf`);
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <FileDown className="h-4 w-4 mr-1" />
      Export PDF
    </Button>
  );
}
