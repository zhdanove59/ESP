import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "@/assets/logo-esp.jpeg";

export interface ProductLine {
  id: string;
  codigo: string;
  descripcion: string;
  iva: number;
  cantidad: number;
  precio: number;
}

export interface InvoiceData {
  fecha: string;
  codigoCliente: string;
  numFactura: string;
  formaPago: string;
  cliente: {
    nombre: string;
    cif: string;
    direccion: string;
    cp: string;
    ciudad: string;
    provincia: string;
    telefono: string;
  };
  lines: ProductLine[];
  descuento: number;
  reqv: number;
}

export const fmt = (n: number) => new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + " €";

export function computeTotals(data: InvoiceData) {
  const totalBruto = data.lines.reduce((s, l) => s + l.cantidad * l.precio, 0);
  const dctoAmount = totalBruto * (data.descuento / 100);
  const baseImponible = totalBruto - dctoAmount;

  const groupsMap = new Map<number, { base: number }>();
  for (const l of data.lines) {
    const importe = l.cantidad * l.precio * (1 - data.descuento / 100);
    const g = groupsMap.get(l.iva) ?? { base: 0 };
    g.base += importe;
    groupsMap.set(l.iva, g);
  }
  const groups = Array.from(groupsMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([tipo, { base }]) => {
      const iva = base * (tipo / 100);
      const reqv = base * (data.reqv / 100);
      return { tipo, base, iva, reqv, importe: base + iva + reqv };
    });

  const ivaTotal = groups.reduce((s, g) => s + g.iva, 0);
  const reqvTotal = groups.reduce((s, g) => s + g.reqv, 0);
  const totalNeto = baseImponible + ivaTotal + reqvTotal;

  return { totalBruto, dctoAmount, baseImponible, ivaTotal, reqvTotal, totalNeto, groups };
}

async function loadLogo(): Promise<string> {
  const res = await fetch(logoUrl);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onloadend = () => resolve(r.result as string);
    r.readAsDataURL(blob);
  });
}

export async function generateInvoicePdf(data: InvoiceData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const totals = computeTotals(data);
  const pageW = doc.internal.pageSize.getWidth();

  try {
    const logo = await loadLogo();
    doc.addImage(logo, "JPEG", 14, 10, 22, 22);
  } catch {}

  // Header company (left, compact)
  doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(26, 58, 122);
  doc.text("EUROPE SPAIN PIONEERS EXP & IMP", 40, 15);
  doc.setFontSize(8).setFont("helvetica", "normal").setTextColor(60);
  doc.text("CIF: B44815439", 40, 20);
  doc.text("Calle Montesclaros 12, 45600 Talavera de la Reina", 40, 24);
  doc.text("Tel: +34 692 723 388", 40, 28);
  doc.text("EUROPESPAINPIONEERS@GMAIL.com", 40, 32);

  // Combined CLIENTE + FACTURA box (height computed after content)
  const y = 42;
  const splitX = pageW / 2 + 5;


  // Cliente (left half) - wrap long fields to stay inside the box
  doc.setFontSize(10).setFont("helvetica", "bold").setTextColor(26, 58, 122);
  doc.text("CLIENTE", 18, y + 6);
  doc.setFontSize(9).setFont("helvetica", "normal").setTextColor(40);
  const c = data.cliente;
  const maxW = splitX - 18 - 4; // available width inside left half
  const wrap = (t: string) => doc.splitTextToSize(t, maxW) as string[];
  const lineH = 4;
  let cy = y + 12;
  const drawWrapped = (t: string) => {
    const lines = wrap(t);
    doc.text(lines, 18, cy);
    cy += lineH * lines.length + 1;
  };
  drawWrapped(c.nombre || "");
  drawWrapped(`C.I.F.: ${c.cif}`);
  drawWrapped(`Dirección: ${c.direccion}`);
  drawWrapped(`${c.cp} ${c.ciudad}`);
  drawWrapped(`Provincia: ${c.provincia}`);
  drawWrapped(`Tel: ${c.telefono}`);

  // Compute final box height based on tallest column
  const rightBottom = y + 32 + 4;
  const boxH = Math.max(42, cy - y, rightBottom - y) + 2;
  doc.setDrawColor(200).setFillColor(245, 247, 250);
  doc.roundedRect(14, y, pageW - 28, boxH, 2, 2, "S");
  doc.setDrawColor(220).line(splitX, y + 2, splitX, y + boxH - 2);

  // Factura (right half)
  doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(26, 58, 122);
  doc.text("FACTURA", splitX + 4, y + 7);
  doc.setFontSize(9).setFont("helvetica", "normal").setTextColor(40);
  doc.text(`Nº: ${data.numFactura || "-"}`, splitX + 4, y + 14);
  doc.text(`Fecha: ${data.fecha}`, splitX + 4, y + 20);
  doc.text(`Forma pago: ${data.formaPago}`, splitX + 4, y + 26);
  doc.text(`Código cliente: ${data.codigoCliente || "-"}`, splitX + 4, y + 32);

  // Products
  autoTable(doc, {
    startY: y + boxH + 6,

    head: [["CÓDIGO", "DESCRIPCIÓN", "IVA %", "CANT.", "PRECIO", "IMPORTE"]],
    body: data.lines.map((l) => [
      l.codigo,
      l.descripcion,
      `${l.iva}%`,
      String(l.cantidad),
      fmt(l.precio),
      fmt(l.cantidad * l.precio),
    ]),
    headStyles: { fillColor: [26, 58, 122], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" }, 5: { halign: "right" } },
    margin: { left: 14, right: 14 },
  });

  let endY = (doc as any).lastAutoTable.finalY + 8;

  // IVA breakdown
  autoTable(doc, {
    startY: endY,
    head: [["TIPO %", "BASE IMP.", "IVA", "R.EQV", "IMPORTE"]],
    body: totals.groups.map((g) => [
      `${g.tipo}%`,
      fmt(g.base),
      fmt(g.iva),
      fmt(g.reqv),
      fmt(g.importe),
    ]),
    headStyles: { fillColor: [60, 90, 150], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8, halign: "right" },
    margin: { left: pageW - 124, right: 14 },
    tableWidth: 110,
  });

  endY = (doc as any).lastAutoTable.finalY + 4;

  autoTable(doc, {
    startY: endY,
    body: [
      ["TOTAL BRUTO", fmt(totals.totalBruto)],
      [`% DTO (${data.descuento}%)`, fmt(totals.dctoAmount)],
      ["BASE IMPONIBLE", fmt(totals.baseImponible)],
      ["IVA TOTAL", fmt(totals.ivaTotal)],
      [`R.EQV (${data.reqv}%)`, fmt(totals.reqvTotal)],
    ],
    bodyStyles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right" } },
    margin: { left: pageW - 124, right: 14 },
    tableWidth: 110,
    theme: "plain",
  });

  endY = (doc as any).lastAutoTable.finalY + 2;
  doc.setFillColor(26, 58, 122);
  doc.rect(pageW - 124, endY, 110, 12, "F");
  doc.setTextColor(255).setFont("helvetica", "bold").setFontSize(12);
  doc.text("TOTAL NETO", pageW - 121, endY + 8);
  doc.text(fmt(totals.totalNeto), pageW - 17, endY + 8, { align: "right" });

  doc.save(`Factura_${data.numFactura || "SinNumero"}.pdf`);
}
