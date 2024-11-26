import { useMutation } from '@tanstack/react-query'
import { useToast } from './use-toast'
import {
  createProductReview,
  CreateProductReviewValue,
} from '@/wix-api/reviews'
import { wixBrowserClient } from '@/lib/wix.client.browser'

export function useCreateProductReview() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (values: CreateProductReviewValue) =>
      createProductReview(wixBrowserClient, values),
    onError(error) {
        console.error(error)
        toast({
            variant: 'destructive',
            description: 'Failed to create review. Please try again.'
        })
    }
  })
}
