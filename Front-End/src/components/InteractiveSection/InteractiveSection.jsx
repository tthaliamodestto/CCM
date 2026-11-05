import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell
} from "recharts";
import { FiCpu, FiSettings, FiBarChart2, FiActivity, FiBox, FiTrendingUp } from "react-icons/fi";
import "./InteractiveSection.css";

const COLORS = ["#AA8E52", "#647C9E", "#AAB5C5", "#D6DCE4"];
const initial = [
  { name: "Jan", producao: 420, meta: 400, custo: 3200 },
  { name: "Fev", producao: 510, meta: 450, custo: 2800 },
  { name: "Mar", producao: 470, meta: 460, custo: 3600 },
  { name: "Abr", producao: 620, meta: 500, custo: 3100 },
  { name: "Mai", producao: 580, meta: 550, custo: 3900 },
  { name: "Jun", producao: 720, meta: 600, custo: 3400 },
];
const materials = [
  { name: "Aço", value: 45 }, { name: "Alumínio", value: 30 },
  { name: "Latão", value: 15 }, { name: "Outros", value: 10 },
];

function Dashboard() {
  const [data, setData] = useState(initial);
  const [tick, setTick] = useState(0);
  const [period, setPeriod] = useState("6");
  const [live, setLive] = useState(true);

  // Os valores demonstrativos variam continuamente para que os gráficos realmente se movimentem.
  useEffect(() => {
    if (!live) return;
    const timer = window.setInterval(() => {
      setTick(v => v + 1);
      setData(old => old.map((p, i) => ({
        ...p,
        producao: Math.max(300, p.producao + Math.round(Math.sin(Date.now() / 1300 + i) * 13)),
        custo: Math.max(2200, p.custo + Math.round(Math.cos(Date.now() / 1700 + i) * 75)),
      })));
    }, 1200);
    return () => window.clearInterval(timer);
  }, [live]);

  const shown = useMemo(() => data.slice(-Number(period)), [data, period]);
  const total = shown.reduce((s, p) => s + p.producao, 0);
  const avg = Math.round(shown.reduce((s, p) => s + p.producao / p.meta * 100, 0) / shown.length);
  const cost = shown.reduce((s, p) => s + p.custo, 0);
  const fmt = n => n.toLocaleString("pt-BR");

  return <div className="ccm-dashboard">
    <div className="dashboard-heading">
      <div><span className="dashboard-eyebrow">CENTRAL DE INTELIGÊNCIA</span>
        <h3>Visão geral da produção</h3>
        <p>Indicadores demonstrativos · atualização automática a cada 1,2 s</p></div>
      <div className="ccm-dash-actions">
        <select value={period} onChange={e => setPeriod(e.target.value)}>
          <option value="3">3 meses</option><option value="6">6 meses</option>
        </select>
        <button type="button" onClick={() => setLive(v => !v)}>{live ? "Pausar dados" : "Retomar animação"}</button>
      </div>
    </div>
    <div className="dashboard-kpis">
      <div className="kpi-card"><span><FiActivity /></span><small>Produção no período</small><strong>{fmt(total)} <em>un.</em></strong><label>Atualização ao vivo · #{tick}</label></div>
      <div className="kpi-card"><span><FiTrendingUp /></span><small>Eficiência média</small><strong>{avg.toFixed(1)}<em>%</em></strong><label>Indicador demonstrativo</label></div>
      <div className="kpi-card"><span><FiBox /></span><small>Materiais utilizados</small><strong>{fmt(1284 + tick % 17)} <em>kg</em></strong><label>Consumo ilustrativo</label></div>
      <div className="kpi-card"><span><FiSettings /></span><small>Custo operacional</small><strong>R$ {fmt(cost)}</strong><label>Variação demonstrativa</label></div>
    </div>
    <div className="dashboard-charts">
      <div className="chart-card chart-large"><div className="chart-title"><div><strong>Produção mensal</strong><small>Unidades produzidas x meta · dados em movimento</small></div></div>
        <ResponsiveContainer width="100%" height={230}><AreaChart data={shown}>
          <defs><linearGradient id="ccmProduction" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#AA8E52" stopOpacity={.4}/><stop offset="100%" stopColor="#AA8E52" stopOpacity={0}/></linearGradient></defs>
          <CartesianGrid stroke="#34445B" strokeDasharray="3 3"/><XAxis dataKey="name" stroke="#9AA7B8"/><YAxis stroke="#9AA7B8"/>
          <Tooltip contentStyle={{background:"#172438",border:"1px solid #AA8E52",borderRadius:8,color:"#fff"}}/>
          <Area isAnimationActive animationDuration={900} type="monotone" dataKey="producao" stroke="#AA8E52" strokeWidth={3} fill="url(#ccmProduction)"/>
          <Area isAnimationActive animationDuration={900} type="monotone" dataKey="meta" stroke="#8FA2BC" strokeDasharray="5 5" fill="transparent"/>
        </AreaChart></ResponsiveContainer>
      </div>
      <div className="chart-card"><div className="chart-title"><div><strong>Distribuição de materiais</strong><small>Participação no consumo</small></div></div>
        <ResponsiveContainer width="100%" height={190}><PieChart><Pie data={materials} dataKey="value" nameKey="name" innerRadius={48} outerRadius={75} paddingAngle={4} isAnimationActive animationDuration={1200}>
          {materials.map((v,i)=><Cell key={v.name} fill={COLORS[i]}/>)}</Pie><Tooltip contentStyle={{background:"#172438",border:"1px solid #AA8E52",borderRadius:8,color:"#fff"}}/></PieChart></ResponsiveContainer>
        <div className="material-legend">{materials.map((m,i)=><span key={m.name}><i style={{background:COLORS[i]}}/>{m.name}<b>{m.value}%</b></span>)}</div>
      </div>
      <div className="chart-card chart-full"><div className="chart-title"><div><strong>Variação de custos</strong><small>Valores demonstrativos em reais · barras atualizadas automaticamente</small></div></div>
        <ResponsiveContainer width="100%" height={190}><BarChart data={shown}><CartesianGrid stroke="#34445B" strokeDasharray="3 3"/><XAxis dataKey="name" stroke="#9AA7B8"/><YAxis stroke="#9AA7B8"/><Tooltip formatter={v=>`R$ ${fmt(v)}`} contentStyle={{background:"#172438",border:"1px solid #AA8E52",borderRadius:8,color:"#fff"}}/><Bar dataKey="custo" fill="#AA8E52" radius={[5,5,0,0]} isAnimationActive animationDuration={900}/></BarChart></ResponsiveContainer>
      </div>
    </div>
    <p className="dashboard-disclaimer">* Dados fictícios para demonstração. A animação é visual e não representa dados reais do banco de dados.</p>
  </div>;
}

export default function InteractiveSection() {
  const [tab, setTab] = useState("torno");
  return <section className="interactive-section" id="experiencia-ccm">
    <div className="interactive-background"><div className="interactive-grid"/><svg className="interactive-lines" viewBox="0 0 1200 700" preserveAspectRatio="none"><path className="light-line" d="M-50 500 C250 100 400 750 700 300 S1050 50 1300 350"/><path className="light-line line-two" d="M-50 600 C250 250 500 800 800 350 S1100 100 1300 450"/></svg></div>
    <div className="interactive-inner">
      <header className="interactive-heading"><span className="interactive-label"><i/> CCM / ENGENHARIA DIGITAL</span>
        <h2>Tecnologia que transforma <span>a indústria.</span></h2>
        <p>Explore máquinas, componentes e dados industriais em uma experiência interativa que conecta engenharia, precisão e tecnologia.</p>
      </header>
      <nav className="interactive-tabs" aria-label="Experiências CCM">
        <button className={tab==="torno"?"active":""} onClick={()=>setTab("torno")}><FiCpu/> Torno mecânico</button>
        <button className={tab==="motor"?"active":""} onClick={()=>setTab("motor")}><FiSettings/> Motor elétrico</button>
        <button className={tab==="dashboard"?"active":""} onClick={()=>setTab("dashboard")}><FiBarChart2/> Dashboard</button>
      </nav>
      {tab==="dashboard" ? <Dashboard/> :
        <div className="ccm-original-model">
          <div className="model-panel-top"><div><span>MODELO 3D ORIGINAL</span><h3>{tab==="torno"?"Torno mecânico universal":"Motor elétrico trifásico"}</h3></div><span className="model-live"><i/> INTERATIVO</span></div>
          <iframe key={tab} title={tab==="torno"?"Modelo 3D do torno mecânico":"Modelo 3D do motor elétrico"} src={tab==="torno"?"/ccm-models/torno.html":"/ccm-models/motor.html"} loading="lazy" allow="fullscreen"/>
          <p className="ccm-model-note">Modelo 3D original fornecido por você. Use os controles do próprio modelo para girar, selecionar componentes e explorar a vista explodida.</p>
        </div>}
      <div className="interactive-bottom-line"><span>CCM — SISTEMA DE ORÇAMENTO METALÚRGICO</span><span>ENGENHARIA · TECNOLOGIA · PRECISÃO</span></div>
    </div>
  </section>;
}
