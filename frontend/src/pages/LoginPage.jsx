import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        await register(email, password, role);
        setSuccess('Account created! Please login.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f0fdf4' }}>
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
        style={{
          background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)',
        }}
      >
        <div style={{ maxWidth: 440 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 32 }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>RS</span>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
              RSAI
            </span>
          </div>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#fff',
              marginBottom: 16,
            }}
          >
            AI-Powered Resume Screening
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            Match your CV with job descriptions instantly. Get ATS optimization tips
            and improve your chances of landing the perfect job.
          </p>
          <div
            className="grid grid-cols-3"
            style={{ gap: 16, marginTop: 48 }}
          >
            {[
              { val: '95%', label: 'Accuracy' },
              { val: '10s', label: 'Analysis' },
              { val: '50+', label: 'CVs at once' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: '16px 12px',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.7)',
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center" style={{ padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div
            className="lg:hidden flex items-center justify-center"
            style={{ gap: 10, marginBottom: 32 }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#059669',
              }}
            >
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>RS</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
              RS<span style={{ color: '#059669' }}>AI</span>
            </span>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: '#475569', marginBottom: 32, fontSize: 14 }}>
            {isLogin
              ? 'Sign in to continue to RSAI'
              : 'Get started with your free account'}
          </p>

          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                borderRadius: 8,
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                borderRadius: 8,
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#059669',
                fontSize: 13,
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
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
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
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
                  I am a
                </label>
                <select
                  id="register-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="USER">Candidate</option>
                  <option value="RECRUITER">Recruiter / HR</option>
                </select>
              </div>
            )}

            {isLogin && (
              <div
                className="flex items-center"
                style={{ gap: 8, marginBottom: 20 }}
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{
                    width: 16,
                    height: 16,
                    accentColor: '#059669',
                    borderRadius: 4,
                  }}
                />
                <span style={{ fontSize: 13, color: '#475569' }}>Remember me</span>
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 0',
                borderRadius: 10,
                backgroundColor: '#059669',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'background-color 0.2s',
                marginTop: 4,
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#047857')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#059669')}
            >
              {loading
                ? 'Please wait...'
                : isLogin
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <p
            style={{
              marginTop: 24,
              textAlign: 'center',
              fontSize: 13,
              color: '#475569',
            }}
          >
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              style={{
                color: '#059669',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
