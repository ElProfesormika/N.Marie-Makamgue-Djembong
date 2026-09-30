import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { LangSwitch, useLang } from "./i18n.jsx";
import { PATHS, useSite } from "./site.jsx";

const THEME_KEY = "mama_coco_theme";

export function useNight() {
  const [night, setNight] = useState(() => document.documentElement.dataset.theme === "night");

  useEffect(() => {
    const sync = () => setNight(document.documentElement.dataset.theme === "night");
    window.addEventListener("mama-theme", sync);
    return () => window.removeEventListener("mama-theme", sync);
  }, []);

  function toggle() {
    const next = document.documentElement.dataset.theme === "night" ? "day" : "night";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
    window.dispatchEvent(new Event("mama-theme"));
  }

  return { night, toggle };
}

export function ThemeToggle({ className = "" }) {
  const { night, toggle } = useNight();
  const { t } = useLang();
  return (
    <button
      type="button"
      className={`theme-btn${className ? ` ${className}` : ""}`}
      aria-pressed={night}
      aria-label={night ? t("themeDay") : t("themeNight")}
      onClick={toggle}
    >
      {night ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M21 14.3A8.4 8.4 0 0 1 9.7 3 7.2 7.2 0 1 0 21 14.3z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2.5v2.2M12 19.3v2.2M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.4 19.6 6 18M18 6l1.6-1.6" />
      </g>
    </svg>
  );
}

function scrollToTop() {
  window.setTimeout(() => window.scrollTo(0, 0), 0);
}

export function Layout() {
  const { pages, settings } = useSite();
  const { t } = useLang();
  const brand = settings.brand || {};
  const contact = settings.contact || {};
  const [open, setOpen] = useState(false);
  const [portraitOpen, setPortraitOpen] = useState(false);
  const navPages = pages.filter((page) => page.show_in_nav);

  const location = useLocation();

  function chooseLink() {
    setOpen(false);
    setPortraitOpen(false);
    scrollToTop();
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setPortraitOpen(false);
    scrollToTop();
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
      <a className="skip" href="#contenu">{t("skip")}</a>
      <header className="site-nav">
        <div className="nav-bar">
          <Link className="brand" to="/" onClick={chooseLink}>
            <img className="brand-logo" src="/mama-coco-logo.png" alt="" />
            <span>
              <strong>{brand.alias || "Mama Coco"}</strong>
              <small>{t("role")}</small>
            </span>
          </Link>
          <div className="nav-quick">
            <LangSwitch className="lang-switch-bar" />
            <ThemeToggle className="theme-btn-bar" />
          </div>
          <button className="menu-btn" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? t("close") : t("menu")}
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
                          onClick={chooseLink}
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
                    onClick={chooseLink}
                  >
                    {item.page.nav_label}
                  </NavLink>
                )
              ))}
            </nav>
            <div className="nav-tools">
              <LangSwitch className="lang-switch-panel" />
              <ThemeToggle className="theme-btn-panel" />
              <NavLink className="btn btn-dark btn-sm" to="/contact" onClick={chooseLink}>
                {t("contact")}
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
            <img className="brand-logo brand-logo-footer" src="/mama-coco-logo.png" alt="" />
            <h2>{brand.name}</h2>
            <p className="alias">{brand.alias}</p>
            <p className="footer-quote">« {brand.footerQuote} »</p>
          </div>
          <div className="footer-contact">
            <p className="kicker">{t("contact")}</p>
            <p>{contact.address}</p>
            <p><a href={`tel:${(contact.phone || "").replace(/\s/g, "")}`}>{contact.phone}</a></p>
            <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
            <p><a href={contact.website} target="_blank" rel="noreferrer">{contact.websiteLabel}</a></p>
          </div>
        </div>
        <nav className="wrap footer-nav" aria-label={t("footerNav")}>
          {navPages.map((page) => (
            <Link key={page.slug} to={PATHS[page.slug] || "/"}>{page.nav_label}</Link>
          ))}
        </nav>
        <p className="wrap footer-base">© {new Date().getFullYear()} {brand.name}</p>
      </footer>
    </>
  );
}

export function PageHero({ page, logo }) {
  const { t } = useLang();
  if (!page) {
    return (
      <header className="page-hero wrap">
        <h1>{t("hiddenTitle")}</h1>
        <p className="intro">{t("hiddenBody")}</p>
      </header>
    );
  }
  return (
    <header className="page-hero wrap">
      <div className={logo ? "hero-title-row" : undefined}>
        <h1>{page.title}</h1>
        {logo && <img className="association-logo" src={logo} alt={t("logoAlt")} />}
      </div>
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

const FLOW = ["accueil", "qui-suis-je", "racines", "parcours", "aisbl", "actions", "reconnaissances", "reseau", "evenements", "galerie", "contact"];

export function Continue({ path }) {
  const { page } = useSite();
  const { t } = useLang();
  const index = FLOW.findIndex((slug) => (PATHS[slug] || "/") === path);
  const next = index >= 0 ? page(FLOW[index + 1]) : null;
  if (!next) return null;
  return (
    <div className="wrap">
      <Link className="continue" to={PATHS[next.slug] || "/"}>
        <span>{t("continue")}</span>
        <strong>{next.nav_label} →</strong>
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
