<template>
  <div>
    <h1>ตะกร้าสินค้า</h1>
    <div v-if="cartItems.length > 0">
      <ul>
        <li v-for="item in cartItems" :key="item.productId">
          <h3>{{ item.name }}</h3>
          <p>จำนวน: {{ item.quantity }}</p>
          <p>ราคา: {{ item.price }} บาท</p>
        </li>
      </ul>
      <p>รวมทั้งหมด: {{ cartTotal }} บาท</p>
    </div>
    <p v-else>
      ตะกร้าของคุณยังว่างเปล่า
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartTotal']) // Ensure 'cart' is the correct namespaced module
  },
  mounted () {
    this.fetchCart() // Fetch cart when the component mounts
    console.log(this.cartItems)
  },
  methods: {
    ...mapActions('cart', ['fetchCart', 'addToCart']) // Ensure the actions are in the 'cart' module
  }
}
</script>

<style scoped>
/* Styles for the cart page */
ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

h3 {
  margin: 0;
}
</style>
