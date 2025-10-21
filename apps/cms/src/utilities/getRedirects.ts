import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export async function getRedirects(depth = 1) {
  try {
    const payload = await getPayload({ config: configPromise })

    const { docs: redirects } = await payload.find({
      collection: 'redirects',
      depth,
      limit: 0,
      pagination: false,
    })

    return redirects
  } catch (error) {
    // During build, database might not be initialized yet
    console.warn(
      'Could not load redirects, database not ready:',
      error instanceof Error ? error.message : String(error),
    )
    return []
  }
}

/**
 * Returns a unstable_cache function mapped with the cache tag for 'redirects'.
 *
 * Cache all redirects together to avoid multiple fetches.
 */
export const getCachedRedirects = () =>
  unstable_cache(async () => getRedirects(), ['redirects'], {
    tags: ['redirects'],
  })
