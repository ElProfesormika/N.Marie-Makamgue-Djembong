import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  AccountPage,
  AdminLayout,
  CollectionEditor,
  Dashboard,
  LoginPage,
  MessagesPage,
  PageEditor,
  SettingsEditor,
} from "./admin.jsx";
import { Layout } from "./components.jsx";
import { LanguageProvider } from "./i18n.jsx";
import {
  ActionsPage,
  AssociationPage,
  AwardsPage,
  ContactPage,
  GalleryPage,
  HomePage,
  IdentityPage,
  JourneyPage,
  EventsPage,
  NetworkPage,
  NotFoundPage,
  RootsPage,
} from "./pages.jsx";
import { SiteProvider } from "./site.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
      <Routes>
        <Route element={<SiteProvider><Layout /></SiteProvider>}>
          <Route index element={<HomePage />} />
          <Route path="qui-suis-je" element={<IdentityPage />} />
          <Route path="racines" element={<RootsPage />} />
          <Route path="parcours" element={<JourneyPage />} />
          <Route path="un-geste-divin" element={<AssociationPage />} />
          <Route path="actions" element={<ActionsPage />} />
          <Route path="reconnaissances" element={<AwardsPage />} />
          <Route path="reseau" element={<NetworkPage />} />
          <Route path="evenements" element={<EventsPage />} />
          <Route path="galerie" element={<GalleryPage />} />
          <Route path="message" element={<Navigate to="/actions" replace />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pages/:slug" element={<PageEditor />} />
          <Route path="listes/:key" element={<CollectionEditor />} />
          <Route path="reglages" element={<SettingsEditor />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="compte" element={<AccountPage />} />
        </Route>
      </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}
