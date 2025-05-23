import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([])

  // Load cart from cookies on page load
  useEffect(() => {
    const cookieCart = Cookies.get('cart')
    if (cookieCart) {
      try {
        setCartItems(JSON.parse(cookieCart)) // Parse JSON from cookie
      } catch (err) {
        console.error("Cart parse error:", err)
      }
    }
  }, [])

  // Update cart in both state and cookie
  const updateCartCookie = (items) => {
    setCartItems(items)
    Cookies.set('cart', JSON.stringify(items), { expires: 7 })
  }

  // Handle quantity changes (+/-)
  const handleQuantityChange = (id, delta) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        return { ...item, quantity: newQty > 1 ? newQty : 1 }
      }
      return item
    })
    updateCartCookie(updated)
  }

  // Remove item from cart
  const handleRemove = (id) => {
    const updated = cartItems.filter(item => item.id !== id)
    updateCartCookie(updated)
  }

  // Calculate total cart value
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0).toFixed(2)
  }

  return (
    <Layout>
      <div style={{ padding: '20px', minHeight: '70vh' }}>
        {/* If cart is empty */}
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          // Grid of cart items
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: '8px' }} />
                <h3 style={{ marginTop: '12px' }}>{item.name}</h3>
                <p>Price: ${item.price}</p>

                {/* Quantity buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => handleQuantityChange(item.id, -1)} style={quantityButtonStyle}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)} style={quantityButtonStyle}>+</button>
                </div>

                {/* Remove button */}
                <button onClick={() => handleRemove(item.id)} style={removeButtonStyle}>Remove</button>
              </div>
            ))}
          </div>
        )}

        <hr style={{ marginTop: '30px' }} />
        <h3 style={{ textAlign: 'center' }}>Total: ${calculateTotal()}</h3>

        {/* Proceed to checkout button */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/checkout">
            <button style={checkoutButtonStyle}>Proceed to Checkout</button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

// Styles
const quantityButtonStyle = {
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  padding: '4px 10px',
  borderRadius: '4px',
  cursor: 'pointer'
}

const removeButtonStyle = {
  marginTop: '8px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '6px 12px',
  cursor: 'pointer'
}

const checkoutButtonStyle = {
  padding: '14px 32px',
  fontSize: '18px',
  borderRadius: '8px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
}
