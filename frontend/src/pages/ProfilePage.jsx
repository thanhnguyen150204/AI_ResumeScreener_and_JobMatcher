import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
          Profile Settings
        </h1>
        <p style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>
          Manage your account information
        </p>
      </div>

      <div className="card" style={{ padding: 32 }}>
        {/* Avatar */}
        <div
          className="flex items-center"
          style={{
            gap: 20,
            paddingBottom: 24,
            marginBottom: 24,
            borderBottom: '1px solid #edf0f4',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: '#d1fae5',
              color: '#047857',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
              {user?.email}
            </p>
            <span
              style={{
                display: 'inline-block',
                marginTop: 6,
                padding: '3px 12px',
                borderRadius: 999,
                backgroundColor: '#ecfdf5',
                color: '#047857',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {user?.role === 'RECRUITER' ? 'Recruiter' : 'Candidate'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input type="email" defaultValue={user?.email} disabled />
            <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
              Email cannot be changed
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: 6,
              }}
            >
              Role
            </label>
            <input
              type="text"
              value={user?.role === 'RECRUITER' ? 'Recruiter / HR' : 'Candidate'}
              disabled
            />
          </div>

          <div
            style={{
              paddingTop: 20,
              marginTop: 4,
              borderTop: '1px solid #edf0f4',
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: 16,
              }}
            >
              Change Password
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: 6,
                  }}
                >
                  Current Password
                </label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: 6,
                  }}
                >
                  New Password
                </label>
                <input type="password" placeholder="••••••••" />
              </div>
            </div>
          </div>

          <div
            className="flex items-center"
            style={{ gap: 12, marginTop: 28 }}
          >
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                borderRadius: 10,
                backgroundColor: '#059669',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Save Changes
            </button>
            {saved && (
              <span style={{ fontSize: 13, color: '#059669', fontWeight: 500 }}>
                ✓ Saved!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
