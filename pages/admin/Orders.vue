<template>
  <v-app>
    <div class="order-container">
      <v-container>
        <v-card class="premium-card">
          <v-card-title class="title">
            <h2>Orders</h2>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="orders"
              item-key="order_id"
              class="elevation-1 premium-table"
              dense
              hide-default-footer
              :items-per-page="-1"
            >
              <!-- แสดงรายการสินค้า -->
              <template #[`item.items`]="{ item }">
                <ul class="order-list">
                  <li v-for="(product, index) in item.order_items" :key="index">
                    {{ product.product_name }} ({{ product.quantity }})
                  </li>
                </ul>
              </template>

              <!-- แสดงสถานะคำสั่งซื้อ -->
              <template #[`item.order_status`]="{ item }">
                <span :class="`status-label ${item.order_status}`">
                  {{ formatStatus(item.order_status) }}
                </span>
              </template>
              <template #[`item.paymentProof`]="{ item }">
                <img
                  :src="'http://localhost:8000/uploads/' + item.payment.paymentProof"
                  alt="Payment Proof"
                  width="100"
                  class="payment-proof-image"
                  @click="viewPaymentProof('http://localhost:8000/uploads/' + item.payment.paymentProof)"
                >
              </template>

              <template #[`item.actions`]="{ item }">
                <v-btn class="action-btn" small @click="viewOrderDetails(item)">
                  View Details
                </v-btn>
                <v-btn
                  class="action-btn completed-btn green-btn"
                  small
                  :disabled="item.order_status === 'completed'"
                  @click="
                    updateOrderStatus({ ...item, order_status: 'completed' })
                  "
                >
                  Completed
                </v-btn>
                <v-btn
                  class="action-btn cancelled-btn red-btn"
                  small
                  :disabled="item.order_status === 'cancelled'"
                  @click="
                    updateOrderStatus({ ...item, order_status: 'cancelled' })
                  "
                >
                  Cancelled
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <v-dialog v-model="orderDetailDialog" max-width="600px" data-app="true">
          <v-card>
            <v-card-title class="title">
              Order Details
            </v-card-title>
            <v-card-text>
              <div v-if="selectedOrder">
                <p><strong>Order ID:</strong> {{ selectedOrder.order_id }}</p>
                <p>
                  <strong>Total Amount:</strong>
                  {{ selectedOrder.total_amount }}
                </p>
                <p>
                  <strong>Order Status:</strong>
                  {{ selectedOrder.order_status }}
                </p>
                <p>
                  <strong>Order Date:</strong> {{ selectedOrder.order_date }}
                </p>

                <!-- ข้อมูลลูกค้า -->
                <p>
                  <strong>Customer Name:</strong>
                  {{ selectedOrder.customer.first_name }}
                  {{ selectedOrder.customer.last_name }}
                </p>
                <p>
                  <strong>Email:</strong> {{ selectedOrder.customer.email }}
                </p>
                <p>
                  <strong>Phone Number:</strong>
                  {{ selectedOrder.customer.phone_number }}
                </p>
                <p>
                  <strong>Address:</strong> {{ selectedOrder.customer.address }}
                </p>

                <!-- แสดงรายการสินค้า -->
                <h3>Purchased Items</h3>
                <ul>
                  <li
                    v-for="(product, index) in selectedOrder.order_items"
                    :key="index"
                  >
                    {{ product.product_name }} - Quantity:
                    {{ product.quantity }} - Price: {{ product.unit_price }}
                  </li>
                </ul>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="orderDetailDialog = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog สำหรับการแสดงหลักฐานการชำระเงิน -->
        <v-dialog v-model="paymentDialog" max-width="500px" data-app="true">
          <v-card>
            <v-card-title>Payment Proof</v-card-title>
            <v-card-text>
              <img
                :src="selectedPaymentProof"
                alt="Payment Proof"
                width="100%"
              >
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="paymentDialog = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      orderDetailDialog: false,
      selectedOrder: null,
      paymentDialog: false,
      selectedPaymentProof: '',
      orders: [], // ข้อมูลคำสั่งซื้อที่จะดึงจาก server
      headers: [
        { text: 'Order ID', value: 'order_id' },
        { text: 'Purchased Items', value: 'items' },
        { text: 'Status', value: 'order_status', sortable: true },
        { text: 'Payment Proof', value: 'paymentProof', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  mounted () {
    this.fetchOrders() // ดึงข้อมูลคำสั่งซื้อเมื่อ component ถูก mount
  },
  methods: {
    async fetchOrders () {
      try {
        const response = await this.$axios.get('/orders/getOrders')
        this.orders = response.data.result
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    viewPaymentProof (item) {
      this.selectedPaymentProof = item
      this.paymentDialog = true
    },
    async updateOrderStatus (item, status) {
      try {
        const response = await this.$axios.put(
          `/orders/updateOrderStatus/${item.order_id}`,
          {
            order_status: item.order_status
          }
        )
        if (response.status === 200) {
          alert(`Order ${item.order_id} marked as ${status}`)
          this.fetchOrders() // อัพเดทรายการคำสั่งซื้อหลังจากการอัพเดทสถานะ
        }
      } catch (error) {
        console.error('Error updating order status:', error)
      }
    },
    viewOrderDetails (item) {
      this.selectedOrder = item // เก็บข้อมูลคำสั่งซื้อที่เลือก
      this.orderDetailDialog = true // เปิด dialog
    },
    formatStatus (status) {
      const statusMap = {
        pending: 'Pending',
        processing: 'Processing',
        completed: 'Completed',
        cancelled: 'Cancelled'
      }
      return statusMap[status] || status
    }
  }
}
</script>

<style scoped>
.order-container {
  background-color: #f4f4f4;
  padding: 2rem;
}

.premium-card {
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
}

.title {
  font-family: "Kanit", sans-serif;
  font-size: 1.75rem;
  color: #4a4a4a;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.premium-table {
  max-height: 600px;
  overflow-y: auto;
  font-family: "Kanit", sans-serif;
  font-size: 0.9rem;
  color: #4a4a4a;
}

.order-list {
  margin: 0;
  padding-left: 1rem;
}

li {
  list-style-type: none;
  margin-bottom: 5px;
  color: #555;
}

.v-btn {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.proof-btn {
  background-color: #f0ad4e;
  color: white;
}

.not-paid {
  color: #ccc;
  font-style: italic;
}

.action-btn {
  margin: 0 5px;
  background-color: transparent;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s;
  font-family: "Kanit", sans-serif;
  font-size: 0.85rem;
}

.action-btn:hover {
  background-color: rgba(248, 110, 117, 0.15);
}

.completed-btn {
  background-color: #6fcf97;
  color: black;
}

.cancelled-btn {
  background-color: #eb5757;
  color: black;
}

.v-card-text {
  padding: 1.5rem;
  color: #333;
}

.v-card-actions {
  justify-content: flex-end;
  padding: 1rem;
}

.v-dialog img {
  border-radius: 10px;
}

/* .v-dialog {
  display: block !important;
} */

/* สไตล์สำหรับสถานะคำสั่งซื้อ */
.status-label {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-label.pending {
  background-color: #f0ad4e;
  color: white;
}

.status-label.processing {
  background-color: #5bc0de;
  color: white;
}

.status-label.completed {
  background-color: #6fcf97;
  color: white;
}

.status-label.cancelled {
  background-color: #eb5757;
  color: white;
}
</style>
