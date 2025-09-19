import { Issue, IssueFormData } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export class IssueService {
  static async getAll(): Promise<Issue[]> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/issues?select=*&order=issued_at.desc`, {
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
      console.error('Failed to fetch issues:', error)
      throw error
    }
  }

  static async getById(id: string): Promise<Issue | null> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/issues?id=eq.${id}&select=*`, {
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
      console.error('Failed to fetch issue:', error)
      throw error
    }
  }

  static async create(issueData: IssueFormData): Promise<Issue> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/issues`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...issueData,
          issued_at: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data[0]
    } catch (error) {
      console.error('Failed to create issue:', error)
      throw error
    }
  }

  static async update(id: string, issueData: Partial<IssueFormData>): Promise<Issue> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/issues?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(issueData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data[0]
    } catch (error) {
      console.error('Failed to update issue:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/issues?id=eq.${id}`, {
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
      console.error('Failed to delete issue:', error)
      throw error
    }
  }

  static async getRecent(limit: number = 5): Promise<Issue[]> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/issues?select=*&order=issued_at.desc&limit=${limit}`, {
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
      console.error('Failed to fetch recent issues:', error)
      throw error
    }
  }
}