import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { englishNav } from "./en.js";

const LANG_KEY = "mama_coco_lang";
const LangContext = createContext(null);

const FR = {
  skip: "Aller au contenu",
  menu: "Menu",
  close: "Fermer",
  role: "Coach · Fondatrice",
  contact: "Contact",
  footerNav: "Pages du site",
  hiddenTitle: "Cette page est masquée.",
  hiddenBody: "Cette page peut être republée depuis l'administration.",
  continue: "Continuer",
  logoAlt: "Logo Un Geste Divin",
  themeDay: "Activer le mode jour",
  themeNight: "Activer le mode nuit",
  expertises: "Expertises",
  figures: "Chiffres",
  institutions: "Institutions",
  seat: "Siège social",
  phone: "Téléphone",
  email: "E-mail",
  website: "Site",
  write: "Écrire un message",
  name: "Nom",
  message: "Message",
  send: "Envoyer",
  sent: "Message envoyé. Je l'ai bien reçu.",
  emptyPhotos: "Aucune photo pour le moment.",
  discover: "Découvrir",
  photo: "Photo",
  info: "Informations",
  date: "Date",
  theme: "Thème",
  status: "Statut",
  backEvents: "Retour aux événements",
  backGallery: "Retour à la galerie",
  filterEvents: "Filtrer les événements",
  upcoming: "À venir",
  past: "Passés",
  nonePast: "Aucun événement passé pour le moment.",
  noneUpcoming: "Aucun événement à venir pour le moment.",
  details: "Détails",
  notFound: "Cette page n'existe pas.",
  missing: "Page introuvable",
  backHome: "Retour à l'accueil",
  dateTo: "au",
  hourTo: "à",
  splashKicker: "Connexion",
  splashTitle: "Le site ne peut pas joindre la base.",
  loading: "Chargement du portfolio Mama Coco…",
  langLabel: "Langue",
  langFrench: "Français",
  langEnglish: "English",
  odd: "ODD",
  adminBack: "← Retour au site",
  adminKicker: "Administration",
  adminLead: "Modifiez les textes, les photos, les pages et les messages.",
  adminPassword: "Mot de passe",
  adminShow: "Voir",
  adminHide: "Masquer",
  adminEnter: "Entrer",
  adminBrand: "Administration",
  adminDash: "Tableau de bord",
  adminIdentityNav: "Identité, photo, contact",
  adminMessages: "Messages",
  adminPages: "Textes des pages",
  adminLists: "Listes & photos",
  adminViewSite: "Voir le site",
  adminLeave: "Quitter",
  adminOpening: "Ouverture de l'administration…",
  dashTitle: "La main sur tout le site",
  dashLead: "Chaque page a ses textes. Chaque liste se complète, se modifie ou se supprime. Les photos viennent de votre ordinateur.",
  dashPages: "pages",
  dashPhotos: "photos",
  dashUnread: "messages non lus",
  dashPhoto: "Changer la photo d'accueil",
  dashPhotoSub: "Et les coordonnées",
  dashAddPhotos: "Ajouter des photos",
  dashAddSub: "Depuis l'ordinateur",
  dashRead: "Lire les messages",
  dashReadSub: "Formulaire de contact",
  pageMissing: "Page introuvable.",
  pageKicker: "Page",
  viewPage: "Voir cette page",
  menuName: "Nom dans le menu",
  menuOrder: "Ordre dans le menu",
  fieldKicker: "Surtitre",
  fieldTitle: "Titre",
  fieldSubtitle: "Sous-titre",
  fieldIntro: "Introduction",
  fieldQuote: "Citation",
  fieldQuoteAuthor: "Auteur de la citation",
  inMenu: "Visible dans le menu",
  published: "Page publiée",
  paragraphs: "Paragraphes",
  addParagraph: "Ajouter un paragraphe",
  paragraphTitle: "Titre du paragraphe",
  fieldText: "Texte",
  deleteParagraph: "Supprimer ce paragraphe",
  saving: "Enregistrement…",
  savePage: "Enregistrer la page",
  savedPage: "Page enregistrée",
  noPhoto: "Aucune photo",
  sending: "Envoi…",
  choosePhoto: "Choisir une photo",
  removePhoto: "Retirer",
  savedItem: "Élément enregistré",
  confirmDelete: "Supprimer cet élément ?",
  deletedItem: "Élément supprimé",
  visibleOnSite: "Visible sur le site",
  save: "Enregistrer",
  moveUp: "Monter",
  moveDown: "Descendre",
  deleteItem: "Supprimer",
  listMissing: "Liste introuvable.",
  add: "Ajouter",
  listLead: "Ajoutez, modifiez, réordonnez ou supprimez. Les photos se choisissent sur votre ordinateur.",
  emptyList: "Cette liste est vide.",
  addedItem: "Élément ajouté",
  newItem: "Nouvel élément",
  settingsKicker: "Réglages",
  settingsTitle: "Identité, photos, contact",
  identity: "Identité",
  fullName: "Nom complet",
  alias: "Alias",
  mark: "Initiales du logo",
  topbar: "Bandeau du haut",
  footerQuote: "Citation du pied de page",
  portraitMenu: "Nom du menu Moi",
  saveIdentity: "Enregistrer l'identité",
  mainPhotos: "Photos principales",
  headline: "Grande phrase",
  lead: "Texte sous la phrase",
  roles: "Ligne de fonctions",
  badge: "Badge",
  aside: "Mention à côté du badge",
  homePhoto: "Photo d'accueil",
  portraitPhoto: "Portrait de la page Qui suis-je",
  savePhotos: "Enregistrer les photos",
  org: "Organisation",
  address: "Adresse",
  websiteField: "Site web",
  websiteLabel: "Libellé du site",
  saveContact: "Enregistrer le contact",
  sectionTitles: "Titres des sections",
  sectionLead: "Les listes, les photos et les textes de chaque page se modifient dans le menu de gauche. Ici, ce sont les titres affichés au-dessus de ces listes.",
  saveTitles: "Enregistrer les titres",
  savedSetting: "Réglage enregistré",
  inbox: "Boîte",
  received: "Messages reçus",
  noMessages: "Aucun message pour le moment.",
  read: "Lu",
  unread: "Non lu",
  markUnread: "Marquer non lu",
  markRead: "Marquer lu",
  confirmDeleteMessage: "Supprimer ce message ?",
  deletedMessage: "Message supprimé",
  account: "Compte",
  currentPassword: "Mot de passe actuel",
  newPassword: "Nouveau mot de passe",
  update: "Mettre à jour",
  passwordChanged: "Mot de passe modifié",
  automatic: "Automatique",
};

const EN = {
  skip: "Skip to content",
  menu: "Menu",
  close: "Close",
  role: "Coach · Founder",
  contact: "Contact",
  footerNav: "Site pages",
  hiddenTitle: "This page is hidden.",
  hiddenBody: "This page can be published again from the administration.",
  continue: "Continue",
  logoAlt: "Un Geste Divin logo",
  themeDay: "Switch to day mode",
  themeNight: "Switch to night mode",
  expertises: "Expertise",
  figures: "Figures",
  institutions: "Institutions",
  seat: "Head office",
  phone: "Phone",
  email: "Email",
  website: "Website",
  write: "Write a message",
  name: "Name",
  message: "Message",
  send: "Send",
  sent: "Message sent. I have received it.",
  emptyPhotos: "No photo for the moment.",
  discover: "Discover",
  photo: "Photo",
  info: "Details",
  date: "Date",
  theme: "Theme",
  status: "Status",
  backEvents: "Back to events",
  backGallery: "Back to the gallery",
  filterEvents: "Filter events",
  upcoming: "Upcoming",
  past: "Past",
  nonePast: "No past event for the moment.",
  noneUpcoming: "No upcoming event for the moment.",
  details: "Details",
  notFound: "This page does not exist.",
  missing: "Page not found",
  backHome: "Back to home",
  dateTo: "to",
  hourTo: "to",
  splashKicker: "Connection",
  splashTitle: "The site cannot reach the database.",
  loading: "Loading Mama Coco's portfolio…",
  langLabel: "Language",
  langFrench: "Français",
  langEnglish: "English",
  odd: "SDG",
  adminBack: "← Back to the site",
  adminKicker: "Administration",
  adminLead: "Edit the texts, photos, pages and messages.",
  adminPassword: "Password",
  adminShow: "Show",
  adminHide: "Hide",
  adminEnter: "Enter",
  adminBrand: "Administration",
  adminDash: "Dashboard",
  adminIdentityNav: "Identity, photo, contact",
  adminMessages: "Messages",
  adminPages: "Page texts",
  adminLists: "Lists & photos",
  adminViewSite: "View the site",
  adminLeave: "Sign out",
  adminOpening: "Opening the administration…",
  dashTitle: "The whole site in your hands",
  dashLead: "Each page has its texts. Each list can be completed, edited or removed. Photos come from your computer.",
  dashPages: "pages",
  dashPhotos: "photos",
  dashUnread: "unread messages",
  dashPhoto: "Change the home photo",
  dashPhotoSub: "And the contact details",
  dashAddPhotos: "Add photos",
  dashAddSub: "From your computer",
  dashRead: "Read the messages",
  dashReadSub: "Contact form",
  pageMissing: "Page not found.",
  pageKicker: "Page",
  viewPage: "View this page",
  menuName: "Name in the menu",
  menuOrder: "Order in the menu",
  fieldKicker: "Kicker",
  fieldTitle: "Title",
  fieldSubtitle: "Subtitle",
  fieldIntro: "Introduction",
  fieldQuote: "Quote",
  fieldQuoteAuthor: "Quote author",
  inMenu: "Visible in the menu",
  published: "Page published",
  paragraphs: "Paragraphs",
  addParagraph: "Add a paragraph",
  paragraphTitle: "Paragraph title",
  fieldText: "Text",
  deleteParagraph: "Delete this paragraph",
  saving: "Saving…",
  savePage: "Save the page",
  savedPage: "Page saved",
  noPhoto: "No photo",
  sending: "Sending…",
  choosePhoto: "Choose a photo",
  removePhoto: "Remove",
  savedItem: "Item saved",
  confirmDelete: "Delete this item?",
  deletedItem: "Item deleted",
  visibleOnSite: "Visible on the site",
  save: "Save",
  moveUp: "Move up",
  moveDown: "Move down",
  deleteItem: "Delete",
  listMissing: "List not found.",
  add: "Add",
  listLead: "Add, edit, reorder or delete. Photos are chosen on your computer.",
  emptyList: "This list is empty.",
  addedItem: "Item added",
  newItem: "New item",
  settingsKicker: "Settings",
  settingsTitle: "Identity, photos, contact",
  identity: "Identity",
  fullName: "Full name",
  alias: "Alias",
  mark: "Logo initials",
  topbar: "Top banner",
  footerQuote: "Footer quote",
  portraitMenu: "Name of the Me menu",
  saveIdentity: "Save identity",
  mainPhotos: "Main photos",
  headline: "Main sentence",
  lead: "Text under the sentence",
  roles: "Line of roles",
  badge: "Badge",
  aside: "Note next to the badge",
  homePhoto: "Home photo",
  portraitPhoto: "Portrait on the Who I am page",
  savePhotos: "Save the photos",
  org: "Organisation",
  address: "Address",
  websiteField: "Website",
  websiteLabel: "Website label",
  saveContact: "Save contact",
  sectionTitles: "Section titles",
  sectionLead: "Lists, photos and page texts are edited in the left menu. Here are the titles shown above those lists.",
  saveTitles: "Save the titles",
  savedSetting: "Setting saved",
  inbox: "Inbox",
  received: "Messages received",
  noMessages: "No message for the moment.",
  read: "Read",
  unread: "Unread",
  markUnread: "Mark unread",
  markRead: "Mark read",
  confirmDeleteMessage: "Delete this message?",
  deletedMessage: "Message deleted",
  account: "Account",
  currentPassword: "Current password",
  newPassword: "New password",
  update: "Update",
  passwordChanged: "Password changed",
  automatic: "Automatic",
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => (localStorage.getItem(LANG_KEY) === "en" ? "en" : "fr"));

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const value = useMemo(() => {
    const table = lang === "en" ? EN : FR;
    return {
      lang,
      setLang: (next) => setLangState(next === "en" ? "en" : "fr"),
      t: (key) => table[key] || FR[key] || key,
    };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const value = useContext(LangContext);
  if (!value) return { lang: "fr", setLang() {}, t: (key) => FR[key] || key };
  return value;
}

export function LangSwitch({ className = "" }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onPointer(event) {
      if (box.current && !box.current.contains(event.target)) setOpen(false);
    }
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(next) {
    setLang(next);
    setOpen(false);
  }

  return (
    <div className={`lang-menu${className ? ` ${className}` : ""}`} ref={box}>
      <button
        type="button"
        className="theme-btn"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("langLabel")}
        onClick={() => setOpen((value) => !value)}
      >
        <GlobeIcon />
      </button>
      {open && (
        <div className="lang-pop" role="menu">
          <button type="button" role="menuitemradio" aria-checked={lang === "fr"} className={lang === "fr" ? "on" : ""} onClick={() => choose("fr")}>
            {t("langFrench")}
          </button>
          <button type="button" role="menuitemradio" aria-checked={lang === "en"} className={lang === "en" ? "on" : ""} onClick={() => choose("en")}>
            {t("langEnglish")}
          </button>
        </div>
      )}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3c2.4 2.7 3.6 5.7 3.6 9s-1.2 6.3-3.6 9c-2.4-2.7-3.6-5.7-3.6-9s1.2-6.3 3.6-9z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const COLLECTION_EN = {
  methode: { label: "Method steps", page: "Home", fields: { title: "Title", body: "Text" } },
  stats: { label: "Home figures", page: "Home", fields: { metric: "Figure", title: "Label", body: "Detail" } },
  expertises: { label: "Expertise", page: "Who I am", fields: { title: "Expertise" } },
  explorer: { label: "Explore cards", page: "Who I am", fields: { subtitle: "Kicker", title: "Title", body: "Link label", metric: "Link" } },
  coaching: { label: "Support", page: "Who I am", fields: { title: "Title", body: "Text" } },
  identite: { label: "Identity cards", page: "Who I am", fields: { title: "Title", subtitle: "Subtitle", body: "Text" } },
  parcours: { label: "Path steps", page: "Path", fields: { subtitle: "Period", title: "Title", body: "Text" } },
  titres: { label: "Titles & affiliations", page: "Path", fields: { title: "Title", subtitle: "Note", body: "Text" } },
  antennes: { label: "Office & branches", page: "Pride", fields: { title: "Place", body: "Detail" } },
  presence: {
    label: "Countries & continents",
    page: "Pride",
    fields: { title: "Country or area", subtitle: "Region", body: "Detail", lat: "Latitude (empty = automatic)", lng: "Longitude (empty = automatic)" },
    placeholders: { subtitle: "Africa, Europe, Americas, Asia or Oceania" },
  },
  poles: { label: "Areas of action", page: "Actions", fields: { image: "Image", title: "Area", body: "Text" } },
  realisations: { label: "Achievements", page: "Actions", fields: { metric: "Figure", title: "Label", body: "Detail" } },
  reconnaissances: { label: "Recognition", page: "Recognition", fields: { image: "Photo", title: "Title", subtitle: "Note", body: "Text" } },
  institutions: { label: "Institutions", page: "Network", fields: { title: "Institution" } },
  ambassades: { label: "Embassies", page: "Network", fields: { title: "Country" } },
  partenaires: { label: "Partners", page: "Network", fields: { title: "Partner" } },
  evenements: {
    label: "Events",
    page: "Events",
    fields: { image: "Poster", status: "Type", title: "Title", body: "Description", date: "Start date", end: "End date", startTime: "Start time", endTime: "End time", subtitle: "Place" },
    placeholders: { status: "Conference, Summit, Meeting…" },
  },
  galerie: {
    label: "Gallery photos",
    page: "Gallery",
    fields: { image: "Image", subtitle: "Theme", title: "Title", body: "Description", metric: "Date", status: "Status" },
    placeholders: { subtitle: "Portrait, Field, Event…", metric: "25 October 2026", status: "Finished, Ongoing…" },
  },
};

const SECTION_EN = {
  heroPrimary: "Home, main button",
  heroSecondary: "Home, secondary button",
  exchange: "Home, institutions banner",
  methodKicker: "Home, method kicker",
  methodTitle: "Home, method title",
  methodLink: "Home, link to the path",
  ctaKicker: "Home, call kicker",
  ctaTitle: "Home, call title",
  ctaButton: "Home, call button",
  coachTitle: "Who I am, support title",
  exploreTitle: "Who I am, explore title",
  exploreLink: "Who I am, gallery link",
  carryTitle: "Who I am, what I carry",
  titresKicker: "Path, titles kicker",
  titresTitle: "Path, roles title",
  antennesKicker: "Pride, office kicker",
  antennesTitle: "Pride, office title",
  presenceKicker: "Pride, map kicker",
  presenceTitle: "Pride, map title",
  actionsKicker: "Actions, kicker",
  actionsTitle: "Actions, title",
  actionPin: "Actions, badge",
  actionMore: "Actions, card button",
  impactKicker: "Actions, impact kicker",
  impactTitle: "Actions, impact title",
  writeButton: "Actions, message button",
  institutionsKicker: "Network, institutions",
  embassiesKicker: "Network, embassies",
  partnersKicker: "Network, partners",
  eventsLink: "Network, link to events",
};

export function localizeCollection(meta, lang) {
  if (!meta || lang !== "en") return meta;
  const pack = COLLECTION_EN[meta.key] || {};
  return {
    ...meta,
    label: pack.label || meta.label,
    page: pack.page || meta.page,
    fields: meta.fields.map((field) => ({
      ...field,
      label: pack.fields?.[field.key] || field.label,
      placeholder: pack.placeholders?.[field.key] || field.placeholder,
    })),
  };
}

export function sectionLabel(key, french, lang) {
  if (lang !== "en") return french;
  return SECTION_EN[key] || french;
}

export function adminPageLabel(slug, french, lang) {
  if (lang !== "en") return french;
  return englishNav(slug) || french;
}
