import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0) {
  try {
    const payload = await getPayload({ config: configPromise })

    const global = await payload.findGlobal({
      slug,
      depth,
    })

    return global
  } catch (error) {
    // During build, database might not be initialized yet
    console.warn(`Could not load global "${slug}", database not ready:`, error instanceof Error ? error.message : String(error))
    
    // Return empty global structure based on slug
    if (slug === 'header') {
      return {
        id: 'temp-header',
        navItems: [],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }
    }
    
    if (slug === 'footer') {
      return {
        id: 'temp-footer',
        navItems: [],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }
    }
    
    // Generic fallback
    return {
      id: `temp-${slug}`,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
  }
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
