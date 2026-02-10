import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { 
  Users, Clock, Trash2, Lock, LogOut, Send, Search, CheckCircle, 
  Save, LayoutDashboard, BarChart3, PieChart as PieIcon, TrendingUp, 
  Target, Zap, Globe, Menu, X, Filter, RefreshCw, Layers, ShieldCheck,
  Settings, Activity, HardDrive, Cpu, Database
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, 
  Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, BarChart, Bar, ComposedChart, ScatterChart, Scatter
} from 'recharts';
import './App.css';

/**
 * TITAN-PRO CRM: ENTERPRISE NEURAL INTERFACE
 * API Configuration & Constants
 */
const API_BASE_URL = 'https://future-fs-02-vksh.onrender.com';
const THEME = {
  primary: '#8b5cf6',   // Violet
  secondary: '#06b6d4', // Cyan
  accent: '#f43f5e',    // Rose
  success: '#10b981',   // Emerald
  warning: '#f59e0b',   // Amber
  background: '#030712' // Slate-950
};
const CHART_COLORS = [THEME.primary, THEME.secondary, THEME.success, THEME.warning, THEME.accent];

function App() {
  // --- CORE SYSTEM STATE ---
  const [leads, setLeads] = useState([]);
  const [view, setView] = useState('form'); 
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemLoad, setSystemLoad] = useState(0);

  // --- API DATA ENGINE ---
  const fetchLeads = useCallback(async () => {
    setIsRefreshing(true);
    setSystemLoad(30);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leads`);
      setLeads(response.data);
      setSystemLoad(100);
    } catch (err) {
      console.error('CRITICAL SYSTEM ERROR: UNABLE TO REACH DATA NODE', err);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setSystemLoad(0);
      }, 1200);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchLeads();
  }, [isAuthenticated, fetchLeads]);

  // --- ADVANCED DATA PROCESSING ENGINE ---
  const titanStats = useMemo(() => {
    if (!leads.length) return { 
      statusDist: [], growthData: [], nodePerformance: [], 
      conversionTrend: [], funnelData: [], summary: {} 
    };

    // 1. Status Matrix
    const statusDist = [
      { name: 'Cold Ops', value: leads.filter(l => l.status === 'New').length },
      { name: 'Active Sync', value: leads.filter(l => l.status === 'Contacted').length },
      { name: 'Successful Breach', value: leads.filter(l => l.status === 'Converted').length },
    ];

    // 2. Temporal Analysis (Timeline)
    const timelineMap = {};
    leads.forEach(l => {
      const date = new Date(l.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      timelineMap[date] = (timelineMap[date] || 0) + 1;
    });
    const growthData = Object.entries(timelineMap).map(([date, count]) => ({ date, count }));

    // 3. Node/Traffic Performance
    const nodePerformance = [
      { name: 'Direct', val: 400, cap: 500, status: 'Stable' },
      { name: 'Neural Link', val: 300, cap: 500, status: 'High' },
      { name: 'Global Hub', val: 200, cap: 500, status: 'Warning' },
      { name: 'Encrypted', val: 278, cap: 500, status: 'Stable' },
    ];

    // 4. Conversion Funnel Efficiency
    const funnelData = [
      { name: 'Inbound', value: leads.length, fill: THEME.primary },
      { name: 'Verified', value: Math.floor(leads.length * 0.8), fill: THEME.secondary },
      { name: 'Engaged', value: Math.floor(leads.length * 0.5), fill: THEME.warning },
      { name: 'Converted', value: leads.filter(l => l.status === 'Converted').length, fill: THEME.success },
    ];

    const conversionRate = ((leads.filter(l => l.status === 'Converted').length / leads.length) * 100).toFixed(2);

    return { statusDist, growthData, nodePerformance, funnelData, conversionRate, total: leads.length };
  }, [leads]);

  // --- BUSINESS LOGIC HANDLERS ---
  const handleLeadAction = async (e) => {
    e.preventDefault();
    const payload = { name: e.target.name.value, email: e.target.email.value, message: e.target.message.value };
    try {
      await axios.post(`${API_BASE_URL}/api/leads`, payload);
      alert('NODE REGISTERED: Submission synchronized with Central Command.');
      e.target.reset();
    } catch (err) { alert('UPLOAD ERROR: Connection timeout.'); }
  };

  const handleAccessSync = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, { password });
      if (res.data.success) { 
        setIsAuthenticated(true); 
        setView('admin'); 
      }
    } catch (err) { alert('IDENTITY REJECTED: Access level insufficient.'); }
  };

  const updateNode = async (id, status, notes) => {
    try {
      await axios.put(`${API_BASE_URL}/api/leads/${id}`, { status, notes });
      fetchLeads();
    } catch (err) { alert('SYNC FAILED'); }
  };

  const purgeNode = async (id) => {
    if (window.confirm('PERMANENT DELETION: Are you sure you want to erase this data shard?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/leads/${id}`);
        fetchLeads();
      } catch (err) { alert('PURGE FAILED'); }
    }
  };

  // --- COMPONENT: CUSTOM TOOLTIP ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip-titan">
          <p className="label">{`${label}`}</p>
          <p className="intro">{`DENSITY: ${payload[0].value}`}</p>
          <div className="tooltip-line"></div>
        </div>
      );
    }
    return null;
  };

  // --- RENDERER: PUBLIC INTERFACES ---
  if (view === 'form') {
    return (
      <div className="titan-public-overlay">
        <div className="background-grid-anim"></div>
        <div className="titan-form-card glass">
          <div className="form-decoration">
            <span className="line"></span>
            <Activity size={18} className="pulse" />
            <span className="line"></span>
          </div>
          <header>
            <h1 className="titan-glitch-text" data-text="SYSTEM INTAKE">SYSTEM INTAKE</h1>
            <p className="subtext">Initialize secure communication protocols below.</p>
          </header>
          <form onSubmit={handleLeadAction} className="titan-form-group">
            <div className="titan-input-box">
              <label><Users size={14}/> IDENTITY_NAME</label>
              <input name="name" type="text" placeholder="Entry ID..." required />
            </div>
            <div className="titan-input-box">
              <label><Globe size={14}/> COMMS_LINK</label>
              <input name="email" type="email" placeholder="email@node.com" required />
            </div>
            <div className="titan-input-box">
              <label><Cpu size={14}/> MISSION_DATA</label>
              <textarea name="message" placeholder="Input specific objectives or data shards..." required />
            </div>
            <button type="submit" className="titan-btn-primary">
              <ShieldCheck size={18} /> INITIALIZE UPLOAD
            </button>
          </form>
          <footer>
            <button className="titan-btn-ghost" onClick={() => setView('login')}>
              <Lock size={12} /> ENTERPRISE_LOGIN
            </button>
          </footer>
        </div>
      </div>
    );
  }

  if (view === 'login' && !isAuthenticated) {
    return (
      <div className="titan-public-overlay">
        <div className="titan-auth-card glass">
          <div className="auth-header">
            <ShieldCheck size={50} className="auth-icon-glow" />
            <h2>ENCRYPTED ACCESS</h2>
          </div>
          <form onSubmit={handleAccessSync}>
            <div className="titan-input-box">
              <input type="password" placeholder="Input Access Key..." value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="titan-btn-danger">VERIFY IDENTITY</button>
            <button type="button" className="titan-btn-ghost" onClick={() => setView('form')}>RETURN TO CORE</button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERER: TITAN ADMIN COMMAND CENTER ---
  return (
    <div className={`titan-dashboard ${!isSidebarOpen ? 'collapsed' : ''}`}>
      {/* 1. ENTERPRISE SIDEBAR - 6 LINKS */}
      <aside className="titan-sidebar">
        <div className="sidebar-header">
          <div className="titan-logo">
            <div className="logo-icon"><HardDrive /></div>
            <span>TITAN_CRM_v2</span>
          </div>
          <button className="sidebar-trigger" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <label>ANALYTICS COMMAND</label>
            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
              <LayoutDashboard /> <span>Command Center</span>
            </button>
            <button className={activeTab === 'conversions' ? 'active' : ''} onClick={() => setActiveTab('conversions')}>
              <Target /> <span>Neural Conversions</span>
            </button>
            <button className={activeTab === 'traffic' ? 'active' : ''} onClick={() => setActiveTab('traffic')}>
              <Activity /> <span>Node Traffic</span>
            </button>
            <button className={activeTab === 'growth' ? 'active' : ''} onClick={() => setActiveTab('growth')}>
              <TrendingUp /> <span>Growth Velocity</span>
            </button>
          </div>

          <div className="nav-group">
            <label>DATA ARCHIVE</label>
            <button className={activeTab === 'leads' ? 'active' : ''} onClick={() => setActiveTab('leads')}>
              <Database /> <span>Master Database</span>
            </button>
          </div>

          <div className="nav-group">
            <label>SYSTEM</label>
            <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
              <Settings /> <span>System Config</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-shard">
            <div className="avatar-shield">A</div>
            <div className="user-info">
              <p>ADMIN_ALPHA</p>
              <span>SUPER_USER</span>
            </div>
          </div>
          <button className="btn-logout-titan" onClick={() => { setIsAuthenticated(false); setView('form'); }}>
            <LogOut /> <span>TERMINATE</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT HUB */}
      <main className="titan-main">
        {/* GLOBAL HEADER */}
        <header className="titan-top-nav">
          <div className="page-identity">
            <h1>{activeTab.toUpperCase()} _TERMINAL</h1>
            <div className="sync-status">
              <div className="pulse-dot"></div> SYSTEM_READY_ACTIVE
            </div>
          </div>

          <div className="top-actions">
            <div className="titan-search-bar">
              <Search size={16} />
              <input placeholder="Query database records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className={`titan-refresh ${isRefreshing ? 'rotating' : ''}`} onClick={fetchLeads}>
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        {/* PROGRESS BAR SIMULATION */}
        {isRefreshing && <div className="system-progress-bar" style={{ width: `${systemLoad}%` }}></div>}

        <div className="titan-scroll-area">
          
          {/* VIEW: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="view-container fade-in">
              <div className="titan-stats-deck">
                <div className="titan-stat-card bento">
                  <div className="stat-icon purple"><Layers /></div>
                  <div className="stat-content">
                    <p>TOTAL_NODES</p>
                    <h3>{titanStats.total}</h3>
                    <div className="stat-graph-mini up"></div>
                  </div>
                </div>
                <div className="titan-stat-card bento">
                  <div className="stat-icon blue"><Activity /></div>
                  <div className="stat-content">
                    <p>ACTIVE_SYNC</p>
                    <h3>{leads.filter(l => l.status === 'Contacted').length}</h3>
                    <div className="stat-graph-mini neutral"></div>
                  </div>
                </div>
                <div className="titan-stat-card bento">
                  <div className="stat-icon emerald"><ShieldCheck /></div>
                  <div className="stat-content">
                    <p>BREACH_SUCCESS</p>
                    <h3>{titanStats.conversionRate}%</h3>
                    <div className="stat-graph-mini up"></div>
                  </div>
                </div>
              </div>

              <div className="titan-grid-layout">
                <div className="titan-chart-box large glass bento-span-2">
                  <div className="chart-header">
                    <h4>TEMPORAL_ACQUISITION_STREAM</h4>
                    <p>Live Node Influx Monitoring</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={titanStats.growthData}>
                      <defs>
                        <linearGradient id="titanColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="date" stroke="#6b7280" axisLine={false} tickLine={false} dy={10} />
                      <YAxis stroke="#6b7280" axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="count" stroke={THEME.primary} fillOpacity={1} fill="url(#titanColor)" strokeWidth={4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="titan-chart-box glass">
                  <div className="chart-header">
                    <h4>NODE_DISTRIBUTION</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={titanStats.statusDist} innerRadius={60} outerRadius={90} paddingAngle={10} dataKey="value">
                        {titanStats.statusDist.map((entry, index) => <Cell key={`c-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="titan-legend">
                    {titanStats.statusDist.map((s, i) => (
                      <div key={i} className="legend-item">
                        <span style={{ background: CHART_COLORS[i] }}></span> {s.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CONVERSIONS (NEURAL) */}
          {activeTab === 'conversions' && (
            <div className="view-container fade-in">
              <div className="titan-grid-layout single">
                <div className="titan-chart-box glass full-width">
                  <div className="chart-header">
                    <h4>CONVERSION_FUNNEL_EFFICIENCY</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={450}>
                    <BarChart data={titanStats.funnelData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#fff" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                        {titanStats.funnelData.map((entry, index) => <Cell key={`f-${index}`} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: TRAFFIC (NODE) */}
          {activeTab === 'traffic' && (
            <div className="view-container fade-in">
              <div className="titan-grid-layout">
                <div className="titan-chart-box glass bento-span-2">
                  <div className="chart-header"><h4>NODE_TRAFFIC_RADAR</h4></div>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={titanStats.nodePerformance}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="name" stroke="#9ca3af" />
                      <PolarRadiusAxis angle={30} domain={[0, 500]} hide />
                      <Radar name="Traffic" dataKey="val" stroke={THEME.secondary} fill={THEME.secondary} fillOpacity={0.4} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="titan-data-list glass">
                  <h4>LIVE_STREAM_NODES</h4>
                  {titanStats.nodePerformance.map((node, i) => (
                    <div key={i} className="node-item-small">
                      <div className="node-meta">
                        <span>{node.name}</span>
                        <p>{node.status}</p>
                      </div>
                      <div className="node-val">{node.val} TPS</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: GROWTH */}
          {activeTab === 'growth' && (
            <div className="view-container fade-in">
              <div className="titan-chart-box glass full-width">
                <div className="chart-header"><h4>GROWTH_VELOCITY_PROJECTION</h4></div>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={titanStats.growthData}>
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <CartesianGrid stroke="#1f2937" />
                    <Bar dataKey="count" barSize={20} fill={THEME.secondary} />
                    <Line type="monotone" dataKey="count" stroke={THEME.accent} strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* VIEW: MASTER DATABASE (LEADS) */}
          {activeTab === 'leads' && (
            <div className="view-container fade-in">
              <div className="titan-table-container glass">
                <table className="titan-enterprise-table">
                  <thead>
                    <tr>
                      <th><Layers size={14}/> NODE_ID</th>
                      <th><Clock size={14}/> TIMESTAMP</th>
                      <th><Activity size={14}/> STATUS_LVL</th>
                      <th><Cpu size={14}/> NEURAL_LOGS</th>
                      <th>COMMANDS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase())).map(lead => (
                      <tr key={lead.id} className="node-row">
                        <td>
                          <div className="lead-identity">
                            <span className="name">{lead.name}</span>
                            <span className="email">{lead.email}</span>
                          </div>
                        </td>
                        <td>{new Date(lead.created_at).toLocaleString()}</td>
                        <td>
                          <span className={`titan-pill ${lead.status.toLowerCase()}`}>
                            {lead.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <textarea 
                            id={`note-${lead.id}`} 
                            defaultValue={lead.notes} 
                            className="titan-inline-textarea"
                            placeholder="Awaiting input..."
                          />
                        </td>
                        <td>
                          <div className="titan-row-actions">
                            <select 
                              value={lead.status} 
                              onChange={(e) => updateNode(lead.id, e.target.value, document.getElementById(`note-${lead.id}`).value)}
                            >
                              <option value="New">COHORT_NEW</option>
                              <option value="Contacted">COHORT_ACTIVE</option>
                              <option value="Converted">COHORT_SYNCED</option>
                            </select>
                            <button className="action-btn save" onClick={() => updateNode(lead.id, lead.status, document.getElementById(`note-${lead.id}`).value)}><Save size={16}/></button>
                            <button className="action-btn purge" onClick={() => purgeNode(lead.id)}><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="view-container fade-in">
              <div className="titan-settings-grid">
                <div className="settings-card glass">
                  <h3><ShieldCheck size={20}/> SECURITY_CORE</h3>
                  <div className="setting-row"><span>Two-Factor Neural Auth</span><div className="toggle active"></div></div>
                  <div className="setting-row"><span>Automatic DB Purge</span><div className="toggle"></div></div>
                  <div className="setting-row"><span>Encryption Level</span><p>AES-512-RSA</p></div>
                </div>
                <div className="settings-card glass">
                  <h3><Activity size={20}/> PERFORMANCE_NODES</h3>
                  <div className="setting-row"><span>Cache Refresh Rate</span><p>500ms</p></div>
                  <div className="setting-row"><span>Visual FX Quality</span><p>Ultra</p></div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
