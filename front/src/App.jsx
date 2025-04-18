import React, { useEffect, useState } from 'react'

function App() {
  const [accountId, setAccountId] = useState('')
  const [price, setPrice] = useState(5000) // en centimes : 5000 = 50€
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      setMessage({ type: 'success', text: '🎉 Paiement réussi !' })
    } else if (params.get('canceled') === 'true') {
      setMessage({ type: 'danger', text: '❌ Paiement annulé ou échoué.' })
    }
  }, [])

  const createUser = async () => {
    try {
      const res = await fetch('http://localhost:4242/api/stripe/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur : ' + data.error)
      }
    } catch (err) {
      console.error(err)
      alert("Erreur de communication avec le serveur.")
    }
  }

  const handlePay = async (e) => {
    e.preventDefault()

    if (!accountId) return alert("Compte Stripe Connect requis.")

    const res = await fetch('http://localhost:4242/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price,
        stripeAccountId: accountId,
      })
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Erreur : " + data.error)
    }
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">🎓 Test Stripe Connect</h1>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <button className="btn btn-primary mb-3" onClick={createUser}>
        Créer un utilisateur (vendeur)
      </button>

      <div className="mb-3">
        <label>Compte Stripe Connect</label>
        <input type="text" className="form-control"
          placeholder="ex: acct_..."
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Montant (€)</label>
        <input type="number" className="form-control"
          value={price / 100}
          onChange={(e) => setPrice(Math.floor(e.target.value * 100))}
        />
      </div>

      <form onSubmit={handlePay}>
        <button className="btn btn-success mt-2">
          Acheter produit
        </button>
      </form>
    </div>
  )
}

export default App
