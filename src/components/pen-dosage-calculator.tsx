import { useMemo, useState } from "react";

/** PeptidePen dual-chamber cartridge: 1.25 mL diluent; dial counts units (100 units = 1 mL). */
export const PEN_VOLUME_ML = 1.25;
export const PEN_TOTAL_UNITS = 125;
export const PRIME_UNITS = 2;

export function calcPenDose(strengthMg: number, doseMg: number, perWeek: number) {
  if (!(strengthMg > 0) || !(doseMg > 0)) return null;
  const mgPerMl = strengthMg / PEN_VOLUME_ML;
  const mgPerUnit = strengthMg / PEN_TOTAL_UNITS;
  const units = doseMg / mgPerUnit;
  const usable = PEN_TOTAL_UNITS - PRIME_UNITS;
  const doses = Math.floor(usable / units + 1e-9);
  const weeks = perWeek > 0 ? doses / perWeek : 0;
  return { mgPerMl, mgPerUnit, units, ml: units / 100, doses, weeks, tooLarge: units > usable };
}

const STRENGTHS = [10, 15, 20, 30, 60];
const FREQS = [
  { label: "Daily", perWeek: 7 },
  { label: "Twice a week", perWeek: 2 },
  { label: "Once a week", perWeek: 1 },
  { label: "Every 2 weeks", perWeek: 0.5 },
];

const fmt = (n: number, d = 2) => (Number.isFinite(n) ? Number(n.toFixed(d)).toString() : "—");

export function PenDosageCalculator() {
  const [strength, setStrength] = useState("20");
  const [dose, setDose] = useState("2.5");
  const [doseUnit, setDoseUnit] = useState<"mg" | "mcg">("mg");
  const [perWeek, setPerWeek] = useState(1);

  const doseMg = (parseFloat(dose) || 0) / (doseUnit === "mcg" ? 1000 : 1);
  const r = useMemo(() => calcPenDose(parseFloat(strength) || 0, doseMg, perWeek), [strength, doseMg, perWeek]);
  const pct = r ? Math.min(100, (r.units / PEN_TOTAL_UNITS) * 100) : 0;

  const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1 text-sm ${on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`;

  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium" htmlFor="strength">1. Pen strength (total mg in the cartridge)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {STRENGTHS.map((s) => (
                <button key={s} type="button" className={chip(strength === String(s))} onClick={() => setStrength(String(s))}>{s} mg</button>
              ))}
            </div>
            <input id="strength" type="number" min="0" step="0.1" inputMode="decimal" className={`${input} mt-2`} value={strength} onChange={(e) => setStrength(e.target.value)} />
            <p className="mt-1 text-xs text-muted-foreground">Mixed with the built-in {PEN_VOLUME_ML} mL of bacteriostatic water ({PEN_TOTAL_UNITS} units).</p>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="dose">2. Amount per injection</label>
            <div className="mt-2 flex gap-2">
              <input id="dose" type="number" min="0" step="0.05" inputMode="decimal" className={input} value={dose} onChange={(e) => setDose(e.target.value)} />
              <select aria-label="Dose unit" className="rounded-md border border-input bg-background px-2 text-sm" value={doseUnit} onChange={(e) => setDoseUnit(e.target.value as "mg" | "mcg")}>
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
              </select>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium">3. How often</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {FREQS.map((f) => (
                <button key={f.label} type="button" className={chip(perWeek === f.perWeek)} onClick={() => setPerWeek(f.perWeek)}>{f.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-5" aria-live="polite">
          {r ? (
            <>
              <p className="text-sm text-muted-foreground">Turn the dose knob to</p>
              <p className="text-5xl font-semibold tracking-tight">{fmt(r.units, 1)} <span className="text-2xl font-normal">units</span></p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background">
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              {r.tooLarge ? (
                <p className="mt-3 text-sm text-destructive">This amount is more than one pen holds. Use a stronger pen or a smaller amount.</p>
              ) : !Number.isInteger(Math.round(r.units * 10) / 10) ? (
                <p className="mt-3 text-xs text-muted-foreground">The dial clicks in whole units — round to {Math.round(r.units)} units.</p>
              ) : null}
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-muted-foreground">Volume per dose</dt><dd className="font-medium">{fmt(r.ml, 3)} mL</dd></div>
                <div><dt className="text-muted-foreground">Concentration</dt><dd className="font-medium">{fmt(r.mgPerMl)} mg/mL</dd></div>
                <div><dt className="text-muted-foreground">Each unit holds</dt><dd className="font-medium">{fmt(r.mgPerUnit * 1000, 1)} mcg</dd></div>
                <div><dt className="text-muted-foreground">Doses per pen</dt><dd className="font-medium">{r.doses}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">One pen lasts about</dt><dd className="font-medium">{r.weeks >= 1 ? `${fmt(r.weeks, 1)} weeks` : `${fmt(r.weeks * 7, 1)} days`}</dd></div>
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">Allows {PRIME_UNITS} units for the first-use prime.</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Enter a pen strength and amount to see the units to dial.</p>
          )}
        </div>
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        For research use only. Always dial the units printed on your product label — this tool is for reference and does not replace it.
      </p>
    </div>
  );
}
