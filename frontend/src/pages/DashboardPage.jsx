import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { resumeAPI } from '../api/client';

export default function DashboardPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resumeAPI
      .history()
      .then((res) => setHistory(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalScans = history.length;
  const avgMatch =
    totalScans > 0
      ? Math.round(history.reduce((s, h) => s + h.matchScore, 0) / totalScans)
      : 0;
  const highMatch = history.filter((h) => h.matchScore >= 80).length;
  const needsWork = history.filter((h) => h.matchScore < 60).length;

  const chartData = (() => {
    const months = {};
    const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    history.forEach((h) => {
      const d = new Date(h.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!months[key]) months[key] = { name: names[d.getMonth()], count: 0 };
      months[key].count += 1;
    });
    return Object.values(months).slice(-8);
  })();

  const recentScans = history.slice(0, 6);

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
      </div>
    );
  }

  const statCards = [
    { label: 'Resumes Scanned', value: totalScans, color: '#1e293b' },
    { label: 'Avg. Match Score', value: `${avgMatch}%`, color: '#059669' },
    { label: 'High Match (≥80%)', value: highMatch, color: '#059669' },
    { label: 'Needs Improvement', value: needsWork, color: '#f59e0b' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>
            Dashboard
          </h1>
          <p style={{ color: '#475569', fontSize: 15, marginTop: 6 }}>
            Overview of your resume analysis activity
          </p>
        </div>
        <Link
          to="/analyze"
          style={{
            padding: '12px 24px',
            borderRadius: 10,
            backgroundColor: '#059669',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ✦ Analyze with AI
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
          marginBottom: 36,
        }}
      >
        {statCards.map((s) => (
          <div className="card" key={s.label} style={{ padding: 28 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: s.color,
                marginTop: 10,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: 24,
        }}
      >
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>
            Analytics Overview
          </h2>
          <p style={{ fontSize: 14, color: '#475569', marginBottom: 24 }}>
            Monthly resume scans
          </p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 13, fill: '#475569' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 13, fill: '#475569' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                  name="Scans"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div
              className="flex items-center justify-center"
              style={{ height: 280, color: '#475569', fontSize: 15 }}
            >
              No data yet. Start by analyzing your first CV!
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 28 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>
              Recent Scans
            </h2>
            <Link
              to="/history"
              style={{ fontSize: 14, color: '#059669', fontWeight: 600 }}
            >
              See all
            </Link>
          </div>
          {recentScans.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentScans.map((scan) => (
                <Link
                  key={scan.id}
                  to={`/report/${scan.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: '#1e293b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {scan.cvFileName}
                    </p>
                    <p style={{ fontSize: 13, color: '#475569', marginTop: 3 }}>
                      {new Date(scan.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    style={{
                      ...getScoreStyle(scan.matchScore),
                      fontSize: 13,
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: 999,
                      marginLeft: 12,
                    }}
                  >
                    {scan.matchScore}%
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="flex items-center justify-center"
              style={{ height: 200, color: '#475569', fontSize: 15 }}
            >
              No scans yet
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '3fr 2fr'"],
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
