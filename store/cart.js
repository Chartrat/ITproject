import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const state = () => ({
  items: []
})

export const mutations = {
  addItemToCart (state, { product, quantity }) {
    const existingItem = state.items.find(
      item => item.productId === product.productId
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      state.items.push({ ...product, quantity })
    } // Closing the mutation properly
  },
  removeItemFromCart (state, productId) {
    state.items = state.items.filter(item => item.productId !== productId)
  },
  setCart (state, items) {
    state.items = Array.isArray(items) ? items : []
  },

  updateCartItem (state, updatedItem) {
    const index = state.items.findIndex(
      item => item.productId === updatedItem.productId
    )
    if (index !== -1) {
      state.items[index] = updatedItem
    }
  }
}

export const actions = {
  async fetchCart ({ commit }) {
    try {
      const token = localStorage.getItem('token')
      const tokendecode = jwtDecode(token)

      console.log(tokendecode[0].customer_id)

      const customerId = tokendecode[0].customer_id

      const response = await axios.get(
        `http://localhost:8000/cart/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('test')
      console.log('Response data:', response.data)

      commit('setCart', response.data.result)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  },

  async addToCart ({ commit, state, dispatch }, product) {
    const cartItem = state.items.find(
      item => item.productId === product.productId
    )
    console.log('cartItem:', product)

    if (cartItem) {
      commit('addItemToCart', { product, quantity: 1 })
    } else {
      commit('addItemToCart', { product, quantity: 1 })
    }
    // Save to database
    await dispatch('saveToDatabase', product) // Call function to save to DB
  },

  async saveToDatabase ({ state }, product) {
    console.log('Product:', product)
    console.log('State:', state)
    const token = localStorage.getItem('token')
    const tokendecode = jwtDecode(token)

    console.log(tokendecode[0].customer_id)

    const customerId = tokendecode[0].customer_id

    try {
      const response = await axios.post(
        'http://localhost:8000/cart/addToCart',
        {
          product_id: product.product_id,
          quantity: 1,
          customer_id: customerId
        }
      )
      console.log('Response data:', response.data)

      if (response.data.status !== 'success') {
        console.error('Error saving to database:', response.data.message)
      }
    } catch (error) {
      console.error('Error saving to database:', error)
    }
  },

  async updateCartItem ({ commit }, { productId, quantity }) {
    try {
      const token = localStorage.getItem('token')
      const tokendecode = jwtDecode(token)
      const customerId = tokendecode[0].customer_id

      const response = await axios.put(
        'http://localhost:8000/cart/updateCartItem',
        { productId, customerId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.status === 'success') {
        commit('updateCartItem', { productId, quantity })
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
    }
  },

  async removeFromCart ({ commit }, productId) {
    try {
      const token = localStorage.getItem('token')
      const tokendecode = jwtDecode(token)
      const customerId = tokendecode[0].customer_id

      const response = await axios.delete(
        'http://localhost:8000/cart/removeFromCart',
        {
          data: { productId, customerId },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.status === 'success') {
        commit('removeItemFromCart', productId)
      }
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }
}

export const getters = {
  cartItems (state) {
    return state.items
  },
  cartItemCount (state) {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  },
  cartTotal (state) {
    return state.items.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    )
  }
}
