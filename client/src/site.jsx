import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import { localizeSite } from "./en.js";
import { useLang } from "./i18n.jsx";

const SiteContext = createContext(null);

export const PATHS = {
  accueil: "/",
  "qui-suis-je": "/qui-suis-je",
  racines: "/racines",
  parcours: "/parcours",
  aisbl: "/un-geste-divin",
  actions: "/actions",
  reconnaissances: "/reconnaissances",
  reseau: "/reseau",
  galerie: "/galerie",
  evenements: "/evenements",
  message: "/message",
  contact: "/contact",
};

export const REGIONS = ["Europe", "Afrique", "Amériques", "Asie", "Océanie"];

export const SECTION_DEFAULTS = {
  heroPrimary: "Voir les actions",
  heroSecondary: "Me contacter",
  exchange: "J'échange avec",
  methodKicker: "Méthode",
  methodTitle: "Quatre temps, du terrain au sommet.",
  methodLink: "mon parcours →",
  ctaKicker: "Charleroi · Belgique",
  ctaTitle: "Un échange, un partenariat, un accompagnement.",
  ctaButton: "Écrire à Mama Coco",
  coachTitle: "Trois accompagnements, au plus près.",
  exploreTitle: "À explorer",
  exploreLink: "la galerie →",
  carryTitle: "Ce que je porte",
  titresKicker: "Titres & appartenances",
  titresTitle: "Fonctions, marrainages, réseaux",
  antennesKicker: "Ancrage",
  antennesTitle: "Siège et antennes",
  presenceKicker: "Rayonnement",
  presenceTitle: "Où mon association est présente",
  actionsKicker: "Objectifs de développement durable",
  actionsTitle: "Chaque action que je mène rejoint un ODD.",
  actionPin: "Action",
  actionMore: "Lire l'action",
  impactKicker: "Impact",
  impactTitle: "Ce que je mesure.",
  writeButton: "Écrire",
  institutionsKicker: "Institutions",
  embassiesKicker: "Ambassades",
  partnersKicker: "Partenaires",
  eventsLink: "Voir les événements",
};

export function sectionCopy(settings) {
  return { ...SECTION_DEFAULTS, ...(settings?.sections || {}) };
}

export const COLLECTIONS = [
  { key: "methode", label: "Étapes de la méthode", page: "Accueil", fields: [
    { key: "title", label: "Titre" },
    { key: "body", label: "Texte", type: "textarea" },
  ]},
  { key: "stats", label: "Chiffres de l'accueil", page: "Accueil", fields: [
    { key: "metric", label: "Chiffre" },
    { key: "title", label: "Libellé" },
    { key: "body", label: "Précision", type: "textarea" },
  ]},
  { key: "expertises", label: "Expertises", page: "Qui suis-je", fields: [
    { key: "title", label: "Expertise" },
  ]},
  { key: "explorer", label: "Cartes À explorer", page: "Qui suis-je", fields: [
    { key: "subtitle", label: "Surtitre" },
    { key: "title", label: "Titre" },
    { key: "body", label: "Libellé du lien" },
    { key: "metric", label: "Lien", placeholder: "/racines" },
  ]},
  { key: "coaching", label: "Accompagnements", page: "Qui suis-je", fields: [
    { key: "title", label: "Titre" },
    { key: "body", label: "Texte", type: "textarea" },
  ]},
  { key: "identite", label: "Cartes d'identité", page: "Qui suis-je", fields: [
    { key: "title", label: "Titre" },
    { key: "subtitle", label: "Sous-titre" },
    { key: "body", label: "Texte", type: "textarea" },
  ]},
  { key: "parcours", label: "Étapes du parcours", page: "Parcours", fields: [
    { key: "subtitle", label: "Période" },
    { key: "title", label: "Titre" },
    { key: "body", label: "Texte", type: "textarea" },
  ]},
  { key: "titres", label: "Titres & appartenances", page: "Parcours", fields: [
    { key: "title", label: "Titre" },
    { key: "subtitle", label: "Mention" },
    { key: "body", label: "Texte", type: "textarea" },
  ]},
  { key: "antennes", label: "Siège & antennes", page: "Un Geste Divin", fields: [
    { key: "title", label: "Lieu" },
    { key: "body", label: "Détail", type: "textarea" },
  ]},
  { key: "presence", label: "Pays & continents", page: "Un Geste Divin", fields: [
    { key: "title", label: "Pays ou zone" },
    { key: "subtitle", label: "Région", placeholder: "Afrique, Europe, Amériques, Asie ou Océanie" },
    { key: "body", label: "Précision", type: "textarea" },
    { key: "lat", label: "Latitude (vide = position automatique)", type: "coord" },
    { key: "lng", label: "Longitude (vide = position automatique)", type: "coord" },
  ]},
  { key: "poles", label: "Pôles d'action", page: "Actions", fields: [
    { key: "image", label: "Image" },
    { key: "title", label: "Pôle" },
    { key: "body", label: "Texte", type: "textarea" },
  ]},
  { key: "realisations", label: "Réalisations", page: "Actions", fields: [
    { key: "metric", label: "Chiffre" },
    { key: "title", label: "Libellé" },
    { key: "body", label: "Détail", type: "textarea" },
  ]},
  { key: "reconnaissances", label: "Reconnaissances", page: "Reconnaissances", fields: [
    { key: "image", label: "Photo" },
    { key: "title", label: "Titre" },
    { key: "subtitle", label: "Mention" },
    { key: "body", label: "Texte", type: "textarea" },
  ]},
  { key: "institutions", label: "Institutions", page: "Réseau", fields: [
    { key: "title", label: "Institution" },
  ]},
  { key: "ambassades", label: "Ambassades", page: "Réseau", fields: [
    { key: "title", label: "Pays" },
  ]},
  { key: "partenaires", label: "Partenaires", page: "Réseau", fields: [
    { key: "title", label: "Partenaire" },
  ]},
  { key: "evenements", label: "Événements", page: "Événements", fields: [
    { key: "image", label: "Affiche" },
    { key: "status", label: "Type", type: "extra", placeholder: "Conférence, Sommet, Rencontre…" },
    { key: "title", label: "Titre" },
    { key: "body", label: "Description", type: "textarea" },
    { key: "date", label: "Date de début", type: "date" },
    { key: "end", label: "Date de fin", type: "date" },
    { key: "startTime", label: "Heure de début", type: "time" },
    { key: "endTime", label: "Heure de fin", type: "time" },
    { key: "subtitle", label: "Lieu" },
  ]},
  { key: "galerie", label: "Photos de la galerie", page: "Galerie", fields: [
    { key: "image", label: "Image" },
    { key: "subtitle", label: "Thème", placeholder: "Portrait, Terrain, Événement…" },
    { key: "title", label: "Titre" },
    { key: "body", label: "Description", type: "textarea" },
    { key: "metric", label: "Date", placeholder: "25 octobre 2026" },
    { key: "status", label: "Statut", type: "extra", placeholder: "Terminé, En cours…" },
  ]},
];

export function SiteProvider({ children }) {
  const { lang, t } = useLang();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/site")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const value = useMemo(() => {
    if (!data) return null;
    const site = lang === "en" ? localizeSite(data) : data;
    return {
      ...site,
      page: (slug) => site.pages.find((item) => item.slug === slug),
      items: (collection) => site.entries.filter((item) => item.collection === collection),
    };
  }, [data, lang]);

  if (error) {
    return (
      <div className="splash">
        <p className="kicker">{t("splashKicker")}</p>
        <h1>{t("splashTitle")}</h1>
        <p>{error}</p>
      </div>
    );
  }
  if (!value) {
    return (
      <div className="splash">
        <span className="loader" aria-hidden="true" />
        <p>{t("loading")}</p>
      </div>
    );
  }
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("Site hors contexte");
  return value;
}

export function useTitle(title) {
  const { settings } = useSite();
  useEffect(() => {
    const alias = settings.brand?.alias || "Mama Coco";
    document.title = title ? `${title} · ${alias}` : alias;
  }, [title, settings]);
}
