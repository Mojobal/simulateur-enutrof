import { useState } from 'react';

const sortsEnutrof = [
  { nom: "Orpaillage", pa: 4, base: 530, crit: 601, nbTour: 1 },
  { nom: "Pelle aurifère", pa: 4, base: 573, crit: 656, nbTour: 1 },
  { nom: "Lancer de pièce", pa: 2, base: 376, crit: 409, nbTour: 3 },
  { nom: "Tamisage", pa: 3, base: 505, crit: 569, nbTour: 1 },
  { nom: "Obsolescence", pa: 3, base: 507, crit: 573, nbTour: 2 },
  { nom: "Pelle des anciens", pa: 4, base: 634, crit: 734, nbTour: 1 },
  { nom: "Monnaie Sonnante", pa: 4, base: 918, crit: 988, nbTour: 1 },
  { nom: "Bêche des Anciens", pa: 4, base: 970, crit: 1046, nbTour: 2 },
  { nom: "Abattement", pa: 3, base: 757, crit: 808, nbTour: 2 },
  { nom: "Banqueroute", pa: 4, base: 1043, crit: 1129, nbTour: 2 },
  { nom: "Opportunité", pa: 2, base: 619, crit: 652, nbTour: 2, effet: "puissance", gain: 80, duree: 2 },
];

export default function App() {
  const [stats, setStats] = useState({
    chance: 500,
    force: 500,
    intelligence: 500,
    agilite: 500,
    puissance: 0,
    doFeu: 0,
    doEau: 40,
    doAir: 0,
    doTerre: 0,
    critSup: 0.25,
    dofus: {
      ocre: true,
      turquoise: true,
      vulbis: true,
    },
    paBase: 11,
  });

  const [resultats, setResultats] = useState([]);

  const getTotalPA = () => stats.paBase + (stats.dofus.ocre ? 1 : 0);

  const calculerDegats = (sort, critRate) => {
    const base = (sort.base * (1 - critRate)) + (sort.crit * critRate);
    const total = base + stats.chance + stats.puissance + stats.doEau;
    return Math.round(total);
  };

  const simuler = () => {
    let paRestants = getTotalPA();
    let tour = [];
    let statsBoostees = { ...stats };

    const sorts = [...sortsEnutrof];
    if (stats.dofus.turquoise) statsBoostees.critSup += 0.1;

    let opt = sorts.find(s => s.nom === "Opportunité");
    if (opt && Math.floor(paRestants / opt.pa) > 0) {
      paRestants -= opt.pa;
      tour.push({ sort: opt.nom, degats: calculerDegats(opt, statsBoostees.critSup), pa: opt.pa });
      statsBoostees.puissance += opt.gain;
    }

    const autresSorts = sorts.filter(s => s.nom !== "Opportunité");
    autresSorts.sort((a, b) => ((b.base + b.crit) / 2) / b.pa - ((a.base + a.crit) / 2) / a.pa);

    for (let sort of autresSorts) {
      let casts = Math.min(Math.floor(paRestants / sort.pa), sort.nbTour);
      for (let i = 0; i < casts; i++) {
        const degats = calculerDegats(sort, statsBoostees.critSup);
        tour.push({ sort: sort.nom, degats, pa: sort.pa });
        paRestants -= sort.pa;
      }
    }
    setResultats(tour);
  };

  return (
    <div style={{ padding: 20, background: '#f3f2e9', color: '#2e1a0f' }}>
      <h1>Simulateur de Dégâts - Enutrof</h1>
      <p>Chance : {stats.chance} | Do Eau : {stats.doEau} | PA Total : {getTotalPA()}</p>
      <p>Dofus actifs : {Object.entries(stats.dofus).filter(([_, v]) => v).map(([k]) => k).join(", ")}</p>
      <button onClick={simuler} style={{ marginTop: 10, padding: 10, background: '#e0aa3e', border: 'none', fontWeight: 'bold' }}>Simuler Tour 1</button>
      <div style={{ marginTop: 20 }}>
        {resultats.map((r, i) => (
          <div key={i}>{r.sort} - {r.pa} PA - {r.degats} dégâts</div>
        ))}
        {resultats.length > 0 && (
          <p style={{ fontWeight: 'bold' }}>Total dégâts : {resultats.reduce((acc, v) => acc + v.degats, 0)}</p>
        )}
      </div>
    </div>
  );
}