const handleStripeCheckout = async (
  totalPrice: number,
  reservationId: string
) => {
  try {
    const res = await fetch(
      'http://localhost:8080/api/create-checkout-session',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          reservationId: reservationId,
        }),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // Redirige al Checkout de Stripe
    } else {
      alert('No URL returned from Stripe.');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    alert('Error processing payment. Please try again.');
  }
};

export default handleStripeCheckout;
