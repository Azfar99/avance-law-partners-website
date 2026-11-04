import { productionConfig, EXPECTED_PROJECT_REF } from "./productionConfig"

const SUPABASE_URL = productionConfig.url
const SUPABASE_ANON_KEY = productionConfig.publicKey
export const isConfigured = productionConfig.backendConfigured

function getSupabaseHeaders(
  sessionToken?: string,
  contentType?: string,
): Record<string, string> {
  const headers: Record<string, string> = { apikey: SUPABASE_ANON_KEY }
  if (contentType) headers["Content-Type"] = contentType

  if (sessionToken) headers.Authorization = `Bearer ${sessionToken}`
  return headers
}

// Local Mock Storage Key
const LOCAL_STORAGE_PREFIX = `alp_prod_${EXPECTED_PROJECT_REF}_db_`

export function hasLocalTable(table: string): boolean {
  try {
    return Array.isArray(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFIX + table) || "null"),
    )
  } catch {
    return false
  }
}

function getLocalTable<T>(table: string, defaultData: T[] = []): T[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + table)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.warn("Could not read local table", table, e)
  }
  return defaultData
}

// Token management for Auth
const AUTH_TOKEN_KEY = `alp_prod_${EXPECTED_PROJECT_REF}_auth_token`
const AUTH_USER_KEY = `alp_prod_${EXPECTED_PROJECT_REF}_auth_user`

export function getStoredSession() {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const userStr = localStorage.getItem(AUTH_USER_KEY)
    if (
      token &&
      userStr &&
      token !== "local-jwt-token-preview"
    ) {
      return { token, user: JSON.parse(userStr) }
    }
  } catch (e) {
    // ignore
  }
  return null
}

export function setStoredSession(token: string | null, user: any | null) {
  if (token && user) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  }
  authListeners.forEach((fn) =>
    fn(
      user ? "SIGNED_IN" : "SIGNED_OUT",
      user ? { user, access_token: token } : null,
    ),
  )
}

const authListeners: Array<(event: string, session: any) => void> = []

interface QueryResult {
  data: any
  error: any
}

class QueryBuilder {
  private operation: "select" | "update" | "delete" = "select"
  private patch: any
  private table: string
  private filters: Array<{
    column: string
    operator: string
    value: any
  }> = []
  private orderCol: string | null = null
  private orderAsc: boolean = true
  private limitVal: number | null = null

  constructor(table: string, private readonly useSession: boolean) {
    this.table = table
  }

  select(columns: string = "*") {
    return this
  }

  eq(column: string, value: any) {
    this.filters.push({ column, operator: "eq", value })
    return this
  }

  order(column: string, { ascending = true }: { ascending?: boolean } = {}) {
    this.orderCol = column
    this.orderAsc = ascending
    return this
  }

  limit(count: number) {
    this.limitVal = count
    return this
  }

  async then(resolve: (result: QueryResult) => void) {
    if (this.operation === "update")
      return resolve(await this.executeUpdate(this.patch))
    if (this.operation === "delete") return resolve(await this.executeDelete())
    if (isConfigured) {
      try {
        let url = `${SUPABASE_URL}/rest/v1/${this.table}?select=*`
        for (const f of this.filters) {
          url += `&${f.column}=${f.operator}.${encodeURIComponent(f.value)}`
        }
        if (this.orderCol) {
          url += `&order=${this.orderCol}.${this.orderAsc ? "asc" : "desc"}`
        }
        if (this.limitVal) {
          url += `&limit=${this.limitVal}`
        }

        const session = this.useSession ? getStoredSession() : null
        const headers = getSupabaseHeaders(session?.token, "application/json")

        const res = await fetch(url, {
          headers,
          signal: AbortSignal.timeout(10_000),
        })
        if (!res.ok) {
          const err = await res
            .json()
            .catch(() => ({ message: res.statusText }))
          resolve({ data: null, error: err })
          return
        }
        const data = await res.json()
        resolve({ data, error: null })
        return
      } catch (err) {
        resolve({
          data: null,
          error: { message: "Could not load content. Please try again." },
        })
        return
      }
    }

    // Local Storage Mock fallback
    let items = getLocalTable<any>(this.table)
    for (const f of this.filters) {
      items = items.filter((item) => String(item[f.column]) === String(f.value))
    }
    if (this.orderCol) {
      const col = this.orderCol
      const asc = this.orderAsc
      items.sort((a, b) => {
        if (a[col] < b[col]) return asc ? -1 : 1
        if (a[col] > b[col]) return asc ? 1 : -1
        return 0
      })
    }
    if (this.limitVal) {
      items = items.slice(0, this.limitVal)
    }
    resolve({ data: items, error: null })
  }

  async insert(recordOrRecords: any | any[]) {
    const isArray = Array.isArray(recordOrRecords)
    if (isConfigured) {
      try {
        const session = getStoredSession()
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${this.table}`, {
          method: "POST",
          headers: {
            ...getSupabaseHeaders(session?.token, "application/json"),
            Prefer: "return=representation",
          },
          body: JSON.stringify(recordOrRecords),
        })
        if (!res.ok) {
          const err = await res
            .json()
            .catch(() => ({ message: res.statusText }))
          return { data: null, error: err }
        }
        const data = await res.json()
        return { data: isArray ? data : data[0], error: null }
      } catch (e) {
        return {
          data: null,
          error: { message: "Could not save the record. Please try again." },
        }
      }
    }

    return { data: null, error: { message: "Online administration is unavailable." } }
  }

  update(patch: any) {
    this.operation = "update"
    this.patch = patch
    return this
  }

  delete() {
    this.operation = "delete"
    return this
  }

  private async executeUpdate(patch: any) {
    const filters = this.filters
    if (!filters.length)
      return {
        data: null,
        error: { message: "A record filter is required for updates." },
      }
    if (isConfigured) {
      try {
        let url = `${SUPABASE_URL}/rest/v1/${this.table}?`
        for (const f of filters) {
          url += `&${f.column}=${f.operator}.${encodeURIComponent(f.value)}`
        }
        const session = getStoredSession()
        const res = await fetch(url, {
          method: "PATCH",
          headers: {
            ...getSupabaseHeaders(session?.token, "application/json"),
            Prefer: "return=representation",
          },
          body: JSON.stringify(patch),
        })
        if (!res.ok) {
          const err = await res
            .json()
            .catch(() => ({ message: res.statusText }))
          return { data: null, error: err }
        }
        const data = await res.json()
        return { data, error: null }
      } catch (e) {
        return {
          data: null,
          error: { message: "Could not save changes. Please try again." },
        }
      }
    }

    return { data: null, error: { message: "Online administration is unavailable." } }
  }

  private async executeDelete() {
    const filters = this.filters
    if (!filters.length)
      return {
        data: null,
        error: { message: "A record filter is required for deletion." },
      }
    if (isConfigured) {
      try {
        let url = `${SUPABASE_URL}/rest/v1/${this.table}?`
        for (const f of filters) {
          url += `&${f.column}=${f.operator}.${encodeURIComponent(f.value)}`
        }
        const session = getStoredSession()
        const res = await fetch(url, {
          method: "DELETE",
          headers: getSupabaseHeaders(session?.token, "application/json"),
        })
        if (!res.ok) {
          const err = await res
            .json()
            .catch(() => ({ message: res.statusText }))
          return { data: null, error: err }
        }
        return { data: true, error: null }
      } catch (e) {
        return {
          data: null,
          error: { message: "Could not delete the record. Please try again." },
        }
      }
    }

    return { data: null, error: { message: "Online administration is unavailable." } }
  }

}

export const supabase = {
  from(table: string, { useSession = true } = {}) {
    return new QueryBuilder(table, useSession)
  },

  auth: {
    async signInWithPassword({
      email,
      password,
    }: {
      email: string
      password?: string
    }) {
      if (isConfigured) {
        try {
          const res = await fetch(
            `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
            {
              method: "POST",
              headers: {
                apikey: SUPABASE_ANON_KEY,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            },
          )
          const data = await res.json()
          if (!res.ok) {
            return { data: null, error: data }
          }
          setStoredSession(data.access_token, data.user)
          return { data: { user: data.user, session: data }, error: null }
        } catch (e) {
          return {
            data: null,
            error: {
              message: "Could not connect to sign in. Please try again.",
            },
          }
        }
      }

      return { data: null, error: { message: "Online administration is unavailable." } }
    },

    async signOut() {
      if (isConfigured) {
        const session = getStoredSession()
        if (session?.token) {
          fetch(`${SUPABASE_URL}/auth/v1/logout`, {
            method: "POST",
            headers: getSupabaseHeaders(session.token),
          }).catch(() => {})
        }
      }
      setStoredSession(null, null)
      return { error: null }
    },

    getSession() {
      const stored = getStoredSession()
      if (stored) {
        return { data: { session: stored }, error: null }
      }
      return { data: { session: null }, error: null }
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      authListeners.push(callback)
      const current = getStoredSession()
      if (current) callback("INITIAL_SESSION", current)
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const idx = authListeners.indexOf(callback)
              if (idx >= 0) authListeners.splice(idx, 1)
            },
          },
        },
      }
    },
  },

  storage: {
    from(bucket: string) {
      return {
        async upload(path: string, file: File) {
          if (isConfigured) {
            try {
              const session = getStoredSession()
              const res = await fetch(
                `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`,
                {
                  method: "POST",
                  headers: getSupabaseHeaders(session?.token, file.type),
                  body: file,
                },
              )
              if (res.ok) {
                return { data: { path }, error: null }
              }
              return {
                data: null,
                error: {
                  message: "Could not upload this image. Please try again.",
                },
              }
            } catch (e) {
              return {
                data: null,
                error: {
                  message:
                    "Could not connect to image storage. Please try again.",
                },
              }
            }
          }

          return { data: null, error: { message: "Online administration is unavailable." } }
        },

        getPublicUrl(path: string) {
          if (isConfigured) {
            return {
              data: {
                publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`,
              },
            }
          }
          return { data: { publicUrl: path } }
        },

        async list() {
          if (isConfigured) {
            try {
              const session = getStoredSession()
              const res = await fetch(
                `${SUPABASE_URL}/storage/v1/object/list/${bucket}`,
                {
                  method: "POST",
                  headers: getSupabaseHeaders(
                    session?.token,
                    "application/json",
                  ),
                  body: JSON.stringify({ prefix: "" }),
                },
              )
              if (res.ok) {
                const data = await res.json()
                return { data, error: null }
              }
            } catch (e) {
              // fallback
            }
          }
          const media = getLocalTable<any>("media")
          return { data: media, error: null }
        },
      }
    },
  },
}

// UI guard only; database RLS remains the authorization boundary.
export async function verifyCurrentAdmin() {
  const session = getStoredSession()
  if (!isConfigured || !session?.token) return null
  try {
    const headers = getSupabaseHeaders(session.token, "application/json")
    const identity = await fetch(SUPABASE_URL + "/auth/v1/user", { headers, signal: AbortSignal.timeout(10000) })
    if (!identity.ok) return null
    const user = await identity.json()
    if (typeof user.id !== "string" || typeof user.email !== "string") return null
    const membership = await fetch(SUPABASE_URL + "/rest/v1/rpc/get_my_admin_status", { method: "POST", headers, body: "{}", signal: AbortSignal.timeout(10000) })
    if (!membership.ok || await membership.json() !== true) return null
    return { id: user.id as string, email: user.email as string, role: "admin" }
  } catch { return null }
}
