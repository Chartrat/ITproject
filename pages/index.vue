<template>
  <div>
    <div class="main-container">
      <!-- ProductList ด้านซ้าย -->
      <div class="product-list">
        <Slideshow />
        <div>
          <h1>รายการสินค้า</h1>
          <div class="products-container">
            <v-row class="justify-start">
              <v-col md="3">
                <CategorySidebar />
              </v-col>
              <v-col md="9">
                <v-row class="justify-start">
                  <div
                    v-for="product in filteredProducts"
                    :key="product.product_id"
                    class="product-card"
                    @click="goToProductDetails(product.product_id)"
                  >
                    <img
                      :src="product.image_url"
                      alt="product.name"
                      class="product-image"
                    >
                    <h3>{{ product.name }}</h3>
                    <p>ราคา: {{ product.price }} บาท</p>
                    <div class="card-actions">
                      <button
                        class="fav-btn"
                        @click.stop="toggleFavorite(product)"
                      >
                        <!-- ไอคอนหัวใจ -->
                        <i
                          :class="
                            product.isFavorite ? 'fas fa-heart' : 'far fa-heart'
                          "
                        />
                      </button>
                      <button
                        class="add-to-cart-btn"
                        @click.stop="addToCart(product)"
                      >
                        <!-- ปุ่มตะกร้า -->
                        <i class="fas fa-shopping-cart" /> เพิ่มลงตะกร้า
                      </button>
                    </div>
                  </div>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { jwtDecode } from 'jwt-decode'
import Slideshow from '~/components/Slideshow.vue'
import CategorySidebar from '~/components/CategorySidebar.vue'

export default {
  components: {
    Slideshow,
    CategorySidebar
  },
  data () {
    return {
      products: [],
      categories: [],
      selectedCategories: [],
      priceRange: 5000123123
    }
  },
  async fetch () {
    try {
      const response = await this.$axios.get('http://localhost:8000/products/')
      this.products = response.data.result.map(product => ({
        ...product,
        isFavorite: false // เพิ่มสถานะ favorite ใน product
      }))
    } catch (error) {
      console.error('Error fetching products:', error)
    }

    // Fetch categories
    try {
      const categoriesResponse = await this.$axios.get(
        'http://localhost:8000/categories/'
      )
      this.categories = categoriesResponse.data.result
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  },
  computed: {
    filteredProducts () {
      return this.products.filter((product) => {
        return (
          (this.selectedCategories.length === 0 ||
            this.selectedCategories.includes(product.category)) &&
          product.price <= this.priceRange
        )
      })
    }
  },
  customerId () {
    if (this.token) {
      const decoded = jwtDecode(this.token)
      return decoded.customerId // ดึง UserID จาก token
    }
    return null
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    goToProductDetails (productId) {
      this.$router.push(`/product/${productId}`)
    },
    toggleFavorite (product) {
      product.isFavorite = !product.isFavorite // เปลี่ยนสถานะ favorite
    }
  }
}
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.product-list {
  flex-grow: 1;
  padding: 16px;
}

.products-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 10px;
}

.product-card {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 24px;
  margin: 10px;
  width: 280px; /* กำหนดขนาดความกว้างเท่ากันทุกการ์ด */
  text-align: center;
  background-color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%; /* กำหนดความสูงเต็มสำหรับการ์ด */
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-color: #a67c52;
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

h3 {
  font-family: "Playfair Display", serif;
  font-size: 20px;
  color: #333;
  margin-bottom: 8px;
  white-space: nowrap; /* ป้องกันไม่ให้ข้อความขึ้นบรรทัดใหม่ */
  overflow: hidden; /* ซ่อนข้อความที่เกินขอบ */
  text-overflow: ellipsis; /* แสดง ... เมื่อข้อความยาวเกินไป */
}

p {
  font-size: 18px;
  color: #555;
  margin-bottom: 16px;
  white-space: nowrap; /* ป้องกันไม่ให้ข้อความขึ้นบรรทัดใหม่ */
  overflow: hidden; /* ซ่อนข้อความที่เกินขอบ */
  text-overflow: ellipsis; /* แสดง ... เมื่อข้อความยาวเกินไป */
}

.card-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
}

.add-to-cart-btn {
  background-color: #a67c52;
  color: white;
  border: none;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center; /* ปุ่มอยู่กลางเสมอ */
  transition: background-color 0.3s ease;
  width: 80%;
}

.add-to-cart-btn i {
  margin-right: 8px;
}

.add-to-cart-btn:hover {
  background-color: #8e653f;
}

.fav-btn {
  background-color: transparent;
  border: none;
  color: #a67c52;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.fav-btn:hover {
  color: #8e653f;
}

.far.fa-heart {
  color: #ccc;
}

.fas.fa-heart {
  color: #a67c52;
}

button:focus {
  outline: none;
}
</style>
