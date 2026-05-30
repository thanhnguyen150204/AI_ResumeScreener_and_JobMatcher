import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/analyze', label: 'Analyze' },
    { to: '/history', label: 'History' },
  ];

  if (user?.role === 'RECRUITER' || user?.role === 'ADMIN') {
    navLinks.push({ to: '/hr-ranking', label: 'HR Ranking' });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#d1fae5',
        borderBottom: '1px solid #a7f3d0',
        boxShadow: '0 1px 3px rgba(5,150,105,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              backgroundColor: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>RS</span>
          </div>
          <span style={{ fontSize: 19, fontWeight: 700, color: '#1e293b' }}>
            RS<span style={{ color: '#059669' }}>AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
                backgroundColor: isActive(link.to) ? '#ecfdf5' : 'transparent',
                color: isActive(link.to) ? '#047857' : '#475569',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.to)) {
                  e.target.style.backgroundColor = '#f0fdf4';
                  e.target.style.color = '#1e293b';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.to)) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#475569';
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            style={{
              padding: '5px 14px',
              borderRadius: 999,
              backgroundColor: '#ecfdf5',
              color: '#047857',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {user?.role === 'RECRUITER' ? 'Recruiter' : 'Candidate'}
          </span>
          <Link
            to="/profile"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: '#059669',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </Link>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 14,
              color: '#475569',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => (e.target.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.target.style.color = '#475569')}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
