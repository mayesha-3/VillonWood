import React, { useState } from 'react';
import { 
  ShieldCheck, Users, GraduationCap, Award, AlertTriangle, 
  Trash2, Check, ArrowLeft, Clock, Lock, Unlock, UserCheck
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import type { UserAppRole } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getUserDailyRole, getGMTCountdown } from '../utils/roleRotation';
import { playSound } from '../utils/soundFX';

interface AdminDashboardProps {
  onBackToMap: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToMap }) => {
  const { 
    usersList, 
    updateUserRole, 
    approveUserRole, 
    toggleUserRestriction, 
    deleteUserAccount 
  } = useAdmin();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'all' | 'learner' | 'teacher' | 'admin' | 'restricted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const todayRole = getUserDailyRole();
  const countdown = getGMTCountdown();

  // Statistics
  const totalUsers = usersList.length;
  const totalLearners = usersList.filter((u) => u.role === 'learner').length;
  const totalTeachers = usersList.filter((u) => u.role === 'teacher').length;
  const totalAdmins = usersList.filter((u) => u.role === 'admin').length;
  const totalRestricted = usersList.filter((u) => u.isRestricted).length;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleRoleChange = (userId: string, newRole: UserAppRole) => {
    playSound('click');
    updateUserRole(userId, newRole);
    showToast(`Rôle mis à jour avec succès en ${newRole}`);
  };

  const handleApprove = (userId: string) => {
    playSound('click');
    approveUserRole(userId);
    showToast('Rôle approuvé pour l\'utilisateur');
  };

  const handleToggleRestrict = (userId: string, isRestricted: boolean) => {
    playSound('click');
    toggleUserRestriction(userId);
    if (!isRestricted) {
      showToast('Utilisateur restreint avec succès (banni du chat & ruban rouge activé)');
    } else {
      showToast('Restriction levée pour l\'utilisateur');
    }
  };

  const handleDelete = (userId: string, userName: string) => {
    playSound('click');
    deleteUserAccount(userId);
    showToast(`Compte de ${userName} supprimé`);
  };

  // Filter users
  const filteredUsers = usersList.filter((u) => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'restricted' ? u.isRestricted : u.role === activeTab);
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="admin-dashboard-page">
      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-nav-left">
          <button type="button" className="back-map-btn" onClick={() => { playSound('click'); onBackToMap(); }}>
            <ArrowLeft size={16} />
            <span>Retour au village</span>
          </button>
          <div className="admin-brand">
            <ShieldCheck size={22} className="admin-icon-glow" />
            <h2>{t('adminPanel')} • VillonWood</h2>
          </div>
        </div>

        <div className="admin-nav-right">
          <div className="admin-profile-badge">
            <span className="online-dot-green" />
            <span>Firebase Main Admin</span>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="admin-main-container">
        {/* Toast Message */}
        {successToast && (
          <div className="admin-toast">
            <Check size={16} /> <span>{successToast}</span>
          </div>
        )}

        {/* Top Summary Stats Cards */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper blue"><Users size={20} /></div>
            <div>
              <div className="stat-value">{totalUsers}</div>
              <div className="stat-label">Citoyens Total</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper green"><GraduationCap size={20} /></div>
            <div>
              <div className="stat-value">{totalLearners}</div>
              <div className="stat-label">Apprenants ({t('userRoleLearner')})</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper amber"><Award size={20} /></div>
            <div>
              <div className="stat-value">{totalTeachers}</div>
              <div className="stat-label">Enseignants ({t('userRoleTeacher')})</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper purple"><ShieldCheck size={20} /></div>
            <div>
              <div className="stat-value">{totalAdmins}</div>
              <div className="stat-label">Administrateurs ({t('userRoleAdmin')})</div>
            </div>
          </div>

          {/* Today's 24h GMT Village Role Card */}
          <div className="stat-card role-summary-card">
            <div>
              <div className="role-summary-header">
                <span className="role-summary-title">Rôle du village (24h GMT)</span>
                <span className="role-summary-badge">GMT 00:00</span>
              </div>
              <div className="role-summary-name">{todayRole.title}</div>
              <div className="role-summary-timer">
                <Clock size={12} /> Rotation dans: <strong>{countdown}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Users Management Section */}
        <div className="admin-section-container">
          <div className="admin-section-header">
            <div className="section-title">
              <Users size={18} />
              <h3>Gestion des utilisateurs & Rôles</h3>
            </div>

            {/* Search Input */}
            <input 
              type="text" 
              className="admin-search-input"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div className="admin-tabs-row">
            <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
              Tous ({totalUsers})
            </button>
            <button className={`tab-btn ${activeTab === 'learner' ? 'active' : ''}`} onClick={() => setActiveTab('learner')}>
              Apprenants ({totalLearners})
            </button>
            <button className={`tab-btn ${activeTab === 'teacher' ? 'active' : ''}`} onClick={() => setActiveTab('teacher')}>
              Enseignants ({totalTeachers})
            </button>
            <button className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
              Admins ({totalAdmins})
            </button>
            <button className={`tab-btn danger ${activeTab === 'restricted' ? 'active' : ''}`} onClick={() => setActiveTab('restricted')}>
              Restreints / Bannis ({totalRestricted})
            </button>
          </div>

          {/* Users Table */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Citoyen</th>
                  <th>Rôle attribué</th>
                  <th>Statut rôle</th>
                  <th>Restrictions</th>
                  <th>Date d'inscription</th>
                  <th style={{ textAlign: 'right' }}>Actions Administrateur</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#785b49' }}>
                      Aucun citoyen trouvé pour ce filtre.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className={u.isRestricted ? 'row-restricted' : ''}>
                      <td>
                        <div className="user-name-cell">
                          <span className="user-avatar-mini">{u.name.charAt(0)}</span>
                          <div>
                            <div className="user-fullname">{u.name}</div>
                            <div className="user-email">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <select
                          className="role-select-dropdown"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserAppRole)}
                        >
                          <option value="learner">Apprenant (Learner)</option>
                          <option value="teacher">Enseignant (Teacher)</option>
                          <option value="admin">Administrateur (Admin)</option>
                        </select>
                      </td>

                      <td>
                        {u.approvedRole ? (
                          <span className="status-badge green">
                            <Check size={12} /> Approuvé
                          </span>
                        ) : (
                          <button 
                            type="button" 
                            className="approve-btn"
                            onClick={() => handleApprove(u.id)}
                          >
                            <UserCheck size={12} /> Approuver le rôle
                          </button>
                        )}
                      </td>

                      <td>
                        {u.isRestricted ? (
                          <span className="status-badge red">
                            <Lock size={12} /> Restreint (Banni)
                          </span>
                        ) : (
                          <span className="status-badge gray">Actif</span>
                        )}
                      </td>

                      <td>{u.joinedDate}</td>

                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions-row">
                          {/* Flag / Warn Button */}
                          <button
                            type="button"
                            className={`action-btn restrict ${u.isRestricted ? 'active' : ''}`}
                            onClick={() => handleToggleRestrict(u.id, u.isRestricted)}
                            title={u.isRestricted ? 'Débloquer l\'utilisateur' : 'Restreindre l\'utilisateur (Avertir & Bannir du chat)'}
                          >
                            {u.isRestricted ? <Unlock size={14} /> : <AlertTriangle size={14} />}
                            <span>{u.isRestricted ? 'Débloquer' : 'Restreindre'}</span>
                          </button>

                          {/* Delete Account */}
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => handleDelete(u.id, u.name)}
                            title="Supprimer définitivement le compte"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
