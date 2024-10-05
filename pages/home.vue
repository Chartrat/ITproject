<template>
  <div>
    <AppHeader />
    <v-container fluid>
      <!-- Hero Section with centered image and quote -->
      <v-row class="hero-section">
        <v-col class="text-center">
          <img src="/v.png" alt="Vuetify.js" class="hero-image mb-5">
          <blockquote class="blockquote hero-quote">
            &#8220;Master Home Complete with home equipments&#8221;
            <footer>
              <small>
                <em>&mdash;Por Natanon </em>
              </small>
            </footer>
          </blockquote>
        </v-col>
      </v-row>

      <!-- Product Grid Section -->
      <v-row class="product-grid">
        <v-col
          v-for="(product, index) in products"
          :key="index"
          cols="12"
          sm="6"
          md="3"
          class="d-flex"
        >
          <v-card class="mx-auto product-card" max-width="344">
            <v-img :src="product.image_url" height="200px" />
            <v-card-title>{{ product.name }}</v-card-title>
            <v-card-subtitle class="text-h5 product-price">
              ฿{{ product.price }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                block
                color="primary"
                class="add-to-cart-btn"
                @click="addToCart(product)"
              >
                Add to Cart
              </v-btn>
              <v-btn
                block
                color="grey"
                class="details-btn"
                @click="showDetails(product)"
              >
                Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Cart Drawer -->
      <v-navigation-drawer v-model="cartDrawer" app right temporary>
        <v-list>
          <v-list-item-group>
            <v-list-item v-for="(item, index) in cart" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  Quantity: {{ item.quantity }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon class="remove-btn" @click="removeFromCart(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-btn fab color="primary" class="cart-button" @click="cartDrawer = true">
        <v-icon>mdi-cart</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import * as jwtDecode from 'jwt-decode'
import AppHeader from '~/components/AppHeader.vue'

export default {
  components: { AppHeader },
  layout: 'blank',
  data () {
    return {
      products: [],
      cart: [],
      cartDrawer: false,
      token: null
    }
  },
  computed: {
    userId () {
      if (this.token) {
        const decoded = jwtDecode(this.token)
        return decoded.userId // ดึง UserID จาก token
      }
      return null
    }
  },
  mounted () {
    if (!this.checklogin()) {
      this.$router.push('/')
    }

    this.token = localStorage.getItem('token') // ดึง token จาก localStorage เมื่อ component ถูก mount
    this.fetchProducts()
  },
  methods: {
    checklogin () {
      const login = localStorage.getItem('token')

      if (!login) {
        return false
      }
      return true // เพิ่มการส่งค่ากลับในกรณีที่มี token
    },
    async fetchProducts () {
      try {
        const response = await this.$axios.get(
          'http://localhost:8000/products'
        )
        if (response.data.status === 'success' && response.data.code === 1) {
          this.products = response.data.result
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    showDetails (product) {
      alert(`Details for ${product.name}`)
    },
    async addToCart (product) {
      const cartItem = this.cart.find(
        item => item.product_id === product.product_id
      )
      if (cartItem) {
        cartItem.quantity++
      } else {
        this.cart.push({ ...product, quantity: 1 })
      }
      // Save to database
      await this.saveToDatabase(product) // Call function to save to DB
    },
    async saveToDatabase (product) {
      try {
        const response = await this.$axios.post('http://localhost:8000/cart', {
          product_id: product.product_id,
          quantity: 1,
          user_id: this.userId // ส่ง UserID ไปยังเซิร์ฟเวอร์
        })
        if (response.data.status !== 'success') {
          console.error('Error saving to database:', response.data.message)
        }
      } catch (error) {
        console.error('Error saving to database:', error)
      }
    },
    removeFromCart (index) {
      this.cart.splice(index, 1)
    }
  }
}
</script>

<style scoped>
/* Global Styles */
body {
  margin: 0;
  font-family: "Arial", sans-serif; /* Set a clean font for the body */
}

/* Hero Section Styles */
.hero-section {
  background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
  padding: 80px 20px; /* Increased padding for a more spacious feel */
  color: white; /* Ensures text is readable against the background */
}

.hero-image {
  width: 180px; /* Slightly larger image */
  border-radius: 50%;
  border: 5px solid white;
  transition: transform 0.3s ease; /* Added a hover effect */
}

.hero-image:hover {
  transform: scale(1.1); /* Zoom effect on hover */
}

.hero-quote {
  font-size: 2rem; /* Increased font size for emphasis */
  margin-top: 20px;
  font-family: "Playfair Display", serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Added shadow for depth */
}

/* Product Grid Styles */
.product-grid {
  padding: 40px 20px;
  background-color: #f5f5f5;
  display: flex;
  flex-wrap: wrap; /* Ensures cards wrap correctly */
}

.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* More pronounced shadow */
  border-radius: 15px; /* Slightly rounder corners */
  overflow: hidden;
  background-color: #ffffff; /* Ensures consistent background color */
  margin: 2; /* Spacing between cards */
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.3); /* Deeper shadow on hover */
}

/* Button Styles */
.add-to-cart-btn {
  background-color: #ff7e5f;
  font-weight: bold;
  font-size: 1.2rem; /* Larger font size for buttons */
  color: white;
  transition: background-color 0.3s ease, transform 0.2s ease; /* Added transform effect */
  border-radius: 5px;
  margin-top: 10px; /* Spacing above buttons */
}

.add-to-cart-btn:hover {
  background-color: #feb47b;
  transform: scale(1.05); /* Scale up on hover */
}

.details-btn {
  font-weight: bold;
  color: #333;
  transition: background-color 0.3s ease; /* Smooth background transition */
}

.details-btn:hover {
  background-color: #e0e0e0;
}

/* Cart Button Styles */
.cart-button {
  position: fixed; /* Fixed position to stay at the bottom right */
  bottom: 20px; /* Distance from the bottom */
  right: 20px; /* Distance from the right */
  z-index: 1000; /* Make sure it's above other elements */
}

/* Cart Drawer Styles */
.v-navigation-drawer {
  background-color: #ffffff; /* White background for the drawer */
}

.v-list-item-title {
  font-weight: bold; /* Bold titles in the cart */
}

.cart-button {
  position: fixed; /* Fixed position to stay at the bottom right */
  bottom: 20px; /* Distance from the bottom */
  right: 20px; /* Distance from the right */
  z-index: 1000; /* Make sure it's above other elements */
  background-color: #ff7e5f; /* Background color for the cart button */
  color: white; /* Text color */
  border-radius: 50%; /* Circular button */
  width: 56px; /* Fixed width */
  height: 56px; /* Fixed height */
  display: flex; /* Center icon */
  align-items: center; /* Center icon vertically */
  justify-content: center; /* Center icon horizontally */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* Button shadow */
  transition: background-color 0.3s ease; /* Smooth background transition */
}

.cart-button:hover {
  background-color: #feb47b; /* Change color on hover */
}

/* Cart Drawer Styles */
.v-navigation-drawer {
  background-color: #ffffff; /* White background for the drawer */
}

.v-list-item-title {
  font-weight: bold; /* Bold titles in the cart */
}

/* Responsive Styles */
@media (max-width: 600px) {
  .hero-quote {
    font-size: 1.8rem; /* Adjust font size for smaller screens */
  }
  .hero-image {
    width: 150px; /* Adjust image size for smaller screens */
  }
  .add-to-cart-btn,
  .details-btn {
    font-size: 1rem; /* Adjust button font size for smaller screens */
  }
}
</style>
