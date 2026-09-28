import bcrypt from "bcryptjs";
import { pool } from "./db.js";

export const pages = [
  {
    slug: "accueil",
    nav_label: "Accueil",
    nav_order: 1,
    kicker: "Fondatrice-présidente · Ambassadrice de la paix universelle",
    title: "Marie Nicaise Makamgue Djembong",
    subtitle: "alias « Mama Coco »",
    intro:
      "Je suis fondatrice-présidente de l'AISBL internationale « Un Geste Divin », coach business, coach en confiance en soi et coach matrimoniale. Je suis membre de la Fédération des Femmes pour la paix mondiale et de la Fédération des Femmes de Bruxelles. J'habite à Charleroi, en Belgique. Mon engagement humanitaire a commencé en 2006.",
    quote:
      "Ensemble, donnons le sourire aux démunis et construisons un monde plus juste, plus sûr et plus solidaire.",
    quote_author: "Mama Coco",
    blocks: [],
  },
  {
    slug: "qui-suis-je",
    nav_label: "Qui suis-je",
    nav_order: 2,
    kicker: "01 · Portrait & identité",
    title: "Ma voix transcontinentale",
    subtitle: "De Charleroi, je vais vers vingt-cinq pays d'Afrique, et au-delà.",
    intro:
      "Je suis originaire d'Afrique, établie à Charleroi, en Belgique, et de nationalité belge. Mes actions ont une envergure transcontinentale. Ancienne fonctionnaire de police et ancienne assistante sociale, je mets depuis 2006 ma force, mon réseau et mon empathie au service exclusif des femmes, des enfants et des démunis.",
    quote: "",
    quote_author: "",
    blocks: [
      {
        heading: "Mon leadership féminin panafricain",
        text: "Je suis coach business, coach en confiance en soi et coach matrimoniale. Je m'engage pour l'entrepreneuriat des femmes et pour les causes de l'autisme et de la drépanocytose. Je suis présidente des Femmes Panafricaines, fondatrice des Femmes Entrepreneuriat, de la Fondation des Enfants Autistes et de la Fondation des Drépanocytaires.",
      },
    ],
  },
  {
    slug: "racines",
    nav_label: "Racines",
    nav_order: 3,
    kicker: "02 · Ce qui a tout commencé",
    title: "Une enfance qui forge mon combat",
    subtitle: "Mes cicatrices ne sont pas une chaîne. Elles deviennent un élan.",
    intro:
      "Mon parcours ne commence pas dans les sommets. Il commence dans une maison, une famille, et une décision : transformer l'épreuve en protection pour les autres.",
    quote:
      "Les cicatrices de l'enfance ne doivent pas être des chaînes, mais le carburant de notre combat pour sauver les autres.",
    quote_author: "Marie Nicaise Makamgue Djembong",
    blocks: [
      {
        heading: "Une enfance qui forge mon combat",
        text: "Ayant grandi dans un contexte familial marqué par la polygamie, j'ai très tôt développé une acuité particulière face aux dynamiques familiales complexes. Voir ma propre mère victime de violences conjugales a été le choc émotionnel fondateur, que j'ai transformé en un combat de chaque instant pour la protection des femmes et des mères en détresse.",
      },
      {
        heading: "Une diplomatie héritée",
        text: "Fille de diplomate, j'ai hérité d'une capacité naturelle à dialoguer avec les plus hautes instances, à fédérer les peuples et à bâtir des ponts diplomatiques entre l'Afrique et l'Europe. Maman de six enfants et orpheline de père, je porte une vision globale du monde et un sens aigu des relations internationales, forgés dès le plus jeune âge.",
      },
    ],
  },
  {
    slug: "parcours",
    nav_label: "Parcours",
    nav_order: 4,
    kicker: "03 · Académique & professionnel",
    title: "De la discipline à mon engagement",
    subtitle: "Travail social, police, coaching et leadership humanitaire.",
    intro:
      "J'ai un bac +2 en travail social. J'ai servi dans la police, puis j'ai mené près de vingt ans d'action de terrain. Chaque étape m'a apporté une compétence : l'écoute, la rigueur, la protection, puis la capacité de faire grandir d'autres femmes.",
    quote: "",
    quote_author: "",
    blocks: [],
  },
  {
    slug: "aisbl",
    nav_label: "Fierté",
    nav_order: 5,
    kicker: "04 · L'association",
    title: "L'AISBL « Un Geste Divin »",
    subtitle: "Un mouvement de solidarité internationale, présent sur quatre continents.",
    intro:
      "J'ai lancé cette association humanitaire internationale en 2023. Elle a été officiellement agréée en Belgique en 2024. Elle est présente dans 25 pays d'Afrique, 6 pays d'Europe, 4 pays d'Asie et en Océanie. J'en suis la fondatrice et la présidente.",
    quote: "",
    quote_author: "",
    blocks: [
      {
        heading: "Ce que l'association pilote",
        text: "Santé et prévention, protection des femmes et des enfants, maladies spécifiques (autisme, drépanocytose), soutien aux groupes vulnérables, éducation et développement durable, autonomisation économique. Plus de 1 000 femmes en situation précaire ont été soutenues. Des forages d'eau potable ont été construits au Burkina Faso, au Ghana, en Côte d'Ivoire et en Ouganda. Deux orphelinats portent le nom de l'association au Cameroun.",
      },
    ],
  },
  {
    slug: "actions",
    nav_label: "Actions",
    nav_order: 6,
    kicker: "05 · Terrain",
    title: "Actions & impact",
    subtitle: "Des pôles concrets, des chiffres, des vies touchées.",
    intro:
      "Mon action ne se raconte pas seulement. Elle se mesure en femmes accompagnées, en puits creusés, en vivres distribués, en enfants protégés et en projets qui restent après le passage des caméras.",
    quote: "",
    quote_author: "",
    blocks: [],
  },
  {
    slug: "reconnaissances",
    nav_label: "Reconnaissances",
    nav_order: 7,
    kicker: "06 · Rayonnement",
    title: "Reconnaissances internationales",
    subtitle: "Sommets, distinctions et passages télévisés.",
    intro:
      "Panéliste et invitée d'honneur de sommets mondiaux, je porte une parole de paix et de co-développement entre l'Afrique et l'Europe. Mon engagement a été honoré par plus de dix prix.",
    quote: "",
    quote_author: "",
    blocks: [],
  },
  {
    slug: "reseau",
    nav_label: "Réseau",
    nav_order: 8,
    kicker: "07 · Institutions & alliances",
    title: "Un réseau diplomatique étendu",
    subtitle: "",
    intro: "J'interviens auprès d'institutions, d'ambassades et de partenaires.",
    quote: "",
    quote_author: "",
    blocks: [],
  },
  {
    slug: "evenements",
    nav_label: "Événements",
    nav_order: 9,
    kicker: "",
    title: "Événements",
    subtitle: "",
    intro: "Je programme les rendez-vous à venir et je garde la trace de ceux qui ont eu lieu.",
    quote: "",
    quote_author: "",
    blocks: [],
  },
  {
    slug: "galerie",
    nav_label: "Galerie",
    nav_order: 10,
    kicker: "08 · Images",
    title: "Galerie",
    subtitle: "Portraits et moments de terrain.",
    intro:
      "Mes portraits officiels et les images de ma présence.",
    quote: "",
    quote_author: "",
    blocks: [],
  },
  {
    slug: "message",
    nav_label: "Message",
    nav_order: 11,
    show_in_nav: false,
    kicker: "09 · Appel",
    title: "Mon message",
    subtitle: "",
    intro:
      "L'union fait la force. Voici les mots que je veux laisser.",
    quote:
      "N'attendez pas que le monde change de lui-même. Si la vie vous a armée à travers l'épreuve, utilisez cette force pour bâtir des refuges, creuser des puits d'eau potable, éduquer la jeunesse et guérir les âmes brisées. L'union fait la force : ensemble, donnons le sourire aux démunis et construisons un monde plus juste, plus sûr et plus solidaire.",
    quote_author: "Marie Nicaise Makamgue Djembong, alias Mama Coco",
    blocks: [],
  },
  {
    slug: "contact",
    nav_label: "Contact",
    nav_order: 12,
    kicker: "10 · Restons en lien",
    title: "Contact",
    subtitle: "Siège, téléphone, écriture.",
    intro:
      "Pour une invitation, un partenariat, un accompagnement ou un message, écrivez-moi. Je lis chaque message.",
    quote: "",
    quote_author: "",
    blocks: [],
  },
];

export const settings = {
  brand: {
    name: "Marie Nicaise Makamgue Djembong",
    alias: "Mama Coco",
    mark: "MC",
    topbar: "Ambassadrice de la paix universelle · Charleroi, Belgique",
    footerQuote:
      "Ensemble, donnons le sourire aux démunis et construisons un monde plus juste, plus sûr et plus solidaire.",
    portraitMenu: "Moi",
  },
  hero: {
    roles:
      "Coach Business · Coach en confiance en soi · Coach matrimoniale · Présidente des Femmes Panafricaines",
    headline: "Je mets ma force au service des femmes, des enfants et des démunis.",
    lead: "Fondatrice-présidente de l'AISBL Un Geste Divin. Coach business, confiance en soi et matrimoniale. Depuis 2006, à Charleroi et sur quatre continents.",
    photo: "/uploads/hero.jpg",
    portrait: "/uploads/galerie-1.jpg",
    badge: "Depuis 2006",
    aside: "Un Geste Divin",
  },
  sections: {
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
  },
  contact: {
    address: "Rue du Collège 25, 6000 Charleroi, Belgique",
    phone: "+32 472 28 50 39",
    email: "internationaleungestedivin@gmail.com",
    website: "https://www.ungestedivin.org",
    websiteLabel: "www.ungestedivin.org",
    org: "AISBL Un Geste Divin",
  },
};

function entry(collection, sort_order, data) {
  return {
    collection,
    sort_order,
    title: "",
    subtitle: "",
    body: "",
    metric: "",
    image: "",
    published: true,
    extra: {},
    ...data,
  };
}

export const entries = [
  entry("stats", 0, { metric: "20+", title: "ans d'engagement", body: "Au service des femmes, des enfants et des démunis." }),
  entry("stats", 1, { metric: "25", title: "pays d'Afrique", body: "Une présence associative transcontinentale." }),
  entry("stats", 2, { metric: "1000+", title: "femmes soutenues", body: "Femmes en situation précaire accompagnées." }),
  entry("stats", 3, { metric: "10+", title: "passages télévisés", body: "En Afrique comme en Europe." }),
  entry("stats", 4, { metric: "4", title: "continents actifs", body: "Afrique, Europe, Asie et Océanie." }),

  entry("expertises", 0, { title: "Coaching business" }),
  entry("expertises", 1, { title: "Coaching en confiance en soi" }),
  entry("expertises", 2, { title: "Coaching matrimonial" }),
  entry("expertises", 3, { title: "Leadership féminin panafricain" }),
  entry("expertises", 4, { title: "Entrepreneuriat féminin" }),
  entry("expertises", 5, { title: "Plaidoyer humanitaire international" }),
  entry("expertises", 6, { title: "Protection des femmes & des enfants" }),
  entry("expertises", 7, { title: "Gestion associative (AISBL)" }),
  entry("expertises", 8, { title: "Diplomatie & relations institutionnelles" }),
  entry("expertises", 9, { title: "Prise de parole publique & médias" }),

  entry("coaching", 0, {
    title: "Coach business",
    body: "Accompagnement de femmes entrepreneures dans le lancement et la structuration de leur activité.",
  }),
  entry("coaching", 1, {
    title: "Coach en confiance en soi",
    body: "Accompagnement personnel et prise de parole des femmes leaders.",
  }),
  entry("coaching", 2, {
    title: "Coach matrimoniale",
    body: "Accompagnement des couples et des familles.",
  }),

  entry("methode", 0, {
    title: "Écouter",
    body: "Mon épreuve devient une attention concrète pour les femmes et les enfants.",
  }),
  entry("methode", 1, {
    title: "Protéger",
    body: "J'ai été policière et assistante sociale, puis j'ai mené vingt ans d'action auprès des plus exposés.",
  }),
  entry("methode", 2, {
    title: "Rendre autonome",
    body: "Je propose le coaching business, la confiance en soi, l'entrepreneuriat et des formations de proximité.",
  }),
  entry("methode", 3, {
    title: "Relier",
    body: "Mon association est présente en Afrique, en Europe, en Asie et en Océanie.",
  }),

  entry("explorer", 0, {
    subtitle: "Racines",
    title: "Mon épreuve devenue combat",
    body: "Lire le récit →",
    metric: "/racines",
  }),
  entry("explorer", 1, {
    subtitle: "Association",
    title: "Un Geste Divin, sur quatre continents",
    body: "Voir la présence →",
    metric: "/un-geste-divin",
  }),
  entry("explorer", 2, {
    subtitle: "Impact",
    title: "Femmes, eau, orphelinats, écoles",
    body: "Voir les actions →",
    metric: "/actions",
  }),

  entry("identite", 0, {
    title: "Je suis originaire d'Afrique",
    subtitle: "Nationalité belge",
    body: "Je suis établie à Charleroi. Mes actions ont une envergure transcontinentale.",
  }),
  entry("identite", 1, {
    title: "Je suis maman de 6 enfants",
    subtitle: "Orpheline de père",
    body: "Je porte une vision globale du monde et un sens aigu de la diplomatie, forgés dès le plus jeune âge.",
  }),
  entry("identite", 2, {
    title: "J'ai été fonctionnaire de police",
    subtitle: "Sens de la protection",
    body: "Ce parcours rigoureux m'a donné le sens de l'autorité, de la protection des citoyens et de la justice sociale.",
  }),
  entry("identite", 3, {
    title: "Fondatrice-présidente",
    subtitle: "AISBL Un Geste Divin",
    body: "J'ai lancé cette association internationale en 2023. Elle a été officiellement agréée en Belgique en 2024.",
  }),

  entry("parcours", 0, {
    subtitle: "Formation",
    title: "Bac +2 en travail social",
    body: "J'ai été assistante sociale au Tchad, auprès des femmes victimes de violences conjugales et des enfants victimes de viol.",
  }),
  entry("parcours", 1, {
    subtitle: "Protection",
    title: "Ancienne fonctionnaire de police",
    body: "J'y ai appris la rigueur, la résistance psychologique et une connaissance fine des enjeux de sécurité des populations vulnérables.",
  }),
  entry("parcours", 2, {
    subtitle: "Depuis 2006",
    title: "Engagement humanitaire de terrain",
    body: "Je mets ma force, mon réseau et mon empathie au service exclusif des démunis. J'ai distribué des tonnes de vivres et de matériel aux orphelinats, aux camps de déplacés et aux femmes battues.",
  }),
  entry("parcours", 3, {
    subtitle: "Accompagnement",
    title: "Coaching & prise de parole",
    body: "Je suis coach business, coach en confiance en soi et coach matrimoniale : lancer une activité, habiter sa voix, accompagner couples et familles.",
  }),
  entry("parcours", 4, {
    subtitle: "Lettres & arts",
    title: "Poétesse, autrice, scène",
    body: "Je suis autrice de plusieurs publications, active en comédie et en chant sur les plateformes numériques. Je suis membre de la CAAD, Caravane des Auteurs Africains de la Diaspora.",
  }),
  entry("parcours", 5, {
    subtitle: "Excellence",
    title: "Doctorat & certifications",
    body: "J'ai obtenu un doctorat à United American University for Leadership and Excellence. Plusieurs certifications professionnelles internationales renforcent mon expertise et ma crédibilité.",
  }),

  entry("titres", 0, { title: "Présidente des Femmes Panafricaines", body: "Leadership féminin et voix collective à l'échelle du continent et de la diaspora." }),
  entry("titres", 1, { title: "Fondatrice des Femmes Entrepreneuriat", body: "Autonomisation économique des femmes et structuration de leurs activités." }),
  entry("titres", 2, { title: "Fondation des Enfants Autistes", body: "Fondatrice. Sensibilisation, prise en charge et dignité des enfants autistes." }),
  entry("titres", 3, { title: "Fondation des Drépanocytaires", body: "Fondatrice. Plaidoyer et soutien autour de la drépanocytose." }),
  entry("titres", 4, { title: "Fédération des Femmes des USA", body: "Membre reconnue au sein d'un mouvement féminin international." }),
  entry("titres", 5, { title: "CAAD", body: "Membre de la Caravane des Auteurs Africains de la Diaspora, réseau littéraire et culturel panafricain." }),
  entry("titres", 6, { title: "Marrainages", body: "Je suis marraine de plusieurs initiatives et causes humanitaires. Je prête ma voix aux populations vulnérables." }),
  entry("titres", 7, { title: "Langue de travail", subtitle: "Français", body: "Le français est la langue de mes interventions, de mes écrits et de la vie de mon association." }),

  entry("antennes", 0, { title: "Siège social", body: "Rue du Collège 25, 6000 Charleroi, Belgique" }),
  entry("antennes", 1, { title: "Locaux en Belgique", body: "Charleroi, Liège, Bruxelles" }),
  entry("antennes", 2, { title: "Représentations internationales", body: "États-Unis, Royaume-Uni, Allemagne" }),

  ...[
    "Cameroun", "RD Congo", "Congo-Brazzaville", "Tchad", "Gabon", "Centrafrique", "Rwanda", "Kenya",
    "Éthiopie", "Ouganda", "Burundi", "Togo", "Ghana", "Burkina Faso", "Côte d'Ivoire", "Guinée équatoriale",
    "Bénin", "Sénégal", "Cap-Vert", "Madagascar", "Maroc", "Algérie",
  ].map((title, i) => entry("presence", i, { title, subtitle: "Afrique" })),
  ...["Belgique", "France", "Allemagne", "Suisse", "Espagne", "Italie"].map((title, i) =>
    entry("presence", 100 + i, { title, subtitle: "Europe" })
  ),
  entry("presence", 200, { title: "Canada", subtitle: "Amériques", body: "Je cite le Canada parmi les pays de mon réseau international." }),
  entry("presence", 300, {
    title: "4 pays d'Asie",
    subtitle: "Asie",
    body: "J'y ai un réseau de bénévoles, de partenaires et de représentants.",
  }),
  entry("presence", 301, {
    title: "Océanie",
    subtitle: "Océanie",
    body: "J'y commence une présence.",
  }),

  entry("poles", 0, { title: "Santé & prévention", body: "Je soutiens des hôpitaux et des centres de santé en zones rurales, et je mène des actions de santé publique de proximité.", extra: { odds: [3] } }),
  entry("poles", 1, { title: "Protection des femmes & enfants", body: "Je lutte contre les violences faites aux femmes, les viols, le harcèlement et les discriminations.", extra: { odds: [5, 16] } }),
  entry("poles", 2, { title: "Maladies spécifiques", body: "Je prends en charge et je sensibilise autour des enfants autistes et des malades de la drépanocytose.", extra: { odds: [3, 10] } }),
  entry("poles", 3, { title: "Groupes vulnérables", body: "Je soutiens les orphelins, les veuves, les personnes âgées, les personnes en situation de handicap, les déplacés de guerre et les sans-abris.", extra: { odds: [1, 10] } }),
  entry("poles", 4, { title: "Éducation & développement durable", body: "Je fais construire des écoles et je réalise des forages d'eau potable au Ghana, au Burkina Faso, en Ouganda et en Côte d'Ivoire.", extra: { odds: [4, 6] } }),
  entry("poles", 5, { title: "Autonomisation & lutte contre l'exil", body: "Je propose des formations gratuites (artisanat, arts) et l'entrepreneuriat local, pour offrir une alternative à l'exil périlleux de la jeunesse.", extra: { odds: [4, 8] } }),

  entry("realisations", 0, { metric: "1000+", title: "femmes soutenues", body: "Femmes en situation précaire que j'accompagne avec mon association et mon réseau.", extra: { odds: [1, 5] } }),
  entry("realisations", 1, { metric: "Forages", title: "accès à l'eau potable", body: "Burkina Faso, Ghana, Côte d'Ivoire, Ouganda.", extra: { odds: [6] } }),
  entry("realisations", 2, { metric: "2", title: "orphelinats", body: "Deux orphelinats portant le nom de mon association, au Cameroun.", extra: { odds: [1, 4] } }),
  entry("realisations", 3, { metric: "Tonnes", title: "de vivres distribués", body: "Orphelinats, camps de déplacés et femmes battues.", extra: { odds: [2] } }),
  entry("realisations", 4, { metric: "25", title: "pays d'Afrique", body: "Et une présence en Europe, en Asie et en Océanie.", extra: { odds: [17] } }),
  entry("realisations", 5, { metric: "10+", title: "prix & passages TV", body: "Plus de dix prix pour mon dévouement humanitaire, et plus de dix passages télévisés.", extra: { odds: [17] } }),

  entry("reconnaissances", 0, { title: "Forum REPATS", subtitle: "Panéliste", body: "J'ai été invitée d'honneur et panéliste de sommets mondiaux, dont le Forum REPATS." }),
  entry("reconnaissances", 1, { title: "Trophées des Leaders", subtitle: "Candidate", body: "J'ai été candidate dans la catégorie Femme Leader." }),
  entry("reconnaissances", 2, { title: "Plus de 10 prix", subtitle: "Dévouement humanitaire", body: "J'ai été honorée pour un engagement transcontinental de longue haleine." }),
  entry("reconnaissances", 3, { title: "Porte-voix de la paix", subtitle: "Afrique et Europe", body: "Je m'engage pour une synergie de respect mutuel, de responsabilité partagée et de co-développement." }),
  entry("reconnaissances", 4, { title: "Reconnaissance médiatique", subtitle: "10+ passages", body: "Plus de dix passages télévisés ont relayé mon engagement, en Afrique comme en Europe." }),

  entry("institutions", 0, { title: "Maison Blanche" }),
  entry("institutions", 1, { title: "Organisation des Nations Unies" }),
  entry("institutions", 2, { title: "Commission européenne" }),
  entry("institutions", 3, { title: "UNESCO" }),
  entry("institutions", 4, { title: "Parlement européen" }),
  entry("institutions", 5, { title: "Union africaine" }),
  entry("institutions", 6, { title: "Sénat de Belgique" }),

  ...[
    "Togo", "Burkina Faso", "RD Congo", "Congo-Brazzaville", "Tchad", "Sénégal", "Mali", "Burundi",
    "France", "Cameroun", "États-Unis", "Bénin", "Centrafrique", "Gabon", "Côte d'Ivoire", "Ghana", "Nigéria",
  ].map((title, i) => entry("ambassades", i, { title })),

  entry("partenaires", 0, { title: "Sénat (France)" }),
  entry("partenaires", 1, { title: "Parlement (Luxembourg)" }),
  entry("partenaires", 2, { title: "Milieu universitaire" }),
  entry("partenaires", 3, { title: "Fédération Nationale des Champions de France" }),
  entry("partenaires", 4, { title: "Palais des Congrès (Cameroun)" }),
  entry("partenaires", 5, { title: "Palais résidentiel (Burkina Faso, Côte d'Ivoire)" }),

  entry("evenements", 0, {
    title: "Journée Mondiale du Sommet des Associations",
    subtitle: "Charleroi, Belgique",
    body: "Je l'organise avec l'AISBL Un Geste Divin. Un rendez-vous pour les associations, les partenaires et les voix qui construisent la solidarité.",
    extra: { date: "2026-11-20", end: "2026-11-21", status: "Sommet" },
  }),

  entry("galerie", 0, {
    title: "Portrait officiel",
    subtitle: "Portrait",
    body: "Mon portrait officiel, alias Mama Coco.",
    image: "/uploads/hero.jpg",
  }),
  entry("galerie", 1, {
    title: "Tenue de lumière",
    subtitle: "Présence",
    body: "Présence, héritage et leadership panafricain.",
    image: "/uploads/galerie-1.jpg",
  }),
];

export async function seedIfEmpty() {
  const existing = await pool.query("SELECT COUNT(*)::int AS n FROM pages");
  if (existing.rows[0].n > 0) return;

  const email = (process.env.ADMIN_EMAIL || "admin@ungestedivin.org").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "MamaCoco2026";
  const hash = await bcrypt.hash(password, 10);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO admins (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [email, hash]
    );
    for (const [key, value] of Object.entries(settings)) {
      await client.query(
        `INSERT INTO settings (key, value) VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO NOTHING`,
        [key, JSON.stringify(value)]
      );
    }
    for (const page of pages) {
      await client.query(
        `INSERT INTO pages
          (slug, nav_label, nav_order, kicker, title, subtitle, intro, quote, quote_author, blocks, show_in_nav)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11)`,
        [
          page.slug,
          page.nav_label,
          page.nav_order,
          page.kicker,
          page.title,
          page.subtitle,
          page.intro,
          page.quote,
          page.quote_author,
          JSON.stringify(page.blocks),
          page.show_in_nav !== false,
        ]
      );
    }
    for (const item of entries) {
      await client.query(
        `INSERT INTO entries
          (collection, title, subtitle, body, metric, image, sort_order, published, extra)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb)`,
        [
          item.collection,
          item.title,
          item.subtitle,
          item.body,
          item.metric,
          item.image,
          item.sort_order,
          item.published,
          JSON.stringify(item.extra || {}),
        ]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
