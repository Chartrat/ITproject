<template>
  <div class="order-details-container">
    <h1>รายละเอียดคำสั่งซื้อหมายเลข {{ orderId }}</h1>

    <div v-if="orderDetails.length > 0">
      <p class="order-status">
        สถานะ: {{ orderDetails[0].order_status }}
      </p>
      <p class="order-date">
        วันที่: {{ formatDate(orderDetails[0].order_date) }}
      </p>
      <p class="order-total">
        ยอดรวม: {{ orderDetails[0].total_amount }} บาท
      </p>

      <h2>รายการสินค้า</h2>
      <div
        v-for="item in orderDetails"
        :key="item.product_id"
        class="product-item"
        @click="goToProductDetails(item.product_id)"
      >
        <img
          :src="item.product_image_url"
          :alt="item.product_name"
          class="product-image"
        >
        <div class="product-info">
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
    },
    goToProductDetails (productId) {
      this.$router.push(`/product/${productId}`)
    }
  }
}
</script>

<style scoped>
.order-details-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-family: "Kanit", sans-serif;
  font-size: 2em;
  color: #333;
  margin-bottom: 20px;
}

.order-status,
.order-date,
.order-total {
  font-family: "Kanit", sans-serif;
  font-size: 1.2em;
  color: #555;
  margin-bottom: 10px;
}

h2 {
  font-family: "Kanit", sans-serif;
  font-size: 1.5em;
  color: #333;
  margin-top: 30px;
  margin-bottom: 20px;
}

.product-item {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.product-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 8px;
}

.product-info {
  font-family: "Kanit", sans-serif;
  color: #555;
}

.product-info p {
  margin: 5px 0;
}
</style>
