import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Stripe Elements
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

// Clé publique Stripe de test
const stripePromise = loadStripe('your_key')

ReactDOM.createRoot(document.getElementById('root')).render(
  <Elements stripe={stripePromise}>
    <App />
  </Elements>
)
