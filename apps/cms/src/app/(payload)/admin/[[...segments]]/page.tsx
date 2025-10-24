import { unstable_noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RootPage } from '@payloadcms/next/views'

type PageProps = {
  params: Promise<{
    segments: string[]
  }>
}

export const generateMetadata = async ({ params }: PageProps) => {
  unstable_noStore()

  const { segments } = await params
  const _path = segments?.join('/') || ''

  return {
    title: 'Admin',
  }
}

const Page = async ({ params }: PageProps) => {
  unstable_noStore()

  const { segments } = await params
  const _path = segments?.join('/') || ''

  const payload = await getPayload({ config })

  if (!payload) {
    return notFound()
  }

  return (
    <RootPage
      config={payload.config}
      importMap={{}}
      params={params}
      searchParams={Promise.resolve({})}
    />
  )
}

export default Page
