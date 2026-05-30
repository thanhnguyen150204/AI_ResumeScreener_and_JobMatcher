import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../api/client';

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped?.type === 'application/pdf') {
      setFile(dropped);
      setError('');
    } else {
      setError('Only PDF files are accepted');
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please upload your CV (PDF)');
    if (!jdText.trim()) return setError('Please paste the job description');
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('cv', file);
      formData.append('jdText', jdText);
      const res = await resumeAPI.analyze(formData);
      navigate(`/report/${res.data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>
          Upload & Analyze
        </h1>
        <p style={{ color: '#475569', fontSize: 15, marginTop: 6 }}>
          Upload your resume and paste the job description to get AI analysis
        </p>
      </div>

      {error && (
        <div
          style={{
            marginBottom: 20,
            padding: 12,
            borderRadius: 8,
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
          }}
        >
          {/* Left — File upload */}
          <div className="card" style={{ padding: 24 }}>
            <h2
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: 16,
              }}
            >
              Upload Resume
            </h2>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? '#059669' : file ? '#a7f3d0' : '#d5dce6'}`,
                borderRadius: 12,
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: dragActive
                  ? '#ecfdf5'
                  : file
                  ? 'rgba(236,253,245,0.5)'
                  : '#fafbfc',
                transition: 'all 0.2s',
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  width: 56,
                  height: 56,
                  margin: '0 auto 16px',
                  borderRadius: 12,
                  backgroundColor: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#059669', fontSize: 24 }}>↑</span>
              </div>
              {file ? (
                <>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#059669' }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: 14, color: '#475569', marginTop: 4 }}>
                    {(file.size / 1024).toFixed(0)} KB — Click to change
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 16, fontWeight: 500, color: '#1e293b' }}>
                    Drag & Drop your Resume here
                  </p>
                  <p style={{ fontSize: 14, color: '#475569', marginTop: 4 }}>
                    PDF only, max 10MB
                  </p>
                </>
              )}
            </div>

            {file && (
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #d5dce6',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#1e293b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {file.name}
                  </p>
                  <p style={{ fontSize: 13, color: '#475569' }}>
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  style={{
                    fontSize: 14,
                    color: '#ef4444',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Right — JD text */}
          <div className="card" style={{ padding: 24 }}>
            <h2
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: 16,
              }}
            >
              Job Description
            </h2>
            <textarea
              id="jd-text"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder={'Paste the full job description here...\n\nExample: We are looking for a Senior Backend Developer with 3+ years experience in Node.js, Express, PostgreSQL...'}
              rows={14}
              style={{
                width: '100%',
                resize: 'none',
                lineHeight: 1.7,
              }}
            />
            <p style={{ fontSize: 13, color: '#475569', marginTop: 8, textAlign: 'right' }}>
              {jdText.length} characters
            </p>
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            id="analyze-submit"
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 32px',
              borderRadius: 10,
              backgroundColor: '#059669',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#047857')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#059669')}
          >
            {loading ? 'Analyzing...' : '✦ Analyze with AI'}
          </button>
        </div>
      </form>

      <style>{`
        @media (max-width: 768px) {
          form > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
