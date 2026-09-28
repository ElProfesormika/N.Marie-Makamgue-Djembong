export const ODDS = [
  { id: 1, name: "Pas de pauvreté", color: "#E5243B", line: "Éliminer la pauvreté sous toutes ses formes." },
  { id: 2, name: "Faim zéro", color: "#DDA63A", line: "Éliminer la faim et assurer la sécurité alimentaire." },
  { id: 3, name: "Bonne santé et bien-être", color: "#4C9F38", line: "Permettre à tous de vivre en bonne santé." },
  { id: 4, name: "Éducation de qualité", color: "#C5192D", line: "Assurer une éducation inclusive et de qualité." },
  { id: 5, name: "Égalité entre les sexes", color: "#FF3A21", line: "Parvenir à l'égalité entre les sexes." },
  { id: 6, name: "Eau propre et assainissement", color: "#26BDE2", line: "Garantir l'accès de tous à l'eau propre." },
  { id: 7, name: "Énergie propre", color: "#FCC30B", line: "Garantir l'accès à une énergie propre et abordable." },
  { id: 8, name: "Travail décent et croissance", color: "#A21942", line: "Promouvoir un travail décent et une croissance durable." },
  { id: 9, name: "Industrie et innovation", color: "#FD6925", line: "Bâtir une infrastructure résiliente et encourager l'innovation." },
  { id: 10, name: "Inégalités réduites", color: "#DD1367", line: "Réduire les inégalités entre les personnes et entre les pays." },
  { id: 11, name: "Villes durables", color: "#FD9D24", line: "Rendre les villes et les communautés durables." },
  { id: 12, name: "Consommation responsable", color: "#BF8B2E", line: "Établir des modes de consommation et de production durables." },
  { id: 13, name: "Lutte contre le climat", color: "#3F7E44", line: "Lutter contre les changements climatiques." },
  { id: 14, name: "Vie aquatique", color: "#0A97D9", line: "Conserver et exploiter durablement les océans." },
  { id: 15, name: "Vie terrestre", color: "#56C02B", line: "Préserver les écosystèmes terrestres." },
  { id: 16, name: "Paix, justice et institutions", color: "#00689D", line: "Promouvoir la paix, la justice et des institutions efficaces." },
  { id: 17, name: "Partenariats", color: "#19486A", line: "Renforcer les moyens de mettre en œuvre les objectifs." },
];

export function oddsOf(item) {
  const extra = item?.extra && typeof item.extra === "object" ? item.extra : {};
  const list = Array.isArray(extra.odds) ? extra.odds : [];
  return [...new Set(list.map(Number).filter((id) => ODDS.some((odd) => odd.id === id)))];
}

export function oddById(id) {
  return ODDS.find((odd) => odd.id === Number(id));
}

export function OddTile({ id, mini = false }) {
  const odd = oddById(id);
  if (!odd) return null;
  return (
    <span className={mini ? "odd-tile mini" : "odd-tile"} style={{ background: odd.color }} title={`ODD ${odd.id}. ${odd.name}`}>
      <b>{odd.id}</b>
      {!mini && <small>{odd.name}</small>}
    </span>
  );
}
