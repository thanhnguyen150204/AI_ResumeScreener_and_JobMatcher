import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { resumeAPI } from '../api/client';

export default function ReportPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    resumeAPI
      .detail(id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid #d1fae5',
            borderTopColor: '#059669',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: 24 }}>
        <p style={{ color: '#ef4444', fontWeight: 500 }}>{error}</p>
        <Link to="/history" style={{ color: '#059669', fontSize: 13, marginTop: 8, display: 'inline-block' }}>
          ← Back to history
        </Link>
      </div>
    );
  }

  const suggestions = data.suggestions || {};
  const matchScore = data.matchScore || 0;
  const strengths = suggestions.strengths || [];
  const missingKeywords = data.missingKeywords || [];
  const atsTips = suggestions.atsOptimizationTips || [];

  const pieData = [
    { name: 'Match', value: matchScore },
    { name: 'Gap', value: 100 - matchScore },
  ];
  const scoreColor = matchScore >= 80 ? '#059669' : matchScore >= 60 ? '#f59e0b' : '#ef4444';
  const COLORS = [scoreColor, '#e8ecf0'];

  const Tag = ({ children, variant = 'green' }) => (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        backgroundColor: variant === 'green' ? '#ecfdf5' : '#fef2f2',
        color: variant === 'green' ? '#047857' : '#dc2626',
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      {children}
    </span>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link
          to="/history"
          style={{ fontSize: 12, color: '#475569', display: 'inline-block', marginBottom: 8 }}
          onMouseEnter={(e) => (e.target.style.color = '#059669')}
          onMouseLeave={(e) => (e.target.style.color = '#475569')}
        >
          ← Back to history
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
              Analysis Report
            </h1>
            <p style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>
              {data.cvFileName}
            </p>
          </div>
          <span style={{ fontSize: 12, color: '#475569' }}>
            {new Date(data.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        {/* Left — Score & Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Match Score Donut */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
              Overview
            </h2>
            <p style={{ fontSize: 12, color: '#475569', marginBottom: 20, lineHeight: 1.6 }}>
              {suggestions.summary || 'No summary available'}
            </p>
            <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    strokeWidth={0}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>
                  {matchScore}%
                </span>
                <span style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Match Score
                </span>
              </div>
            </div>
          </div>

          {/* Skills Tags */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>
              Matched Skills ({strengths.length})
            </h3>
            <div style={{ marginBottom: 20 }}>
              {strengths.length > 0
                ? strengths.map((s, i) => <Tag key={i}>{s}</Tag>)
                : <span style={{ fontSize: 12, color: '#475569' }}>None identified</span>}
            </div>

            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>
              Missing Skills ({missingKeywords.length})
            </h3>
            <div>
              {missingKeywords.length > 0
                ? missingKeywords.map((kw, i) => <Tag key={i} variant="red">{kw}</Tag>)
                : <span style={{ fontSize: 12, color: '#475569' }}>No gaps found</span>}
            </div>
          </div>
        </div>

        {/* Right — AI Suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {suggestions.suggestions?.summary && (
            <div className="card" style={{ padding: 24 }}>
              <div className="flex items-center" style={{ gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  1
                </span>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                  Optimize Summary Section
                </h3>
              </div>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {suggestions.suggestions.summary}
              </p>
            </div>
          )}

          {suggestions.suggestions?.skills && (
            <div className="card" style={{ padding: 24 }}>
              <div className="flex items-center" style={{ gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  2
                </span>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                  Optimize Skills Section
                </h3>
              </div>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {suggestions.suggestions.skills}
              </p>
            </div>
          )}

          {suggestions.suggestions?.experience && (
            <div className="card" style={{ padding: 24 }}>
              <div className="flex items-center" style={{ gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  3
                </span>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                  Optimize Experience Section
                </h3>
              </div>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {suggestions.suggestions.experience}
              </p>
            </div>
          )}

          {atsTips.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>
                ATS Optimization Tips
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {atsTips.map((tip, i) => (
                  <div key={i} className="flex" style={{ gap: 12 }}>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {i + 1}
                    </span>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 2fr'"],
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
