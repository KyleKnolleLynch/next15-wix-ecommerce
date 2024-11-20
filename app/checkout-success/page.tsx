import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout Success',
}

export default function CheckoutSuccess() {
  return (
    <main className='mx-auto flex max-w-3xl flex-col items-center space-y-5 px-5 py-10'>
      <h1 className='text-3xl font-bold'>Your order has been received!</h1>
      <p>A summary of your order was sent to your email address.</p>
    </main>
  )
}
