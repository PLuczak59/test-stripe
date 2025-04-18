const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Créer un compte Connect Express
router.post('/create-user', async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/refresh`,
      return_url: `${process.env.FRONTEND_URL}/success`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer une session de paiement
router.post('/create-checkout-session', async (req, res) => {
  const { price, stripeAccountId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'Produit test' },
          unit_amount: price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      payment_intent_data: {
        application_fee_amount: Math.floor(price * 0.2), // 20% de commission
        transfer_data: { destination: stripeAccountId },
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
