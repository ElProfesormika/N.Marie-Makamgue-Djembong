import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { PATHS, useSite } from "./site.jsx";

export function Layout() {
  const { pages, settings } = useSite();
  const brand = settings.brand || {};
  const contact = settings.contact || {};
  const [open, setOpen] = useState(false);
  const [portraitOpen, setPortraitOpen] = useState(false);
  const navPages = pages.filter((page) => page.show_in_nav);

  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setPortraitOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      });
    }, { threshold: 0.14 });
    nodes.forEach((node) => observer.observe(node));
    const fallback = window.setTimeout(() => {
      nodes.forEach((node) => node.classList.add("in"));
    }, 900);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [location.pathname]);

  const links = navPages.filter((page) => page.slug !== "contact");
  const portraitSlugs = ["qui-suis-je", "racines"];
  const portraitPages = links.filter((page) => portraitSlugs.includes(page.slug));
  const portraitActive = portraitPages.some((page) => location.pathname === (PATHS[page.slug] || "/"));
  const menu = [];
  let portraitPlaced = false;
  for (const page of links) {
    if (portraitSlugs.includes(page.slug)) {
      if (!portraitPlaced && portraitPages.length > 0) {
        menu.push({ type: "portrait" });
        portraitPlaced = true;
      }
    } else {
      menu.push({ type: "link", page });
    }
  }

  return (
    <>
      <a className="skip" href="#contenu">Aller au contenu</a>
      <header className="site-nav">
        <div className="nav-bar">
          <Link className="brand" to="/" onClick={() => setOpen(false)}>
            <span className="mark">{brand.mark || "MC"}</span>
            <span>
              <strong>{brand.alias || "Mama Coco"}</strong>
              <small>Coach · Fondatrice</small>
            </span>
          </Link>
          <button className="menu-btn" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? "Fermer" : "Menu"}
          </button>
          <div className={open ? "nav-panel open" : "nav-panel"}>
            <nav>
              {menu.map((item) => (
                item.type === "portrait" ? (
                  <div className={`nav-drop${portraitOpen ? " open" : ""}`} key="portrait">
                    <button
                      type="button"
                      className={`nav-link nav-parent${portraitActive ? " active" : ""}`}
                      aria-expanded={portraitOpen}
                      aria-haspopup="true"
                      onClick={() => setPortraitOpen((value) => !value)}
                    >
                      {brand.portraitMenu || "Moi"}
                    </button>
                    <div className="nav-sub">
                      {portraitPages.map((page) => (
                        <NavLink
                          key={page.slug}
                          to={PATHS[page.slug] || "/"}
                          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                          onClick={() => setOpen(false)}
                        >
                          {page.nav_label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={item.page.slug}
                    to={PATHS[item.page.slug] || "/"}
                    end={item.page.slug === "accueil"}
                    className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {item.page.nav_label}
                  </NavLink>
                )
              ))}
            </nav>
            <div className="nav-tools">
              <NavLink className="btn btn-dark btn-sm" to="/contact" onClick={() => setOpen(false)}>
                Contact
              </NavLink>
            </div>
          </div>
        </div>
        {brand.topbar && <p className="nav-note">{brand.topbar}</p>}
      </header>
      <main id="contenu">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="wrap footer-top">
          <div>
            <p className="mark">{brand.mark || "MC"}</p>
            <h2>{brand.name}</h2>
            <p className="alias">{brand.alias}</p>
            <p className="footer-quote">« {brand.footerQuote} »</p>
          </div>
          <div className="footer-contact">
            <p className="kicker">Contact</p>
            <p>{contact.address}</p>
            <p><a href={`tel:${(contact.phone || "").replace(/\s/g, "")}`}>{contact.phone}</a></p>
            <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
            <p><a href={contact.website} target="_blank" rel="noreferrer">{contact.websiteLabel}</a></p>
          </div>
        </div>
        <nav className="wrap footer-nav" aria-label="Pages du site">
          {navPages.map((page) => (
            <Link key={page.slug} to={PATHS[page.slug] || "/"}>{page.nav_label}</Link>
          ))}
        </nav>
        <p className="wrap footer-base">© {new Date().getFullYear()} {brand.name}</p>
      </footer>
    </>
  );
}

export function PageHero({ page }) {
  if (!page) {
    return (
      <header className="page-hero wrap">
        <h1>Cette page est masquée.</h1>
        <p className="intro">Cette page peut être republée depuis l'administration.</p>
      </header>
    );
  }
  return (
    <header className="page-hero wrap">
      <h1>{page.title}</h1>
      {page.subtitle && <p className="lede">{page.subtitle}</p>}
      {page.intro && <p className="intro">{page.intro}</p>}
    </header>
  );
}

export function Quote({ text, author }) {
  if (!text) return null;
  return (
    <blockquote className="quote">
      <p>{text}</p>
      {author && <footer>{author}</footer>}
    </blockquote>
  );
}

const FLOW = [
  ["/", "Accueil"],
  ["/qui-suis-je", "Qui suis-je"],
  ["/racines", "Racines"],
  ["/parcours", "Parcours"],
  ["/un-geste-divin", "Un Geste Divin"],
  ["/actions", "Actions"],
  ["/reconnaissances", "Reconnaissances"],
  ["/reseau", "Réseau"],
  ["/evenements", "Événements"],
  ["/galerie", "Galerie"],
  ["/contact", "Contact"],
];

export function Continue({ path }) {
  const index = FLOW.findIndex(([route]) => route === path);
  const next = FLOW[index + 1];
  if (!next) return null;
  return (
    <div className="wrap">
      <Link className="continue" to={next[0]}>
        <span>Continuer</span>
        <strong>{next[1]} →</strong>
      </Link>
    </div>
  );
}

export function Blocks({ blocks }) {
  if (!blocks?.length) return null;
  return (
    <div className="blocks">
      {blocks.map((block, index) => (
        <article className="card story" key={`${block.heading}-${index}`}>
          {block.heading && <h2>{block.heading}</h2>}
          {block.text && <p>{block.text}</p>}
        </article>
      ))}
    </div>
  );
}
