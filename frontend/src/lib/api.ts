let tokenGetter: (() => Promise<string | null>) | null = null

const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export function setTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = tokenGetter ? await tokenGetter() : null
  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail || response.statusText)
  }

  return response.json()
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
}

