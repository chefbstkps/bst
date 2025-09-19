import { Radio, RadioFormData, RadioHistory } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export class RadioService {
  static async getAll(): Promise<Radio[]> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/radios?select=*&order=created_at.desc`, {
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
      console.error('Failed to fetch radios:', error)
      throw error
    }
  }

  static async getById(id: string): Promise<Radio | null> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/radios?id=eq.${id}&select=*`, {
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
      console.error('Failed to fetch radio:', error)
      throw error
    }
  }

  static async getBySerialNumber(serienummer: string): Promise<Radio | null> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/radios?serienummer=eq.${encodeURIComponent(serienummer)}&select=*`, {
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
      console.error('Failed to fetch radio by serial number:', error)
      throw error
    }
  }

  static async create(radioData: RadioFormData): Promise<Radio> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/radios`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(radioData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Supabase error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data[0]
    } catch (error) {
      console.error('Failed to create radio:', error)
      throw error
    }
  }

  static async update(id: string, radioData: Partial<RadioFormData>): Promise<Radio> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/radios?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(radioData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data[0]
    } catch (error) {
      console.error('Failed to update radio:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/radios?id=eq.${id}`, {
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
      console.error('Failed to delete radio:', error)
      throw error
    }
  }

  static async getHistory(radioId: string): Promise<RadioHistory[]> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/radio_history?radio_id=eq.${radioId}&select=*&order=timestamp.desc`, {
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
      console.error('Failed to fetch radio history:', error)
      throw error
    }
  }

  static async addHistoryEntry(radioId: string, action: string, description: string, details?: any): Promise<RadioHistory> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/radio_history`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          radio_id: radioId,
          action,
          description,
          details,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data[0]
    } catch (error) {
      console.error('Failed to add history entry:', error)
      throw error
    }
  }

  static async getStats(): Promise<{
    total: number
    portable: number
    mobile: number
    base: number
  }> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/radios?select=type`, {
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
      
      const stats = {
        total: data?.length || 0,
        portable: data?.filter((r: any) => r.type === 'Portable').length || 0,
        mobile: data?.filter((r: any) => r.type === 'Mobile').length || 0,
        base: data?.filter((r: any) => r.type === 'Base').length || 0,
      }

      return stats
    } catch (error) {
      console.error('Failed to fetch radio stats:', error)
      throw error
    }
  }
}
