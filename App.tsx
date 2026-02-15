
import React, { useState } from 'react';
import { 
  Calculator, 
  Lightbulb, 
  Droplets, 
  TrendingUp, 
  User, 
  Info,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Home,
  BookOpen,
  Tv,
  Wifi,
  Smile,
  Utensils,
  Gavel,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Bus,
  PlusCircle
} from 'lucide-react';
import { FinancialData, AIAnalysisResponse } from './types';
import { ECONOMY_DEFAULTS } from './constants';
import FinancialChart from './FinancialChart';
import { analyzeImpact } from './geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<FinancialData>({
    income: ECONOMY_DEFAULTS.SMLV_2025 + ECONOMY_DEFAULTS.AUX_TRANSPORTE_2025,
    electricity: 140000,
    water: 90000,
    rent: ECONOMY_DEFAULTS.TYPICAL_RENT,
    food: ECONOMY_DEFAULTS.TYPICAL_FOOD,
    health: ECONOMY_DEFAULTS.TYPICAL_HEALTH,
    transport: ECONOMY_DEFAULTS.TYPICAL_TRANSPORT,
    education: ECONOMY_DEFAULTS.TYPICAL_EDUCATION,
    entertainment: ECONOMY_DEFAULTS.TYPICAL_ENTERTAINMENT,
    telecom: ECONOMY_DEFAULTS.TYPICAL_TELECOM,
    personalCare: ECONOMY_DEFAULTS.TYPICAL_PERSONAL_CARE,
    others: ECONOMY_DEFAULTS.TYPICAL_OTHERS
  });

  const [initialData] = useState<FinancialData>({ ...data });
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  const handleSliderChange = (name: keyof FinancialData, value: number) => {
    setData(prev => ({ ...prev, [name]: value }));
  };

const calculateImpact = async () => {
  setLoading(true);
  try {
    const result: any = await analyzeImpact(data, initialData);

    setAiAnalysis({
      summary: typeof result?.summary === "string" ? result.summary : (result?.error ? "No se pudo generar el análisis." : ""),
      recommendations: Array.isArray(result?.recommendations) ? result.recommendations : [],
      sandraMessage: typeof result?.sandraMessage === "string" ? result.sandraMessage : ""
    });
  } finally {
    setLoading(false);
  }
};


  const totalExpenses = 
    data.electricity + 
    data.water + 
    data.rent + 
    data.food + 
    data.health + 
    data.transport + 
    data.education + 
    data.entertainment + 
    data.telecom + 
    data.personalCare + 
    data.others;

  const totalUtilities = data.electricity + data.water;
  const disposable = data.income - totalExpenses;
  const utilityPercentage = (totalUtilities / data.income) * 100;

  // DEBUG: muestra errores en pantalla en vez de quedar blanco
(window as any).onunhandledrejection = (e: any) => {
  console.error("Unhandled promise rejection:", e?.reason || e);
  alert("Error: " + (e?.reason?.message || e?.reason || e));
};

(window as any).onerror = (msg: any, src: any, line: any, col: any, err: any) => {
  console.error("Window error:", msg, err);
  alert("Error: " + (err?.message || msg));
};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-6 px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-black flex items-center gap-2 tracking-tight">
              <Gavel className="text-yellow-400" />
              Sandra al Senado: Ley contra los Abusos en los Servicios Públicos
            </h1>
            <p className="opacity-90 text-xs md:text-sm font-medium uppercase tracking-wider">Defendiendo tu bolsillo en el Congreso</p>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
            <ShieldCheck size={18} className="text-green-400" />
            <span className="font-semibold text-sm">Propuesta Bandera 2026</span>
          </div>
        </div>
      </header>

      <div className="bg-yellow-100 border-b border-yellow-200 py-3 px-4 text-center">
        <p className="text-sm text-yellow-800 font-bold flex items-center justify-center gap-2">
          <AlertTriangle size={16} />
          ¿Sientes que tu factura sube sin explicación? Simula el impacto de los abusos aquí.
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Panel */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
              <Calculator className="text-blue-600" />
              Simula tu factura y gastos mensuales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-2">
                <label className="block text-sm font-bold text-blue-900 mb-2 flex justify-between">
                  <span>Tus Ingresos Totales (Sueldo + Extras)</span>
                  <span className="text-blue-600">{formatCurrency(data.income)}</span>
                </label>
                <input 
                  type="range" min="1000000" max="10000000" step="100000"
                  value={data.income}
                  onChange={(e) => handleSliderChange('income', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Utility Sliders */}
              <div className="bg-yellow-50/30 p-3 rounded-xl border border-yellow-100">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2 flex justify-between">
                  <span className="flex items-center gap-1"><Lightbulb size={14} className="text-yellow-600" /> Factura de Luz</span>
                  <span className="text-slate-900">{formatCurrency(data.electricity)}</span>
                </label>
                <input 
                  type="range" min="20000" max="1000000" step="5000"
                  value={data.electricity}
                  onChange={(e) => handleSliderChange('electricity', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>

              <div className="bg-cyan-50/30 p-3 rounded-xl border border-cyan-100">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2 flex justify-between">
                  <span className="flex items-center gap-1"><Droplets size={14} className="text-cyan-600" /> Factura de Agua</span>
                  <span className="text-slate-900">{formatCurrency(data.water)}</span>
                </label>
                <input 
                  type="range" min="10000" max="800000" step="5000"
                  value={data.water}
                  onChange={(e) => handleSliderChange('water', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Essential categories */}
              <div className="p-2 bg-slate-50/50 rounded-lg">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                  <span className="flex items-center gap-1"><Utensils size={14} className="text-pink-600" /> Alimentación</span>
                  <span className="text-slate-700">{formatCurrency(data.food)}</span>
                </label>
                <input type="range" min="100000" max="3000000" step="50000" value={data.food} onChange={(e) => handleSliderChange('food', parseInt(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500" />
              </div>

              <div className="p-2 bg-slate-50/50 rounded-lg">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                  <span className="flex items-center gap-1"><Bus size={14} className="text-orange-600" /> Transporte</span>
                  <span className="text-slate-700">{formatCurrency(data.transport)}</span>
                </label>
                <input type="range" min="0" max="1500000" step="10000" value={data.transport} onChange={(e) => handleSliderChange('transport', parseInt(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              </div>

              <div className="p-2 bg-slate-50/50 rounded-lg">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                  <span className="flex items-center gap-1"><HeartPulse size={14} className="text-red-500" /> Salud</span>
                  <span className="text-slate-700">{formatCurrency(data.health)}</span>
                </label>
                <input type="range" min="0" max="1500000" step="10000" value={data.health} onChange={(e) => handleSliderChange('health', parseInt(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
              </div>

              <div className="p-2 bg-slate-50/50 rounded-lg">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                  <span className="flex items-center gap-1"><Home size={14} className="text-indigo-500" /> Arriendo</span>
                  <span className="text-slate-700">{formatCurrency(data.rent)}</span>
                </label>
                <input type="range" min="0" max="4000000" step="50000" value={data.rent} onChange={(e) => handleSliderChange('rent', parseInt(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>

              {/* Secondary categories */}
              <div className="p-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex justify-between">
                  <span className="flex items-center gap-1"><BookOpen size={14} /> Educación</span>
                  <span className="text-slate-700">{formatCurrency(data.education)}</span>
                </label>
                <input type="range" min="0" max="2000000" step="20000" value={data.education} onChange={(e) => handleSliderChange('education', parseInt(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-400" />
              </div>

              <div className="p-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex justify-between">
                  <span className="flex items-center gap-1"><Tv size={14} /> Ocio</span>
                  <span className="text-slate-700">{formatCurrency(data.entertainment)}</span>
                </label>
                <input type="range" min="0" max="1000000" step="10000" value={data.entertainment} onChange={(e) => handleSliderChange('entertainment', parseInt(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-400" />
              </div>

              <div className="p-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex justify-between">
                  <span className="flex items-center gap-1"><Wifi size={14} /> Internet/Cel</span>
                  <span className="text-slate-700">{formatCurrency(data.telecom)}</span>
                </label>
                <input type="range" min="0" max="600000" step="10000" value={data.telecom} onChange={(e) => handleSliderChange('telecom', parseInt(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-400" />
              </div>

              <div className="p-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex justify-between">
                  <span className="flex items-center gap-1"><PlusCircle size={14} /> Otros Gastos</span>
                  <span className="text-slate-700">{formatCurrency(data.others)}</span>
                </label>
                <input type="range" min="0" max="1000000" step="10000" value={data.others} onChange={(e) => handleSliderChange('others', parseInt(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-400" />
              </div>
            </div>
          </div>

          <button 
            onClick={calculateImpact}
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] border-b-4 border-blue-900"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                Calculando ahorro...
              </span>
            ) : (
              <>
                <Zap size={24} className="text-yellow-400" />
                ¿CÓMO PUEDO BAJAR TUS SERVICIOS PÚBLICOS?
              </>
            )}
          </button>
        </section>

        {/* Results Section */}
        <section className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-emerald-600" />
              Análisis del Presupuesto
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                <span className="text-xs text-red-600 uppercase font-bold tracking-wider">Factura de Servicios</span>
                <span className="text-lg font-bold text-red-700">{formatCurrency(totalUtilities)}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Peso en el Ingreso</span>
                <span className={`text-lg font-bold ${utilityPercentage > 15 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {utilityPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <FinancialChart data={data} />

            <div className="mt-8 p-5 rounded-2xl bg-slate-900 text-white shadow-inner">
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Lo que te queda para vivir</p>
                <p className={`text-2xl font-black ${disposable < 100000 ? 'text-red-400' : 'text-white'}`}>
                  {formatCurrency(disposable)}
                </p>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 text-center uppercase font-bold tracking-widest">
                {disposable < 0 ? "⚠️ DÉFICIT: SERVICIOS PÚBLICOS ABUSIVOS" : "ESTADO DE TU BOLSILLO"}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* AI Analysis Result */}
      {aiAnalysis && (
        <div className="max-w-6xl mx-auto px-4 mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="bg-white border-2 border-blue-600 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Gavel size={200} />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
                <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-400/20 w-fit">
                  <ShieldCheck className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight text-blue-900 italic">Sandra al Senado: 2026</h3>
                  <p className="text-blue-600 font-bold uppercase text-xs tracking-[0.2em]">Ley Contra los Abusos en los Servicios Públicos</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3">
                  <h4 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-4">Análisis de Equidad Familiar</h4>
                  <p className="text-xl leading-relaxed text-slate-800 font-medium bg-blue-50/50 p-6 rounded-2xl border-l-4 border-blue-600">
                    {aiAnalysis.summary}
                  </p>
                  
                  <div className="mt-10 bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-3xl text-white shadow-xl relative">
                    <Sparkles className="absolute top-4 right-4 text-yellow-400 opacity-50" />
                    <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-yellow-400">
                      <User size={20} />
                      Sandra te dice:
                    </h4>
                    <p className="text-xl font-bold leading-relaxed italic">
                      "{aiAnalysis.sandraMessage}"
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                    <h4 className="text-blue-900 font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <AlertTriangle size={16} className="text-yellow-600" />
                      Combatiendo los abusos:
                    </h4>
                    <ul className="space-y-4">
                   {(aiAnalysis.recommendations || []).map((rec, idx) => (
                        <li key={idx} className="flex gap-4">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black mt-1">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700 text-sm leading-relaxed font-semibold">{rec}</span>
                        </li>
                      ))}
                    </ul>
                    <a 
                      href="https://www.instagram.com/sandrafonseca2026/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-10 w-full bg-yellow-400 text-blue-950 font-black py-4 rounded-2xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2 group block text-center"
                    >
                      ¡Apóyame para llegar al Senado! 
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-6xl mx-auto px-4 mt-16 text-center">
        <div className="h-px bg-slate-200 w-full mb-8"></div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2 items-center text-blue-600 font-bold">
            <Gavel size={20} />
            <span>Senado 2026: Ley Contra los Abusos en los Servicios Públicos</span>
          </div>
          <p className="text-slate-400 text-xs font-medium leading-loose max-w-2xl">
            Material de campaña política - Sandra al Senado. Simulador interactivo 2025/2026. 
            El objetivo es visibilizar cómo los abusos tarifarios asfixian a la clase media y trabajadora de Colombia.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
