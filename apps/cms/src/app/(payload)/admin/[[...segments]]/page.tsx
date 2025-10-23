import { unstable_noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RootPage } from '@payloadcms/next/views'

type Args = {
  params: {
    segments: string[]
  }
}

export const generateMetadata = async ({ params }: Args) => {
  unstable_noStore()
  
  const { segments } = params
  const path = segments?.join('/') || ''

  return {
    title: 'Admin',
  }
}

const Page = async ({ params }: Args) => {
  unstable_noStore()
  
  const { segments } = params
  const path = segments?.join('/') || ''

  const payload = await getPayload({ config })

  if (!payload) {
    return notFound()
  }

  return <RootPage />
}

export default Page