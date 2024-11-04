import { products } from '@wix/stores'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, ButtonProps } from './ui/button'
import { useCreateBackInStockNotificationRequest } from '@/hooks/back-in-stock'
import { requiredString } from '@/lib/validation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import LoadingButton from './loading-button'
import { env } from '@/env'

const formSchema = z.object({
  email: requiredString.email(),
})

type FormValues = z.infer<typeof formSchema>

interface BackInStockNotificationButtonProps extends ButtonProps {
  product: products.Product
  selectedOptions: Record<string, string>
}

export default function BackInStockNotificationButton({
  product,
  selectedOptions,
  ...props
}: BackInStockNotificationButtonProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const mutation = useCreateBackInStockNotificationRequest()

  async function onSubmit({ email }: FormValues) {
    mutation.mutate({
      email,
      itemUrl: env.NEXT_PUBLIC_BASE_URL + '/products/' + product.slug,
      product,
      selectedOptions,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>Notify when available</Button>
      </DialogTrigger>
      <DialogHeader>
        <DialogTitle>Notify when available</DialogTitle>
        <DialogDescription>
          Enter your email and you will be notified as soon as this item is back
          in stock.
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type='submit' loading={mutation.isPending}>
              Notify me
            </LoadingButton>
          </form>
        </Form>
        {mutation.isSuccess && (
          <div className='py-2.5 text-green-500'>
            Thank you! You will be notified when this item is back in stock.
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
