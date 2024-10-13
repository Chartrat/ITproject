<template>
  <header class="app-header">
    <nav class="navbar">
      <h1>Master Home</h1>
      <ul class="nav-links">
        <li>
          <router-link to="/">
            Home
          </router-link>
        </li>

        <!-- Dropdown Admin Menu -->
        <li
          v-if="Admin === 'admin'"
          class="dropdown"
          @mouseenter="toggleDropdown"
          @mouseleave="toggleDropdown"
        >
          <a href="#" class="dropdown-link">Admin</a>
          <ul v-if="isDropdownOpen" class="dropdown-menu">
            <li>
              <router-link to="/admin/EditProducts">
                Edit Product
              </router-link>
            </li>
            <li>
              <router-link to="/admin/Orders">
                Orders
              </router-link>
            </li>
          </ul>
        </li>

        <li>
          <router-link to="/user/Profile">
            Profile
          </router-link>
        </li>

        <!-- เพิ่มไอคอนตะกร้าสินค้า -->
        <li @mouseenter="toggleCartPreview" @mouseleave="toggleCartPreview">
          <router-link to="/cart">
            <i class="fa fa-shopping-cart" /> Cart ({{ cartItemCount }})
          </router-link>
          <!-- Cart Preview -->
          <div v-if="isCartPreviewOpen" class="cart-preview">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item-preview"
            >
              <p>{{ item.name }} ({{ item.quantity }})</p>
            </div>
          </div>
        </li>
      </ul>

      <button class="menu-toggle" @click="toggleMenu">
        <span class="bar" />
        <span class="bar" />
        <span class="bar" />
      </button>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="mobile-menu">
      <ul>
        <li>
          <router-link to="/">
            Home
          </router-link>
        </li>

        <!-- Dropdown Admin Menu in Mobile -->
        <li v-if="Admin === 'admin'" class="dropdown" @click="toggleDropdown">
          <a href="#" class="dropdown-link">Admin</a>
          <ul v-if="isDropdownOpen" class="dropdown-menu">
            <li>
              <router-link to="/admin/EditProducts">
                Edit Product
              </router-link>
            </li>
            <li>
              <router-link to="/admin/Orders">
                Orders
              </router-link>
            </li>
          </ul>
        </li>

        <li>
          <router-link to="/Profile">
            Profile
          </router-link>
        </li>
        <li>
          <router-link to="/cart">
            <i class="fa fa-shopping-cart" /> Cart ({{ cartItemCount }})
          </router-link>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex' // ใช้ mapGetters เพื่อดึงจำนวนสินค้าในตะกร้าจาก Vuex

export default {
  data () {
    return {
      isMenuOpen: false,
      isDropdownOpen: false,
      isCartPreviewOpen: false,
      Admin: '',
      searchQuery: ''
    }
  },
  computed: {
    ...mapGetters('cart', ['cartItemCount']) // ดึง cartItemCount จาก store
  },
  mounted () {
    const role = localStorage.getItem('role')
    this.Admin = role
  },
  methods: {
    toggleMenu () {
      this.isMenuOpen = !this.isMenuOpen
    },
    toggleDropdown () {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    toggleCartPreview () {
      this.isCartPreviewOpen = !this.isCartPreviewOpen
    }
  }
}
</script>

<style scoped>
/* เพิ่มสไตล์ที่ใช้ใน header */
.app-header {
  background-color: #fff;
  color: #333;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  font-weight: bold;
}

/* เพิ่มสไตล์สำหรับไอคอนตะกร้าสินค้า */
.fa-shopping-cart {
  margin-right: 8px;
}

/* Dropdown Menu Styling */
.dropdown {
  position: relative;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.dropdown-menu li {
  padding: 8px 16px;
}

.dropdown-menu li a {
  text-decoration: none;
  color: black;
}

.dropdown:hover .dropdown-menu,
.dropdown-menu:hover {
  display: block;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.menu-toggle .bar {
  height: 3px;
  width: 25px;
  background-color: #333;
  margin: 4px 0;
}

.mobile-menu {
  display: none;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .mobile-menu {
    display: block;
    background-color: #fff;
    position: absolute;
    top: 60px;
    right: 0;
    left: 0;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .mobile-menu ul {
    list-style: none;
    padding: 0;
  }

  .mobile-menu li {
    margin: 1rem 0;
  }

  .mobile-menu a {
    color: #333;
    text-decoration: none;
    font-weight: bold;
  }
}
.cart-preview {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  width: 200px;
  top: 100%;
  right: 0;
  z-index: 1000;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.cart-item-preview {
  margin-bottom: 5px;
}

.cart-item-preview p {
  margin: 0;
  font-size: 14px;
}
</style>
