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
    }
  },
  removeItemFromCart (state, productId) {
    state.items = state.items.filter(item => item.productId !== productId)
  },
  setCart (state, items) {
    state.items = Array.isArray(items) ? items : []
  },
  updateCartItem (state, { productId, quantity }) {
    const item = state.items.find(item => item.productId === productId)
    if (item) {
      item.quantity = quantity
    }
  }
}

export const actions = {
  async fetchCart ({ commit }) {
    try {
      const token = localStorage.getItem('token')
      const tokendecode = jwtDecode(token)
      const customerId = tokendecode[0].customer_id

      const response = await axios.get(
        `http://localhost:8000/cart/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // Map backend data to frontend format
      const items = response.data.result.map(item => ({
        productId: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url
        // Include other properties as needed
      }))

      commit('setCart', items)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  },

  async addToCart ({ commit, state, dispatch }, product) {
    // ค้นหาสินค้าในตะกร้า
    const existingItem = state.items.find(
      item => item.product_id === product.product_id
    )

    if (existingItem) {
      // หากพบสินค้าแล้ว ให้อัพเดทจำนวน
      const newQuantity = existingItem.quantity + 1
      await dispatch('updateCartItem', {
        productId: product.product_id,
        quantity: newQuantity
      })
    } else {
      // หากไม่พบสินค้า ให้เพิ่มสินค้าใหม่เข้าตะกร้าโดยตั้งจำนวนเริ่มต้นเป็น 1
      commit('addItemToCart', { product, quantity: 1 })
      await dispatch('saveToDatabase', product)
    }
  },

  async saveToDatabase ({ state }, product) {
    const token = localStorage.getItem('token')
    const tokendecode = jwtDecode(token)
    const customerId = tokendecode[0].customer_id
    console.log('Customer ID:', customerId) // เพิ่มตรงนี้
    console.log('Product ID:', product.productId) // และตรงนี้

    try {
      const response = await axios.post(
        'http://localhost:8000/cart/addToCart',
        {
          product_id: product.product_id,
          quantity: 1,
          customer_id: customerId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

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
      console.log('Customer ID:', customerId) // เพิ่มตรงนี้
      console.log('Product ID:', productId) // และตรงนี้
      console.log('Quantity:', quantity) // และตร
      const response = await axios.put(
        'http://localhost:8000/cart/updateCartItem',
        {
          product_id: productId,
          customer_id: customerId,
          quantity
        },
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
      console.log('Customer ID:', customerId) // เพิ่มตรงนี้
      console.log('Product ID:', productId)
      const response = await axios.delete(
        'http://localhost:8000/cart/removeFromCart',
        {
          data: { product_id: productId, customer_id: customerId },
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
