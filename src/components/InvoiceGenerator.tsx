import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Download, LogOut } from "lucide-react";
import { toast } from "sonner";
import { computeTotals, fmt, generateInvoicePdf, type InvoiceData, type ProductLine } from "@/lib/invoice-pdf";
import NumberInput from "@/components/NumberInput";

const num = (v: string) => {
  const n = parseFloat((v || "").toString().replace(",", "."));
  return isNaN(n) ? 0 : n;
};

const newLine = (): ProductLine => ({
  id: crypto.randomUUID(),
  codigo: "",
  descripcion: "",
  iva: 4,
  cantidad: 1,
  precio: 0,
});

export default function InvoiceGenerator({ onLogout }: { onLogout: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState<InvoiceData>({
    fecha: today,
    codigoCliente: "",
    numFactura: "",
    formaPago: "Transferencia",
    cliente: { nombre: "", cif: "", direccion: "", cp: "", ciudad: "", provincia: "", telefono: "" },
    lines: [newLine()],
    descuento: 0,
    reqv: 0,
  });

  const totals = useMemo(() => computeTotals(data), [data]);

  const updateLine = (id: string, patch: Partial<ProductLine>) =>
    setData((d) => ({ ...d, lines: d.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));

  const handleGenerate = async () => {
    if (!data.numFactura) return toast.error("Indica el nº de factura");
    if (!data.cliente.nombre) return toast.error("Indica el nombre del cliente");
    try {
      await generateInvoicePdf(data);
      toast.success("PDF generado correctamente");
    } catch (e) {
      toast.error("Error generando el PDF");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-primary">Panel de Administración</h1>
            <p className="text-xs text-muted-foreground">Generador de Facturas</p>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}><LogOut className="mr-2 h-4 w-4" />Cerrar sesión</Button>
        </div>
      </header>

      <main className="container mx-auto space-y-6 px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-primary">Datos de la Factura</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Fecha</Label><Input type="date" value={data.fecha} onChange={(e) => setData({ ...data, fecha: e.target.value })} /></div>
              <div><Label>Nº Factura</Label><Input value={data.numFactura} onChange={(e) => setData({ ...data, numFactura: e.target.value })} placeholder="2026-001" /></div>
              <div><Label>Código Cliente</Label><Input value={data.codigoCliente} onChange={(e) => setData({ ...data, codigoCliente: e.target.value })} /></div>
              <div>
                <Label>Forma de Pago</Label>
                <Select value={data.formaPago} onValueChange={(v) => setData({ ...data, formaPago: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Transferencia", "Efectivo", "Tarjeta", "Cheque", "Domiciliación"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-primary">Cliente</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Nombre / Empresa</Label><Input value={data.cliente.nombre} onChange={(e) => setData({ ...data, cliente: { ...data.cliente, nombre: e.target.value } })} /></div>
              <div><Label>C.I.F.</Label><Input value={data.cliente.cif} onChange={(e) => setData({ ...data, cliente: { ...data.cliente, cif: e.target.value } })} /></div>
              <div><Label>Teléfono</Label><Input value={data.cliente.telefono} onChange={(e) => setData({ ...data, cliente: { ...data.cliente, telefono: e.target.value } })} /></div>
              <div className="sm:col-span-2"><Label>Dirección</Label><Input value={data.cliente.direccion} onChange={(e) => setData({ ...data, cliente: { ...data.cliente, direccion: e.target.value } })} /></div>
              <div><Label>Código Postal</Label><Input value={data.cliente.cp} onChange={(e) => setData({ ...data, cliente: { ...data.cliente, cp: e.target.value } })} /></div>
              <div><Label>Ciudad</Label><Input value={data.cliente.ciudad} onChange={(e) => setData({ ...data, cliente: { ...data.cliente, ciudad: e.target.value } })} /></div>
              <div className="sm:col-span-2"><Label>Provincia</Label><Input value={data.cliente.provincia} onChange={(e) => setData({ ...data, cliente: { ...data.cliente, provincia: e.target.value } })} /></div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">Productos</h2>
            <Button size="sm" onClick={() => setData((d) => ({ ...d, lines: [...d.lines, newLine()] }))}>
              <Plus className="mr-1 h-4 w-4" />Añadir línea
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 pr-2">Código</th>
                  <th className="pb-2 pr-2">Descripción</th>
                  <th className="pb-2 pr-2 w-20">IVA %</th>
                  <th className="pb-2 pr-2 w-20">Cant.</th>
                  <th className="pb-2 pr-2 w-28">Precio</th>
                  <th className="pb-2 pr-2 w-28 text-right">Total</th>
                  <th className="pb-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {data.lines.map((l) => (
                  <tr key={l.id} className="border-b last:border-0">
                    <td className="py-2 pr-2"><Input value={l.codigo} onChange={(e) => updateLine(l.id, { codigo: e.target.value })} /></td>
                    <td className="py-2 pr-2"><Input value={l.descripcion} onChange={(e) => updateLine(l.id, { descripcion: e.target.value })} /></td>
                    <td className="py-2 pr-2"><NumberInput value={l.iva} onChange={(v) => updateLine(l.id, { iva: v })} /></td>
                    <td className="py-2 pr-2"><NumberInput value={l.cantidad} onChange={(v) => updateLine(l.id, { cantidad: v })} /></td>
                    <td className="py-2 pr-2"><NumberInput value={l.precio} onChange={(v) => updateLine(l.id, { precio: v })} /></td>
                    <td className="py-2 pr-2 text-right font-medium">{fmt(l.cantidad * l.precio)}</td>
                    <td className="py-2"><Button variant="ghost" size="icon" onClick={() => setData((d) => ({ ...d, lines: d.lines.filter((x) => x.id !== l.id) }))}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex justify-end">
          <Card className="w-full max-w-[45%] min-w-[320px] p-6">
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div><Label className="text-xs">% Descuento</Label><Input inputMode="decimal" value={String(data.descuento)} onChange={(e) => setData({ ...data, descuento: num(e.target.value) })} /></div>
              <div><Label className="text-xs">% R.EQV</Label><Input inputMode="decimal" value={String(data.reqv)} onChange={(e) => setData({ ...data, reqv: num(e.target.value) })} /></div>
            </div>

            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-secondary text-left">
                  <th className="p-2">Tipo</th><th className="p-2 text-right">Base</th><th className="p-2 text-right">IVA</th><th className="p-2 text-right">R.EQV</th><th className="p-2 text-right">Importe</th>
                </tr>
              </thead>
              <tbody>
                {totals.groups.map((g) => (
                  <tr key={g.tipo} className="border-b">
                    <td className="p-2">{g.tipo}%</td>
                    <td className="p-2 text-right">{fmt(g.base)}</td>
                    <td className="p-2 text-right">{fmt(g.iva)}</td>
                    <td className="p-2 text-right">{fmt(g.reqv)}</td>
                    <td className="p-2 text-right">{fmt(g.importe)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between"><span>Total Bruto</span><span>{fmt(totals.totalBruto)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Dto ({data.descuento}%)</span><span>-{fmt(totals.dctoAmount)}</span></div>
              <div className="flex justify-between"><span>Base Imponible</span><span>{fmt(totals.baseImponible)}</span></div>
              <div className="flex justify-between"><span>IVA</span><span>{fmt(totals.ivaTotal)}</span></div>
              <div className="flex justify-between"><span>R.EQV</span><span>{fmt(totals.reqvTotal)}</span></div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-primary-foreground">
              <span className="font-semibold">TOTAL NETO</span>
              <span className="text-2xl font-bold">{fmt(totals.totalNeto)}</span>
            </div>

            <Button size="lg" className="mt-5 w-full" onClick={handleGenerate}>
              <Download className="mr-2 h-5 w-5" />Generar Factura PDF
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
