import { Leaf, Truck, Globe2, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import logo from "@/assets/logo-esp.jpeg";

const COMPANY = "EUROPE SPAIN PIONEERS EXP & IMP";

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-3">
          <img src={logo} alt="ESP Logo" className="h-12 w-12 rounded-md object-contain" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-tight text-primary">EUROPE SPAIN PIONEERS</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Exp & Imp</div>
          </div>
        </a>
        <nav className="hidden gap-8 text-sm font-medium md:flex">
          <a href="#nosotros" className="text-foreground/80 hover:text-primary">Nosotros</a>
          <a href="#servicios" className="text-foreground/80 hover:text-primary">Servicios</a>
          <a href="#contacto" className="text-foreground/80 hover:text-primary">Contacto</a>
        </nav>
        <Button asChild size="sm"><a href="#contacto">Contactar</a></Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.28_0.13_260)] text-primary-foreground">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="container relative mx-auto grid items-center gap-10 px-4 py-24 md:grid-cols-2 md:py-32">
        <div>
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider">Importación & Exportación</span>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
            Conectando a <span className="text-[var(--brand-yellow)]">España</span> con el Mundo
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85">
            Servicios premium de importación y exportación de productos frescos y logística fiable desde Talavera de la Reina hacia toda Europa y el mundo.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <a href="#contacto">Contactar <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
              <a href="#servicios">Nuestros Servicios</a>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="rounded-full bg-white/95 p-8 shadow-2xl">
            <img src={logo} alt="ESP" className="h-64 w-64 object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="nosotros" className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-primary md:text-4xl">Sobre Nosotros</h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded bg-[var(--brand-orange)]" />
        <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
          Ubicados en <strong className="text-foreground">Talavera de la Reina</strong>, en el corazón de España, somos una empresa especializada en conectar la excelencia de los productos españoles con mercados internacionales. Combinamos tradición, calidad y logística moderna para llevar lo mejor de nuestra tierra a clientes de todo el mundo.
        </p>
      </div>
    </section>
  );
}

const services = [
  { icon: Leaf, title: "Productos Frescos", desc: "Cítricos, verduras y especialidades españolas seleccionadas con los más altos estándares de calidad.", color: "var(--brand-green)" },
  { icon: Truck, title: "Logística", desc: "Gestión integral de transporte y aduanas fiable en Europa y el mundo, con seguimiento end-to-end.", color: "var(--brand-orange)" },
  { icon: Globe2, title: "Comercio Global", desc: "Abastecimiento y distribución entre continentes con una red consolidada de socios comerciales.", color: "var(--brand-red)" },
];

function Services() {
  return (
    <section id="servicios" className="bg-secondary/50 py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">Nuestros Servicios</h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded bg-[var(--brand-orange)]" />
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <Card key={s.title} className="group relative overflow-hidden border-0 p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: `color-mix(in oklab, ${s.color} 15%, transparent)`, color: s.color }}>
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
              <p className="mt-3 text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contacto" className="text-white" style={{ background: "#1a3a7a" }}>
      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Contacto</h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded bg-[var(--brand-yellow)]" />
          <p className="mt-6 text-white/80">Estamos a su disposición para cualquier consulta comercial.</p>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3">
          {[
            { icon: MapPin, title: "Dirección", lines: ["Calle Montesclaros 12", "Talavera de la Reina", "CP 45600"] },
            { icon: Phone, title: "Teléfono", lines: ["+34 692 723 388"], href: "tel:+34692723388" },
            { icon: Mail, title: "Email", lines: ["EUROPESPAINPIONEERS@GMAIL.com"], href: "mailto:EUROPESPAINPIONEERS@GMAIL.com" },
          ].map((c) => (
            <div key={c.title} className="rounded-xl bg-white/5 p-6 text-center backdrop-blur ring-1 ring-white/10">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">{c.title}</h3>
              <div className="mt-2 space-y-1 text-sm text-white/80">
                {c.lines.map((l) => c.href ? <a key={l} href={c.href} className="block break-words hover:text-white">{l}</a> : <p key={l}>{l}</p>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const waMsg = encodeURIComponent("Hola Wario, vi tu trabajo en la web de Europe Spain Pioneers y me gustaría saber más sobre tus servicios de desarrollo.");
  return (
    <footer className="border-t bg-background py-10 text-sm">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="text-center md:text-left">
          <div className="font-semibold text-foreground">© {year} {COMPANY}</div>
          <div className="text-muted-foreground">CIF: B44815439</div>
        </div>
        <div className="flex flex-col items-center gap-2 text-muted-foreground md:items-end">
          <div>
            Desarrollado por{" "}
            <a href={`https://wa.me/33745687745?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Wario</a>
            {" "}— ¿Quieres una web para tu negocio?
          </div>
          <a href="/admin" className="text-xs text-muted-foreground/70 hover:text-primary">Administración</a>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
