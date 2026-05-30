import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI } from '../api/client';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resumeAPI
      .history()
      .then((res) => setHistory(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getScoreStyle = (score) => {
    if (score >= 80) return { backgroundColor: '#ecfdf5', color: '#047857' };
    if (score >= 60) return { backgroundColor: '#fffbeb', color: '#b45309' };
    return { backgroundColor: '#fef2f2', color: '#dc2626' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div
          style={{
            width: 36, height: 36,
            border: '3px solid #d1fae5', borderTopColor: '#059669',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>
            Analysis History
          </h1>
          <p style={{ color: '#475569', fontSize: 15, marginTop: 6 }}>
            {history.length} total scans
          </p>
        </div>
        <Link
          to="/analyze"
          style={{
            padding: '12px 24px', borderRadius: 10,
            backgroundColor: '#059669', color: '#fff',
            fontSize: 15, fontWeight: 600, textDecoration: 'none',
          }}
        >
          ✦ New Analysis
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <p style={{ color: '#475569', marginBottom: 16, fontSize: 16 }}>No analyses yet</p>
          <Link to="/analyze" style={{ color: '#059669', fontWeight: 600, fontSize: 15 }}>
            Start your first analysis →
          </Link>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #d5dce6' }}>
                {['File Name', 'Match Score', 'Missing Keywords', 'Date', ''].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left', padding: '16px 28px',
                      fontSize: 13, fontWeight: 600, color: '#475569',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: '1px solid #edf0f4', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '18px 28px' }}>
                    <p style={{ fontSize: 15, fontWeight: 500, color: '#1e293b', maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.cvFileName}
                    </p>
                  </td>
                  <td style={{ padding: '18px 28px' }}>
                    <span style={{ ...getScoreStyle(item.matchScore), fontSize: 14, fontWeight: 700, padding: '4px 14px', borderRadius: 999 }}>
                      {item.matchScore}%
                    </span>
                  </td>
                  <td style={{ padding: '18px 28px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(item.missingKeywords || []).slice(0, 3).map((kw, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: 12, padding: '4px 10px', borderRadius: 999,
                            backgroundColor: '#f0fdf4', border: '1px solid #d5dce6',
                            color: '#475569',
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                      {(item.missingKeywords || []).length > 3 && (
                        <span style={{ fontSize: 12, color: '#475569' }}>
                          +{item.missingKeywords.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '18px 28px' }}>
                    <span style={{ fontSize: 14, color: '#475569' }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </span>
                  </td>
                  <td style={{ padding: '18px 28px', textAlign: 'right' }}>
                    <Link
                      to={`/report/${item.id}`}
                      style={{ fontSize: 14, color: '#059669', fontWeight: 600 }}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
