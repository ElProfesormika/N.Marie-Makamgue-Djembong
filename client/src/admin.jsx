import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { api, getToken, setToken } from "./api.js";
import { ThemeToggle } from "./components.jsx";
import { LangSwitch, adminPageLabel, localizeCollection, sectionLabel, useLang } from "./i18n.jsx";
import { ODDS } from "./odds.jsx";
import { COLLECTIONS, PATHS, SECTION_DEFAULTS } from "./site.jsx";

const ODD_EN = {
  1: "No poverty",
  2: "Zero hunger",
  3: "Good health and well-being",
  4: "Quality education",
  5: "Gender equality",
  6: "Clean water and sanitation",
  7: "Affordable and clean energy",
  8: "Decent work and economic growth",
  9: "Industry, innovation and infrastructure",
  10: "Reduced inequalities",
  11: "Sustainable cities and communities",
  12: "Responsible consumption and production",
  13: "Climate action",
  14: "Life below water",
  15: "Life on land",
  16: "Peace, justice and strong institutions",
  17: "Partnerships for the goals",
};

function useAdminData() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function reload() {
    const next = await api("/api/admin/site", { auth: true });
    setData(next);
    return next;
  }

  useEffect(() => {
    if (!getToken()) {
      navigate("/admin/login");
      return;
    }
    reload().catch((err) => {
      if (err.status === 401) {
        setToken("");
        navigate("/admin/login");
      } else setError(err.message);
    });
  }, [navigate]);

  function toast(message) {
    setNote(message);
    window.setTimeout(() => setNote(""), 2400);
  }

  return { data, error, note, reload, toast };
}

export function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `${t("adminKicker")} · Mama Coco`;
    if (getToken()) navigate("/admin");
  }, [navigate, t]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const result = await api("/api/auth/login", { method: "POST", body: { email, password } });
      setToken(result.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="login">
      <form className="card form" onSubmit={submit}>
        <div className="row-between">
          <Link className="back" to="/">{t("adminBack")}</Link>
          <span className="login-tools">
            <LangSwitch />
            <ThemeToggle />
          </span>
        </div>
        <p className="kicker">{t("adminKicker")}</p>
        <h1>Mama Coco</h1>
        <p className="intro">{t("adminLead")}</p>
        <label>{t("email")}<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>
          {t("adminPassword")}
          <div className="secret">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="secret-btn"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? t("adminHide") : t("adminShow")}
            </button>
          </div>
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-dark" type="submit">{t("adminEnter")}</button>
      </form>
    </main>
  );
}

export function AdminLayout() {
  const admin = useAdminData();
  const { lang, t } = useLang();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  if (!getToken()) return <Navigate to="/admin/login" replace />;
  if (admin.error) return <div className="splash"><h1>{admin.error}</h1></div>;
  if (!admin.data) return <div className="splash"><p>{t("adminOpening")}</p></div>;

  const groups = [
    [t("adminPages"), admin.data.pages.map((page) => ({ to: `/admin/pages/${page.slug}`, label: adminPageLabel(page.slug, page.nav_label, lang) }))],
    [t("adminLists"), COLLECTIONS.map((item) => ({ to: `/admin/listes/${item.key}`, label: localizeCollection(item, lang).label }))],
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link className="brand" to="/admin">
          <img className="brand-logo" src="/mama-coco-logo.png" alt="" />
          <span><strong>{t("adminBrand")}</strong><small>Mama Coco</small></span>
        </Link>
        <nav>
          <NavLink end to="/admin">{t("adminDash")}</NavLink>
          <NavLink to="/admin/reglages">{t("adminIdentityNav")}</NavLink>
          <NavLink to="/admin/messages">
            {t("adminMessages")} {admin.data.unreadMessages > 0 && <em>{admin.data.unreadMessages}</em>}
          </NavLink>
          <NavLink to="/admin/compte">{t("adminPassword")}</NavLink>
          {groups.map(([title, links]) => (
            <div key={title}>
              <p>{title}</p>
              {links.map((link) => (
                <NavLink key={link.to} to={link.to}>{link.label}</NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="side-links">
          <Link to="/">{t("adminViewSite")}</Link>
          <LangSwitch />
          <ThemeToggle />
          <button type="button" onClick={() => { setToken(""); window.location.href = "/admin/login"; }}>{t("adminLeave")}</button>
        </div>
      </aside>
      <div className="admin-main">
        {admin.note && <p className="toast">{admin.note}</p>}
        <Outlet context={admin} />
      </div>
    </div>
  );
}

export function Dashboard() {
  const { data } = useOutletContext();
  const { t } = useLang();
  const photos = data.entries.filter((item) => item.collection === "galerie").length;
  return (
    <section>
      <p className="kicker">{t("adminDash")}</p>
      <h1>{t("dashTitle")}</h1>
      <p className="intro">{t("dashLead")}</p>
      <div className="cards three">
        <article className="card stat"><strong>{data.pages.length}</strong><h2>{t("dashPages")}</h2></article>
        <article className="card stat"><strong>{photos}</strong><h2>{t("dashPhotos")}</h2></article>
        <article className="card stat"><strong>{data.unreadMessages}</strong><h2>{t("dashUnread")}</h2></article>
      </div>
      <div className="cards three section">
        <Link className="card teaser" to="/admin/reglages"><h3>{t("dashPhoto")}</h3><span>{t("dashPhotoSub")}</span></Link>
        <Link className="card teaser" to="/admin/listes/galerie"><h3>{t("dashAddPhotos")}</h3><span>{t("dashAddSub")}</span></Link>
        <Link className="card teaser" to="/admin/messages"><h3>{t("dashRead")}</h3><span>{t("dashReadSub")}</span></Link>
      </div>
    </section>
  );
}

export function PageEditor() {
  const { slug } = useParams();
  const { t } = useLang();
  const { data, reload, toast } = useOutletContext();
  const source = data.pages.find((page) => page.slug === slug);
  const [form, setForm] = useState(source);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(source), [source]);
  if (!form) return <p>{t("pageMissing")}</p>;

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setBlock(index, key, value) {
    const blocks = form.blocks.map((block, i) => (i === index ? { ...block, [key]: value } : block));
    setField("blocks", blocks);
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await api(`/api/admin/pages/${slug}`, { method: "PUT", auth: true, body: form });
      await reload();
      toast(t("savedPage"));
    } catch (err) {
      toast(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="editor" onSubmit={save}>
      <p className="kicker">{t("pageKicker")}</p>
      <h1>{form.nav_label}</h1>
      {PATHS[slug] && <p><Link to={PATHS[slug]}>{t("viewPage")}</Link></p>}
      <div className="grid-2">
        <label>{t("menuName")}<input value={form.nav_label} onChange={(e) => setField("nav_label", e.target.value)} /></label>
        <label>{t("menuOrder")}<input type="number" value={form.nav_order} onChange={(e) => setField("nav_order", Number(e.target.value))} /></label>
      </div>
      <label>{t("fieldKicker")}<input value={form.kicker || ""} onChange={(e) => setField("kicker", e.target.value)} /></label>
      <label>{t("fieldTitle")}<input value={form.title || ""} onChange={(e) => setField("title", e.target.value)} /></label>
      <label>{t("fieldSubtitle")}<input value={form.subtitle || ""} onChange={(e) => setField("subtitle", e.target.value)} /></label>
      <label>{t("fieldIntro")}<textarea value={form.intro || ""} onChange={(e) => setField("intro", e.target.value)} /></label>
      <label>{t("fieldQuote")}<textarea value={form.quote || ""} onChange={(e) => setField("quote", e.target.value)} /></label>
      <label>{t("fieldQuoteAuthor")}<input value={form.quote_author || ""} onChange={(e) => setField("quote_author", e.target.value)} /></label>
      <div className="checks">
        <label><input type="checkbox" checked={form.show_in_nav} onChange={(e) => setField("show_in_nav", e.target.checked)} /> {t("inMenu")}</label>
        <label><input type="checkbox" checked={form.published} onChange={(e) => setField("published", e.target.checked)} /> {t("published")}</label>
      </div>
      <div className="blocks-editor">
        <div className="row-between">
          <h2>{t("paragraphs")}</h2>
          <button type="button" className="btn btn-line" onClick={() => setField("blocks", [...(form.blocks || []), { heading: "", text: "" }])}>{t("addParagraph")}</button>
        </div>
        {(form.blocks || []).map((block, index) => (
          <div className="card" key={index}>
            <label>{t("paragraphTitle")}<input value={block.heading} onChange={(e) => setBlock(index, "heading", e.target.value)} /></label>
            <label>{t("fieldText")}<textarea value={block.text} onChange={(e) => setBlock(index, "text", e.target.value)} /></label>
            <button type="button" className="btn btn-danger" onClick={() => setField("blocks", form.blocks.filter((_, i) => i !== index))}>{t("deleteParagraph")}</button>
          </div>
        ))}
      </div>
      <button className="btn btn-dark" type="submit" disabled={saving}>{saving ? t("saving") : t("savePage")}</button>
    </form>
  );
}

async function uploadImage(file) {
  const body = new FormData();
  body.append("file", file);
  const result = await api("/api/admin/upload", { method: "POST", auth: true, body });
  return result.url;
}

function ImageField({ value, onChange }) {
  const { t } = useLang();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="image-field">
      {value ? <img src={value} alt="" /> : <div className="ph">{t("noPhoto")}</div>}
      <label className="btn btn-line">
        {busy ? t("sending") : t("choosePhoto")}
        <input type="file" accept="image/*" hidden onChange={pick} />
      </label>
      {value && <button type="button" className="btn btn-danger" onClick={() => onChange("")}>{t("removePhoto")}</button>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

function EntryCard({ item, meta, siblings, onChanged, toast }) {
  const { lang, t } = useLang();
  const [form, setForm] = useState(item);
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(item), [item]);

  async function save() {
    setSaving(true);
    try {
      await api(`/api/admin/entries/${item.id}`, { method: "PUT", auth: true, body: form });
      await onChanged();
      toast(t("savedItem"));
    } catch (err) {
      toast(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(t("confirmDelete"))) return;
    await api(`/api/admin/entries/${item.id}`, { method: "DELETE", auth: true });
    await onChanged();
    toast(t("deletedItem"));
  }

  async function move(direction) {
    const ids = siblings.map((entry) => entry.id);
    const index = ids.indexOf(item.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await api("/api/admin/entries/reorder", { method: "POST", auth: true, body: { ids } });
    await onChanged();
  }

  return (
    <article className="card entry-card">
      {meta.fields.map((field) => (
        <div className="field" key={field.key}>
          <span>{field.label}</span>
          {field.key === "image" ? (
            <ImageField value={form.image} onChange={(image) => setForm({ ...form, image })} />
          ) : field.type === "odds" ? (
            <div className="odd-picks">
              {ODDS.map((odd) => {
                const selected = (form.extra?.odds || []).map(Number).includes(odd.id);
                return (
                  <label key={odd.id} className={selected ? "on" : ""}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {
                        const current = (form.extra?.odds || []).map(Number).filter((id) => id !== odd.id);
                        const odds = selected ? current : [...current, odd.id].sort((a, b) => a - b);
                        setForm({ ...form, extra: { ...(form.extra || {}), odds } });
                      }}
                    />
                    <i style={{ background: odd.color }}>{odd.id}</i>
                    {lang === "en" ? ODD_EN[odd.id] || odd.name : odd.name}
                  </label>
                );
              })}
            </div>
          ) : field.type === "date" || field.type === "time" ? (
            <input
              type={field.type}
              value={form.extra?.[field.key] || ""}
              onChange={(event) => {
                const extra = { ...(form.extra || {}) };
                const value = event.target.value;
                if (value) extra[field.key] = value;
                else delete extra[field.key];
                setForm({ ...form, extra });
              }}
            />
          ) : field.type === "extra" ? (
            <input
              placeholder={field.placeholder || ""}
              value={form.extra?.[field.key] || ""}
              onChange={(event) => {
                const extra = { ...(form.extra || {}) };
                const value = event.target.value;
                if (value) extra[field.key] = value;
                else delete extra[field.key];
                setForm({ ...form, extra });
              }}
            />
          ) : field.type === "coord" ? (
            <input
              type="number"
              step="0.01"
              placeholder={t("automatic")}
              value={form.extra?.[field.key] ?? ""}
              onChange={(event) => {
                const extra = { ...(form.extra || {}) };
                if (event.target.value === "") delete extra[field.key];
                else extra[field.key] = Number(event.target.value);
                setForm({ ...form, extra });
              }}
            />
          ) : field.type === "textarea" ? (
            <textarea value={form[field.key] || ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} />
          ) : (
            <input
              placeholder={field.placeholder || ""}
              value={form[field.key] || ""}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            />
          )}
        </div>
      ))}
      <label className="check">
        <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
        {t("visibleOnSite")}
      </label>
      <div className="entry-actions">
        <button type="button" className="btn btn-dark" onClick={save} disabled={saving}>{saving ? "…" : t("save")}</button>
        <button type="button" className="btn btn-line" onClick={() => move(-1)}>{t("moveUp")}</button>
        <button type="button" className="btn btn-line" onClick={() => move(1)}>{t("moveDown")}</button>
        <button type="button" className="btn btn-danger" onClick={remove}>{t("deleteItem")}</button>
      </div>
    </article>
  );
}

export function CollectionEditor() {
  const { key } = useParams();
  const { lang, t } = useLang();
  const { data, reload, toast } = useOutletContext();
  const meta = localizeCollection(COLLECTIONS.find((item) => item.key === key), lang);
  const items = data.entries.filter((item) => item.collection === key);
  if (!meta) return <p>{t("listMissing")}</p>;

  async function add() {
    await api("/api/admin/entries", {
      method: "POST",
      auth: true,
      body: { collection: key, title: t("newItem"), published: true },
    });
    await reload();
    toast(t("addedItem"));
  }

  return (
    <section>
      <p className="kicker">{meta.page}</p>
      <div className="row-between">
        <h1>{meta.label}</h1>
        <button type="button" className="btn btn-gold" onClick={add}>{t("add")}</button>
      </div>
      <p className="intro">{t("listLead")}</p>
      <div className="stack">
        {items.map((item) => (
          <EntryCard key={item.id} item={item} meta={meta} siblings={items} onChanged={reload} toast={toast} />
        ))}
        {items.length === 0 && <p>{t("emptyList")}</p>}
      </div>
    </section>
  );
}

const SECTION_LABELS = {
  heroPrimary: "Accueil, bouton principal",
  heroSecondary: "Accueil, bouton secondaire",
  exchange: "Accueil, bandeau des institutions",
  methodKicker: "Accueil, surtitre de la méthode",
  methodTitle: "Accueil, titre de la méthode",
  methodLink: "Accueil, lien vers le parcours",
  ctaKicker: "Accueil, surtitre de l'appel",
  ctaTitle: "Accueil, titre de l'appel",
  ctaButton: "Accueil, bouton de l'appel",
  coachTitle: "Qui suis-je, titre des accompagnements",
  exploreTitle: "Qui suis-je, titre À explorer",
  exploreLink: "Qui suis-je, lien vers la galerie",
  carryTitle: "Qui suis-je, titre Ce que je porte",
  titresKicker: "Parcours, surtitre des titres",
  titresTitle: "Parcours, titre des fonctions",
  antennesKicker: "Fierté, surtitre du siège",
  antennesTitle: "Fierté, titre du siège",
  presenceKicker: "Fierté, surtitre de la carte",
  presenceTitle: "Fierté, titre de la carte",
  actionsKicker: "Actions, surtitre",
  actionsTitle: "Actions, titre",
  actionPin: "Actions, pastille",
  actionMore: "Actions, bouton de la fiche",
  impactKicker: "Actions, surtitre de l'impact",
  impactTitle: "Actions, titre de l'impact",
  writeButton: "Actions, bouton du message",
  institutionsKicker: "Réseau, institutions",
  embassiesKicker: "Réseau, ambassades",
  partnersKicker: "Réseau, partenaires",
  eventsLink: "Réseau, lien vers les événements",
};

export function SettingsEditor() {
  const { lang, t } = useLang();
  const { data, reload, toast } = useOutletContext();
  const [brand, setBrand] = useState(data.settings.brand || {});
  const [hero, setHero] = useState(data.settings.hero || {});
  const [contact, setContact] = useState(data.settings.contact || {});
  const [sections, setSections] = useState({ ...SECTION_DEFAULTS, ...(data.settings.sections || {}) });
  const [saving, setSaving] = useState("");

  async function save(key, value) {
    setSaving(key);
    try {
      await api(`/api/admin/settings/${key}`, { method: "PUT", auth: true, body: value });
      await reload();
      toast(t("savedSetting"));
    } catch (err) {
      toast(err.message);
    } finally {
      setSaving("");
    }
  }

  return (
    <section className="stack">
      <div>
        <p className="kicker">{t("settingsKicker")}</p>
        <h1>{t("settingsTitle")}</h1>
      </div>
      <form className="card editor" onSubmit={(e) => { e.preventDefault(); save("brand", brand); }}>
        <h2>{t("identity")}</h2>
        <label>{t("fullName")}<input value={brand.name || ""} onChange={(e) => setBrand({ ...brand, name: e.target.value })} /></label>
        <label>{t("alias")}<input value={brand.alias || ""} onChange={(e) => setBrand({ ...brand, alias: e.target.value })} /></label>
        <label>{t("mark")}<input value={brand.mark || ""} onChange={(e) => setBrand({ ...brand, mark: e.target.value })} /></label>
        <label>{t("topbar")}<input value={brand.topbar || ""} onChange={(e) => setBrand({ ...brand, topbar: e.target.value })} /></label>
        <label>{t("footerQuote")}<textarea value={brand.footerQuote || ""} onChange={(e) => setBrand({ ...brand, footerQuote: e.target.value })} /></label>
        <label>{t("portraitMenu")}<input value={brand.portraitMenu || ""} onChange={(e) => setBrand({ ...brand, portraitMenu: e.target.value })} placeholder="Moi" /></label>
        <button className="btn btn-dark" type="submit" disabled={saving === "brand"}>{t("saveIdentity")}</button>
      </form>
      <form className="card editor" onSubmit={(e) => { e.preventDefault(); save("hero", hero); }}>
        <h2>{t("mainPhotos")}</h2>
        <label>{t("headline")}<input value={hero.headline || ""} onChange={(e) => setHero({ ...hero, headline: e.target.value })} /></label>
        <label>{t("lead")}<textarea value={hero.lead || ""} onChange={(e) => setHero({ ...hero, lead: e.target.value })} /></label>
        <label>{t("roles")}<input value={hero.roles || ""} onChange={(e) => setHero({ ...hero, roles: e.target.value })} /></label>
        <label>{t("badge")}<input value={hero.badge || ""} onChange={(e) => setHero({ ...hero, badge: e.target.value })} /></label>
        <label>{t("aside")}<input value={hero.aside || ""} onChange={(e) => setHero({ ...hero, aside: e.target.value })} /></label>
        <p className="kicker">{t("homePhoto")}</p>
        <ImageField value={hero.photo || ""} onChange={(photo) => setHero({ ...hero, photo })} />
        <p className="kicker">{t("portraitPhoto")}</p>
        <ImageField value={hero.portrait || ""} onChange={(portrait) => setHero({ ...hero, portrait })} />
        <button className="btn btn-dark" type="submit" disabled={saving === "hero"}>{t("savePhotos")}</button>
      </form>
      <form className="card editor" onSubmit={(e) => { e.preventDefault(); save("contact", contact); }}>
        <h2>{t("contact")}</h2>
        <label>{t("org")}<input value={contact.org || ""} onChange={(e) => setContact({ ...contact, org: e.target.value })} /></label>
        <label>{t("address")}<textarea value={contact.address || ""} onChange={(e) => setContact({ ...contact, address: e.target.value })} /></label>
        <label>{t("phone")}<input value={contact.phone || ""} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></label>
        <label>{t("email")}<input value={contact.email || ""} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></label>
        <label>{t("websiteField")}<input value={contact.website || ""} onChange={(e) => setContact({ ...contact, website: e.target.value })} /></label>
        <label>{t("websiteLabel")}<input value={contact.websiteLabel || ""} onChange={(e) => setContact({ ...contact, websiteLabel: e.target.value })} /></label>
        <button className="btn btn-dark" type="submit" disabled={saving === "contact"}>{t("saveContact")}</button>
      </form>
      <form className="card editor" onSubmit={(e) => { e.preventDefault(); save("sections", sections); }}>
        <h2>{t("sectionTitles")}</h2>
        <p className="intro">{t("sectionLead")}</p>
        {Object.entries(SECTION_LABELS).map(([key, label]) => (
          <label key={key}>
            {sectionLabel(key, label, lang)}
            <input value={sections[key] || ""} onChange={(e) => setSections({ ...sections, [key]: e.target.value })} />
          </label>
        ))}
        <button className="btn btn-dark" type="submit" disabled={saving === "sections"}>{t("saveTitles")}</button>
      </form>
    </section>
  );
}

export function MessagesPage() {
  const { lang, t } = useLang();
  const { toast } = useOutletContext();
  const [messages, setMessages] = useState([]);

  async function load() {
    setMessages(await api("/api/admin/messages", { auth: true }));
  }
  useEffect(() => { load(); }, []);

  async function toggle(message) {
    await api(`/api/admin/messages/${message.id}`, { method: "PATCH", auth: true, body: { read: !message.read } });
    await load();
  }
  async function remove(message) {
    if (!window.confirm(t("confirmDeleteMessage"))) return;
    await api(`/api/admin/messages/${message.id}`, { method: "DELETE", auth: true });
    await load();
    toast(t("deletedMessage"));
  }

  return (
    <section>
      <p className="kicker">{t("inbox")}</p>
      <h1>{t("received")}</h1>
      <div className="stack">
        {messages.length === 0 && <p>{t("noMessages")}</p>}
        {messages.map((message) => (
          <article className={`card message ${message.read ? "" : "unread"}`} key={message.id}>
            <p className="kicker">{new Date(message.created_at).toLocaleString(lang === "en" ? "en-GB" : "fr-BE")} · {message.read ? t("read") : t("unread")}</p>
            <h2>{message.name}</h2>
            <p><a href={`mailto:${message.email}`}>{message.email}</a>{message.phone ? ` · ${message.phone}` : ""}</p>
            <p>{message.body}</p>
            <div className="entry-actions">
              <button type="button" className="btn btn-line" onClick={() => toggle(message)}>{message.read ? t("markUnread") : t("markRead")}</button>
              <button type="button" className="btn btn-danger" onClick={() => remove(message)}>{t("deleteItem")}</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AccountPage() {
  const { t } = useLang();
  const { toast } = useOutletContext();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await api("/api/admin/password", { method: "PUT", auth: true, body: { current, next } });
      setCurrent("");
      setNext("");
      toast(t("passwordChanged"));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card editor" onSubmit={submit}>
      <p className="kicker">{t("account")}</p>
      <h1>{t("adminPassword")}</h1>
      <label>{t("currentPassword")}<input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required /></label>
      <label>{t("newPassword")}<input type="password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={8} /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-dark" type="submit">{t("update")}</button>
    </form>
  );
}
