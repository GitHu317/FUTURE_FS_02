import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Users, Mail, Clock, Trash2, Lock, LogIn, LogOut, Send, 
  ArrowLeft, Globe, Save, Loader2, CheckCircle, AlertCircle 
} from 'lucide-react';
import './App.css';

// Replace with your deployed backend URL for production
const API_BASE_URL = 'https://future-fs-02-vksh.onrender.com';

function App() {
  const [leads, setLeads] = useState([]);
  const [view, setView] = useState('form'); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // --- NEW: LOADING & FEEDBACK STATES ---
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' }); // type: 'success' or 'error'

  // Helper to show temporary feedback
  const showFeedback = (msg, type = 'success') => {
    setFeedback({ message: msg, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3500);
  };

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leads`);
      setLeads(response.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
      showFeedback('Could not sync with database', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && view === 'admin') {
      fetchLeads();
    }
  }, [isAuthenticated, view, fetchLeads]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newLead = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value
    };

    try {
      await axios.post(`${API_BASE_URL}/api/leads`, newLead);
      showFeedback('Inquiry sent successfully! Our team will contact you.');
      e.target.reset();
    } catch {
      showFeedback('Failed to send. Please check your connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, { password });
      if (response.data.success) {
        setIsAuthenticated(true);
        setView('admin');
        showFeedback('Welcome back, Admin');
      }
    } catch (err) {
      showFeedback('Invalid Admin Password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLead = async (id, newStatus, newNotes) => {
    setIsLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/api/leads/${id}`, { 
        status: newStatus, 
        notes: newNotes 
      });
      await fetchLeads(); 
      showFeedback('Changes saved to cloud');
    } catch (err) {
      showFeedback('Failed to update lead', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm('Are you sure you want to remove this lead?')) {
      setIsLoading(true);
      try {
        await axios.delete(`${API_BASE_URL}/api/leads/${id}`);
        await fetchLeads();
        showFeedback('Lead removed', 'success');
      } catch (err) {
        showFeedback('Delete operation failed', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- NOTIFICATION TOAST COMPONENT ---
  const Toast = () => (
    feedback.message ? (
      <div className={`toast-notification ${feedback.type}`}>
        {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        {feedback.message}
      </div>
    ) : null
  );

  // 1. PUBLIC CONTACT FORM VIEW
  if (view === 'form') {
    return (
      <div className="contact-page-wrapper">
        <Toast />
        <div className="contact-card">
          <div className="form-header">
            <Send size={40} color="#6366f1" />
            <h2>Contact Us</h2>
            <p>Generate a lead for the Task 2 CRM</p>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input name="name" type="text" placeholder="John Doe" required disabled={isLoading} />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input name="email" type="email" placeholder="john@example.com" required disabled={isLoading} />
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea name="message" placeholder="I am interested..." required disabled={isLoading} />
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="spinner" /> : "Submit Inquiry"}
            </button>
          </form>
          <button className="nav-link" onClick={() => setView('login')} disabled={isLoading}>
            <Lock size={14} /> Admin Login
          </button>
        </div>
      </div>
    );
  }

  // 2. ADMIN LOGIN VIEW
  if (view === 'login' && !isAuthenticated) {
    return (
      <div className="login-container">
        <Toast />
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
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="spinner" /> : <><LogIn size={18} /> Enter Dashboard</>}
          </button>
        </form>
      </div>
    );
  }

  // 3. ADMIN DASHBOARD VIEW
  return (
    <div className="dashboard-container">
      <Toast />
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
                <tr key={lead.id} className={isLoading ? "row-loading" : ""}>
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
                      disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                        onClick={() => {
                            const currentNote = document.getElementById(`note-${lead.id}`).value;
                            updateLead(lead.id, lead.status, currentNote);
                        }}
                      >
                        {isLoading ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                      </button>

                      <button className="delete-icon-btn" onClick={() => deleteLead(lead.id)} disabled={isLoading}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-msg">No leads found in database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
