// Service for fetching and caching page data for the static renderer

import type { Page } from "@/components/static-renderer/page-renderer"

export class StaticRendererService {
  private static cache: Record<string, { data: Page; timestamp: number }> = {}
  private static CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

  /**
   * Fetch page data from the API or cache
   */
  static async getPageData(pageId: string, workspaceId: string): Promise<Page> {
    const cacheKey = `${workspaceId}:${pageId}`
    const cachedData = this.cache[cacheKey]

    // Return cached data if it's still valid
    if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_DURATION) {
      return cachedData.data
    }

    // Fetch fresh data
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/workspaces/${workspaceId}/pages/${pageId}`
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`Failed to fetch page data: ${response.status}`)
      }

      const data = await response.json()

      // Cache the result
      this.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
      }

      return data
    } catch (error) {
      console.error("Error fetching page data:", error)
      throw error
    }
  }

  /**
   * Clear the cache for a specific page or all pages
   */
  static clearCache(pageId?: string, workspaceId?: string) {
    if (pageId && workspaceId) {
      // Clear specific page cache
      const cacheKey = `${workspaceId}:${pageId}`
      delete this.cache[cacheKey]
    } else {
      // Clear all cache
      this.cache = {}
    }
  }
}

