const API_BASE = import.meta.env.VITE_API_URL || 'https://39.106.162.16/api'

function getToken() {
  return localStorage.getItem('layers_token')
}

async function request(method: string, path: string, body?: unknown, auth = false) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (auth) {
    const token = getToken()
    if (!token) throw new Error('Unauthorized')
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Request failed: ${res.status}`)
  }
  return data.data
}

export const api = {
  // Auth
  register: (data: { username: string; email: string; password: string; artist_name?: string; plan?: string }) =>
    request('POST', '/auth/register', data),
  login: (data: { email: string; password: string }) =>
    request('POST', '/auth/login', data),
  me: () => request('GET', '/auth/me', undefined, true),

  // Artworks
  getArtworks: (params?: { page?: number; limit?: number; search?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return request('GET', `/artworks${qs ? `?${qs}` : ''}`)
  },
  getArtwork: (id: string) => request('GET', `/artworks/${id}`),
  getMyArtworks: () => request('GET', '/artworks/creator/mine', undefined, true),
  createArtwork: (data: { title: string; description?: string; original_image_url?: string; mockup_url?: string; tags?: string[] }) =>
    request('POST', '/artworks', data, true),

  // Creator
  getCreatorDashboard: () => request('GET', '/creator/dashboard', undefined, true),
  getCreatorEarnings: () => request('GET', '/creator/earnings', undefined, true),
  getCreatorOrders: () => request('GET', '/creator/orders', undefined, true),
  getExternalAccounts: () => request('GET', '/creator/external-accounts', undefined, true),
  addExternalAccount: (data: { platform: string; account_name?: string; api_key?: string; shop_url?: string }) =>
    request('POST', '/creator/external-accounts', data, true),

  // Admin
  getAdminDashboard: () => request('GET', '/admin/dashboard', undefined, true),
  getAdminArtworks: (params?: { status?: string; page?: number }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return request('GET', `/admin/artworks${qs ? `?${qs}` : ''}`, undefined, true)
  },
  approveArtwork: (id: number) => request('POST', `/admin/artworks/${id}/approve`, undefined, true),
  rejectArtwork: (id: number, reason?: string) =>
    request('POST', `/admin/artworks/${id}/reject`, { reason }, true),
  getAdminCreators: () => request('GET', '/admin/creators', undefined, true),
  getAdminOrders: () => request('GET', '/admin/orders', undefined, true),

  // Printify
  getBlueprints: () => request('GET', '/printify/blueprints'),
  getPrintifyPending: () => request('GET', '/printify-sync/pending', undefined, true),
  syncPrintify: (artworkId: number) => request('POST', `/printify-sync/sync/${artworkId}`, undefined, true),
  syncPrintifyAll: () => request('POST', '/printify-sync/sync/all', undefined, true),

  // External platforms
  getPlatforms: () => request('GET', '/external-platforms/platforms'),
}

export default api
