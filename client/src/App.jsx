import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { 
  Users, Mail, Clock, Trash2, Lock, LogIn, LogOut, Send, 
  Search, CheckCircle, BarChart3, Save, LayoutDashboard, 
  UserPlus, PieChart as PieIcon, Settings 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import './App.css';

const API_BASE_URL = 'https://future-fs-02-vksh.onrender.com';
const COLORS = ['#6366f1', '#fbbf24', '#34d299', '#ef4444'];

function App() {
  const [leads, setLeads] = useState([]);
  const [view, setView] = useState('form'); 
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard' or 'leads'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leads`);
      setLeads(response.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchLeads();
  }, [isAuthenticated, fetchLeads]);

  // --- DATA PROCESSING FOR CHARTS ---
  const stats = useMemo(() => {
    const statusData = [
      { name: 'New', value: leads.filter(l => l.status === 'New').length },
      { name: 'Contacted', value: leads.filter(l => l.status === 'Contacted').length },
      { name: 'Converted', value: leads.filter(l => l.status === 'Converted').length },
    ];

    // Group leads by Date for Line Chart
    const dailyMap = {};
    leads.forEach(lead => {
      const date = new Date(lead.created_at).toLocaleDateString();
      dailyMap[date] = (dailyMap[date] || 0) + 1;
    });
    const timelineData = Object.keys(dailyMap).map(date => ({ date, count: dailyMap[date] })).reverse();

    return { statusData, timelineData, total: leads.length };
  }, [leads]);

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- HANDLERS ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newLead = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value
    };
    try {
      await axios.post(`${API_BASE_URL}/api/leads`, newLead);
      alert('Inquiry Sent Successfully!');
      e.target.reset();
    } catch { alert('Error sending lead.'); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, { password });
      if (response.data.success) setIsAuthenticated(true);
    } catch { alert('Invalid Password'); }
  };

  const updateLead = async (id, status, notes) => {
    try {
      await axios.put(`${API_BASE_URL}/api/leads/${id}`, { status, notes });
      fetchLeads();
    } catch { alert('Update failed'); }
  };

  const deleteLead = async (id) => {
    if (window.confirm('Delete this lead?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/leads/${id}`);
        fetchLeads();
      } catch { alert('Delete failed'); }
    }
  };

  // --- RENDER VIEWS ---
  if (!isAuthenticated && view === 'form') {
    return (
      <div className="public-container">
        <div className="glass-card">
          <div className="form-header">
            <Send size={40} className="icon-glow" />
            <h2>Get in Touch</h2>
            <p>Fill out the form to start your project with us.</p>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input name="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="input-group">
              <label>Your Message</label>
              <textarea name="message" placeholder="How can we help?" required />
            </div>
            <button type="submit" className="primary-btn">Submit Inquiry</button>
          </form>
          <button className="ghost-btn" onClick={() => setView('login')}>
            <Lock size={14} /> Admin Access
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && view === 'login') {
    return (
      <div className="public-container">
        <div className="glass-card login-box">
          <Lock size={40} className="icon-glow" />
          <h2>CRM Portal</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              required 
            />
            <button type="submit" className="primary-btn">Login</button>
            <button type="button" className="ghost-btn" onClick={() => setView('form')}>Back to Site</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">F</div>
          <span>Future CRM</span>
        </div>
        <nav className="sidebar-nav">
          <button className={adminTab === 'dashboard' ? 'active' : ''} onClick={() => setAdminTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={adminTab === 'leads' ? 'active' : ''} onClick={() => setAdminTab('leads')}>
            <Users size={20} /> Manage Leads
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="logout-nav">
            <LogOut size={20} /> Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title">
            <h1>{adminTab === 'dashboard' ? 'Business Analytics' : 'Lead Management'}</h1>
            <p>Welcome back, Admin</p>
          </div>
          <div className="header-actions">
            <div className="search-pill">
              <Search size={16} />
              <input 
                placeholder="Search leads..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {adminTab === 'dashboard' ? (
          <div className="dashboard-content">
            {/* Top Stat Cards */}
            <div className="stats-grid">
              <div className="stat-box">
                <Users className="blue" />
                <div><span>Total Leads</span><h3>{stats.total}</h3></div>
              </div>
              <div className="stat-box">
                <Clock className="yellow" />
                <div><span>New Leads</span><h3>{leads.filter(l => l.status === 'New').length}</h3></div>
              </div>
              <div className="stat-box">
                <CheckCircle className="green" />
                <div><span>Conversions</span><h3>{leads.filter(l => l.status === 'Converted').length}</h3></div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
              <div className="chart-container main-chart">
                <h3>Lead Acquisition Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#16161a', border: '1px solid #27272a' }} />
                    <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container side-chart">
                <h3>Lead Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.statusData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="leads-content">
            <div className="table-card">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id}>
                      <td>
                        <div className="lead-info">
                          <strong>{lead.name}</strong>
                          <span>{lead.email}</span>
                        </div>
                      </td>
                      <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${lead.status.toLowerCase()}`}>{lead.status}</span>
                      </td>
                      <td>
                        <textarea 
                          id={`note-${lead.id}`}
                          defaultValue={lead.notes} 
                          className="table-note"
                        />
                      </td>
                      <td>
                        <div className="table-actions">
                          <select 
                            value={lead.status}
                            onChange={(e) => updateLead(lead.id, e.target.value, document.getElementById(`note-${lead.id}`).value)}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                          </select>
                          <button className="save-icon" onClick={() => updateLead(lead.id, lead.status, document.getElementById(`note-${lead.id}`).value)}>
                            <Save size={16} />
                          </button>
                          <button className="del-icon" onClick={() => deleteLead(lead.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
