import React, { useEffect, useRef, useState } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';

/**
 * Connexion automatique de l'activité.
 *
 * Discord fournit le code OAuth au SDK : le joueur n'a donc plus à saisir ou
 * copier son identifiant Discord. Le serveur transforme ce code en session.
 */
export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const authStarted = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function connectActivity() {
      // Le code retourné par authorize est à usage unique. Cette garde évite
      // qu'un double montage React ne l'envoie deux fois au serveur.
      if (authStarted.current) return;
      authStarted.current = true;

      try {
        const configResponse = await fetch('/api/activity-config', {
          credentials: 'include'
        });
        const config = await configResponse.json();
        if (!configResponse.ok || !config.clientId) {
          throw new Error(config.error || 'L’activité Discord n’est pas configurée.');
        }

        const discordSdk = new DiscordSDK(config.clientId);
        await discordSdk.ready();

        const { code } = await discordSdk.commands.authorize({
          client_id: config.clientId,
          response_type: 'code',
          state: '',
          prompt: 'none',
          // L'activité a uniquement besoin de l'identité Discord.
          // Le scope des commandes peut déclencher l'installation de
          // l'application, ce qui n'est pas nécessaire puisque le bot est
          // déjà présent sur le serveur.
          scope: ['identify']
        });

        const authResponse = await fetch('/auth/activity', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        const authData = await authResponse.json();
        if (!authResponse.ok || !authData.access_token) {
          throw new Error(authData.error || 'Connexion Discord impossible.');
        }

        await discordSdk.commands.authenticate({
          access_token: authData.access_token
        });

        if (!cancelled) onLogin(authData.user);
      } catch (connectionError) {
        if (!cancelled) {
          setError(connectionError.message || 'Connexion Discord impossible.');
          setLoading(false);
        }
      }
    }

    connectActivity();
    return () => {
      cancelled = true;
    };
  }, [onLogin]);

  const handleDemo = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/auth/demo', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Connexion de démonstration impossible.');
      }
      onLogin(data.user);
    } catch (demoError) {
      setError(demoError.message || 'Connexion impossible.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <span className="login-crown">👑</span>
        <h1>Medieval Kingdom</h1>
        <p>Connexion automatique à votre aventure Discord</p>

        <div style={{
          marginTop: 24,
          padding: '16px 18px',
          background: 'var(--bg-card2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          textAlign: 'left',
          lineHeight: 1.5
        }}>
          {loading ? (
            <>
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              <strong style={{ color: 'var(--gold)' }}>Identification Discord…</strong>
              <p style={{ marginTop: 6, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Votre membre Discord est reconnu automatiquement.
              </p>
            </>
          ) : (
            <>
              <strong style={{ color: 'var(--gold)' }}>L’activité doit être ouverte dans Discord</strong>
              <p style={{ marginTop: 6, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Lancez Medieval Kingdom depuis un salon vocal Discord pour être identifié sans saisir votre ID.
              </p>
            </>
          )}
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

        {!loading && (
          <button
            className="btn btn-demo"
            onClick={handleDemo}
            style={{ marginTop: 20, marginBottom: 0 }}
          >
            🎭 Ouvrir le mode démo
          </button>
        )}
      </div>
    </div>
  );
}