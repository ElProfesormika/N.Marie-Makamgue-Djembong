import { useId } from "react";

function starPoints(cx, cy, r) {
  const points = [];
  for (let i = 0; i < 5; i += 1) {
    const outer = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const inner = outer + Math.PI / 5;
    points.push(`${cx + Math.cos(outer) * r},${cy + Math.sin(outer) * r}`);
    points.push(`${cx + Math.cos(inner) * r * 0.4},${cy + Math.sin(inner) * r * 0.4}`);
  }
  return points.join(" ");
}

function Frame({ children, label }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function WhiteHouse() {
  return (
    <Frame label="Maison Blanche">
      <circle cx="32" cy="32" r="32" fill="#123a63" />
      <polygon points="12,30 32,16 52,30" fill="#f3d78a" />
      <rect x="29" y="14" width="6" height="12" rx="1" fill="#f7f3ea" />
      <rect x="14" y="30" width="36" height="18" fill="#f7f3ea" />
      {[18, 24, 30, 36, 42].map((x) => (
        <rect key={x} x={x} y="33" width="3.2" height="11" rx="1.4" fill="#123a63" />
      ))}
      <rect x="28" y="38" width="8" height="10" fill="#123a63" />
    </Frame>
  );
}

function UnitedNations() {
  return (
    <Frame label="Organisation des Nations Unies">
      <circle cx="32" cy="32" r="32" fill="#009edb" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="#fff" strokeWidth="1.6" />
      <ellipse cx="32" cy="32" rx="8" ry="18" fill="none" stroke="#fff" strokeWidth="1.4" />
      <path d="M14 32h36M18 24h28M18 40h28" fill="none" stroke="#fff" strokeWidth="1.3" />
      <circle cx="32" cy="32" r="2" fill="#fff" />
    </Frame>
  );
}

function EuropeanCommission() {
  const stars = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
    return { x: 32 + Math.cos(angle) * 18, y: 32 + Math.sin(angle) * 18 };
  });
  return (
    <Frame label="Commission européenne">
      <circle cx="32" cy="32" r="32" fill="#003399" />
      {stars.map((point) => (
        <polygon key={`${point.x}-${point.y}`} points={starPoints(point.x, point.y, 3.3)} fill="#fc0" />
      ))}
    </Frame>
  );
}

function Unesco() {
  return (
    <Frame label="UNESCO">
      <circle cx="32" cy="32" r="32" fill="#0077c8" />
      <polygon points="14,28 32,14 50,28" fill="#fff" />
      <rect x="16" y="28" width="32" height="3" fill="#fff" />
      {[18, 26, 34, 42].map((x) => (
        <rect key={x} x={x} y="31" width="4" height="14" fill="#fff" />
      ))}
      <rect x="15" y="45" width="34" height="4" fill="#fff" />
    </Frame>
  );
}

function EuropeanParliament() {
  return (
    <Frame label="Parlement européen">
      <circle cx="32" cy="32" r="32" fill="#003399" />
      <path d="M12 40a20 20 0 0 1 40 0" fill="none" stroke="#fc0" strokeWidth="3" />
      <path d="M18 40a14 14 0 0 1 28 0" fill="none" stroke="#fff" strokeWidth="2" />
      <rect x="30" y="22" width="4" height="16" rx="1" fill="#fc0" />
    </Frame>
  );
}

function AfricanUnion() {
  return (
    <Frame label="Union africaine">
      <circle cx="32" cy="32" r="32" fill="#0b7a3b" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#f5c518" strokeWidth="2" />
      <path
        d="M34 16c5 3 9 8 8 14 3 1 5 6 3 11-3 7-8 8-9 14-3-1-7 0-9-5-5-2-7-9-4-15 1-8 5-12 8-16 1-1 2-3 3-3z"
        fill="#f5c518"
      />
    </Frame>
  );
}

function BelgianSenate() {
  const id = `be-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Sénat de Belgique">
      <defs>
        <clipPath id={id}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width="22" height="64" fill="#111" />
        <rect x="22" width="20" height="64" fill="#fdda24" />
        <rect x="42" width="22" height="64" fill="#ef3340" />
        <circle cx="32" cy="34" r="13" fill="#fff" />
        <polygon points="22,36 32,24 42,36" fill="#123a63" />
        <rect x="25" y="36" width="14" height="9" fill="#123a63" />
      </g>
    </svg>
  );
}

function FederalParliament() {
  return (
    <Frame label="Parlement fédéral">
      <circle cx="32" cy="32" r="32" fill="#111" />
      <path d="M10 40h44v6H10z" fill="#fdda24" />
      <path d="M10 46h44v8H10z" fill="#ef3340" />
      <polygon points="14,40 32,18 50,40" fill="#f7f3ea" />
      {[20, 28, 36].map((x) => (
        <rect key={x} x={x} y="28" width="4" height="12" fill="#111" />
      ))}
    </Frame>
  );
}

function NationalAssembly() {
  return (
    <Frame label="Assemblée nationale">
      <circle cx="32" cy="32" r="32" fill="#002395" />
      <rect x="12" y="40" width="40" height="10" fill="#ed2939" />
      <polygon points="16,40 32,20 48,40" fill="#fff" />
      {[22, 29, 36].map((x) => (
        <rect key={x} x={x} y="30" width="4" height="10" fill="#002395" />
      ))}
    </Frame>
  );
}

function Fallback({ name }) {
  const letters = name
    .split(" ")
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return (
    <Frame label={name}>
      <circle cx="32" cy="32" r="32" fill="#1565e0" />
      <text x="32" y="38" textAnchor="middle" fontSize="18" fontFamily="Outfit, sans-serif" fill="#fff">
        {letters || "•"}
      </text>
    </Frame>
  );
}

export function InstitutionLogo({ name }) {
  const key = (name || "").toLowerCase();
  if (key.includes("maison blanche") || key.includes("white house")) return <WhiteHouse />;
  if (key.includes("nations unies") || key.includes("onu") || key.includes("united nations")) return <UnitedNations />;
  if (key.includes("commission")) return <EuropeanCommission />;
  if (key.includes("unesco")) return <Unesco />;
  if (key.includes("fédéral") || key.includes("federal")) return <FederalParliament />;
  if (key.includes("assemblée") || key.includes("assemblee") || key.includes("national assembly")) return <NationalAssembly />;
  if (key.includes("parlement") || key.includes("parliament")) return <EuropeanParliament />;
  if (key.includes("africaine") || key.includes("african union")) return <AfricanUnion />;
  if (key.includes("sénat") || key.includes("senat") || key.includes("belgique") || key.includes("senate")) return <BelgianSenate />;
  return <Fallback name={name} />;
}

export function shortInstitution(name) {
  const key = (name || "").toLowerCase();
  if (key.includes("nations unies") || key === "onu") return "ONU";
  if (key.includes("united nations")) return "UN";
  return name;
}
