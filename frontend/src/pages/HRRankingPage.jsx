import { useState, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { resumeAPI } from '../api/client';

const PIE_COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#f59e0b', '#fb923c', '#ef4444'];

export default function HRRankingPage() {
  const [files, setFiles] = useState([]);
  const [jdText, setJdText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('table');
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const pdfs = selected.filter((f) => f.type === 'application/pdf');
    setFiles(pdfs);
    if (pdfs.length < selected.length) {
      setError(`${selected.length - pdfs.length} non-PDF file(s) were skipped`);
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return setError('Please upload at least 1 CV');
    if (!jdText.trim()) return setError('Please paste the job description');
    setError('');
    setLoading(true);
    setResults(null);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('cvs', f));
      formData.append('jdText', jdText);
      const res = await resumeAPI.bulkRank(formData);
      setResults(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBarColor = (s) => (s >= 80 ? '#059669' : s >= 60 ? '#f59e0b' : '#ef4444');
  const getScoreStyle = (s) => {
    if (s >= 80) return { backgroundColor: '#ecfdf5', color: '#047857' };
    if (s >= 60) return { backgroundColor: '#fffbeb', color: '#b45309' };
    return { backgroundColor: '#fef2f2', color: '#dc2626' };
  };

  const btnBase = {
    padding: '6px 14px', fontSize: 12, fontWeight: 500,
    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
          HR Candidate Ranking
        </h1>
        <p style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>
          Upload multiple CVs and let AI rank the best candidates
        </p>
      </div>

      {/* Upload form */}
      {!results && (
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ marginBottom: 20, padding: 12, borderRadius: 8, backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }}>
              {error}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>
                Upload Resumes
              </h2>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: '2px dashed #d5dce6', borderRadius: 12,
                  padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
                  backgroundColor: '#fafbfc', transition: 'border-color 0.2s',
                }}
              >
                <input ref={fileRef} type="file" accept=".pdf" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                <p style={{ fontSize: 14, fontWeight: 500, color: '#1e293b' }}>Click to select multiple PDFs</p>
                <p style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Up to 50 files, PDF only</p>
              </div>
              {files.length > 0 && (
                <div style={{ marginTop: 16, maxHeight: 160, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, padding: '8px 12px', borderRadius: 8, backgroundColor: '#f0fdf4', border: '1px solid #d5dce6' }}>
                      <span style={{ color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{f.name}</span>
                      <span style={{ fontSize: 11, color: '#475569' }}>{(f.size / 1024).toFixed(0)} KB</span>
                    </div>
                  ))}
                  <p style={{ fontSize: 11, color: '#475569', textAlign: 'right', paddingTop: 4 }}>{files.length} file(s)</p>
                </div>
              )}
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Job Description</h2>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job description here..."
                rows={12}
                style={{ width: '100%', resize: 'none', lineHeight: 1.7 }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit" disabled={loading}
              style={{
                padding: '12px 32px', borderRadius: 10, backgroundColor: '#059669',
                color: '#fff', fontWeight: 600, fontSize: 14, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Ranking...' : '✦ Analyze with AI'}
            </button>
          </div>
        </form>
      )}

      {/* Results */}
      {results && (
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: '#475569' }}>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>{results.length}</span> candidates ranked
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setResults(null)}
                style={{ ...btnBase, padding: '8px 16px', borderRadius: 8, border: '1px solid #d5dce6', color: '#475569', backgroundColor: '#fff' }}
              >
                New Ranking
              </button>
              <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #d5dce6' }}>
                <button onClick={() => setView('table')} style={{ ...btnBase, backgroundColor: view === 'table' ? '#059669' : '#fff', color: view === 'table' ? '#fff' : '#475569' }}>Table</button>
                <button onClick={() => setView('chart')} style={{ ...btnBase, backgroundColor: view === 'chart' ? '#059669' : '#fff', color: view === 'chart' ? '#fff' : '#475569' }}>Chart</button>
              </div>
            </div>
          </div>

          {view === 'table' ? (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #d5dce6' }}>
                    {['Rank', 'Name', 'Match Score', 'Strengths', 'Missing'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #edf0f4', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: '50%', fontSize: 11, fontWeight: 700,
                          backgroundColor: i < 3 ? '#059669' : '#f0fdf4', color: i < 3 ? '#fff' : '#475569',
                        }}>{i + 1}</span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{r.filename}</p>
                        {r.error && <p style={{ fontSize: 10, color: '#ef4444', marginTop: 2 }}>{r.error}</p>}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 80, height: 6, borderRadius: 3, backgroundColor: '#edf0f4', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 3, width: `${r.matchScore}%`, backgroundColor: getBarColor(r.matchScore), transition: 'width 0.5s' }} />
                          </div>
                          <span style={{ ...getScoreStyle(r.matchScore), fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{r.matchScore}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {(r.strengths || []).slice(0, 2).map((s, j) => (
                            <span key={j} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, backgroundColor: '#ecfdf5', color: '#047857' }}>{s}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {(r.missingKeywords || []).slice(0, 2).map((kw, j) => (
                            <span key={j} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, backgroundColor: '#fef2f2', color: '#dc2626' }}>{kw}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Comparative Match Scores</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={results.map((r) => ({ name: r.filename.replace(/\.pdf$/i, '').slice(0, 15), score: r.matchScore }))} layout="vertical" barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} width={120} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#059669" radius={[0, 6, 6, 0]} name="Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Score Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={results.map((r) => ({ name: r.filename.replace(/\.pdf$/i, '').slice(0, 12), value: r.matchScore }))}
                      cx="50%" cy="50%" outerRadius={100} dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false} strokeWidth={2}
                    >
                      {results.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
