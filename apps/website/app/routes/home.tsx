import { useMemo, useState } from "react";

import { refranes, type RefranTipo } from "@refranes/data";
import type { Route } from "./+types/home";
import { FLAG_COLORS, Garland, PapelFlag } from "../components/papel";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Refranes Mexicanos — Diccionario público" },
    {
      name: "description",
      content:
        "Colección de refranes y dichos mexicanos con su significado. Descarga gratis el diccionario completo en formato JSON.",
    },
  ];
}

const FEATURED_ID = "camaron-que-se-duerme-se-lo-lleva-la-corriente";

function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

type Filter = "todos" | RefranTipo;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "refrán", label: "Refranes" },
  { key: "dicho", label: "Dichos" },
];

export default function Home() {
  const featured =
    refranes.find((r) => r.id === FEATURED_ID) ?? refranes[0]!;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return refranes.filter((r) => {
      if (filter !== "todos" && r.tipo !== filter) return false;
      if (!q) return true;
      return (
        normalize(r.refran).includes(q) ||
        normalize(r.significado).includes(q)
      );
    });
  }, [query, filter]);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pb-16">
        <Garland count={14} />
        <div className="mx-auto max-w-3xl px-6 pt-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-magenta">
            Sabiduría popular de México
          </p>
          <h1 className="mt-3 font-display text-5xl font-black leading-tight text-ink sm:text-7xl">
            Refranes Mexicanos
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
            {refranes.length} refranes y dichos, cada uno con su significado.
            Gratis, abierto y para todos.
          </p>

          <div className="relative mx-auto mt-12 flex max-w-md justify-center">
            <div className="papel-flag relative">
              <PapelFlag color={FLAG_COLORS[0]} width={300} height={252} />
              <p className="absolute inset-x-8 top-[34%] text-center text-xl font-extrabold leading-tight text-white drop-shadow">
                {featured.refran}
              </p>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-md text-base text-ink-soft">
            {featured.significado}
          </p>

          <a
            href="#descargar"
            className="mt-10 inline-block rounded-full bg-magenta px-8 py-4 text-base font-bold text-white shadow-lg transition hover:scale-105"
          >
            Descargar el diccionario
          </a>
        </div>
      </section>

      {/* Browse */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-display text-3xl font-black text-ink">
          Explora la colección
        </h2>

        <div className="sticky top-0 z-10 -mx-6 bg-paper/90 px-6 py-4 backdrop-blur">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca un refrán o su significado…"
            className="w-full rounded-full border border-paper-deep bg-white px-6 py-3.5 text-base text-ink outline-none focus:border-magenta"
          />
          <div className="mt-3 flex gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={
                    "rounded-full px-4 py-2 text-sm font-bold transition " +
                    (active
                      ? "bg-magenta text-white"
                      : "bg-white text-ink-soft hover:bg-paper-deep")
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-sm text-ink-soft">
          {results.length}{" "}
          {results.length === 1 ? "resultado" : "resultados"}
        </p>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {results.map((r, i) => (
            <li
              key={r.id}
              className="rounded-3xl bg-white p-5 shadow-sm"
              style={{
                borderTop: `4px solid ${FLAG_COLORS[i % FLAG_COLORS.length]}`,
              }}
            >
              <p className="text-base font-bold text-ink">{r.refran}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {r.significado}
              </p>
              <span className="mt-3 inline-block rounded-full bg-paper-deep px-3 py-1 text-xs font-bold capitalize text-magenta">
                {r.tipo}
              </span>
            </li>
          ))}
        </ul>
        {results.length === 0 ? (
          <p className="mt-8 text-center text-ink-soft">
            Sin resultados para «{query}».
          </p>
        ) : null}
      </section>

      {/* Download */}
      <section
        id="descargar"
        className="bg-ink px-6 py-20 text-paper"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-black">
            Descarga el diccionario
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-paper/70">
            Todos los refranes en un solo archivo JSON, libre para usar en tus
            proyectos. Sin registro, sin límites.
          </p>
          <a
            href="/refranes.json"
            download="refranes.json"
            className="mt-8 inline-block rounded-full bg-magenta px-8 py-4 text-base font-bold text-white shadow-lg transition hover:scale-105"
          >
            Descargar refranes.json
          </a>

          <div className="mt-12 rounded-3xl bg-white/5 p-6 text-left">
            <p className="text-sm font-bold uppercase tracking-wider text-paper/60">
              Estructura
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-black/30 p-4 text-sm text-paper/90">
              <code>{`[
  {
    "id": "camaron-que-se-duerme-se-lo-lleva-la-corriente",
    "refran": "Camarón que se duerme, se lo lleva la corriente.",
    "significado": "Quien se descuida deja pasar las oportunidades…",
    "tipo": "refrán"
  }
]`}</code>
            </pre>
            <p className="mt-4 text-sm text-paper/60">
              <code className="text-paper/90">tipo</code> es{" "}
              <code className="text-paper/90">"refrán"</code> o{" "}
              <code className="text-paper/90">"dicho"</code>. Endpoint público
              con CORS abierto en{" "}
              <a
                className="underline"
                href="/refranes.json"
              >
                /refranes.json
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-ink px-6 pb-12 text-center text-sm text-paper/50">
        <p>
          Hecho con cariño por{" "}
          <a className="underline" href="https://cesargdm.com">
            César Guadarrama
          </a>
          . Licencia MIT.
        </p>
      </footer>
    </main>
  );
}
