const GAZETTEER = {
  cameroun: [3.87, 11.52],
  "rd congo": [-2.5, 23.5],
  "congo-brazzaville": [-0.8, 15.2],
  tchad: [15.4, 18.7],
  gabon: [-0.8, 11.6],
  centrafrique: [6.6, 20.9],
  rwanda: [-1.94, 29.87],
  kenya: [0.2, 37.9],
  ethiopie: [9.1, 40.5],
  ouganda: [1.37, 32.29],
  burundi: [-3.37, 29.92],
  togo: [8.6, 1.1],
  ghana: [7.95, -1.02],
  "burkina faso": [12.3, -1.5],
  "cote d'ivoire": [7.5, -5.5],
  "guinee equatoriale": [1.6, 10.3],
  benin: [9.3, 2.3],
  senegal: [14.5, -14.5],
  "cap-vert": [15.1, -23.6],
  madagascar: [-19.4, 46.7],
  mali: [17.6, -2],
  maroc: [31.8, -7.1],
  algerie: [28.0, 2.6],
  belgique: [50.5, 4.5],
  france: [46.6, 2.3],
  allemagne: [51.2, 10.4],
  suisse: [46.8, 8.2],
  espagne: [40.4, -3.7],
  italie: [42.5, 12.5],
  niger: [17.6, 8.1],
  nigeria: [9.1, 8.7],
  somalie: [5.2, 46.2],
  egypte: [26.8, 30.8],
  tunisie: [34, 9],
  "guinee-conakry": [10.4, -10.9],
  "guinee-bissau": [12, -15],
  "afrique du sud": [-29, 25],
  "congo-kinshasa": [-2.5, 23.5],
  hongrie: [47.2, 19.5],
  "pays-bas": [52.1, 5.3],
  autriche: [47.6, 14.1],
  angleterre: [52.3, -1.5],
  chine: [35.9, 104.2],
  japon: [36.2, 138.3],
  malaisie: [4.2, 102],
  thailande: [15.9, 100.9],
  indonesie: [-2.5, 118],
  australie: [-25.3, 133.8],
  "nouvelle-zelande": [-41.5, 172.5],
  "etats-unis": [39.8, -98.6],
  canada: [56.1, -96],
};

export function placeKey(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "'")
    .trim();
}

export function locate(item) {
  const extra = item?.extra && typeof item.extra === "object" ? item.extra : {};
  const lat = Number(extra.lat);
  const lng = Number(extra.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
    return { lat, lng, pinned: true };
  }
  const known = GAZETTEER[placeKey(item?.titleFr || item?.title)];
  if (!known) return null;
  return { lat: known[0], lng: known[1], pinned: true };
}
