import { Accessory, AccessoryFormData } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export class AccessoryService {
  static async getAll(): Promise<Accessory[]> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/accessories?select=*&order=created_at.desc`, {
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
      console.error('Failed to fetch accessories:', error)
      throw error
    }
  }

  static async getById(id: string): Promise<Accessory | null> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/accessories?id=eq.${id}&select=*`, {
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
      console.error('Failed to fetch accessory:', error)
      throw error
    }
  }

  static async create(accessoryData: AccessoryFormData): Promise<Accessory> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/accessories`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(accessoryData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data[0]
    } catch (error) {
      console.error('Failed to create accessory:', error)
      throw error
    }
  }

  static async update(id: string, accessoryData: Partial<AccessoryFormData>): Promise<Accessory> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/accessories?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(accessoryData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data[0]
    } catch (error) {
      console.error('Failed to update accessory:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/accessories?id=eq.${id}`, {
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
      console.error('Failed to delete accessory:', error)
      throw error
    }
  }

  static async getStats(): Promise<{ total: number }> {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/accessories?select=count`, {
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
      return { total: data.length || 0 }
    } catch (error) {
      console.error('Failed to fetch accessory stats:', error)
      throw error
    }
  }
}
