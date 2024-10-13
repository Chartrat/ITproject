<template>
  <div class="product-card">
    <img :src="product.image_url" alt="product.name">
    <h3>{{ product.name }}</h3>
    <p>ราคา: {{ product.price }} บาท</p>
    <button @click="addToCart(product)">
      เพิ่มลงตะกร้า
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    product: Object
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    addToCart (product) {
      this.addToCart({ product, quantity: 1 }) // ส่ง product และจำนวนสินค้าไปที่ Vuex action
    }
  }
}
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  text-align: center;
}

button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-top: 10px;
}
button:hover {
  background-color: #218838;
}
</style>
