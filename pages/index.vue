<template>
  <div>
    <div class="main-container">
      <!-- ส่วนของรายการสินค้า -->
      <div class="product-list">
        <Slideshow />
        <br>
        <div class="products-container">
          <v-row class="justify-start">
            <!-- Sidebar -->
            <v-col md="3">
              <CategorySidebar
                @main-category-change="updateSelectedMainCategory"
                @category-change="updateSelectedCategories"
                @price-change="updatePriceRange"
              />
            </v-col>
            <!-- รายการสินค้า -->
            <v-col md="9">
              <!-- วนลูปเพื่อแสดงสินค้าตามหมวดหมู่ -->
              <div
                v-for="(products, categoryName) in groupedProducts"
                :key="categoryName"
              >
                <h2>{{ categoryName }}</h2>
                <v-row class="justify-start">
                  <div
                    v-for="product in products"
                    :key="product.product_id"
                    class="product-card"
                    @click="goToProductDetails(product.product_id)"
                  >
                    <img
                      :src="product.image_url"
                      :alt="product.name"
                      class="product-image"
                    >
                    <h3>{{ product.name }}</h3>
                    <p>ราคา: {{ product.price }} บาท</p>
                    <div class="card-actions">
                      <button
                        class="fav-btn"
                        @click.stop="toggleFavorite(product)"
                      >
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
                        <i class="fas fa-shopping-cart" /> เพิ่มลงตะกร้า
                      </button>
                    </div>
                  </div>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <!-- แทรก Chatbot -->
    <div class="chatbot-container">
      <Chatbot />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Slideshow from '~/components/Slideshow.vue'
import CategorySidebar from '~/components/CategorySidebar.vue'
import Chatbot from '~/components/Chatbot.vue'

export default {
  components: {
    Slideshow,
    CategorySidebar,
    Chatbot
  },
  data () {
    return {
      products: [],
      categories: [],
      categoriesById: {},
      selectedMainCategory: 'all',
      selectedCategories: [],
      priceRange: { min: 0, max: Infinity }
    }
  },
  computed: {
    // สินค้าที่ถูกกรองตามเงื่อนไข
    filteredProducts () {
      const filtered = this.products.filter((product) => {
        const productCategory = this.categoriesById[product.category_id] || {}
        const selectedMainCategoryId = this.selectedMainCategory
        const productCategoryId = product.category_id
        const productParentCategoryId = productCategory.parent_id

        const mainCategoryMatch =
          this.selectedMainCategory === 'all' ||
          !this.selectedMainCategory ||
          productParentCategoryId === selectedMainCategoryId ||
          productCategoryId === selectedMainCategoryId

        const subCategoryMatch =
          this.selectedCategories.length === 0 ||
          this.selectedCategories.includes(product.category_id)
        product.price = Number(product.price)

        const priceMatch =
          product.price >= this.priceRange.min &&
          product.price <= this.priceRange.max

        return mainCategoryMatch && subCategoryMatch && priceMatch
      })

      // เรียงสินค้าตามชื่อหมวดหมู่
      return filtered.sort((a, b) => {
        const categoryA = this.categoriesById[a.category_id] || {}
        const categoryB = this.categoriesById[b.category_id] || {}
        const nameA = categoryA.name || ''
        const nameB = categoryB.name || ''
        return nameA.localeCompare(nameB, 'th')
      })
    },
    // จัดกลุ่มสินค้าตามหมวดหมู่
    groupedProducts () {
      const groups = {}

      this.filteredProducts.forEach((product) => {
        const categoryId = String(product.category_id)
        const category = this.categoriesById[categoryId]

        // ตรวจสอบค่า
        console.log('Product ID:', product.product_id)
        console.log('Product Category ID:', categoryId)
        console.log('Category Found:', category)

        const categoryName = category ? category.name : 'ไม่ทราบหมวดหมู่'

        if (!groups[categoryName]) {
          groups[categoryName] = []
        }
        groups[categoryName].push(product)
      })

      return groups
    }
  },
  watch: {
    categories: {
      immediate: true,
      handler (newCategories) {
        const map = {}
        newCategories.forEach((category) => {
          const categoryId = String(category.category_id)
          map[categoryId] = category
        })
        this.categoriesById = map
        console.log('Categories By ID:', this.categoriesById)
      }
    }
  },
  async mounted () {
    await this.fetchProducts()
    await this.fetchCategories()
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    async fetchProducts () {
      try {
        const response = await this.$axios.get(
          'http://localhost:8000/products/'
        )
        this.products = response.data.result.map(product => ({
          ...product,
          category_id: String(product.category_id),
          isFavorite: false
        }))
        console.log('Products:', this.products)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async fetchCategories () {
      try {
        const categoriesResponse = await this.$axios.get(
          'http://localhost:8000/categories/categories'
        )
        this.categories = categoriesResponse.data.result.map(category => ({
          ...category,
          category_id: String(category.category_id),
          parent_id:
            category.parent_id !== null ? String(category.parent_id) : null
        }))
        console.log('Categories:', this.categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    updateSelectedMainCategory (selectedMainCategory) {
      console.log('Selected Main Category:', selectedMainCategory)
      this.selectedMainCategory = selectedMainCategory
      this.selectedCategories = []
    },

    goToProductDetails (productId) {
      this.$router.push(`/product/${productId}`)
    },
    toggleFavorite (product) {
      product.isFavorite = !product.isFavorite
    },
    updateSelectedCategories (selectedCategories) {
      this.selectedCategories = selectedCategories
    },
    updatePriceRange (selectedPriceRange) {
      console.log('Received Price Range:', selectedPriceRange)
      if (selectedPriceRange === null) {
        this.priceRange = { min: 0, max: Infinity }
      } else if (selectedPriceRange.includes('+')) {
        const min = parseInt(selectedPriceRange.replace('+', ''))
        this.priceRange = { min, max: Infinity }
      } else {
        const [min, max] = selectedPriceRange.split('-').map(Number)
        this.priceRange = { min, max }
      }
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
  width: 280px;
  text-align: center;
  background-color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
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

h2 {
  font-size: 24px;
  color: #a67c52;
  margin-top: 40px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

h3 {
  font-family: "Kanit", sans-serif;
  font-size: 20px;
  color: #333;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

p {
  font-size: 18px;
  color: #555;
  margin-bottom: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  justify-content: center;
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

.product-header {
  margin-top: 20px;
}
</style>
