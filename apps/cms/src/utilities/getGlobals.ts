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
    console.warn(
      `Could not load global "${slug}", database not ready:`,
      error instanceof Error ? error.message : String(error),
    )

    // Return empty global structure based on slug
    if (slug === 'header') {
      return {
        id: 0,
        navItems: [],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      } as any
    }

    if (slug === 'footer') {
      return {
        id: 0,
        navItems: [],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      } as any
    }

    // Generic fallback
    return {
      id: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    } as any
  }
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
