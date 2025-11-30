const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? '/api'
    : 'https://chatify-api.up.railway.app';

export async function getCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/csrf`, {
    method: 'PATCH',
    credentials: 'include',
  });

  const data = await response.json();
  return data.csrfToken;
}

export function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

export { API_BASE_URL };
