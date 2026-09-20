import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';

import CharacterPage from './pages/CharacterPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import QuestsPage from './pages/QuestsPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CombatPage from './pages/CombatPage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import WelcomeGuide from './components/WelcomeGuide.jsx';

const API = '';

export const UserContext = createContext(null);

function useUser() {
  return useContext(UserContext);
}

function Avatar({ user, size = 36 }) {
  const [imgError, setImgError] = React.useState(false);
  const avatarUrl = user?.avatarUrl;
  const initial = (user?.displayName || user?.username || '?')[0].toUpperCase();

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={user.username}
        onError={() => setImgError(true)}
        style={{
          width: size, height: size, borderRadius: '50%',
          border: '2px solid var(--border-gold)', objectFit: 'cover', flexShrink: 0
        }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: '2px solid var(--border-gold)', background: 'var(--bg-dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Cinzel, serif', fontWeight: 700, color: 'var(--gold)',
      fontSize: size * 0.4, flexShrink: 0
    }}>
      {initial}
    </div>
  );
}

export { Avatar };

function Sidebar({ user }) {
  const handleLogout = () => {
    window.location.href = '/auth/logout';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="crown">⚔️</span>
        <h2>Kingdom</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="icon">🏰</span>
          <span>Accueil</span>
        </NavLink>
        <NavLink to="/character" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="icon">⚔️</span>
          <span>Personnage</span>
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="icon">🎒</span>
          <span>Inventaire</span>
        </NavLink>
        <NavLink to="/quests" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="icon">📜</span>
          <span>Quêtes</span>
        </NavLink>
        <NavLink to="/combat" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="icon">⚔️</span>
          <span>Combat</span>
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="icon">🏪</span>
          <span>Boutique</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="icon">🏆</span>
          <span>Classement</span>
        </NavLink>
      </nav>
      <div className="sidebar-user">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Avatar user={user} size={36} />
          <div style={{ minWidth: 0 }}>
            <div className="user-name">{user?.displayName || user?.username || 'Aventurier'}</div>
            <div className="user-sub">{user?.demo ? 'Mode démo' : 'Discord'}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
      </div>
    </aside>
  );
}

function CharacterRequiredPage({ onCharacterCreated }) {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const checkCharacter = async () => {
    setChecking(true);
    setError('');
    try {
      const response = await fetch('/api/player', { credentials: 'include' });
      const data = await response.json();
      if (data.player) {
        onCharacterCreated();
      } else {
        setError('Aucun personnage trouvé pour votre compte Discord.');
      }
    } catch {
      setError('Impossible de vérifier votre personnage. Réessayez.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <span className="login-crown">🛡️</span>
        <h1>Bienvenue, aventurier</h1>
        <p>Votre compte Discord a bien été reconnu.</p>
        <div style={{
          marginTop: 24,
          padding: '18px',
          background: 'var(--bg-card2)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius)',
          textAlign: 'left',
          lineHeight: 1.55
        }}>
          <strong style={{ color: 'var(--gold)' }}>Votre aventure n’a pas encore commencé</strong>
          <p style={{ marginTop: 8, color: 'var(--text)' }}>
            Créez votre personnage dans un salon Discord avec la commande :
          </p>
          <code style={{
            display: 'block',
            marginTop: 12,
            padding: '10px 12px',
            background: 'var(--bg-dark)',
            color: 'var(--gold-light)',
            borderRadius: 6,
            fontSize: '1rem'
          }}>
            /personnage creer
          </code>
          <p style={{ marginTop: 10, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Choisissez ensuite votre classe et relancez la vérification ci-dessous.
          </p>
        </div>

        {error && (
          <div style={{
            marginTop: 14,
            padding: '10px 14px',
            background: '#2a0e0e',
            border: '1px solid #c0392b',
            borderRadius: 'var(--radius)',
            fontSize: '0.85rem',
            color: '#e74c3c',
            textAlign: 'left'
          }}>
            ⚠️ {error}
          </div>
        )}

        <button
          className="btn btn-gold"
          onClick={checkCharacter}
          disabled={checking}
          style={{ marginTop: 18 }}
        >
          {checking ? '⏳ Vérification…' : '✅ J’ai créé mon personnage'}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined);
  const [discordAuthEnabled, setDiscordAuthEnabled] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasCharacter, setHasCharacter] = useState(undefined);

  useEffect(() => {
    fetch(`${API}/api/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setUser(data.user || null); })
      .catch(() => setUser(null));
  }, []);

  // Show welcome guide for new players (level 1, never seen it)
  useEffect(() => {
    if (!user) return;
    setHasCharacter(undefined);
    fetch(`${API}/api/player`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setHasCharacter(Boolean(data.player)))
      .catch(() => setHasCharacter(true));
  }, [user]);

  // Show welcome guide for new players (level 1, never seen it)
  useEffect(() => {
    if (!user || hasCharacter === false) return;
    const key = `welcome_seen_${user.id}`;
    if (localStorage.getItem(key)) return;
    fetch(`${API}/api/player`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const p = data.player;
        if (p && p.level <= 1 && !p.faction && Object.keys(p.inventory || {}).length === 0) {
          setShowWelcome(true);
        }
      })
      .catch(() => {});
  }, [user]);

  const closeWelcome = () => {
    setShowWelcome(false);
    if (user) localStorage.setItem(`welcome_seen_${user.id}`, '1');
  };

  if (user === undefined) {
    return (
      <div className="loading" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
        <span>Chargement du royaume...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <UserContext.Provider value={{ user: null }}>
        <LoginPage onLogin={(u) => setUser(u)} />
      </UserContext.Provider>
    );
  }

  if (hasCharacter === undefined) {
    return (
      <div className="loading" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
        <span>Vérification de votre personnage...</span>
      </div>
    );
  }

  if (!hasCharacter) {
    return (
      <UserContext.Provider value={{ user, discordAuthEnabled }}>
        <CharacterRequiredPage onCharacterCreated={() => setHasCharacter(true)} />
      </UserContext.Provider>
    );
  }

  return (
    <UserContext.Provider value={{ user, discordAuthEnabled }}>
      {showWelcome && <WelcomeGuide onClose={closeWelcome} />}
      <BrowserRouter>
        <div className="layout">
          <Sidebar user={user} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/character" element={<CharacterPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/combat" element={<CombatPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
