<template>
  <div>
    <h1>ตะกร้าสินค้า</h1>
    <div v-if="cartItems.length > 0">
      <ul>
        <li v-for="item in cartItems" :key="item.productId">
          <h3>{{ item.name }}</h3>
          <p>จำนวน: {{ item.quantity }}</p>
          <p>ราคา: {{ item.price }} บาท</p>
          <button @click="removeFromCart(item.productId)">
            ลบ
          </button>
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
    ...mapGetters('cart', ['cartItems', 'cartTotal']) // ดึงรายการสินค้าและยอดรวมจาก Vuex
  },
  methods: {
    ...mapActions('cart', ['removeFromCart']) // เรียก action removeFromCart
  }
}
</script>

<style scoped>
/* สไตล์ของเพจตะกร้า */
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
