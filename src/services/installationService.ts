import { Installation, InstallationFormData } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export class InstallationService {
  static async getAll(): Promise<Installation[]> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/installations?select=*&order=installed_at.desc`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data || []
    } catch (error) {
      console.error('Failed to fetch installations:', error)
      throw error
    }
  }

  static async getById(id: string): Promise<Installation | null> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/installations?id=eq.${id}&select=*`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data[0] || null
    } catch (error) {
      console.error('Failed to fetch installation:', error)
      throw error
    }
  }

  static async create(installationData: InstallationFormData): Promise<Installation> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/installations`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...installationData,
          installed_at: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data[0]
    } catch (error) {
      console.error('Failed to create installation:', error)
      throw error
    }
  }

  static async update(id: string, installationData: Partial<InstallationFormData>): Promise<Installation> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/installations?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(installationData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data[0]
    } catch (error) {
      console.error('Failed to update installation:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/installations?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to delete installation:', error)
      throw error
    }
  }

  static async getRecent(limit: number = 5): Promise<Installation[]> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/installations?select=*&order=installed_at.desc&limit=${limit}`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data || []
    } catch (error) {
      console.error('Failed to fetch recent installations:', error)
      throw error
    }
  }
}