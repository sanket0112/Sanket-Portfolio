import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'messages', 'users'
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const fetchData = async () => {
            try {
                const statRes = await api.get('/analytics', config);
                setStats(statRes.data);

                const msgRes = await api.get('/messages', config);
                setMessages(msgRes.data);
                
                const userRes = await api.get('/admin/users', config);
                setUsers(userRes.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            }
        };

        fetchData();
    }, [navigate]);

    const deleteMessage = async (id) => {
        const token = localStorage.getItem('adminToken');
        try {
            await api.delete(`/messages/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setMessages(messages.filter(msg => msg._id !== id));
        } catch (err) {
            console.error(err);
        }
    };
    
    const toggleBlockStatus = async (id) => {
        const token = localStorage.getItem('adminToken');
        try {
            await api.put(`/admin/users/${id}/block`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUser = async (id, userName) => {
        if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"?`)) {
            return;
        }
        const token = localStorage.getItem('adminToken');
        try {
            await api.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="text-gradient">Admin Dashboard</h1>
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <button onClick={() => setActiveTab('overview')} className="btn" style={{ background: activeTab === 'overview' ? 'var(--accent-purple)' : 'transparent', border: activeTab === 'overview' ? 'none' : '1px solid rgba(255,255,255,0.2)'}}>Overview</button>
                <button onClick={() => setActiveTab('messages')} className="btn" style={{ background: activeTab === 'messages' ? 'var(--accent-purple)' : 'transparent', border: activeTab === 'messages' ? 'none' : '1px solid rgba(255,255,255,0.2)'}}>Messages</button>
                <button onClick={() => setActiveTab('users')} className="btn" style={{ background: activeTab === 'users' ? 'var(--accent-purple)' : 'transparent', border: activeTab === 'users' ? 'none' : '1px solid rgba(255,255,255,0.2)'}}>Manage Users</button>
            </div>

            {activeTab === 'overview' && stats && (
                <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
                    <div className="glass-panel" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)' }}>Total Visitors</h3>
                        <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>{stats.totalVisitors}</p>
                    </div>
                    <div className="glass-panel" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)' }}>Page Views</h3>
                        <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{stats.pageViews}</p>
                    </div>
                    <div className="glass-panel" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)' }}>Contact Requests</h3>
                        <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-purple)' }}>{stats.contactRequests}</p>
                    </div>
                    <div className="glass-panel" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)' }}>Registered Users</h3>
                        <p style={{ fontSize: '3rem', fontWeight: '800', color: '#10b981' }}>{users.length}</p>
                    </div>
                </div>
            )}

            {activeTab === 'messages' && (
                <>
                    <h2>Messages</h2>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.length === 0 ? <p>No messages yet.</p> : messages.map((msg) => (
                            <div key={msg._id} className="glass-panel" style={{ position: 'relative' }}>
                                <button 
                                    onClick={() => deleteMessage(msg._id)}
                                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}
                                 >
                                    Delete
                                </button>
                                <h4 style={{ color: 'var(--accent-cyan)' }}>{msg.name}</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{msg.email}</p>
                                <p><strong>Subject:</strong> {msg.subject}</p>
                                <p style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>{msg.message}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
            
            {activeTab === 'users' && (
                <>
                    <h2>Manage Users</h2>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {users.length === 0 ? <p>No registered users yet.</p> : users.map((u) => (
                            <div key={u._id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ color: 'var(--accent-cyan)' }}>{u.name}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{u.email}</p>
                                    <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: u.isBlocked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: u.isBlocked ? '#ef4444' : '#10b981' }}>
                                        {u.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        onClick={() => toggleBlockStatus(u._id)}
                                        className="btn"
                                        style={{ 
                                            background: u.isBlocked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                            color: u.isBlocked ? '#10b981' : '#ef4444', 
                                            border: `1px solid ${u.isBlocked ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` 
                                        }}
                                    >
                                        {u.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                    <button 
                                        onClick={() => deleteUser(u._id, u.name)}
                                        className="btn"
                                        style={{ 
                                            background: 'rgba(239, 68, 68, 0.15)', 
                                            color: '#ef4444', 
                                            border: '1px solid rgba(239, 68, 68, 0.4)' 
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
