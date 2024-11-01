<template>
  <v-app>
    <v-main>
      <div class="checkout-container">
        <h1>สรุปรายการสั่งซื้อ</h1>
        <div v-if="items.length > 0">
          <ul class="item-list">
            <li v-for="(item, index) in items" :key="index" class="item">
              <img
                :src="item.image_url"
                alt="Product Image"
                class="product-image"
              >
              <div class="item-details">
                <h3>{{ item.name }}</h3>
                <p>จำนวน: {{ item.quantity }}</p>
                <p>ราคา: {{ item.price }} บาท</p>
              </div>
            </li>
          </ul>
          <p class="total">
            รวมทั้งหมด: {{ total }} บาท
          </p>

          <v-btn color="success" class="payment-btn" @click="handlePayment">
            ชำระเงินผ่าน PromptPay
          </v-btn>

          <div v-if="qrCode" class="qr-code-container">
            <img :src="qrCode" alt="PromptPay QR Code" class="qr-code">
            <p>สแกนเพื่อชำระเงินผ่าน PromptPay</p>

            <div class="upload-container">
              <input type="file" @change="handleUpload">
              <v-btn color="primary" @click="submitPaymentProof">
                ยืนยันการชำระเงิน
              </v-btn>

              <!-- Display uploaded image preview -->
              <div v-if="previewImage" class="preview-container">
                <p>ตัวอย่างสลิปที่อัพโหลด:</p>
                <img
                  :src="previewImage"
                  alt="Payment Proof Preview"
                  class="preview-image"
                >
              </div>
            </div>
          </div>
        </div>
        <p v-else class="empty-cart">
          ไม่มีสินค้าในตะกร้า
        </p>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import QRCode from 'qrcode'
import jwtDecode from 'jwt-decode'

export default {
  data () {
    return {
      items: [],
      total: 0,
      qrCode: '', // สำหรับ URL ของ QR Code
      paymentProof: null, // ไฟล์หลักฐานการชำระเงิน
      previewImage: null // URL ตัวอย่างรูปที่อัพโหลด
    }
  },
  mounted () {
    if (this.$route.params.cartItems) {
      this.items = this.$route.params.cartItems
      this.total = this.$route.params.cartTotal
    }
  },
  methods: {
    async handlePayment () {
      const promptpayQR = require('promptpay-qr')
      const payload = promptpayQR('0969453828', { amount: this.total })
      this.qrCode = await QRCode.toDataURL(payload)

      alert(
        'กรุณาสแกน QR Code เพื่อชำระเงินและอัปโหลดสลิปหลังจากชำระเงินเสร็จ'
      )
    },
    handleUpload (event) {
      this.paymentProof = event.target.files[0]
      this.previewImage = URL.createObjectURL(this.paymentProof) // สร้าง URL สำหรับดูตัวอย่าง
    },
    async submitPaymentProof () {
      if (!this.paymentProof) {
        alert('กรุณาอัพโหลดหลักฐานการชำระเงิน')
        return
      }

      const token = localStorage.getItem('token')
      const tokendecode = jwtDecode(token)
      const customerId = tokendecode[0].customer_id

      const orderPayload = {
        customer_id: customerId,
        order_status: 'processing',
        total_amount: this.total,
        orderDetails: this.items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price
        }))
      }

      try {
        // Send order creation request
        const orderResponse = await this.$axios.post(
          '/orders/createOrder',
          orderPayload
        )

        if (orderResponse.status === 200) {
          const orderId = orderResponse.data.result.orderId
          // Set up FormData with payment details
          const formData = new FormData()
          formData.append('customer_id', customerId)
          formData.append('order_id', orderId)
          formData.append('payment_method', 'PromptPay')
          formData.append('payment_date', new Date().toISOString())
          formData.append('amount', this.total)
          formData.append('payment_status', 'pending')
          formData.append('paymentProof', this.paymentProof) // เพิ่มไฟล์

          // Send proof of payment with multipart/form-data
          const proofResponse = await this.$axios.post(
            '/payment/CreatePayment',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          )

          if (proofResponse.status === 200) {
            alert('อัพโหลดหลักฐานการชำระเงินสำเร็จ')
            this.$router.push('/user/Orderuser')
          }
        } else {
          alert('การสร้างออเดอร์ล้มเหลว')
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัพโหลด:', error)
        alert('การอัพโหลดหลักฐานล้มเหลว')
      }
    }
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f8f8f8;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

h1 {
  font-family: "Kanit", sans-serif;
  font-size: 2.5em;
  color: #333;
  text-align: center;
  font-weight: 700;
  margin-bottom: 30px;
}

.item-list {
  list-style: none;
  padding: 0;
}

.item {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
}

.product-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0;
  font-family: "Kanit", sans-serif;
  font-size: 1.3em;
  color: #222;
}

.item-details p {
  margin: 5px 0;
  font-family: "Kanit", sans-serif;
  color: #555;
}

.total {
  font-family: "Kanit", sans-serif;
  font-size: 1.8em;
  color: #333;
  text-align: right;
  margin-top: 30px;
  font-weight: 600;
}

.payment-btn {
  display: block;
  width: 100%;
  padding: 15px;
  font-family: "Kanit", sans-serif;
  font-size: 1.2em;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 50px;
  margin-top: 30px;
  background-color: #00695c;
  color: #fff;
  transition: background-color 0.3s ease;
}

.payment-btn:hover {
  background-color: #004d40;
}

.qr-code-container {
  text-align: center;
  margin-top: 30px;
}

.qr-code {
  width: 160px;
  height: 160px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.upload-container {
  text-align: center;
  margin-top: 20px;
}

.empty-cart {
  font-family: "Kanit", sans-serif;
  font-size: 1.4em;
  color: #999;
  text-align: center;
  font-weight: 500;
}
.preview-container {
  text-align: center;
  margin-top: 20px;
}

.preview-image {
  width: 300px;
  height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
