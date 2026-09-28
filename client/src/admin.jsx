import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { api, getToken, setToken } from "./api.js";
import { ODDS } from "./odds.jsx";
import { COLLECTIONS, PATHS, SECTION_DEFAULTS } from "./site.jsx";

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
  const [email, setEmail] = useState("admin@ungestedivin.org");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Administration · Mama Coco";
    if (getToken()) navigate("/admin");
  }, [navigate]);

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
        <Link className="back" to="/">← Retour au site</Link>
        <p className="kicker">Administration</p>
        <h1>Mama Coco</h1>
        <p className="intro">Modifiez les textes, les photos, les pages et les messages.</p>
        <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Mot de passe<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-dark" type="submit">Entrer</button>
      </form>
    </main>
  );
}

export function AdminLayout() {
  const admin = useAdminData();
  if (!getToken()) return <Navigate to="/admin/login" replace />;
  if (admin.error) return <div className="splash"><h1>{admin.error}</h1></div>;
  if (!admin.data) return <div className="splash"><p>Ouverture de l'administration…</p></div>;

  const groups = [
    ["Textes des pages", admin.data.pages.map((page) => ({ to: `/admin/pages/${page.slug}`, label: page.nav_label }))],
    ["Listes & photos", COLLECTIONS.map((item) => ({ to: `/admin/listes/${item.key}`, label: item.label }))],
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link className="brand" to="/admin">
          <span className="mark">MC</span>
          <span><strong>Administration</strong><small>Mama Coco</small></span>
        </Link>
        <nav>
          <NavLink end to="/admin">Tableau de bord</NavLink>
          <NavLink to="/admin/reglages">Identité, photo, contact</NavLink>
          <NavLink to="/admin/messages">
            Messages {admin.data.unreadMessages > 0 && <em>{admin.data.unreadMessages}</em>}
          </NavLink>
          <NavLink to="/admin/compte">Mot de passe</NavLink>
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
          <Link to="/">Voir le site</Link>
          <button type="button" onClick={() => { setToken(""); window.location.href = "/admin/login"; }}>Quitter</button>
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
  const photos = data.entries.filter((item) => item.collection === "galerie").length;
  return (
    <section>
      <p className="kicker">Tableau de bord</p>
      <h1>La main sur tout le site</h1>
      <p className="intro">Chaque page a ses textes. Chaque liste se complète, se modifie ou se supprime. Les photos viennent de votre ordinateur.</p>
      <div className="cards three">
        <article className="card stat"><strong>{data.pages.length}</strong><h2>pages</h2></article>
        <article className="card stat"><strong>{photos}</strong><h2>photos</h2></article>
        <article className="card stat"><strong>{data.unreadMessages}</strong><h2>messages non lus</h2></article>
      </div>
      <div className="cards three section">
        <Link className="card teaser" to="/admin/reglages"><h3>Changer la photo d'accueil</h3><span>Et les coordonnées</span></Link>
        <Link className="card teaser" to="/admin/listes/galerie"><h3>Ajouter des photos</h3><span>Depuis l'ordinateur</span></Link>
        <Link className="card teaser" to="/admin/messages"><h3>Lire les messages</h3><span>Formulaire de contact</span></Link>
      </div>
    </section>
  );
}

export function PageEditor() {
  const { slug } = useParams();
  const { data, reload, toast } = useOutletContext();
  const source = data.pages.find((page) => page.slug === slug);
  const [form, setForm] = useState(source);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(source), [source]);
  if (!form) return <p>Page introuvable.</p>;

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
      toast("Page enregistrée");
    } catch (err) {
      toast(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="editor" onSubmit={save}>
      <p className="kicker">Page</p>
      <h1>{form.nav_label}</h1>
      {PATHS[slug] && <p><Link to={PATHS[slug]}>Voir cette page</Link></p>}
      <div className="grid-2">
        <label>Nom dans le menu<input value={form.nav_label} onChange={(e) => setField("nav_label", e.target.value)} /></label>
        <label>Ordre dans le menu<input type="number" value={form.nav_order} onChange={(e) => setField("nav_order", Number(e.target.value))} /></label>
      </div>
      <label>Surtitre<input value={form.kicker || ""} onChange={(e) => setField("kicker", e.target.value)} /></label>
      <label>Titre<input value={form.title || ""} onChange={(e) => setField("title", e.target.value)} /></label>
      <label>Sous-titre<input value={form.subtitle || ""} onChange={(e) => setField("subtitle", e.target.value)} /></label>
      <label>Introduction<textarea value={form.intro || ""} onChange={(e) => setField("intro", e.target.value)} /></label>
      <label>Citation<textarea value={form.quote || ""} onChange={(e) => setField("quote", e.target.value)} /></label>
      <label>Auteur de la citation<input value={form.quote_author || ""} onChange={(e) => setField("quote_author", e.target.value)} /></label>
      <div className="checks">
        <label><input type="checkbox" checked={form.show_in_nav} onChange={(e) => setField("show_in_nav", e.target.checked)} /> Visible dans le menu</label>
        <label><input type="checkbox" checked={form.published} onChange={(e) => setField("published", e.target.checked)} /> Page publiée</label>
      </div>
      <div className="blocks-editor">
        <div className="row-between">
          <h2>Paragraphes</h2>
          <button type="button" className="btn btn-line" onClick={() => setField("blocks", [...(form.blocks || []), { heading: "", text: "" }])}>Ajouter un paragraphe</button>
        </div>
        {(form.blocks || []).map((block, index) => (
          <div className="card" key={index}>
            <label>Titre du paragraphe<input value={block.heading} onChange={(e) => setBlock(index, "heading", e.target.value)} /></label>
            <label>Texte<textarea value={block.text} onChange={(e) => setBlock(index, "text", e.target.value)} /></label>
            <button type="button" className="btn btn-danger" onClick={() => setField("blocks", form.blocks.filter((_, i) => i !== index))}>Supprimer ce paragraphe</button>
          </div>
        ))}
      </div>
      <button className="btn btn-dark" type="submit" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer la page"}</button>
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
      {value ? <img src={value} alt="" /> : <div className="ph">Aucune photo</div>}
      <label className="btn btn-line">
        {busy ? "Envoi…" : "Choisir une photo"}
        <input type="file" accept="image/*" hidden onChange={pick} />
      </label>
      {value && <button type="button" className="btn btn-danger" onClick={() => onChange("")}>Retirer</button>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

function EntryCard({ item, meta, siblings, onChanged, toast }) {
  const [form, setForm] = useState(item);
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(item), [item]);

  async function save() {
    setSaving(true);
    try {
      await api(`/api/admin/entries/${item.id}`, { method: "PUT", auth: true, body: form });
      await onChanged();
      toast("Élément enregistré");
    } catch (err) {
      toast(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm("Supprimer cet élément ?")) return;
    await api(`/api/admin/entries/${item.id}`, { method: "DELETE", auth: true });
    await onChanged();
    toast("Élément supprimé");
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
                    {odd.name}
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
              placeholder="Automatique"
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
        Visible sur le site
      </label>
      <div className="entry-actions">
        <button type="button" className="btn btn-dark" onClick={save} disabled={saving}>{saving ? "…" : "Enregistrer"}</button>
        <button type="button" className="btn btn-line" onClick={() => move(-1)}>Monter</button>
        <button type="button" className="btn btn-line" onClick={() => move(1)}>Descendre</button>
        <button type="button" className="btn btn-danger" onClick={remove}>Supprimer</button>
      </div>
    </article>
  );
}

export function CollectionEditor() {
  const { key } = useParams();
  const { data, reload, toast } = useOutletContext();
  const meta = COLLECTIONS.find((item) => item.key === key);
  const items = data.entries.filter((item) => item.collection === key);
  if (!meta) return <p>Liste introuvable.</p>;

  async function add() {
    await api("/api/admin/entries", {
      method: "POST",
      auth: true,
      body: { collection: key, title: "Nouvel élément", published: true },
    });
    await reload();
    toast("Élément ajouté");
  }

  return (
    <section>
      <p className="kicker">{meta.page}</p>
      <div className="row-between">
        <h1>{meta.label}</h1>
        <button type="button" className="btn btn-gold" onClick={add}>Ajouter</button>
      </div>
      <p className="intro">Ajoutez, modifiez, réordonnez ou supprimez. Les photos se choisissent sur votre ordinateur.</p>
      <div className="stack">
        {items.map((item) => (
          <EntryCard key={item.id} item={item} meta={meta} siblings={items} onChanged={reload} toast={toast} />
        ))}
        {items.length === 0 && <p>Cette liste est vide.</p>}
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
      toast("Réglage enregistré");
    } catch (err) {
      toast(err.message);
    } finally {
      setSaving("");
    }
  }

  return (
    <section className="stack">
      <div>
        <p className="kicker">Réglages</p>
        <h1>Identité, photos, contact</h1>
      </div>
      <form className="card editor" onSubmit={(e) => { e.preventDefault(); save("brand", brand); }}>
        <h2>Identité</h2>
        <label>Nom complet<input value={brand.name || ""} onChange={(e) => setBrand({ ...brand, name: e.target.value })} /></label>
        <label>Alias<input value={brand.alias || ""} onChange={(e) => setBrand({ ...brand, alias: e.target.value })} /></label>
        <label>Initiales du logo<input value={brand.mark || ""} onChange={(e) => setBrand({ ...brand, mark: e.target.value })} /></label>
        <label>Bandeau du haut<input value={brand.topbar || ""} onChange={(e) => setBrand({ ...brand, topbar: e.target.value })} /></label>
        <label>Citation du pied de page<textarea value={brand.footerQuote || ""} onChange={(e) => setBrand({ ...brand, footerQuote: e.target.value })} /></label>
        <label>Nom du menu Moi<input value={brand.portraitMenu || ""} onChange={(e) => setBrand({ ...brand, portraitMenu: e.target.value })} placeholder="Moi" /></label>
        <button className="btn btn-dark" type="submit" disabled={saving === "brand"}>Enregistrer l'identité</button>
      </form>
      <form className="card editor" onSubmit={(e) => { e.preventDefault(); save("hero", hero); }}>
        <h2>Photos principales</h2>
        <label>Grande phrase<input value={hero.headline || ""} onChange={(e) => setHero({ ...hero, headline: e.target.value })} /></label>
        <label>Texte sous la phrase<textarea value={hero.lead || ""} onChange={(e) => setHero({ ...hero, lead: e.target.value })} /></label>
        <label>Ligne de fonctions<input value={hero.roles || ""} onChange={(e) => setHero({ ...hero, roles: e.target.value })} /></label>
        <label>Badge<input value={hero.badge || ""} onChange={(e) => setHero({ ...hero, badge: e.target.value })} /></label>
        <label>Mention à côté du badge<input value={hero.aside || ""} onChange={(e) => setHero({ ...hero, aside: e.target.value })} /></label>
        <p className="kicker">Photo d'accueil</p>
        <ImageField value={hero.photo || ""} onChange={(photo) => setHero({ ...hero, photo })} />
        <p className="kicker">Portrait de la page Qui suis-je</p>
        <ImageField value={hero.portrait || ""} onChange={(portrait) => setHero({ ...hero, portrait })} />
        <button className="btn btn-dark" type="submit" disabled={saving === "hero"}>Enregistrer les photos</button>
      </form>
      <form className="card editor" onSubmit={(e) => { e.preventDefault(); save("contact", contact); }}>
        <h2>Contact</h2>
        <label>Organisation<input value={contact.org || ""} onChange={(e) => setContact({ ...contact, org: e.target.value })} /></label>
        <label>Adresse<textarea value={contact.address || ""} onChange={(e) => setContact({ ...contact, address: e.target.value })} /></label>
        <label>Téléphone<input value={contact.phone || ""} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></label>
        <label>E-mail<input value={contact.email || ""} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></label>
        <label>Site web<input value={contact.website || ""} onChange={(e) => setContact({ ...contact, website: e.target.value })} /></label>
        <label>Libellé du site<input value={contact.websiteLabel || ""} onChange={(e) => setContact({ ...contact, websiteLabel: e.target.value })} /></label>
        <button className="btn btn-dark" type="submit" disabled={saving === "contact"}>Enregistrer le contact</button>
      </form>
      <form className="card editor" onSubmit={(e) => { e.preventDefault(); save("sections", sections); }}>
        <h2>Titres des sections</h2>
        <p className="intro">Les listes, les photos et les textes de chaque page se modifient dans le menu de gauche. Ici, ce sont les titres affichés au-dessus de ces listes.</p>
        {Object.entries(SECTION_LABELS).map(([key, label]) => (
          <label key={key}>
            {label}
            <input value={sections[key] || ""} onChange={(e) => setSections({ ...sections, [key]: e.target.value })} />
          </label>
        ))}
        <button className="btn btn-dark" type="submit" disabled={saving === "sections"}>Enregistrer les titres</button>
      </form>
    </section>
  );
}

export function MessagesPage() {
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
    if (!window.confirm("Supprimer ce message ?")) return;
    await api(`/api/admin/messages/${message.id}`, { method: "DELETE", auth: true });
    await load();
    toast("Message supprimé");
  }

  return (
    <section>
      <p className="kicker">Boîte</p>
      <h1>Messages reçus</h1>
      <div className="stack">
        {messages.length === 0 && <p>Aucun message pour le moment.</p>}
        {messages.map((message) => (
          <article className={`card message ${message.read ? "" : "unread"}`} key={message.id}>
            <p className="kicker">{new Date(message.created_at).toLocaleString("fr-BE")} · {message.read ? "Lu" : "Non lu"}</p>
            <h2>{message.name}</h2>
            <p><a href={`mailto:${message.email}`}>{message.email}</a>{message.phone ? ` · ${message.phone}` : ""}</p>
            <p>{message.body}</p>
            <div className="entry-actions">
              <button type="button" className="btn btn-line" onClick={() => toggle(message)}>{message.read ? "Marquer non lu" : "Marquer lu"}</button>
              <button type="button" className="btn btn-danger" onClick={() => remove(message)}>Supprimer</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AccountPage() {
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
      toast("Mot de passe modifié");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card editor" onSubmit={submit}>
      <p className="kicker">Compte</p>
      <h1>Mot de passe</h1>
      <label>Mot de passe actuel<input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required /></label>
      <label>Nouveau mot de passe<input type="password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={8} /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-dark" type="submit">Mettre à jour</button>
    </form>
  );
}
