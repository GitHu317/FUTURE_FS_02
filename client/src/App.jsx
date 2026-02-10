import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { 
  Users, Mail, Clock, Trash2, Lock, LogIn, LogOut, Send, 
  Search, CheckCircle, BarChart3, Save, LayoutDashboard, 
  UserPlus, PieChart as PieIcon, Settings, X, AlertCircle,
  TrendingUp, Percent, Zap, Activity
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import './App.css';

const API_BASE_URL = 'https://future-fs-02-vksh.onrender.com';
const COLORS = ['#6366f1', '#fbbf24', '#34d299', '#ef4444'];

// Custom Notification Component
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`notification-popup ${type}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="close-notify"><X size={16} /></button>
    </div>
  );
};

function App() {
  const [leads, setLeads] = useState([]);
  const [view, setView] = useState('form'); 
  const [adminTab, setAdminTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 4000);
  };

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

  // --- ENHANCED DATA PROCESSING ---
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter(l => l.status === 'New').length;
    const contactedCount = leads.filter(l => l.status === 'Contacted').length;
    const convertedCount = leads.filter(l => l.status === 'Converted').length;

    // Relationship Calculations
    const conversionRate = total > 0 ? ((convertedCount / total) * 100).toFixed(1) : 0;
    const engagementRate = total > 0 ? (((contactedCount + convertedCount) / total) * 100).toFixed(1) : 0;
    const contactToConvertRatio = contactedCount > 0 ? (convertedCount / contactedCount).toFixed(2) : 0;

    const statusData = [
      { name: 'New', value: newCount },
      { name: 'Contacted', value: contactedCount },
      { name: 'Converted', value: convertedCount },
    ];

    const dailyMap = {};
    leads.forEach(lead => {
      const date = new Date(lead.created_at).toLocaleDateString();
      dailyMap[date] = (dailyMap[date] || 0) + 1;
    });
    const timelineData = Object.keys(dailyMap).map(date => ({ date, count: dailyMap[date] })).reverse();

    return { 
      statusData, timelineData, total, 
      conversionRate, engagementRate, contactToConvertRatio,
      newCount, contactedCount, convertedCount
    };
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
      showNotification('Inquiry Sent Successfully!', 'success');
      e.target.reset();
    } catch { showNotification('Error sending lead.', 'error'); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, { password });
      if (response.data.success) setIsAuthenticated(true);
    } catch { showNotification('Invalid Password', 'error'); }
  };

  const updateLead = async (id, status, notes) => {
    try {
      await axios.put(`${API_BASE_URL}/api/leads/${id}`, { status, notes });
      fetchLeads();
      showNotification('Update successful');
    } catch { showNotification('Update failed', 'error'); }
  };

  const deleteLead = async (id) => {
    if (window.confirm('Delete this lead?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/leads/${id}`);
        fetchLeads();
        showNotification('Lead Deleted');
      } catch { showNotification('Delete failed', 'error'); }
    }
  };

  if (!isAuthenticated && view === 'form') {
    return (
      <div className="public-container">
        <Notification {...notification} onClose={() => setNotification({ message: '', type: '' })} />
        <div className="glass-card">
          <div className="form-header">
            <Send size={40} className="icon-glow" />
            <h2>Get in Touch</h2>
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
        <Notification {...notification} onClose={() => setNotification({ message: '', type: '' })} />
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
      <Notification {...notification} onClose={() => setNotification({ message: '', type: '' })} />
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

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title">
            <h1>Dashboard</h1>
            <p>Relationship & Performance Metrics</p>
          </div>
          <div className="header-actions">
            <div className="search-pill">
              <Search size={16} />
              <input 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {adminTab === 'dashboard' ? (
          <div className="dashboard-content">
            {/* Primary Volume Stats */}
            <div className="stats-grid">
              <div className="stat-box">
                <Users className="blue" />
                <div><span>Total Leads</span><h3>{stats.total}</h3></div>
              </div>
              <div className="stat-box">
                <TrendingUp className="purple" />
                <div><span>Conv. Rate</span><h3>{stats.conversionRate}%</h3></div>
              </div>
              <div className="stat-box">
                <Activity className="pink" />
                <div><span>Engagement</span><h3>{stats.engagementRate}%</h3></div>
              </div>
            </div>

            {/* Relationship Detail Cards */}
            <div className="relationship-grid">
              <div className="rel-card">
                <div className="rel-header">
                  <Zap size={18} />
                  <span>Lead Pipeline Health</span>
                </div>
                <div className="rel-body">
                   <div className="rel-stat">
                      <label>Action Ratio</label>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${stats.engagementRate}%` }}></div>
                      </div>
                      <small>{stats.engagementRate}% of leads have been engaged.</small>
                   </div>
                   <div className="rel-stat">
                      <label>Contact-to-Close</label>
                      <p>{stats.contactToConvertRatio}x</p>
                      <small>Conversion multiplier for contacted leads.</small>
                   </div>
                </div>
              </div>

              <div className="rel-card">
                <div className="rel-header">
                  <Percent size={18} />
                  <span>Status Distribution</span>
                </div>
                <div className="rel-body">
                   <ul className="dist-list">
                      <li><span>New</span> <strong>{stats.newCount}</strong></li>
                      <li><span>Contacted</span> <strong>{stats.contactedCount}</strong></li>
                      <li><span>Converted</span> <strong>{stats.convertedCount}</strong></li>
                   </ul>
                </div>
              </div>
            </div>

            <div className="charts-row">
              <div className="chart-container">
                <h3>Acquisition Timeline</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#16161a', border: '1px solid #27272a' }} />
                    <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="leads-content">
            {/* ... Existing Leads Table (Unchanged) ... */}
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
