// API Client Helper
const BASE_URL = '/api';

export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('rb_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Terjadi kesalahan sistem.');
  }

  return data;
}
