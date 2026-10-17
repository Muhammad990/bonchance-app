import React, { useState, useEffect } from 'react';
import './App.css';
import StartPage from './Component/StartPage';
import Dashboard from './Component/Dashboard';
import { API_URL, getCookie, deleteCookie } from './api';
import { useLanguage } from './LanguageContext';

function App() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [rejection, setRejection] = useState('');
  const [inviteCode, setInviteCode] = useState(
    () => new URLSearchParams(window.location.search).get('invite') || ''
  );

  const handleInviteLogin = (member) => {
    setUser(member);
    setInviteCode('');
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, '', '/');
    }
  };

  useEffect(() => {
    if (user && user.unseenRejection && user.rejectionReason) {
      setRejection(user.rejectionReason);
    } else if (!user) {
      setRejection('');
    }
  }, [user]);

  const dismissRejection = async () => {
    setRejection('');
    const token = getCookie('token');
    if (user && token) {
      try {
        await fetch(`${API_URL}/api/auth/mark-rejection-seen`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser((u) => (u ? { ...u, unseenRejection: false, rejectionReason: '' } : u));
      } catch (e) {
        /* ignore */
      }
    }
  };

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const token = getCookie('token');
      if (token) {
        try {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            credentials: 'include',
            headers: { Authorization: `Bearer ${token}` },
          });
          const json = await res.json().catch(() => null);
          if (!cancelled && res.ok && json && json.success && json.data) {
            setUser(json.data.member);
          }
        } catch (e) {
          /* no session, show start page */
        }
      }
      if (!cancelled) setReady(true);
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="App">
      {!ready ? null : inviteCode ? (
        <StartPage onLogin={handleInviteLogin} />
      ) : user ? (
        <Dashboard
          user={user}
          onLogout={() => { deleteCookie('token'); setUser(null); }}
        />
      ) : (
        <StartPage onLogin={setUser} />
      )}

      {rejection && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '300px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px 20px 18px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 12px',
                borderRadius: '50%',
                backgroundColor: '#ffecec',
                color: '#e03e3e',
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#333333', marginBottom: '8px' }}>
              {t('app.rejected_title')}
            </div>
            <p style={{ fontSize: '13px', color: '#777777', margin: '0 0 16px', lineHeight: '1.5' }}>
              {rejection}
            </p>
            <button
              onClick={dismissRejection}
              style={{
                width: '100%',
                height: '40px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: '#e03e3e',
                color: '#ffffff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {t('common.ok')}
            </button>
          </div>
        </div>
      )}
      {/* <Deposit/> */}
      {/* <Withdraw/> */}
      {/* <AboutUs/> */}
      {/* <InvitationRules/> */}
      {/* <VipRules/> */}
      {/* <Faq/> */}
      {/* <AboutUsDetails/> */}
      {/* <InviteFriends/> */}
      {/* <Starting/> */}
      {/* <Services/> */}
      {/* <MyProfile/> */}
      {/* <LoginPassword/> */}
      {/* <SecurityPin/> */}
      {/* <WithdrawPage/> */}
    </div>
  );
}

export default App;
