import { DashboardStats } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export class DashboardService {
  static async getStats(): Promise<DashboardStats> {
    try {
      // Get radio stats
      const radiosResponse = await fetch(`${supabaseUrl}/rest/v1/radios?select=type`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!radiosResponse.ok) {
        throw new Error(`HTTP error! status: ${radiosResponse.status}`)
      }

      const radios = await radiosResponse.json()

      // Get accessory stats
      const accessoriesResponse = await fetch(`${supabaseUrl}/rest/v1/accessories?select=count`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!accessoriesResponse.ok) {
        throw new Error(`HTTP error! status: ${accessoriesResponse.status}`)
      }

      const accessories = await accessoriesResponse.json()

      // Get recent installations
      const installationsResponse = await fetch(`${supabaseUrl}/rest/v1/installations?select=*&order=installed_at.desc&limit=5`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!installationsResponse.ok) {
        throw new Error(`HTTP error! status: ${installationsResponse.status}`)
      }

      const recentInstallations = await installationsResponse.json()

      // Get recent issues
      const issuesResponse = await fetch(`${supabaseUrl}/rest/v1/issues?select=*&order=issued_at.desc&limit=5`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!issuesResponse.ok) {
        throw new Error(`HTTP error! status: ${issuesResponse.status}`)
      }

      const recentIssues = await issuesResponse.json()

      // Get recent registrations
      const registrationsResponse = await fetch(`${supabaseUrl}/rest/v1/radios?select=*&order=created_at.desc&limit=5`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!registrationsResponse.ok) {
        throw new Error(`HTTP error! status: ${registrationsResponse.status}`)
      }

      const recentRegistrations = await registrationsResponse.json()

      const radioStats = {
        total_radios: radios?.length || 0,
        portable_radios: radios?.filter((r: any) => r.type === 'Portable').length || 0,
        mobile_radios: radios?.filter((r: any) => r.type === 'Mobile').length || 0,
        base_radios: radios?.filter((r: any) => r.type === 'Base').length || 0,
      }

      return {
        ...radioStats,
        total_accessories: accessories.length || 0,
        recent_installations: recentInstallations || [],
        recent_issues: recentIssues || [],
        recent_registrations: recentRegistrations || [],
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      throw error
    }
  }
}
