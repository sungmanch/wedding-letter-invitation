import { MetadataRoute } from 'next'

const BASE_URL = 'https://maisondeletter.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // TODO: 공개된 청첩장 페이지들 동적 추가 가능
  // const publishedInvitations = await getPublishedInvitations()
  // const invitationPages = publishedInvitations.map(inv => ({
  //   url: `${BASE_URL}/share/${inv.id}`,
  //   lastModified: inv.updatedAt,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }))

  return [...staticPages]
}
