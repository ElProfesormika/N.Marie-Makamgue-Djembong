import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "./api.js";
import { Blocks, Continue, PageHero, Quote } from "./components.jsx";
import { PresenceGlobe } from "./globe.jsx";
import { InstitutionLogo, shortInstitution } from "./logos.jsx";
import { locate } from "./places.js";
import { REGIONS, sectionCopy, useSite, useTitle } from "./site.jsx";

export function HomePage() {
  const { page, items, settings } = useSite();
  const current = page("accueil");
  const hero = settings.hero || {};
  const brand = settings.brand || {};
  useTitle(brand.name || "Accueil");

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      });
    }, { threshold: 0.16 });
    nodes.forEach((node) => observer.observe(node));
    const fallback = window.setTimeout(() => {
      nodes.forEach((node) => node.classList.add("in"));
    }, 1400);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  if (!current) return <PageHero page={null} />;

  const expertises = items("expertises");
  const rail = expertises.slice(0, 5);
  const steps = items("methode");
  const copy = sectionCopy(settings);
  const institutions = items("institutions");
  const headline = hero.headline || "Je mets ma force au service des femmes, des enfants et des démunis.";
  const lead = hero.lead || current.intro;
  const highlight = "femmes, des enfants et des démunis";
  const cut = headline.toLowerCase().indexOf(highlight);

  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy rise">
          <p className="pill">{[hero.badge || "Depuis 2006", hero.aside || "Un Geste Divin"].filter(Boolean).join(" · ")}</p>
          <p className="identity">{current.title}, {brand.alias || current.subtitle}</p>
          <h1>
            {cut >= 0 ? (
              <>
                {headline.slice(0, cut)}
                <span className="shine">{headline.slice(cut, cut + highlight.length)}</span>
                {headline.slice(cut + highlight.length)}
              </>
            ) : headline}
          </h1>
          <p className="intro">{lead}</p>
          {hero.roles && <p className="roles">{hero.roles}</p>}
          <div className="hero-actions">
            <Link className="btn btn-dark" to="/actions">{copy.heroPrimary} <span aria-hidden="true">→</span></Link>
            <Link className="btn btn-line" to="/contact">{copy.heroSecondary}</Link>
          </div>
        </div>
        <figure className="portrait-round rise rise-late">
          <img src={hero.photo} alt={current.title} />
        </figure>
      </section>

      {rail.length > 0 && (
        <section className="wrap rail" aria-label="Expertises">
          {rail.map((item) => (
            <span key={item.id}>{item.title}</span>
          ))}
        </section>
      )}

      <section className="wrap stats" aria-label="Chiffres">
        {items("stats").map((item) => (
          <article className="stat" key={item.id}>
            <strong>{item.metric}</strong>
            <h2>{item.title}</h2>
          </article>
        ))}
      </section>

      {institutions.length > 0 && (
        <section className="marquee" aria-label="Institutions">
          <p>{copy.exchange}</p>
          <div className="marquee-window">
            <div className="marquee-track">
              {[...institutions, ...institutions].map((item, index) => (
                <div className="logo-card" key={`${item.id}-${index}`}>
                  <InstitutionLogo name={item.title} />
                  <strong>{shortInstitution(item.title)}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {steps.length > 0 && (
        <section className="wrap section reveal">
          <div className="section-head">
            <div>
              <p className="kicker">{copy.methodKicker}</p>
              <h2>{copy.methodTitle}</h2>
            </div>
            <Link to="/parcours">{copy.methodLink}</Link>
          </div>
          <div className="steps">
            {steps.map((item, index) => (
              <article key={item.id}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <h3>{item.title}</h3>
                {item.body && <p>{item.body}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="wrap section">
        <div className="cta-band">
          <div>
            <p className="kicker">{copy.ctaKicker}</p>
            <h2>{copy.ctaTitle}</h2>
          </div>
          <Link className="btn btn-dark" to="/contact">{copy.ctaButton}</Link>
        </div>
      </section>
    </>
  );
}

export function IdentityPage() {
  const { page, items, settings } = useSite();
  const current = page("qui-suis-je");
  const copy = sectionCopy(settings);
  useTitle("Qui suis-je");
  if (!current) return <PageHero page={null} />;
  return (
    <article className="page">
      <PageHero page={current} />
      <section className="wrap cards two identity reveal">
        <div className="cards">
          {items("identite").map((item) => (
            <article className="card" key={item.id}>
              <p className="kicker">{item.subtitle}</p>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <figure className="portrait portrait-soft">
          <img src={settings.hero?.portrait} alt="Mon portrait" />
        </figure>
      </section>
      <section className="wrap section reveal">
        <Blocks blocks={current.blocks} />
      </section>
      {items("coaching").length > 0 && (
        <section className="wrap section reveal">
          <div className="coach-band">
            <h2>{copy.coachTitle}</h2>
            <div className="coach-grid">
              {items("coaching").map((item, index) => (
                <article key={item.id}>
                  <b>0{index + 1}</b>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="wrap section reveal">
        <div className="section-head">
          <h2 className="explore-title">{copy.exploreTitle}</h2>
          <Link to="/galerie">{copy.exploreLink}</Link>
        </div>
        <div className="explore-grid">
          {items("explorer").map((item) => (
            <Link key={item.id} to={String(item.metric || "").startsWith("/") ? item.metric : "/"}>
              {item.subtitle && <p className="kicker">{item.subtitle}</p>}
              <h3>{item.title}</h3>
              {item.body && <span>{item.body}</span>}
            </Link>
          ))}
        </div>
      </section>
      {items("expertises").length > 0 && (
        <section className="wrap section carry reveal">
          <div className="carry-panel">
            <h2>{copy.carryTitle}</h2>
            <div className="carry-grid">
              {items("expertises").map((item) => (
                <article key={item.id}>{item.title}</article>
              ))}
            </div>
          </div>
        </section>
      )}
      <Continue path="/qui-suis-je" />
    </article>
  );
}

export function RootsPage() {
  const { page, settings } = useSite();
  const current = page("racines");
  const hero = settings.hero || {};
  useTitle("Racines");
  if (!current) return <PageHero page={null} />;
  return (
    <article className="page">
      <PageHero page={current} />
      <section className="wrap roots reveal">
        <Blocks blocks={current.blocks} />
        <figure className="portrait portrait-soft">
          <img src={hero.photo} alt="Marie Nicaise Makamgue Djembong" />
        </figure>
      </section>
      <section className="wrap reveal">
        <Quote text={current.quote} author={current.quote_author} />
      </section>
      <Continue path="/racines" />
    </article>
  );
}

export function JourneyPage() {
  const { page, items, settings } = useSite();
  const current = page("parcours");
  const copy = sectionCopy(settings);
  useTitle("Parcours");
  if (!current) return <PageHero page={null} />;
  return (
    <article className="page">
      <PageHero page={current} />
      <section className="wrap section reveal">
        <ol className="timeline">
          {items("parcours").map((item, index) => (
            <li key={item.id}>
              <span className="tl-node">{String(index + 1).padStart(2, "0")}</span>
              <article className="tl-card">
                {item.subtitle && <p className="kicker">{item.subtitle}</p>}
                <h2>{item.title}</h2>
                {item.body && <p>{item.body}</p>}
              </article>
            </li>
          ))}
        </ol>
      </section>
      <section className="wrap section">
        <p className="kicker">{copy.titresKicker}</p>
        <h2 className="section-title">{copy.titresTitle}</h2>
        <div className="cards three">
          {items("titres").map((item) => (
            <article className="card" key={item.id}>
              {item.subtitle && <p className="kicker">{item.subtitle}</p>}
              <h3>{item.title}</h3>
              {item.body && <p>{item.body}</p>}
            </article>
          ))}
        </div>
      </section>
      <Continue path="/parcours" />
    </article>
  );
}

export function AssociationPage() {
  const { page, items, settings } = useSite();
  const current = page("aisbl");
  const copy = sectionCopy(settings);
  const presence = items("presence");
  const [activeId, setActiveId] = useState(null);
  useTitle("Un Geste Divin");
  if (!current) return <PageHero page={null} />;
  const located = presence.map((item) => ({ item, point: locate(item) }));
  const regions = [
    ...REGIONS.filter((name) => presence.some((item) => item.subtitle === name)),
    ...[...new Set(presence.map((item) => item.subtitle).filter((name) => name && !REGIONS.includes(name)))],
  ];
  const active = located.find((entry) => entry.item.id === activeId) || null;
  const markers = located
    .filter((entry) => entry.point)
    .map((entry) => ({
      location: [entry.point.lat, entry.point.lng],
      size: entry.item.id === activeId ? 0.1 : 0.055,
      color: entry.item.id === activeId ? [0.95, 0.78, 0.25] : undefined,
    }));
  return (
    <article className="page">
      <PageHero page={current} />
      <section className="wrap section reveal">
        <Blocks blocks={current.blocks} />
      </section>
      <section className="wrap section reveal">
        <p className="kicker">{copy.antennesKicker}</p>
        <h2 className="section-title">{copy.antennesTitle}</h2>
        <div className="cards three">
          {items("antennes").map((item) => (
            <article className="card" key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap section">
        <p className="kicker">{copy.presenceKicker}</p>
        <h2 className="section-title">{copy.presenceTitle}</h2>
        <div className="presence-layout">
          <div className="globe-stage">
            <PresenceGlobe markers={markers} focus={active?.point || null} />
            {active && <p className="globe-caption">{active.item.title}</p>}
          </div>
          <div className="presence-legend">
            {regions.map((region) => {
              const list = located.filter((entry) => entry.item.subtitle === region);
              return (
                <article key={region}>
                  <h3>{region}</h3>
                  <div className="presence-names">
                    {list.map(({ item, point }) => (
                      <button
                        key={item.id}
                        type="button"
                        className={item.id === activeId ? "on" : ""}
                        onClick={() => setActiveId(item.id === activeId ? null : item.id)}
                      >
                        {point ? <i /> : null}
                        {item.title}
                      </button>
                    ))}
                  </div>
                  {list.filter(({ item }) => item.body).map(({ item }) => (
                    item.id === activeId || !locate(item) ? <p key={`${item.id}-body`}>{item.body}</p> : null
                  ))}
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <Continue path="/un-geste-divin" />
    </article>
  );
}

export function ActionsPage() {
  const { page, items, settings } = useSite();
  const current = page("actions");
  const copy = sectionCopy(settings);
  const letter = page("message");
  const poles = items("poles");
  const [open, setOpen] = useState(null);
  useTitle("Actions & impact");

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!current) return <PageHero page={null} />;

  return (
    <article className="page">
      <PageHero page={current} />
      <section className="wrap section">
        <div className="section-head">
          <div>
            <p className="kicker">{copy.actionsKicker}</p>
            <h2 className="section-title">{copy.actionsTitle}</h2>
          </div>
        </div>
        <div className="action-grid">
          {poles.map((item) => (
              <article className="action-card" key={item.id}>
                <div className="action-banner">
                  {item.image && <img src={item.image} alt="" />}
                  <span className="action-pin">{copy.actionPin}</span>
                </div>
                <div className="action-copy">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <button className="btn btn-dark action-open" type="button" onClick={() => setOpen(item)}>
                    {copy.actionMore}
                  </button>
                </div>
              </article>
            ))}
        </div>
      </section>
      <section className="wrap section">
        <p className="kicker">{copy.impactKicker}</p>
        <h2 className="section-title">{copy.impactTitle}</h2>
        <div className="stats">
          {items("realisations").map((item) => (
            <article className="card stat" key={item.id}>
              <strong>{item.metric}</strong>
              <h2>{item.title}</h2>
              {item.body && <p>{item.body}</p>}
            </article>
          ))}
        </div>
      </section>
      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={open.title} onClick={() => setOpen(null)}>
          <div className="action-sheet" onClick={(event) => event.stopPropagation()}>
            <button className="sheet-close" type="button" onClick={() => setOpen(null)} aria-label="Fermer">Fermer</button>
            <div className="action-banner sheet-banner">
              {open.image && <img src={open.image} alt="" />}
              <span className="action-pin">{copy.actionPin}</span>
            </div>
            <div className="sheet-body">
              <h2>{open.title}</h2>
              <p>{open.body}</p>
            </div>
          </div>
        </div>
      )}
      {letter && (letter.quote || letter.intro) && (
        <section className="wrap section message-band">
          <p className="kicker">{letter.title || "Mon message"}</p>
          <Quote text={letter.quote} author={letter.quote_author} />
          {letter.intro && <p className="intro">{letter.intro}</p>}
          {letter.blocks?.length > 0 && <Blocks blocks={letter.blocks} />}
          <Link className="btn btn-dark" to="/contact">{copy.writeButton}</Link>
        </section>
      )}
      <Continue path="/actions" />
    </article>
  );
}

export function AwardsPage() {
  const { page, items } = useSite();
  const current = page("reconnaissances");
  useTitle("Reconnaissances");
  if (!current) return <PageHero page={null} />;
  return (
    <article className="page">
      <PageHero page={current} />
      <section className="wrap section cards two reveal">
        {items("reconnaissances").map((item) => (
          <article className="card award" key={item.id}>
            {item.image && <img className="award-photo" src={item.image} alt="" />}
            {item.subtitle && <p className="kicker">{item.subtitle}</p>}
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>
      <Continue path="/reconnaissances" />
    </article>
  );
}

export function NetworkPage() {
  const { page, items, settings } = useSite();
  const current = page("reseau");
  const copy = sectionCopy(settings);
  useTitle("Réseau");
  if (!current) return <PageHero page={null} />;
  const institutions = items("institutions");
  const embassies = items("ambassades");
  const partners = items("partenaires");
  return (
    <article className="page">
      <PageHero page={current} />
      <section className="wrap network">
        <div className="network-meter" aria-label="Aperçu du réseau">
          <p><strong>{institutions.length}</strong> institutions</p>
          <p><strong>{embassies.length}</strong> ambassades</p>
          <p><strong>{partners.length}</strong> partenaires</p>
        </div>
        <section className="network-panel">
          <p className="kicker">{copy.institutionsKicker}</p>
          <div className="network-logos">
            {institutions.map((item) => (
              <article key={item.id}>
                <InstitutionLogo name={item.title} />
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>
        </section>
        <div className="network-split">
          <section className="directory">
            <header>
              <p className="kicker">{copy.embassiesKicker}</p>
              <strong>{embassies.length}</strong>
            </header>
            <ul>
              {embassies.map((item) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
          </section>
          <section className="directory">
            <header>
              <p className="kicker">{copy.partnersKicker}</p>
              <strong>{partners.length}</strong>
            </header>
            <ul className="directory-stack">
              {partners.map((item) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
          </section>
        </div>
        <p className="network-next"><Link to="/evenements">{copy.eventsLink}</Link></p>
      </section>
      <Continue path="/reseau" />
    </article>
  );
}

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function eventStart(item) {
  return item.extra?.date || "";
}

function eventFinish(item) {
  return item.extra?.end || item.extra?.date || "";
}

function formatEventDate(start, end) {
  if (!start) return "";
  const long = (iso) => new Intl.DateTimeFormat("fr-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));
  if (!end || end === start) return long(start);
  return `${long(start)} au ${long(end)}`;
}

function formatHours(start, end) {
  if (start && end) return `${start} à ${end}`;
  return start || end || "";
}

function EventIcon({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true };
  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4.5l3 2" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg {...common}>
        <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function EventFacts({ item }) {
  const when = formatEventDate(eventStart(item), item.extra?.end || "");
  const hours = formatHours(item.extra?.startTime || "", item.extra?.endTime || "");
  return (
    <ul className="event-meta">
      {when && <li><EventIcon name="date" /><span>{when}</span></li>}
      {hours && <li><EventIcon name="clock" /><span>{hours}</span></li>}
      {item.subtitle && <li><EventIcon name="pin" /><span>{item.subtitle}</span></li>}
    </ul>
  );
}

function EventPoster({ item }) {
  const kind = item.extra?.status || "";
  return (
    <div className="event-poster">
      {item.image ? <img src={item.image} alt="" /> : <div className="event-fallback" />}
      {kind && <span className="event-badge">{kind}</span>}
    </div>
  );
}

function EventCard({ item, onOpen }) {
  return (
    <article className="event-card">
      <EventPoster item={item} />
      <div className="event-copy">
        <h3>{item.title}</h3>
        {item.body && <p className="event-excerpt">{item.body}</p>}
        <EventFacts item={item} />
        <div className="event-actions">
          <button className="event-details" type="button" onClick={() => onOpen(item)}>Détails</button>
        </div>
      </div>
    </article>
  );
}

export function EventsPage() {
  const { page, items } = useSite();
  const current = page("evenements");
  const [filter, setFilter] = useState("upcoming");
  const [open, setOpen] = useState(null);
  useTitle("Événements");

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!current) return <PageHero page={null} />;
  const today = todayKey();
  const events = items("evenements");
  const upcoming = events
    .filter((item) => !eventFinish(item) || eventFinish(item) >= today)
    .sort((a, b) => eventStart(a).localeCompare(eventStart(b)));
  const past = events
    .filter((item) => eventFinish(item) && eventFinish(item) < today)
    .sort((a, b) => eventStart(b).localeCompare(eventStart(a)));
  const shown = filter === "past" ? past : upcoming;

  return (
    <article className="page">
      <PageHero page={current} />
      {open ? (
        <section className="wrap section event-view">
          <button className="project-back" type="button" onClick={() => setOpen(null)}>Retour aux événements</button>
          <EventPoster item={open} />
          <h2>{open.title}</h2>
          <EventFacts item={open} />
          {open.body && <p className="event-full">{open.body}</p>}
        </section>
      ) : (
        <section className="wrap section">
          <div className="event-filters" role="tablist" aria-label="Filtrer les événements">
            <button type="button" role="tab" aria-selected={filter === "upcoming"} className={filter === "upcoming" ? "on" : ""} onClick={() => setFilter("upcoming")}>
              À venir
            </button>
            <button type="button" role="tab" aria-selected={filter === "past"} className={filter === "past" ? "on" : ""} onClick={() => setFilter("past")}>
              Passés
            </button>
          </div>
          {shown.length === 0 && (
            <p className="intro">{filter === "past" ? "Aucun événement passé pour le moment." : "Aucun événement à venir pour le moment."}</p>
          )}
          <div className="event-grid">
            {shown.map((item) => <EventCard key={item.id} item={item} onOpen={setOpen} />)}
          </div>
        </section>
      )}
      <Continue path="/evenements" />
    </article>
  );
}

export function GalleryPage() {
  const { page, items } = useSite();
  const current = page("galerie");
  const photos = items("galerie");
  const [open, setOpen] = useState(null);
  useTitle("Galerie");

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!current) return <PageHero page={null} />;
  const status = open?.extra?.status || "";

  return (
    <article className="page">
      <PageHero page={current} />
      {open ? (
        <section className="wrap section project-view">
          <button className="project-back" type="button" onClick={() => setOpen(null)}>Retour à la galerie</button>
          {open.subtitle && <p className="project-theme">{open.subtitle}</p>}
          <h2>{open.title}</h2>
          {open.body && <p className="project-lead">{open.body}</p>}
          {open.image && (
            <figure className="project-frame">
              <img src={open.image} alt={open.title || "Photo"} />
            </figure>
          )}
          <div className="project-facts">
            {(open.metric || open.subtitle || status) && (
              <article className="card">
                <h3>Informations</h3>
                {open.metric && <p>Date : {open.metric}</p>}
                {open.subtitle && <p>Thème : {open.subtitle}</p>}
                {status && <p>Statut : {status}</p>}
              </article>
            )}
            {open.body && (
              <article className="card">
                <h3>Description</h3>
                <p>{open.body}</p>
              </article>
            )}
          </div>
        </section>
      ) : (
        <section className="wrap section">
          {photos.length === 0 && <p className="intro">Aucune photo pour le moment.</p>}
          <div className="project-grid">
            {photos.map((item) => (
              <article className="project-card" key={item.id}>
                <div className="project-visual">
                  {item.image && <img src={item.image} alt={item.title || "Photo"} />}
                  {item.subtitle && <span className="project-pill">{item.subtitle}</span>}
                  {item.extra?.status && <span className="project-state">{item.extra.status}</span>}
                </div>
                <div className="project-copy">
                  <h3>{item.title}</h3>
                  {item.body && <p>{item.body}</p>}
                  {item.metric && <p className="project-date">{item.metric}</p>}
                  <button className="project-more" type="button" onClick={() => setOpen(item)}>Découvrir</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      <Continue path="/galerie" />
    </article>
  );
}

export function ContactPage() {
  const { page, settings } = useSite();
  const current = page("contact");
  const contact = settings.contact || {};
  const [form, setForm] = useState({ name: "", email: "", phone: "", body: "", company: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  useTitle("Contact");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setStatus("");
    try {
      await api("/api/contact", { method: "POST", body: form });
      setForm({ name: "", email: "", phone: "", body: "", company: "" });
      setStatus("Message envoyé. Je l'ai bien reçu.");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!current) return <PageHero page={null} />;
  return (
    <article className="page">
      <PageHero page={current} />
      <section className="wrap section contact-grid">
        <div className="cards">
          <article className="card">
            <p className="kicker">{contact.org}</p>
            <h2>Siège social</h2>
            <p>{contact.address}</p>
          </article>
          <article className="card">
            <p className="kicker">Téléphone</p>
            <h2><a href={`tel:${(contact.phone || "").replace(/\s/g, "")}`}>{contact.phone}</a></h2>
          </article>
          <article className="card">
            <p className="kicker">E-mail</p>
            <h2><a href={`mailto:${contact.email}`}>{contact.email}</a></h2>
          </article>
          <article className="card">
            <p className="kicker">Site</p>
            <h2><a href={contact.website} target="_blank" rel="noreferrer">{contact.websiteLabel}</a></h2>
          </article>
        </div>
        <form className="card form" onSubmit={submit}>
          <h2>Écrire un message</h2>
          <label>Nom<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>E-mail<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Téléphone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label>Message<textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required /></label>
          <input className="hp" tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} aria-hidden="true" />
          {error && <p className="form-error">{error}</p>}
          {status && <p className="form-ok">{status}</p>}
          <button className="btn btn-dark" type="submit">Envoyer</button>
        </form>
      </section>
    </article>
  );
}

export function NotFoundPage() {
  useTitle("Page introuvable");
  return (
    <section className="page-hero wrap">
      <p className="kicker">404</p>
      <h1>Cette page n'existe pas.</h1>
      <Link className="btn btn-dark" to="/">Retour à l'accueil</Link>
    </section>
  );
}
