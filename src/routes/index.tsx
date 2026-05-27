import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/components/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Europe Spain Pioneers — Importación y Exportación de Frutas y Verduras" },
      { name: "description", content: "Empresa española de importación y exportación de productos frescos. Cítricos, verduras y logística fiable desde Talavera de la Reina al mundo." },
      { property: "og:title", content: "Europe Spain Pioneers Exp & Imp" },
      { property: "og:description", content: "Conectando a España con el Mundo. Productos frescos, logística y comercio global." },
    ],
  }),
  component: Landing,
});
