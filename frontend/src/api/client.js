const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const authAPI = {
  register: (body) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  login: (body) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  logout: () =>
    fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders(),
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem('refreshToken'),
      }),
    }).then(handleResponse),

  me: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    }).then(handleResponse),
};

export const resumeAPI = {
  analyze: (formData) =>
    fetch(`${API_BASE}/resume/analyze`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    }).then(handleResponse),

  history: () =>
    fetch(`${API_BASE}/resume/history`, {
      headers: getHeaders(),
    }).then(handleResponse),

  detail: (id) =>
    fetch(`${API_BASE}/resume/history/${id}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  bulkRank: (formData) =>
    fetch(`${API_BASE}/resume/bulk-rank`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    }).then(handleResponse),
};
