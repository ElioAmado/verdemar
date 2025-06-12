const handleStripeCheckout = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: 'product_001', quantity: 1 }],
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // Redirige al Checkout de Stripe
    } else {
      alert('Failed to initiate payment session.');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    alert('Payment failed. Please try again.');
  }
};
export default handleStripeCheckout;