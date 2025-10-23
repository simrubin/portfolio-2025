/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'
import { unstable_noStore as noStore } from 'next/cache'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> => {
  noStore() // Prevent caching to ensure fresh data
  return generatePageMetadata({ config, params, searchParams })
}

const Page = ({ params, searchParams }: Args) => {
  noStore() // Prevent caching to ensure fresh data
  return RootPage({ config, params, searchParams, importMap })
}

export default Page
