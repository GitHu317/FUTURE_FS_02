import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Users, Mail, Clock, Trash2, Lock, LogIn, LogOut, Send, ArrowLeft, Globe, Save, CheckCircle, AlertCircle, X } from 'lucide-react';
import './App.css';

function App() {
  const [leads, setLeads] = useState([]);
  const [view, setView] = useState('form'); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Notification State
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchLeads = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leads');
      setLeads(response.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && view === 'admin') {
        await fetchLeads();
      }
    };
    loadData();
  }, [isAuthenticated, view, fetchLeads]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newLead = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value
    };

    try {
      await axios.post('http://localhost:5000/api/leads', newLead);
      showNotification('Lead sent to CRM successfully!', 'success');
      e.target.reset();
    } catch {
      showNotification('Failed to send lead. Is the server running?', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { password });
      if (response.data.success) {
        setIsAuthenticated(true);
        setView('admin');
        showNotification('Welcome back, Admin!', 'success');
      }
    } catch (err) {
      showNotification('Invalid Admin Password', 'error');
    }
  };

  const updateLead = async (id, newStatus, newNotes) => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${id}`, { 
        status: newStatus, 
        notes: newNotes 
      });
      fetchLeads(); 
      showNotification('Changes saved successfully!', 'success');
    } catch (err) {
      showNotification('Error updating lead', 'error');
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm('Are you sure you want to remove this lead?')) {
      try {
        await axios.delete(`http://localhost:5000/api/leads/${id}`);
        fetchLeads();
        showNotification('Lead deleted', 'success');
      } catch (err) {
        showNotification('Error deleting lead', 'error');
      }
    }
  };

  // Shared Notification Component
  const NotificationToast = () => (
    <div className={`notification-toast ${notification.type} ${notification.show ? 'show' : ''}`}>
      {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{notification.message}</span>
      <button onClick={() => setNotification({ ...notification, show: false })} className="close-toast">
        <X size={16} />
      </button>
    </div>
  );

  if (view === 'form') {
    return (
      <div className="contact-page-wrapper">
        <NotificationToast />
        <div className="contact-card">
          <div className="form-header">
            <Send size={40} color="#6366f1" />
            <h2>Contact Us</h2>
            <p>Generate a lead for the Task 2 CRM</p>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input name="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea name="message" placeholder="I am interested in your services..." required />
            </div>
            <button type="submit" className="submit-btn">Submit Inquiry</button>
          </form>
          <button className="nav-link" onClick={() => setView('login')}>
            <Lock size={14} /> Admin Login
          </button>
        </div>
      </div>
    );
  }

  if (view === 'login' && !isAuthenticated) {
    return (
      <div className="login-container">
        <NotificationToast />
        <form className="login-box" onSubmit={handleLogin}>
          <button type="button" onClick={() => setView('form')} className="back-btn">
            <ArrowLeft size={16} /> Back to Form
          </button>
          <h2>CRM Admin Access</h2>
          <p>Enter password to manage leads</p>
          <input 
            type="password" 
            placeholder="Password = apptester" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            <LogIn size={18} /> Enter Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <NotificationToast />
      <header className="dashboard-header">
        <div className="header-left">
          <h1><Users size={32} /> Lead Management</h1>
          <p>Managing {leads.length} website inquiries</p>
        </div>
        <div className="header-right">
          <button className="nav-btn" onClick={() => setView('form')}>View Form</button>
          <button onClick={() => {setIsAuthenticated(false); setView('form');}} className="logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Source</th>
              <th>Notes / Follow-ups</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead.id}>
                  <td>#{lead.id}</td>
                  <td className="name-cell">{lead.name}</td>
                  <td><Mail size={14} /> {lead.email}</td>
                  <td><Globe size={14} /> {lead.source || 'Website'}</td>
                  <td>
                    <textarea 
                      id={`note-${lead.id}`}
                      className="note-editor"
                      defaultValue={lead.notes} 
                      placeholder="Add follow-up notes..."
                    />
                  </td>
                  <td>
                    <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td><Clock size={14} /> {new Date(lead.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-row">
                      <select 
                        value={lead.status} 
                        onChange={(e) => {
                            const currentNote = document.getElementById(`note-${lead.id}`).value;
                            updateLead(lead.id, e.target.value, currentNote);
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                      </select>

                      <button 
                        className="save-icon-btn" 
                        title="Save Changes"
                        onClick={() => {
                            const currentNote = document.getElementById(`note-${lead.id}`).value;
                            updateLead(lead.id, lead.status, currentNote);
                        }}
                      >
                        <Save size={18} />
                      </button>

                      <button className="delete-icon-btn" onClick={() => deleteLead(lead.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-msg">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
