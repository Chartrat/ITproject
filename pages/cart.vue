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

export default {
  data () {
    return {
      selectedItems: [] // เก็บสินค้าที่ถูกเลือก
    }
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartTotal']),
    selectedTotal () {
      // คำนวณยอดรวมของสินค้าที่ถูกเลือก
      return this.selectedItems.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)
    }
  },
  mounted () {
    this.fetchCart() // Fetch cart when the component mounts
    console.log(this.cartItems)
  },
  methods: {
    ...mapActions('cart', ['fetchCart']),
    goToCheckout () {
      // ส่งเฉพาะสินค้าที่ถูกเลือกไปยังหน้า checkout
      this.$router.push({
        name: 'checkout', // ใช้ชื่อของ route ที่ตั้งไว้
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
}

.cart-title {
  font-family: "Roboto", sans-serif;
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
