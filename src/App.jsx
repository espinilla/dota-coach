import React, { useState, useEffect } from 'react';
import { Search, Sword, Shield, RotateCcw, Zap, Skull, TrendingUp, X, Menu, Crosshair } from 'lucide-react';

// --- BASE DE DATOS DEL META (SIMULADA) ---
// Datos de ejemplo para que la app funcione sin API externa por ahora.
const HEROES_DB = {
  "axe": { 
    id: 1, name: "Axe", img: "axe", role: "Offlane", 
    counters: ["Viper", "Lifestealer", "Ursa", "Necrophos"], 
    items: ["Blink Dagger", "Blade Mail", "Vanguard", "Heart of Tarrasque"],
    facets: [
      { name: "One Man Army", desc: "Más fuerza cuando está solo." },
      { name: "Call of the Blade", desc: "Chance de girar al atacar." }
    ]
  },
  "pudge": { 
    id: 2, name: "Pudge", img: "pudge", role: "Support/Core", 
    counters: ["Lifestealer", "Weaver", "Slark", "Ursa"], 
    items: ["Aether Lens", "Blink Dagger", "Aghanims Scepter", "Eternal Shroud"],
    facets: [
      { name: "Fresh Meat", desc: "Dismember aumenta fuerza permanentemente." },
      { name: "Flayer's Hook", desc: "El gancho hace más daño por distancia." }
    ]
  },
  "juggernaut": { 
    id: 3, name: "Juggernaut", img: "juggernaut", role: "Carry", 
    counters: ["Axe", "Legion Commander", "Ursa", "Sven"], 
    items: ["Battle Fury", "Manta Style", "Butterfly", "Aghanims Scepter"],
    facets: [
      { name: "Bladeform", desc: "Gana agilidad y velocidad tras atacar." },
      { name: "Bladekeeper", desc: "Omnislash hace más daño crítico." }
    ]
  },
  "sniper": { 
    id: 4, name: "Sniper", img: "sniper", role: "Mid/Carry", 
    counters: ["Spectre", "Storm Spirit", "Phantom Assassin", "Spirit Breaker"], 
    items: ["Hurricane Pike", "Daedalus", "Mjolnir", "Monkey King Bar"],
    facets: [
      { name: "Ghillie Suit", desc: "Invisible al atacar desde árboles." },
      { name: "Scattershot", desc: "Shrapnel ralentiza más." }
    ]
  },
  "lion": { 
    id: 5, name: "Lion", img: "lion", role: "Support", 
    counters: ["Rubick", "Lifestealer", "Puck", "Tidehunter"], 
    items: ["Blink Dagger", "Force Staff", "Aghanims Shard", "Ghost Scepter"],
    facets: [
      { name: "Essence Eater", desc: "Mana Drain daña enemigos." },
      { name: "Fist of Death", desc: "Finger hace daño en área cuerpo a cuerpo." }
    ]
  },
  "phantom_assassin": { 
    id: 6, name: "Phantom Assassin", img: "phantom_assassin", role: "Carry", 
    counters: ["Axe", "Troll Warlord", "Morphling", "Lion"], 
    items: ["Desolator", "Black King Bar", "Battle Fury", "Nullifier"],
    facets: [
      { name: "Veil of Mystery", desc: "Blur dura más tiempo." },
      { name: "Methodical", desc: "Críticos garantizados cada 6 golpes." }
    ]
  },
  "zeus": { 
    id: 7, name: "Zeus", img: "zuus", role: "Mid", 
    counters: ["Anti-Mage", "Templar Assassin", "Juggernaut", "Huskar"], 
    items: ["Phylactery", "Aghanims Scepter", "Octarine Core", "Kaya and Sange"],
    facets: [
      { name: "Livewire", desc: "Static Field hace daño por vida actual." },
      { name: "Divine", desc: "Más daño mágico a objetivos lejanos." }
    ]
  },
  "anti_mage": { 
    id: 8, name: "Anti-Mage", img: "antimage", role: "Carry", 
    counters: ["Legion Commander", "Grimstroke", "Outworld Destroyer", "Bloodseeker"], 
    items: ["Battle Fury", "Manta Style", "Butterfly", "Abyssal Blade"],
    facets: [
      { name: "Magebane's Mirror", desc: "Counterspell refleja hechizos." },
      { name: "Mana Thirst", desc: "Más daño si el enemigo tiene poco maná." }
    ]
  },
  "legion_commander": { 
    id: 9, name: "Legion Commander", img: "legion_commander", role: "Offlane", 
    counters: ["Troll Warlord", "Ursa", "Monkey King", "Winter Wyvern"], 
    items: ["Blink Dagger", "Blade Mail", "Desolator", "Black King Bar"],
    facets: [
      { name: "Stonehall", desc: "Overwhelming Odds da armadura." },
      { name: "Spoils of War", desc: "Duel da daño a aliados cercanos." }
    ]
  },
  "drow_ranger": { 
    id: 10, name: "Drow Ranger", img: "drow_ranger", role: "Carry", 
    counters: ["Mars", "Tusk", "Clockwerk", "Spectre"], 
    items: ["Hurricane Pike", "Butterfly", "Daedalus", "Satanic"],
    facets: [
      { name: "Vantage Point", desc: "Más daño desde terreno elevado." },
      { name: "Sidestep", desc: "Puede moverse mientras canaliza Multishot." }
    ]
  },
  "bristleback": {
    id: 11, name: "Bristleback", img: "bristleback", role: "Offlane",
    counters: ["Viper", "Slark", "Legion Commander", "Grimstroke"],
    items: ["Vanguard", "Aghanims Scepter", "Lotus Orb", "Bloodstone"],
    facets: [
      { name: "Berserk", desc: "Gana velocidad de ataque por Warpath." },
      { name: "Snot Rocket", desc: "Lanza mocos al recibir daño." }
    ]
  }
};

const IMG_BASE = "https://cdn.dota2.com/apps/dota2/images/heroes/";

export default function DotaCoachApp() {
  const [enemyHeroes, setEnemyHeroes] = useState([]);
  const [myHero, setMyHero] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [mode, setMode] = useState('draft_enemy');
  const [recommended, setRecommended] = useState([]);

  // --- BUSCADOR ---
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    const matches = Object.values(HEROES_DB).filter((h) => 
      h.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSuggestions(matches);
  }, [searchTerm]);

  // --- MOTOR DE RECOMENDACIÓN ---
  useEffect(() => {
    if (enemyHeroes.length === 0) {
      setRecommended([]);
      return;
    }
    let countersPool = [];
    enemyHeroes.forEach(enemy => {
      if (enemy.counters) {
        countersPool = [...countersPool, ...enemy.counters];
      }
    });
    // Filtramos duplicados y seleccionamos los mejores
    const uniqueCounters = [...new Set(countersPool)].slice(0, 6);
    setRecommended(uniqueCounters);
  }, [enemyHeroes]);

  const addEnemy = (hero) => {
    if (enemyHeroes.length >= 5) return alert("Ya hay 5 enemigos (Full Team).");
    if (enemyHeroes.find(h => h.id === hero.id)) return;
    setEnemyHeroes([...enemyHeroes, hero]);
    setSearchTerm('');
    setSuggestions([]);
  };

  const pickMyHero = (hero) => {
    setMyHero(hero);
    setSearchTerm('');
    setSuggestions([]);
    setMode('in_game');
  };

  const resetGame = () => {
    if(confirm("¿Nueva partida? Se borrará el draft actual.")) {
      setEnemyHeroes([]);
      setMyHero(null);
      setMode('draft_enemy');
      setSearchTerm('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans flex flex-col pb-20 selection:bg-red-900 selection:text-white">
      
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-[#1c0b0b] to-[#0a0a0a] border-b border-red-900/50 p-4 sticky top-0 z-30 shadow-2xl">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Dota_2_Logo_2.png" className="w-8 h-8 drop-shadow-lg" alt="Dota 2" />
            <div>
              <h1 className="text-lg font-bold text-gray-100 leading-none tracking-wider">META COACH</h1>
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Asistente en vivo</p>
            </div>
          </div>
          <button onClick={resetGame} className="bg-[#2a1a1a] hover:bg-red-900 text-red-200 p-2 rounded-full transition-all border border-red-900/30">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-2xl mx-auto p-4 space-y-6">

        {/* --- FASE 1: ENEMIGOS --- */}
        <div className="space-y-2">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
              <Skull size={14} /> Equipo Enemigo
            </h2>
            <span className="text-[10px] text-gray-600">{enemyHeroes.length} / 5</span>
          </div>
          
          {/* Slots de Enemigos */}
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/3] bg-[#151515] border border-gray-800 rounded relative overflow-hidden group hover:border-red-800 transition-colors">
                {enemyHeroes[i] ? (
                  <>
                    <img src={`${IMG_BASE}${enemyHeroes[i].img}_sb.png`} className="w-full h-full object-cover" alt="Hero" />
                    <div onClick={() => setEnemyHeroes(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-900/80 hidden group-hover:flex items-center justify-center cursor-pointer">
                      <X size={20} className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-800">
                    <span className="text-xs font-bold">?</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Buscador */}
          {!myHero && (
            <div className="relative">
              <div className="flex items-center bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-3 shadow-inner focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-900 transition-all">
                <Search size={18} className="text-gray-500 mr-3" />
                <input 
                  type="text" 
                  placeholder={mode === 'draft_enemy' ? "Agregar enemigo (ej. Axe)..." : "Busca TU héroe..."}
                  className="bg-transparent w-full outline-none text-sm text-white placeholder-gray-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              
              {/* Resultados */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-gray-700 mt-2 rounded-lg shadow-2xl z-20 max-h-60 overflow-y-auto">
                  {suggestions.map(hero => (
                    <div 
                      key={hero.id} 
                      onClick={() => mode === 'draft_enemy' ? addEnemy(hero) : pickMyHero(hero)}
                      className="flex items-center gap-3 p-3 hover:bg-red-900/20 cursor-pointer border-b border-gray-800/50 last:border-0 transition-colors"
                    >
                      <img src={`${IMG_BASE}${hero.img}_sb.png`} className="w-12 h-7 rounded shadow-sm" alt={hero.name} />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-200">{hero.name}</span>
                        <span className="text-[10px] text-gray-500 uppercase">{hero.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- FASE 2: RECOMENDACIONES --- */}
        {!myHero && recommended.length > 0 && (
          <div className="bg-gradient-to-br from-[#0f291e] to-[#0a0a0a] border border-green-900/30 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xs font-bold text-green-400 uppercase mb-3 flex items-center gap-2 tracking-widest">
              <TrendingUp size={14} /> Sugerencias de Pick
            </h2>
            <div className="flex flex-wrap gap-2">
              {recommended.map((heroName, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    const hero = Object.values(HEROES_DB).find((h) => h.name === heroName);
                    if (hero) pickMyHero(hero);
                  }}
                  className="px-3 py-1.5 bg-[#1a3d2e] hover:bg-[#23523d] border border-green-800 text-green-100 text-xs font-medium rounded shadow-sm transition-all"
                >
                  {heroName}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-green-900/30">
               <button 
                 onClick={() => setMode('pick_me')}
                 className="w-full py-2 bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 border border-blue-900/50 rounded text-xs font-bold uppercase transition-all"
               >
                 O selecciona manualmente
               </button>
            </div>
          </div>
        )}

        {/* --- FASE 3: EN PARTIDA (DASHBOARD) --- */}
        {myHero && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            
            {/* Tarjeta de Héroe */}
            <div className="relative rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(https://cdn.dota2.com/apps/dota2/images/heroes/${myHero.img}_lg.png)` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
                
                <div className="relative p-5 flex items-end justify-between">
                    <div>
                        <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded mb-2 inline-block shadow">{myHero.role}</span>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">{myHero.name}</h2>
                    </div>
                    <button onClick={() => setMyHero(null)} className="text-xs text-gray-400 hover:text-white underline">Cambiar</button>
                </div>
            </div>

            {/* Facetas */}
            <div className="grid grid-cols-2 gap-3">
                {myHero.facets?.map((facet, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${idx === 0 ? 'bg-red-900/10 border-red-900/50' : 'bg-blue-900/10 border-blue-900/50'}`}>
                        <h4 className={`text-xs font-bold uppercase mb-1 ${idx === 0 ? 'text-red-400' : 'text-blue-400'}`}>Faceta {idx + 1}: {facet.name}</h4>
                        <p className="text-[10px] text-gray-400 leading-snug">{facet.desc}</p>
                    </div>
                ))}
            </div>

            {/* Build */}
            <div>
               <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Zap size={14} /> Build Ganadora
               </h3>
               <div className="grid grid-cols-1 gap-2">
                  {myHero.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#151515] p-2 rounded border border-gray-800">
                       <div className="w-8 h-8 flex items-center justify-center bg-[#222] rounded text-yellow-600 font-bold text-sm border border-gray-700">
                         {i + 1}
                       </div>
                       <span className="text-sm font-medium text-gray-200">{item}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Consejos */}
            {enemyHeroes.length > 0 && (
                <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Crosshair size={14} /> Amenazas
                    </h3>
                    <p className="text-xs text-gray-500">
                        Ten cuidado con <b>{enemyHeroes.map(h => h.name).join(', ')}</b>. 
                        {myHero.role === 'Carry' && ' Prioriza tu BKB si tienen mucho stun.'}
                        {myHero.role === 'Support' && ' Compra visión y Glimmer Cape.'}
                    </p>
                </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
