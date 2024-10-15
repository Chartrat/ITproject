<template>
  <div>
    <h1>สรุปรายการสั่งซื้อ</h1>
    <div v-if="items.length > 0">
      <ul>
        <li v-for="(item, index) in items" :key="index">
          <h3>{{ item.name }}</h3>
          <p>จำนวน: {{ item.quantity }}</p>
          <p>ราคา: {{ item.price }} บาท</p>
        </li>
      </ul>
      <p>รวมทั้งหมด: {{ total }} บาท</p>
      <!-- ปุ่มชำระเงิน -->
      <v-btn color="success" @click="handlePayment">
        ชำระเงิน
      </v-btn>
    </div>
    <p v-else>
      ไม่มีสินค้าในตะกร้า
    </p>
  </div>
</template>

<script>
import { jwtDecode } from 'jwt-decode'
export default {
  data () {
    return {
      items: [],
      total: 0
    }
  },
  mounted () {
    // รับข้อมูลจาก params ที่ส่งมาจาก cart.vue
    if (this.$route.params.cartItems) {
      this.items = this.$route.params.cartItems
      this.total = this.$route.params.cartTotal
    }
  },
  methods: {
    async handlePayment () {
      // สร้าง payload สำหรับคำสั่งซื้อและรายละเอียดคำสั่งซื้อ
      const token = localStorage.getItem('token')
      const tokendecode = jwtDecode(token)
      const customerId = tokendecode[0].customer_id

      const orderPayload = {
        customer_id: customerId,
        order_status: 'processing',
        total_amount: this.total,
        orderDetails: this.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.price
        }))
      }

      try {
        // เรียก API ไปยัง backend เพื่อบันทึกข้อมูล
        const response = await this.$axios.post(
          '/orders/createOrder',
          orderPayload
        )
        if (response.status === 200) {
          alert('ดำเนินการชำระเงินเรียบร้อยแล้ว')
          // สามารถเปลี่ยนหน้าได้ เช่น ไปยังหน้าคำสั่งซื้อสำเร็จ
          this.$router.push('/user/Orderuser')
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการชำระเงิน:', error)
        alert('การชำระเงินล้มเหลว')
      }
    }
  }
}
</script>

<style scoped>
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
