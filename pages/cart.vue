<template>
  <div class="cart-container">
    <h1 class="cart-title">
      ตะกร้าสินค้า
    </h1>
    <div v-if="cartItems.length > 0">
      <ul class="cart-items">
        <li v-for="item in cartItems" :key="item.productId" class="cart-item">
          <img
            :src="item.image_url"
            alt="Product Image"
            class="product-image"
          >
          <div class="product-details">
            <h3>{{ item.name }}</h3>
            <p>จำนวน: {{ item.quantity }}</p>
            <p>ราคา: {{ item.price }} บาท</p>
            <div class="quantity-controls">
              <button @click="updateQuantity(item, item.quantity - 1)">
                -
              </button>
              <span>{{ item.quantity }}</span>
              <button @click="updateQuantity(item, item.quantity + 1)">
                +
              </button>
              <button class="remove-button" @click="removeItem(item)">
                ลบ
              </button>
            </div>
          </div>
          <div class="checkbox-container">
            <input v-model="selectedItems" type="checkbox" :value="item">
          </div>
        </li>
      </ul>

      <p class="cart-total">
        รวมทั้งหมด: {{ selectedTotal }} บาท
      </p>
      <v-btn
        class="checkout-button"
        :disabled="selectedItems.length === 0"
        @click="goToCheckout"
      >
        Check Out
      </v-btn>
    </div>
    <p v-else class="empty-cart">
      ตะกร้าของคุณยังว่างเปล่า
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// eslint-disable-next-line import/named
import jwtDecode from 'jwt-decode'
// import { params } from 'vee-validate/dist/types/rules/alpha'

export default {
  data () {
    return {
      selectedItems: [],
      token: ''
    }
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartTotal']),
    selectedTotal () {
      return this.selectedItems.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)
    },
    customerId () {
      if (this.token) {
        const decoded = jwtDecode(this.token)
        return decoded.customer_id
      }
      return null
    }
  },
  mounted () {
    this.token = localStorage.getItem('token')
    this.fetchCart()
  },
  methods: {
    ...mapActions('cart', ['fetchCart', 'updateCartItem', 'removeFromCart']),
    async updateQuantity (item, newQuantity) {
      if (newQuantity > 0) {
        try {
          await this.updateCartItem({
            productId: item.productId,
            quantity: newQuantity
          })
        } catch (error) {
          console.error('Error updating cart item:', error)
          alert('Cannot update cart item')
        }
      } else if (newQuantity === 0) {
        try {
          await this.removeFromCart(item.productId)
        } catch (error) {
          console.error('Error removing cart item:', error)
          alert('Cannot remove cart item')
        }
      }
    },
    async removeItem (item) {
      try {
        await this.removeFromCart(item.productId)
      } catch (error) {
        console.error('Error removing cart item:', error)
        alert('Cannot remove cart item')
      }
    },
    goToCheckout () {
      if (this.selectedItems.length === 0) {
        alert('Please select items before proceeding to checkout.')
        return
      }
      this.$router.push({
        name: 'checkout',
        params: {
          cartItems: this.selectedItems,
          cartTotal: this.selectedTotal
        }
      })
    }
  }
}
</script>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: "Kanit", sans-serif;
}

.cart-title {
  font-family: "Kanit", sans-serif;
  font-size: 28px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.cart-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}

.product-details {
  flex: 1;
}

.product-details h3 {
  font-size: 18px;
  margin: 0;
  color: #333;
}

.product-details p {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-controls button {
  background-color: #eee;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.quantity-controls button:hover {
  background-color: #ddd;
}

.remove-button {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #ff7875;
}

.checkbox-container {
  margin-left: 20px;
}

.cart-total {
  font-size: 20px;
  text-align: right;
  margin-top: 20px;
  color: #333;
}

.checkout-button {
  display: block;
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  color: white;
  text-align: center;
  border-radius: 10px;
  font-size: 18px;
  margin-top: 20px;
}

.checkout-button:disabled {
  background-color: #ccc;
}

.empty-cart {
  text-align: center;
  font-size: 18px;
  color: #777;
}

@media (max-width: 600px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-image {
    margin-bottom: 10px;
  }

  .cart-total {
    text-align: left;
  }
}
</style>
