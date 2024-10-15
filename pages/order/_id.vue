<template>
  <div>
    <h1>รายละเอียดคำสั่งซื้อหมายเลข {{ orderId }}</h1>

    <div v-if="orderDetails.length > 0">
      <p>สถานะ: {{ orderDetails[0].order_status }}</p>
      <p>วันที่: {{ formatDate(orderDetails[0].order_date) }}</p>
      <p>ยอดรวม: {{ orderDetails[0].total_amount }} บาท</p>

      <h2>รายการสินค้า</h2>
      <div
        v-for="item in orderDetails"
        :key="item.product_id"
        class="product-item"
      >
        <img
          :src="item.product_image_url"
          :alt="item.product_name"
          class="product-image"
        >
        <div>
          <p>สินค้า: {{ item.product_name }}</p>
          <p>จำนวน: {{ item.quantity }}</p>
          <p>ราคา: {{ item.unit_price }} บาท</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>ไม่พบข้อมูลคำสั่งซื้อ</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      orderId: null,
      orderDetails: []
    }
  },
  async created () {
    this.orderId = this.$route.params.id
    try {
      const response = await axios.get(
        `http://localhost:8000/orders/getOrderById/${this.orderId}`
      )
      this.orderDetails = response.data.result
    } catch (error) {
      console.error('Error fetching order details:', error)
    }
  },
  methods: {
    formatDate (dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateStr).toLocaleDateString('th-TH', options)
    }
  }
}
</script>

<style scoped>
.product-item {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
}
.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
}
</style>
