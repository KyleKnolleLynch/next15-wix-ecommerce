import { WixClient } from '@/lib/wix-client.base'
import { getLoggedInMember } from './members'

export interface CreateProductReviewValue {
  productId: string
  title: string
  body: string
  rating: number
}

export async function createProductReview(
  wixClient: WixClient,
  { productId, title, body, rating }: CreateProductReviewValue,
) {
  const member = await getLoggedInMember(wixClient)

  if (!member) {
    throw Error('Must be logged in to leave a review')
  }

  const authorName =
    member.contact?.firstName && member.contact?.lastName
      ? `${member.contact.firstName} ${member.contact.lastName}`
      : member.contact?.firstName ||
        member.contact?.lastName ||
        member.profile?.nickname ||
        'Anonymous'

  return wixClient.reviews.createReview({
    author: {
      authorName,
      contactId: member.contactId,
    },
    entityId: productId,
    namespace: 'stores',
    content: {
      title,
      body,
      rating,
    },
  })
}
