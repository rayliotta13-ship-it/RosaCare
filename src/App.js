import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabase";

const B = "#1A6B8A";
const BL = "#EBF5FA";
const W = "#FFFFFF";
const BG = "#F5F5F5";
const G1 = "#1A1A1A";
const G2 = "#555555";
const G3 = "#999999";
const G4 = "#C4C4C4";
const G5 = "#E8E8E8";
const GR = "#34C759";
const OR = "#FF9500";
const RE = "#FF3B30";

const PHRASES = [
  { t: "Tu as élevé des enfants avec amour — c'est la plus belle des œuvres.", a: null },
  { t: "Le soleil de Montpellier brille encore en toi.", a: null },
  { t: "Une femme qui a travaillé toute sa vie porte en elle une force que rien n'efface.", a: null },
  { t: "Tes petits-enfants voient en toi ce que les mots ne peuvent pas dire.", a: null },
  { t: "L'amour d'une mère est la lumière que ses enfants portent toute leur vie.", a: null },
  { t: "On ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux.", a: "Antoine de Saint-Exupéry" },
  { t: "Aimer, c'est agir.", a: "Victor Hugo" },
  { t: "La vie est belle pour qui sait regarder.", a: null },
  { t: "Le cœur d'une mère est un abîme sans fond au fond duquel on trouve toujours un pardon.", a: "Honoré de Balzac" },
  { t: "Là où il y a de l'amour, il y a de la vie.", a: "Gandhi" },
  { t: "La gratitude est la mémoire du cœur.", a: "Jean-Baptiste Massieu" },
  { t: "Chaque matin, nous renaissons. Ce que nous faisons aujourd'hui importe le plus.", a: "Bouddha" },
  { t: "Un cœur qui aime ne vieillit pas.", a: "Proverbe grec" },
  { t: "الجنة تحت أقدام الأمهات.", a: "Hadith" },
  { t: "من صبر ظفر.", a: "Proverbe arabe — Qui patiente réussit." },
  { t: "الابتسامة صدقة.", a: "Hadith — Le sourire est une aumône." },
  { t: "خير الناس أنفعهم للناس.", a: "Hadith — Le meilleur est celui qui est utile aux autres." },
  { t: "Lila est là, tout près — et son amour pour toi est immense.", a: null },
  { t: "Tes enfants sont ta plus belle réussite.", a: null },
  { t: "Tu as donné tant d'amour — il te revient aujourd'hui multiplié.", a: null },
  { t: "La joie partagée est une joie doublée.", a: "Goethe" },
  { t: "Ce que tu as semé avec amour fleurit toujours.", a: null },
  { t: "Prendre soin de soi est un acte de courage.", a: null },
  { t: "القناعة كنز لا يفنى.", a: "Proverbe arabe — La sagesse est un trésor inépuisable." },
  { t: "في كل يوم جديد نعمة جديدة.", a: "Proverbe arabe — Chaque nouveau jour est une nouvelle grâce." },
  { t: "Aimez et laissez-vous aimer — c'est la sagesse suprême.", a: null },
  { t: "Ta force vient de tout ce que tu as traversé.", a: null },
  { t: "Lila t'aime. Tes petits-enfants t'aiment. Tu es entourée.", a: null },
  { t: "Le vrai voyage de découverte, c'est avoir de nouveaux yeux.", a: "Marcel Proust" },
  { t: "La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur.", a: "Bouddha" },
];

const MEDS_MATIN_DEFAULT = [
  { id: 1, name: "Pantoprazole 20mg", role: "Protège l'estomac des autres médicaments", dose: "1 comprimé entier", moment_prise: "À jeun strict · 1h avant les autres", alert: true },
  { id: 2, name: "Cosimprel 5mg/5mg", role: "Fait baisser la tension et protège le cœur", dose: "½ comprimé", moment_prise: "Avant de manger", alert: false },
  { id: 3, name: "Amiodarone 200mg", role: "Régule le rythme du cœur — évite les palpitations", dose: "1 comprimé", moment_prise: "Pendant le repas", alert: false },
  { id: 4, name: "Furosémide 40mg", role: "Élimine l'eau en trop dans le corps", dose: "1 comprimé", moment_prise: "Pendant le repas", alert: false },
  { id: 5, name: "Diffu-K 600mg", role: "Remplace le potassium perdu — indispensable", dose: "1 gélule", moment_prise: "Ne jamais sauter", alert: true },
  { id: 6, name: "Aldactone 25mg", role: "Diurétique doux qui protège aussi le cœur", dose: "1 comprimé", moment_prise: "1ère prise du jour", alert: false },
  { id: 7, name: "Eliquis 2,5mg", role: "Fluidifie le sang pour éviter les caillots", dose: "1 comprimé", moment_prise: "1ère prise du jour", alert: false },
  { id: 8, name: "Orocal Vitamine D3", role: "Renforce les os et apporte du calcium", dose: "1 comprimé à croquer", moment_prise: "", alert: false },
  { id: 9, name: "Forxiga 10mg", role: "Aide à contrôler le diabète", dose: "1 comprimé", moment_prise: "Avec ½ verre d'eau", alert: false },
];
const MEDS_SOIR_DEFAULT = [
  { id: 10, name: "Eliquis 2,5mg", role: "Fluidifie le sang — 2ème prise", dose: "1 comprimé", moment_prise: "", alert: false },
  { id: 11, name: "Aldactone 25mg", role: "Diurétique doux — 2ème prise", dose: "1 comprimé", moment_prise: "", alert: false },
];
const MEDS_MENSUEL_DEFAULT = [
  { id: 12, name: "Uvedose 50 000 UI", role: "Vitamine D mensuelle pour les os et l'immunité", dose: "1 ampoule", moment_prise: "Pure ou diluée dans un verre d'eau", alert: false, date_prise: "" },
];

const NUTRITION = {
  coeur: {
    label: "Cœur & Tension", emoji: "❤️",
    ok: ["Poisson gras (saumon, maquereau, sardines)", "Légumes verts frais", "Fruits frais", "Huile d'olive", "Légumineuses", "Noix et amandes"],
    limiter: ["Viande rouge (1 fois/semaine)", "Fromage (petites portions)", "Pain blanc"],
    eviter: ["Sel ajouté — réduire au maximum", "Charcuteries", "Plats industriels", "Alcool"],
  },
  diabete: {
    label: "Diabète", emoji: "🩸",
    ok: ["Légumes non féculents", "Protéines maigres", "Céréales complètes", "Baies, pomme, poire", "Eau, tisanes"],
    limiter: ["Riz et pâtes (petites portions)", "Pain complet", "Banane, raisin"],
    eviter: ["Sucre ajouté", "Sodas et jus de fruits", "Viennoiseries", "Desserts sucrés"],
  },
  anticoag: {
    label: "Anticoagulants", emoji: "💊",
    ok: ["Viandes, poissons, œufs", "Produits laitiers", "Légumes en quantité stable"],
    limiter: ["Choux, épinards — quantité constante", "Ail, gingembre en excès"],
    eviter: ["Pamplemousse", "Millepertuis", "Alcool"],
  },
};

const TABS = [
  { id: "accueil", label: "Accueil" },
  { id: "carnet", label: "Journal" },
  { id: "medicaments", label: "Médicaments" },
  { id: "nutrition", label: "Nutrition" },
  { id: "presence", label: "Présence" },
];

const Icon = ({ name, size = 22, color = G4, strokeWidth = 1.7 }) => {
  const s = { width: size, height: size, flexShrink: 0 };
  const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "home") return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>;
  if (name === "person") return <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"/></svg>;
  if (name === "pill") return <svg style={s} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="8" height="18" rx="4"/><rect x="13" y="3" width="8" height="18" rx="4"/><line x1="3" y1="12" x2="11" y2="12"/><line x1="13" y1="12" x2="21" y2="12"/></svg>;
  if (name === "book") return <svg style={s} viewBox="0 0 24 24" {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>;
  if (name === "leaf") return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M21 3C21 3 15 3 9 9c-4 4-5 9-5 9s5-1 9-5c6-6 8-10 8-10z"/><path d="M3 21l5-5"/></svg>;
  if (name === "clock") return <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>;
  if (name === "logout") return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
  if (name === "edit") return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>;
  if (name === "trash") return <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>;
  if (name === "check") return <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="20 6 9 17 4 12"/></svg>;
  return null;
};

const getDayOfYear = () => { const n = new Date(); return Math.floor((n - new Date(n.getFullYear(), 0, 0)) / 86400000); };
const fmtH = (ts) => ts ? new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—";
const fmtD = (ts) => ts ? new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "";
const loadL = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const saveL = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: G3, letterSpacing: "0.9px", textTransform: "uppercase", marginBottom: 10 }}>{children}</div>
);

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background: W, borderRadius: 16, padding: "16px 18px", marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.05)", cursor: onClick ? "pointer" : "default", ...style }}>
    {children}
  </div>
);

const toRow = (med, moment) => ({
  id: med.id,
  moment,
  name: med.name,
  role: med.role || "",
  dose: med.dose || "",
  moment_prise: med.moment_prise || "",
  alert: med.alert || false,
  checked: med.checked || false,
  date_prise: med.date_prise || "",
});

const fromRow = (row) => ({
  id: row.id,
  name: row.name,
  role: row.role,
  dose: row.dose,
  moment_prise: row.moment_prise,
  alert: row.alert,
  checked: row.checked,
  date_prise: row.date_prise,
});

export default function RosaCare() {
  const [tab, setTab] = useState("accueil");
  const [medsMatin, setMedsMatin] = useState([]);
  const [medsSoir, setMedsSoir] = useState([]);
  const [medsMensuel, setMedsMensuel] = useState([]);
  const [medsLoaded, setMedsLoaded] = useState(false);
  const [moment, setMoment] = useState("matin");
  const [showInter, setShowInter] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [nutr, setNutr] = useState("coeur");
  const [notes, setNotes] = useState([]);
  const [showNote, setShowNote] = useState(false);
  const [noteAuteur, setNoteAuteur] = useState("Lila");
  const [rdvList, setRdvList] = useState([]);
  const [showRdv, setShowRdv] = useState(false);
  const [rdvDraft, setRdvDraft] = useState({ id: null, titre: "", date: "", heure: "", lieu: "", commentaire: "" });
  const [noteCat, setNoteCat] = useState("Notes");
  const [photo, setPhoto] = useState(null);
  const [presences, setPresences] = useState([]);
  const [loadingP, setLoadingP] = useState(false);

  const newMed = useRef({ name: "", role: "", dose: "", moment_prise: "" });
  const noteRef = useRef(null);
  const rdvTitreRef = useRef(null);
  const rdvDateRef = useRef(null);
  const rdvHeureRef = useRef(null);
  const rdvLieuRef = useRef(null);
  const rdvCommentaireRef = useRef(null);
  const photoRef = useRef(null);

  // ── Charger médicaments depuis Supabase ──────────────────
  const fetchMeds = async () => {
    const { data } = await supabase.from("medicaments").select("*").order("id");
    if (data && data.length > 0) {
      const todayStr = new Date().toDateString();
      const savedDate = loadL("rc_date", null);
      const freshDay = savedDate !== todayStr;
      setMedsMatin(data.filter(r => r.moment === "matin").map(r => ({ ...fromRow(r), checked: freshDay ? false : r.checked })));
      setMedsSoir(data.filter(r => r.moment === "soir").map(r => ({ ...fromRow(r), checked: freshDay ? false : r.checked })));
      setMedsMensuel(data.filter(r => r.moment === "mensuel").map(r => fromRow(r)));
      if (freshDay) saveL("rc_date", todayStr);
    } else {
      // Première fois — insérer les médicaments par défaut
      const allDefault = [
        ...MEDS_MATIN_DEFAULT.map(m => toRow({ ...m, checked: false }, "matin")),
        ...MEDS_SOIR_DEFAULT.map(m => toRow({ ...m, checked: false }, "soir")),
        ...MEDS_MENSUEL_DEFAULT.map(m => toRow({ ...m, checked: false }, "mensuel")),
      ];
      await supabase.from("medicaments").insert(allDefault);
      setMedsMatin(MEDS_MATIN_DEFAULT.map(m => ({ ...m, checked: false })));
      setMedsSoir(MEDS_SOIR_DEFAULT.map(m => ({ ...m, checked: false })));
      setMedsMensuel(MEDS_MENSUEL_DEFAULT.map(m => ({ ...m, checked: false })));
      saveL("rc_date", new Date().toDateString());
    }
    setMedsLoaded(true);
  };

  const updateMedInDB = async (med, mo) => {
    await supabase.from("medicaments").upsert(toRow(med, mo));
  };

  const fetchPresences = async () => {
    const { data } = await supabase.from("presences").select("*").order("heure", { ascending: false }).limit(20);
    if (data) setPresences(data);
  };

  const fetchNotes = async () => {
    const { data } = await supabase.from("carnet").select("*").order("created_at", { ascending: false });
    if (data) setNotes(data);
  };
  const fetchRdv = async () => {
  const { data } = await supabase.from("rendezVous").select("*").order("date_rdv", { ascending: true });
  if (data) setRdvList(data);
};

  useEffect(() => {
    fetchMeds();
    fetchPresences();
    fetchNotes();
    fetchRdv();

    const channel = supabase
      .channel("rosacare-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "presences" }, () => fetchPresences())
      .on("postgres_changes", { event: "*", schema: "public", table: "carnet" }, () => fetchNotes())
      .on("postgres_changes", { event: "*", schema: "public", table: "rendezVous" }, () => fetchRdv())
      .on("postgres_changes", { event: "*", schema: "public", table: "medicaments" }, () => fetchMeds())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const logP = async (action, who) => {
    setLoadingP(true);
    await supabase.from("presences").insert([{ action, saisie_par: who }]);
    await fetchPresences();
    setLoadingP(false);
  };

  const lastP = (who, action) => presences.find(p => p.saisie_par === who && p.action === action);
  const statut = (who) => presences.find(p => p.saisie_par === who)?.action || null;

  const toggleMed = async (list, setList, id, mo) => {
    const updated = list.map(m => m.id === id ? { ...m, checked: !m.checked } : m);
    setList(updated);
    const med = updated.find(m => m.id === id);
    await updateMedInDB(med, mo);
  };

  const delMed = async (mo, id) => {
    if (mo === "matin") setMedsMatin(x => x.filter(m => m.id !== id));
    else if (mo === "soir") setMedsSoir(x => x.filter(m => m.id !== id));
    else setMedsMensuel(x => x.filter(m => m.id !== id));
    await supabase.from("medicaments").delete().eq("id", id);
  };

  const saveMedEdit = async (mo, id, fields) => {
    const update = (list, set) => {
      const updated = list.map(m => m.id === id ? { ...m, ...fields } : m);
      set(updated);
      const med = updated.find(m => m.id === id);
      updateMedInDB(med, mo);
    };
    if (mo === "matin") update(medsMatin, setMedsMatin);
    else if (mo === "soir") update(medsSoir, setMedsSoir);
    else update(medsMensuel, setMedsMensuel);
    setEditingMed(null);
  };

  const valAll = async (mo) => {
    if (mo === "matin") {
      const updated = medsMatin.map(m => ({ ...m, checked: true }));
      setMedsMatin(updated);
      for (const m of updated) await updateMedInDB(m, "matin");
    } else if (mo === "soir") {
      const updated = medsSoir.map(m => ({ ...m, checked: true }));
      setMedsSoir(updated);
      for (const m of updated) await updateMedInDB(m, "soir");
    } else {
      const updated = medsMensuel.map(m => ({ ...m, checked: true }));
      setMedsMensuel(updated);
      for (const m of updated) await updateMedInDB(m, "mensuel");
    }
  };

  const addMed = async () => {
    const name = newMed.current.name?.trim();
    if (!name) return;
    const entry = {
      id: Date.now(),
      name,
      role: newMed.current.role?.trim() || "",
      dose: newMed.current.dose?.trim() || "",
      moment_prise: newMed.current.moment_prise?.trim() || "",
      alert: false,
      checked: false,
      date_prise: "",
    };
    if (moment === "matin") setMedsMatin(x => [...x, entry]);
    else if (moment === "soir") setMedsSoir(x => [...x, entry]);
    else setMedsMensuel(x => [...x, entry]);
    await supabase.from("medicaments").insert(toRow(entry, moment));
    newMed.current = { name: "", role: "", dose: "", moment_prise: "" };
    setShowAddMed(false);
  };

  const updDate = async (id, date) => {
    const updated = medsMensuel.map(m => m.id === id ? { ...m, date_prise: date } : m);
    setMedsMensuel(updated);
    const med = updated.find(m => m.id === id);
    await updateMedInDB(med, "mensuel");
  };

  const addNote = async () => {
    const text = noteRef.current?.value?.trim();
    if (!text) return;
    await supabase.from("carnet").insert([{ categorie: noteCat, texte: text, auteur: noteAuteur }]);
    if (noteRef.current) noteRef.current.value = "";
    setShowNote(false);
    await fetchNotes();
  };

  const getMedList = () =>
    moment === "matin" ? [medsMatin, setMedsMatin] :
    moment === "soir" ? [medsSoir, setMedsSoir] :
    [medsMensuel, setMedsMensuel];

  const phrase = PHRASES[getDayOfYear() % PHRASES.length];
  const checkedM = medsMatin.filter(m => m.checked).length;
  const checkedS = medsSoir.filter(m => m.checked).length;
  const totalM = medsMatin.length;
  const totalS = medsSoir.length;

  const Avatar = ({ nom, size = 38 }) => {
    const st = statut(nom);
    const bg = st === "arrivee" ? GR : st === "depart" ? OR : G4;
    return <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: W, flexShrink: 0 }}>{nom[0]}</div>;
  };

  const EditModal = ({ med, mo }) => {
    const [f, setF] = useState({ name: med.name, role: med.role, dose: med.dose, moment_prise: med.moment_prise || "" });
    const inp = (label, key) => (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G3, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
        <input value={f[key]} onChange={e => setF(p => ({ ...p, [key]: e.target.value }))}
          style={{ width: "100%", border: `1.5px solid ${G5}`, background: BG, borderRadius: 10, padding: "11px 13px", fontSize: 15, color: G1, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
      </div>
    );
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 999 }}>
        <div style={{ background: W, borderRadius: "20px 20px 0 0", padding: "24px 20px 32px", width: "100%", maxWidth: 390 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: G1, marginBottom: 18 }}>Modifier le médicament</div>
          {inp("Nom", "name")}{inp("À quoi il sert", "role")}{inp("Dose", "dose")}{inp("Moment de prise", "moment_prise")}
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={() => setEditingMed(null)} style={{ flex: 1, padding: 13, background: G5, color: G2, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Annuler</button>
            <button onClick={() => saveMedEdit(mo, med.id, f)} style={{ flex: 2, padding: 13, background: B, color: W, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
          </div>
        </div>
      </div>
    );
  };

  // ── ACCUEIL ──────────────────────────────────────────────
  const Accueil = () => (
    <div style={{ paddingBottom: 28, overflowX: "hidden" }}>
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: G1, letterSpacing: "-0.4px" }}>Tableau de bord</div>
          <div style={{ fontSize: 14, color: G3, marginTop: 3 }}>
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </div>
        </div>

        <SectionLabel>Présence</SectionLabel>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {["Rosa", "Lila"].map(nom => {
            const st = statut(nom);
            const present = st === "arrivee";
            const arr = lastP(nom, "arrivee");
            const dep = lastP(nom, "depart");
            return (
              <div key={nom} style={{ flex: 1, background: W, borderRadius: 16, padding: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                  <Avatar nom={nom} size={36} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: G1 }}>{nom}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: present ? GR : st === "depart" ? OR : G4, marginTop: 1 }}>
                      {present ? "● Présente" : st === "depart" ? "○ Absente" : "—"}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <Icon name="clock" size={12} color={G3} />
                  <span style={{ fontSize: 12, color: G3 }}>Arrivée</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: G1, marginLeft: "auto" }}>{fmtH(arr?.heure)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="logout" size={12} color={G3} />
                  <span style={{ fontSize: 12, color: G3 }}>Départ</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: G1, marginLeft: "auto" }}>{fmtH(dep?.heure)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <SectionLabel>Médicaments du jour</SectionLabel>
        <Card onClick={() => setTab("medicaments")} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: G1, letterSpacing: "-0.3px" }}>
                {checkedM + checkedS} sur {totalM + totalS} pris
              </div>
              <div style={{ fontSize: 13, color: G3, marginTop: 2 }}>
                {totalM + totalS - checkedM - checkedS > 0
                  ? `${totalM + totalS - checkedM - checkedS} restant${totalM + totalS - checkedM - checkedS > 1 ? "s" : ""}`
                  : "✓ Tout pris pour aujourd'hui"}
              </div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: BL, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="pill" size={20} color={B} />
            </div>
          </div>
          <div style={{ height: 4, background: G5, borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ height: "100%", background: checkedM + checkedS === totalM + totalS && totalM + totalS > 0 ? GR : B, width: `${totalM + totalS ? Math.round((checkedM + checkedS) / (totalM + totalS) * 100) : 0}%`, borderRadius: 2, transition: "width 0.4s" }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[{ label: "Matin", checked: checkedM, total: totalM }, { label: "Soir", checked: checkedS, total: totalS }].map(({ label, checked, total }) => (
              <div key={label} style={{ flex: 1, background: BG, borderRadius: 10, padding: "9px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: G3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: checked === total && total > 0 ? GR : G1 }}>{checked}/{total}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: B }}>Voir les médicaments →</div>
        </Card>

        <SectionLabel>Citation du jour</SectionLabel>
        <Card style={{ textAlign: "center", padding: "20px 18px", marginBottom: 18 }}>
          <div style={{ fontSize: 32, color: G3, opacity: 0.25, lineHeight: 0.7, marginBottom: 12, fontFamily: "Georgia, serif" }}>"</div>
          <div style={{ fontSize: 15, color: G2, lineHeight: 1.7, fontStyle: "italic" }}>"{phrase.t}"</div>
          {phrase.a && <div style={{ fontSize: 12, color: G3, marginTop: 10, fontWeight: 600 }}>— {phrase.a}</div>}
        </Card>

        <SectionLabel>Souvenir du jour</SectionLabel>
        <div style={{ background: W, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.05)", marginBottom: 0 }}>
          <div style={{ width: "100%", height: 200, background: BG, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {photo
              ? <img src={photo} alt="souvenir" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ textAlign: "center" }}><div style={{ fontSize: 32, marginBottom: 8 }}>🌸</div><div style={{ fontSize: 13, color: G3 }}>Ajoutez une photo souvenir</div></div>}
          </div>
          <div style={{ padding: "14px 16px" }}>
            {photo && <div style={{ fontSize: 12, color: G3, marginBottom: 8 }}>{fmtD(new Date())}</div>}
            <button onClick={() => photoRef.current?.click()} style={{ width: "100%", background: B, color: W, border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              + Ajouter un souvenir
            </button>
          </div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) setPhoto(URL.createObjectURL(f)); }} />
      </div>
      <div style={{ height: 28 }} />
    </div>
  );

  // ── PRÉSENCE ─────────────────────────────────────────────
  const Presence = () => (
    <div style={{ padding: "20px 16px 28px", overflowX: "hidden" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: G1, letterSpacing: "-0.4px", marginBottom: 3 }}>Présence</div>
      <div style={{ fontSize: 13, color: G3, marginBottom: 20 }}>Informez la famille en temps réel</div>
      {["Rosa", "Lila"].map(nom => {
        const st = statut(nom);
        const present = st === "arrivee";
        const arr = lastP(nom, "arrivee");
        const dep = lastP(nom, "depart");
        return (
          <Card key={nom}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <Avatar nom={nom} size={46} />
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: G1 }}>{nom}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: present ? GR : st === "depart" ? OR : G4, marginTop: 2 }}>
                  {present ? "● Présente" : st === "depart" ? "○ Absente" : "Aucune information"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[{ label: "Arrivée", val: fmtH(arr?.heure), date: arr ? fmtD(arr.heure) : null },
                { label: "Départ", val: fmtH(dep?.heure), date: dep ? fmtD(dep.heure) : null }].map(({ label, val, date }) => (
                <div key={label} style={{ flex: 1, background: BG, borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: G3, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: G1 }}>{val}</div>
                  {date && <div style={{ fontSize: 11, color: G3, marginTop: 2 }}>{date}</div>}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => logP("arrivee", nom)} disabled={loadingP} style={{ flex: 1, background: GR, color: W, border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🏠 J'arrive</button>
              <button onClick={() => logP("depart", nom)} disabled={loadingP} style={{ flex: 1, background: OR, color: W, border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🚶 Je pars</button>
            </div>
          </Card>
        );
      })}
      <SectionLabel>Historique</SectionLabel>
      {presences.length === 0
        ? <Card style={{ textAlign: "center", color: G3, padding: 24 }}>Aucune présence enregistrée</Card>
        : presences.slice(0, 10).map(p => (
          <Card key={p.id} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: p.action === "arrivee" ? "#EDFAF1" : "#FFF4E6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
              {p.action === "arrivee" ? "🏠" : "🚶"}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: G1 }}>{p.saisie_par} · {p.action === "arrivee" ? "Arrivée" : "Départ"}</div>
              <div style={{ fontSize: 12, color: G3, marginTop: 2 }}>{fmtD(p.heure)} à {fmtH(p.heure)}</div>
            </div>
          </Card>
        ))}
      <div style={{ height: 20 }} />
    </div>
  );

  // ── MÉDICAMENTS ──────────────────────────────────────────
  const Medicaments = () => {
    const [list] = getMedList();
    return (
      <div style={{ padding: "20px 16px 28px", overflowX: "hidden" }}>
        {editingMed && <EditModal med={editingMed.med} mo={editingMed.mo} />}
        <div style={{ fontSize: 20, fontWeight: 700, color: G1, letterSpacing: "-0.4px", marginBottom: 3 }}>Médicaments</div>
        <div style={{ fontSize: 13, color: G3, marginBottom: 18 }}>Ce que chaque comprimé fait pour vous</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {["matin", "soir", "mensuel"].map(m => (
            <button key={m} onClick={() => setMoment(m)} style={{ flex: 1, padding: "9px 4px", borderRadius: 10, background: moment === m ? B : G5, color: moment === m ? W : G2, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              {m === "matin" ? "☀️ Matin" : m === "soir" ? "🌙 Soir" : "📅 Mensuel"}
            </button>
          ))}
        </div>
        {moment === "matin" && (
          <div style={{ background: "#FFFBEE", borderRadius: 12, padding: "11px 14px", marginBottom: 14, border: "1px solid #FFE5A0", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Icon name="clock" size={14} color="#7A5400" />
            <div style={{ fontSize: 12, color: "#7A5400", fontWeight: 600, lineHeight: 1.5 }}>Commencer par le Pantoprazole 1h avant les autres médicaments, à jeun strict.</div>
          </div>
        )}
        {!medsLoaded ? (
          <div style={{ textAlign: "center", padding: 40, color: G3, fontSize: 14 }}>Chargement…</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {list.map(med => (
              <div key={med.id} style={{ background: W, borderRadius: 14, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.05)", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div onClick={() => toggleMed(list, moment === "matin" ? setMedsMatin : moment === "soir" ? setMedsSoir : setMedsMensuel, med.id, moment)} style={{ flex: 1, cursor: "pointer" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: med.checked ? G4 : G1, textDecoration: med.checked ? "line-through" : "none", marginBottom: 3 }}>{med.name}</div>
                  <div style={{ fontSize: 12, color: med.alert ? OR : G3, marginBottom: 5, lineHeight: 1.4 }}>{med.role}</div>
                  {med.dose && (
                    <div style={{ display: "inline-flex", alignItems: "center", background: BG, borderRadius: 6, padding: "3px 9px" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: B }}>{med.dose}</span>
                      {med.moment_prise ? <span style={{ fontSize: 12, color: G3, marginLeft: 5 }}>· {med.moment_prise}</span> : null}
                    </div>
                  )}
                  {moment === "mensuel" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 8 }}>
                      <span style={{ fontSize: 11, color: G3, fontWeight: 600 }}>Dernière prise :</span>
                      <input type="date" value={med.date_prise || ""} onChange={e => updDate(med.id, e.target.value)} onClick={e => e.stopPropagation()} style={{ fontSize: 12, border: `1px solid ${G5}`, borderRadius: 7, padding: "3px 8px", color: G1, background: BG, outline: "none", fontFamily: "inherit" }} />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, alignItems: "center", paddingTop: 1 }}>
                  <div onClick={() => toggleMed(list, moment === "matin" ? setMedsMatin : moment === "soir" ? setMedsSoir : setMedsMensuel, med.id, moment)} style={{ width: 26, height: 26, borderRadius: 7, background: med.checked ? B : W, border: `2px solid ${med.checked ? B : med.alert ? OR : G5}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                    {med.checked && <Icon name="check" size={13} color={W} strokeWidth={2.5} />}
                  </div>
                  <button onClick={() => setEditingMed({ med, mo: moment })} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                    <Icon name="edit" size={15} color={G3} />
                  </button>
                  <button onClick={() => delMed(moment, med.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                    <Icon name="trash" size={15} color={G4} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={() => valAll(moment)} style={{ flex: 1, background: GR, color: W, border: "none", borderRadius: 12, padding: "12px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✓ Valider {moment}</button>
          <button onClick={() => setShowAddMed(v => !v)} style={{ flex: 1, background: BL, color: B, border: "none", borderRadius: 12, padding: "12px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Ajouter</button>
        </div>
        {showAddMed && (
          <div style={{ background: BG, borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: G1, marginBottom: 12 }}>Nouveau médicament</div>
            {[{ ph: "Nom *", key: "name" }, { ph: "À quoi il sert", key: "role" }, { ph: "Dose (ex: 1 comprimé)", key: "dose" }, { ph: "Moment (ex: pendant le repas)", key: "moment_prise" }].map(({ ph, key }) => (
              <input key={key} placeholder={ph} onChange={e => { newMed.current[key] = e.target.value; }} style={{ width: "100%", border: `1px solid ${G5}`, background: W, borderRadius: 10, padding: "11px 13px", fontSize: 14, color: G1, marginBottom: 8, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowAddMed(false)} style={{ flex: 1, padding: 11, background: W, color: G3, border: `1px solid ${G5}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Annuler</button>
              <button onClick={addMed} style={{ flex: 2, padding: 11, background: B, color: W, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            </div>
          </div>
        )}
        <button onClick={() => setShowInter(v => !v)} style={{ width: "100%", background: "#FFFBEE", color: "#7A5400", border: "1px solid #FFE5A0", borderRadius: 12, padding: "12px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
          <span>⚠️ Interactions importantes</span><span>{showInter ? "▲" : "▼"}</span>
        </button>
        {showInter && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
            {[
              { titre: "Amiodarone + Eliquis", texte: "L'Amiodarone amplifie l'effet de l'Eliquis. Surveiller : saignements des gencives, urines foncées, bleus inhabituels." },
              { titre: "Furosémide + Diffu-K", texte: "Le Diffu-K est indispensable à chaque prise de Furosémide. Ne jamais l'oublier." },
              { titre: "Forxiga + Furosémide", texte: "Double effet diurétique. Bien s'hydrater, surtout par temps chaud." },
              { titre: "Cosimprel + Furosémide", texte: "Peut faire baisser la tension. Se lever doucement pour éviter les vertiges." },
            ].map((inter, i) => (
              <div key={i} style={{ background: "#FFFBEE", borderRadius: 12, padding: "12px 14px", border: "1px solid #FFE5A0" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#7A5400", marginBottom: 4 }}>{inter.titre}</div>
                <div style={{ fontSize: 12, color: "#7A5400", lineHeight: 1.5, opacity: 0.85 }}>{inter.texte}</div>
              </div>
            ))}
            <div style={{ background: BL, borderRadius: 12, padding: "12px 14px", border: `1px solid ${B}22` }}>
              <div style={{ fontSize: 12, color: B, fontWeight: 600, lineHeight: 1.5 }}>ℹ️ En cas de doute, consultez votre médecin ou votre pharmacien avant tout changement de traitement.</div>
            </div>
          </div>
        )}
        <div style={{ height: 20 }} />
      </div>
    );
  };

  // ── CARNET ───────────────────────────────────────────────
  const Carnet = () => (
    <div style={{ padding: "20px 16px 28px", overflowX: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: G1, letterSpacing: "-0.4px" }}>Mon journal</div>
          <div style={{ fontSize: 13, color: G3, marginTop: 2 }}>Notes et rendez-vous</div>
        </div>
        
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {["Notes", "Rendez-vous"].map(cat => (
          <button key={cat} onClick={() => setNoteCat(cat)} style={{ flex: 1, padding: "9px 6px", borderRadius: 10, background: noteCat === cat ? B : G5, color: noteCat === cat ? W : G2, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{cat}</button>
        ))}
      </div>
      {noteCat === "Notes" && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <button onClick={() => setShowNote(v => !v)}
            style={{ width: 34, height: 34, background: B, color: W, border: "none", borderRadius: "50%", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
        </div>
      )}
      {showNote && noteCat ==="Notes" && (
        <div style={{ background: BG, borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <select value={noteAuteur} onChange={e => setNoteAuteur(e.target.value)} style={{ width: "100%", padding: "10px 13px", border: `1px solid ${G5}`, background: W, borderRadius: 10, fontSize: 14, color: G1, marginBottom: 8, outline: "none", fontFamily: "inherit" }}>
            <option value="Lila">Lila</option>
            <option value="Rosa">Rosa</option>
          </select>
          <textarea ref={noteRef} placeholder="Écrivez votre note ici..." style={{ width: "100%", minHeight: 90, border: `1px solid ${G5}`, background: W, borderRadius: 12, padding: "12px 14px", fontSize: 14, color: G1, resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.6 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={() => setShowNote(false)} style={{ flex: 1, padding: 11, background: W, color: G3, border: `1px solid ${G5}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Annuler</button>
            <button onClick={addNote} style={{ flex: 2, padding: 11, background: B, color: W, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
          </div>
        </div>
      )}
      {noteCat ==="Notes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notes.filter(n => n.categorie ==="Notes").length === 0 ? (
            <div style={{ background: W, borderRadius: 14, padding: "22px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.18 }}>📋</div>
              <div style={{ fontSize: 13, color: G4 }}>Aucune note enregistrée</div>
            </div>
          ) : notes.filter(n => n.categorie ==="Notes").map((note, i) => (
            <Card key={note.id || i} style={{ marginBottom: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: B }}>{fmtD(note.created_at)}</div>
                  {note.auteur && <div style={{ fontSize: 11, color: G3, marginTop: 2 }}>{note.auteur}</div>}
                </div>
                <button onClick={async () => {
                  await supabase.from("carnet").delete().eq("id", note.id);
                  setNotes(prev => prev.filter(n => n.id !== note.id));
                }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: G4, padding: 4 }}>🗑️</button>
              </div>
              <div style={{ fontSize: 14, color: G2, lineHeight: 1.6 }}>{note.texte}</div>
            </Card>
          ))}
        </div>
      )}
      {noteCat === "Rendez-vous" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
            <button onClick={() => { setRdvDraft({ id: null, titre: "", date: "", heure: "", lieu: "", commentaire: "" }); setShowRdv(true); }}
              style={{ width: 34, height: 34, background: B, color: W, border: "none", borderRadius: "50%", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
          {showRdv && (
            <div style={{ background: BG, borderRadius: 14, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: G1, marginBottom: 10 }}>{rdvDraft.id ? "Modifier" : "Ajouter un rendez-vous"}</div>
              <input ref={rdvTitreRef} type="text" placeholder="Titre (ex: Cardiologue)" defaultValue={rdvDraft.titre}
                style={{ width: "100%", padding: "10px 13px", border: `1px solid ${G5}`, background: W, borderRadius: 10, fontSize: 14, color: G1, marginBottom: 8, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
              <input ref={rdvDateRef} type="date" defaultValue={rdvDraft.date}
                style={{ width: "100%", padding: "10px 13px", border: `1px solid ${G5}`, background: W, borderRadius: 10, fontSize: 14, color: G1, marginBottom: 8, outline: "none", boxSizing: "border-box" }} />
              <input ref={rdvHeureRef} type="time" defaultValue={rdvDraft.heure}
                style={{ width: "100%", padding: "10px 13px", border: `1px solid ${G5}`, background: W, borderRadius: 10, fontSize: 14, color: G1, marginBottom: 8, outline: "none", boxSizing: "border-box" }} />
              <input ref={rdvLieuRef} type="text" placeholder="Lieu (ex: Clinique Saint-Jean)" defaultValue={rdvDraft.lieu}
                style={{ width: "100%", padding: "10px 13px", border: `1px solid ${G5}`, background: W, borderRadius: 10, fontSize: 14, color: G1, marginBottom: 8, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
              <textarea ref={rdvCommentaireRef} placeholder="Commentaire (optionnel)" defaultValue={rdvDraft.commentaire}
                style={{ width: "100%", minHeight: 70, border: `1px solid ${G5}`, background: W, borderRadius: 10, padding: "10px 13px", fontSize: 14, color: G1, resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowRdv(false)} style={{ flex: 1, padding: 11, background: W, color: G3, border: `1px solid ${G5}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Annuler</button>
                <button onClick={async () => {
                  const titre = rdvTitreRef.current?.value?.trim();
                  const date = rdvDateRef.current?.value;
                  if (!titre || !date) return;
                  const payload = { titre, date_rdv: date, heure: rdvHeureRef.current?.value || "", lieu: rdvLieuRef.current?.value?.trim() || "", commentaire: rdvCommentaireRef.current?.value?.trim() || "" };
                  if (rdvDraft.id) {
                    await supabase.from("rendezVous").update(payload).eq("id", rdvDraft.id);
                  } else {
                    await supabase.from("rendezVous").insert([payload]);
                  }
                  await fetchRdv();
                  setShowRdv(false);
                }} style={{ flex: 2, padding: 11, background: B, color: W, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
              </div>
            </div>
          )}
          {rdvList.length === 0 ? (
            <div style={{ background: W, borderRadius: 14, padding: "22px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.18 }}>📅</div>
              <div style={{ fontSize: 13, color: G4 }}>Aucun rendez-vous enregistré</div>
            </div>
          ) : rdvList.map(rdv => (
            <Card key={rdv.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: G1, marginBottom: 4 }}>{rdv.titre}</div>
                  <div style={{ fontSize: 13, color: B, fontWeight: 600 }}>📅 {rdv.date_rdv ? new Date(rdv.date_rdv).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ""} {rdv.heure && `· ${rdv.heure}`}</div>
                  {rdv.lieu && <div style={{ fontSize: 12, color: G3, marginTop: 2 }}>📍 {rdv.lieu}</div>}
                  {rdv.commentaire && <div style={{ fontSize: 12, color: G3, marginTop: 4, fontStyle: "italic" }}>{rdv.commentaire}</div>}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => { setRdvDraft({ id: rdv.id, titre: rdv.titre, date: rdv.date_rdv, heure: rdv.heure, lieu: rdv.lieu, commentaire: rdv.commentaire }); setShowRdv(true); }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: G3, padding: 4 }}>✏️</button>
                  <button onClick={async () => {
                    await supabase.from("rendezVous").delete().eq("id", rdv.id);
                    setRdvList(prev => prev.filter(r => r.id !== rdv.id));
                  }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: G4, padding: 4 }}>🗑️</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div style={{ height: 20 }} />
    </div>
  );

  // ── NUTRITION ────────────────────────────────────────────
  const Nutrition = () => {
    const cat = NUTRITION[nutr];
    return (
      <div style={{ padding: "20px 16px 28px", overflowX: "hidden" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: G1, letterSpacing: "-0.4px", marginBottom: 3 }}>Nutrition</div>
        <div style={{ fontSize: 13, color: G3, marginBottom: 18 }}>Conseils adaptés à votre profil</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          {Object.entries(NUTRITION).map(([key, val]) => (
            <button key={key} onClick={() => setNutr(key)} style={{ flex: 1, padding: "9px 4px", borderRadius: 10, background: nutr === key ? B : G5, color: nutr === key ? W : G2, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", lineHeight: 1.5 }}>
              {val.emoji}<br />{val.label}
            </button>
          ))}
        </div>
        {[{ color: GR, label: "Recommandé", items: cat.ok }, { color: OR, label: "Avec modération", items: cat.limiter }, { color: RE, label: "À éviter", items: cat.eviter }].map(section => (
          <Card key={section.label}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: section.color }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: section.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{section.label}</div>
            </div>
            {section.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: i < section.items.length - 1 ? `1px solid ${G5}` : "none" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: G4, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: G2 }}>{item}</span>
              </div>
            ))}
          </Card>
        ))}
        <div style={{ fontSize: 15, fontWeight: 700, color: G1, marginBottom: 12 }}>Activité physique</div>
        {[
          { emoji: "🚶", titre: "Marche quotidienne", texte: "15 à 30 minutes selon l'état de forme." },
          { emoji: "⚖️", titre: "Équilibre", texte: "Exercices doux debout, appui sur une chaise si besoin." },
          { emoji: "🤸", titre: "Étirements légers", texte: "Matin ou soir, quelques minutes suffisent." },
          { emoji: "💧", titre: "Hydratation", texte: "Boire régulièrement, surtout avec les diurétiques." },
          { emoji: "😴", titre: "Repos", texte: "Respecter les signaux de fatigue. Une sieste courte est bénéfique." },
        ].map((a, i) => (
          <Card key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", marginBottom: 8 }}>
            <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{a.emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: G1, marginBottom: 2 }}>{a.titre}</div>
              <div style={{ fontSize: 12, color: G3, lineHeight: 1.5 }}>{a.texte}</div>
            </div>
          </Card>
        ))}
        <div style={{ height: 20 }} />
      </div>
    );
  };

  const screens = { accueil: Accueil, presence: Presence, medicaments: Medicaments, carnet: Carnet, nutrition: Nutrition };
  const Screen = screens[tab];
  const tabIcons = { accueil: "home", presence: "person", medicaments: "pill", carnet: "book", nutrition: "leaf" };

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", background: "#C8C8CE", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 0" }}>
      <div style={{ width: 390, height: 844, background: BG, borderRadius: 54, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 60px 140px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.2)", flexShrink: 0 }}>

        <div style={{ background: W, padding: "50px 20px 16px", borderBottom: `1px solid ${G5}`, display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
          <img src="/rosacare-logo.png" alt="RosaCare" style={{ height: 110, maxWidth: "90%", objectFit: "contain", display: "block" }} />
        </div>
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>
          <Screen />
        </div>
        <div style={{ background: W, display: "flex", padding: "12px 4px 30px", borderTop: `1px solid ${G5}`, flexShrink: 0, minHeight: 70 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, border: "none", background: "none", cursor: "pointer", padding: "4px 2px" }}>
              <Icon name={tabIcons[t.id]} size={22} color={tab === t.id ? B : G4} strokeWidth={tab === t.id ? 2 : 1.6} />
              <span style={{ fontSize: 10, fontWeight: 700, color: tab === t.id ? B : G4 }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}