<template>
  <div class="orders-container">
    <h1>คำสั่งซื้อของคุณ</h1>
    <div v-if="orders.length > 0">
      <v-row>
        <v-col v-for="order in orders" :key="order.order_id" cols="12" md="6">
          <!-- ใช้ @click เพื่อให้คลิกแล้วนำทางไปยังหน้ารายละเอียด -->
          <div class="order-card" @click="goToOrderDetails(order.order_id)">
            <h3>หมายเลขคำสั่งซื้อ: {{ order.order_id }}</h3>
            <p>วันที่: {{ formatDate(order.order_date) }}</p>
            <p>สถานะ: {{ order.order_status }}</p>
            <p>ยอดรวม: {{ order.total_amount }} บาท</p>
          </div>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <p>คุณยังไม่มีคำสั่งซื้อ</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export default {
  data () {
    return {
      orders: [] // ใช้ customerId จริง ๆ จากการ login
    }
  },
  async mounted () {
    await this.fetchOrders()
  },
  methods: {
    async fetchOrders () {
      const token = localStorage.getItem('token')
      const tokendecode = jwtDecode(token)
      const customerId = tokendecode[0].customer_id // ดึง customer_id จาก token

      try {
        const response = await axios.get(
          `http://localhost:8000/orders/getOrdersByCustomer/${customerId}`
        )
        const orders = response.data.result

        const groupedOrders = orders.reduce((acc, order) => {
          const existingOrder = acc.find(o => o.order_id === order.order_id)
          if (existingOrder) {
            existingOrder.details.push({
              product_id: order.product_id,
              product_name: order.product_name,
              quantity: order.quantity,
              unit_price: order.unit_price
            })
          } else {
            acc.push({
              order_id: order.order_id,
              order_date: order.order_date,
              order_status: order.order_status,
              total_amount: order.total_amount,
              details: [
                {
                  product_id: order.product_id,
                  product_name: order.product_name,
                  quantity: order.quantity,
                  unit_price: order.unit_price
                }
              ]
            })
          }
          return acc
        }, [])
        groupedOrders.sort((a, b) => b.order_id - a.order_id)

        this.orders = groupedOrders
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    // ฟังก์ชันสำหรับนำทางไปยังหน้ารายละเอียดคำสั่งซื้อ
    goToOrderDetails (orderId) {
      this.$router.push(`/order/${orderId}`)
    },
    formatDate (dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateStr).toLocaleDateString('th-TH', options)
    }
  }
}
</script>

<style scoped>
.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Prompt", sans-serif; /* ใช้ฟอนต์ที่เรียบง่ายและมีสไตล์ */
}

.order-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

h1 {
  font-size: 2.5em;
  text-align: center;
  color: #333;
  margin-bottom: 40px;
}

h3 {
  margin-top: 0;
  color: #444;
  font-size: 1.5em;
  font-weight: 600;
}

p {
  color: #777;
  font-size: 1.1em;
  margin: 10px 0;
}

ul {
  list-style: none;
  padding: 0;
  margin: 20px 0 0 0;
}

li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  color: #555;
}

li:last-child {
  border-bottom: none;
}

.v-col {
  margin-bottom: 30px;
}

/* เพิ่มการเน้นสีที่ใช้ */
.order-card h3,
.order-card p {
  color: #333;
}

h4 {
  margin-top: 20px;
  font-weight: 700;
  color: #333;
}

.order-card:hover h3 {
  color: #f86e75; /* เน้นสีเมื่อ hover */
}
</style>
