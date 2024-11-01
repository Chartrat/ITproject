<template>
  <div class="category-sidebar">
    <h2>Categories</h2>
    <!-- หมวดหมู่หลัก -->
    <ul class="category-list">
      <li>
        <input
          id="main-all"
          v-model="selectedMainCategory"
          type="radio"
          name="main-category"
          value="all"
          @change="onMainCategoryChange"
        >
        <label for="main-all">หมวดหมู่ทั้งหมด</label>
      </li>
      <li
        v-for="mainCategory in mainCategories"
        :key="mainCategory.category_id"
      >
        <input
          :id="`main-${mainCategory.category_id}`"
          v-model="selectedMainCategory"
          type="radio"
          name="main-category"
          :value="mainCategory.category_id"
          @change="onMainCategoryChange"
        >
        <label :for="`main-${mainCategory.category_id}`">{{
          mainCategory.name
        }}</label>
      </li>
    </ul>

    <!-- Shop by Category -->
    <!-- <div class="filter-section">
      <h4>Shop by Category</h4>
      <ul class="filter-list">
        <li
          v-for="subCategory in displayedSubCategories"
          :key="subCategory.category_id"
        >
          <input
            :id="`sub-${subCategory.category_id}`"
            v-model="selectedCategories"
            type="checkbox"
            name="category"
            :value="subCategory.category_id"
            @change="onCategoryChange"
          >
          <label :for="`sub-${subCategory.category_id}`">{{
            subCategory.name
          }}</label>
        </li>
      </ul>
    </div> -->

    <!-- Shop by Price -->
    <div class="filter-section">
      <h4>เลือกซื้อโดย Shop by Price</h4>
      <ul class="filter-list">
        <li>
          <input
            id="under-100"
            v-model="selectedPriceRange"
            type="radio"
            name="price"
            value="0-100"
            @change="onPriceChange"
          >
          <label for="under-100">0 - 100</label>
        </li>
        <li>
          <input
            id="100-500"
            v-model="selectedPriceRange"
            type="radio"
            name="price"
            value="100-500"
            @change="onPriceChange"
          >
          <label for="100-500">100 - 500</label>
        </li>
        <li>
          <input
            id="500-1000"
            v-model="selectedPriceRange"
            type="radio"
            name="price"
            value="500-1000"
            @change="onPriceChange"
          >
          <label for="500-1000">500 - 1000</label>
        </li>
        <li>
          <input
            id="1000-2000"
            v-model="selectedPriceRange"
            type="radio"
            name="price"
            value="1000-2000"
            @change="onPriceChange"
          >
          <label for="1000-2000">1000 - 2000</label>
        </li>
        <li>
          <input
            id="over-2000"
            v-model="selectedPriceRange"
            type="radio"
            name="price"
            value="2000+"
            @change="onPriceChange"
          >
          <label for="over-2000">2000 +</label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategorySidebar',
  data () {
    return {
      selectedMainCategory: 'all', // เริ่มต้นที่ "หมวดหมู่ทั้งหมด"
      selectedCategories: [],
      selectedPriceRange: null,
      mainCategories: [],
      subCategories: []
    }
  },
  computed: {
    // แสดงหมวดหมู่ย่อยทั้งหมดหรือเฉพาะที่สัมพันธ์กับหมวดหมู่หลักที่เลือก
    displayedSubCategories () {
      if (this.selectedMainCategory && this.selectedMainCategory !== 'all') {
        return this.subCategories.filter(
          c => c.parent_id === this.selectedMainCategory
        )
      }
      return this.subCategories
    }
  },
  async mounted () {
    await this.fetchCategories()
  },
  methods: {
    async fetchCategories () {
      // ดึงข้อมูลจาก API เพื่อแสดงหมวดหมู่หลักและย่อย
      const response = await this.$axios.get(
        'http://localhost:8000/categories/categories'
      )
      const categories = response.data.result
      console.log('Categories:', categories)

      // แยกหมวดหมู่หลักและย่อย
      this.mainCategories = categories.filter(c => c.parent_id === null)
      this.subCategories = categories.filter(c => c.parent_id !== null)
    },
    onMainCategoryChange () {
      // ล้างรายการหมวดหมู่ย่อยที่เลือก
      this.selectedCategories = []
      // รีเซ็ตการกรองราคาเมื่อเลือก "หมวดหมู่ทั้งหมด"
      if (this.selectedMainCategory === 'all') {
        this.selectedPriceRange = null
      }
      this.$emit('main-category-change', String(this.selectedMainCategory))
    },
    onCategoryChange () {
      this.$emit('category-change', this.selectedCategories)
    },
    onPriceChange () {
      console.log('Selected Price Range:', this.selectedPriceRange)
      this.$emit('price-change', this.selectedPriceRange)
    }
  }
}
</script>

<style scoped>
.category-sidebar {
  padding: 20px;
  background-color: #fdfdfd;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  font-family: "Kanit", sans-serif;
  color: #2c2c2c;
}

h4 {
  margin-bottom: 15px;
  color: #444;
  font-family: "Kanit", sans-serif;
  font-weight: bold;
}

.category-list,
.filter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 12px;
}

.filter-section {
  margin-bottom: 25px;
}

input[type="checkbox"],
input[type="radio"] {
  margin-right: 10px;
  accent-color: #a67c52;
}

label {
  font-size: 16px;
  font-family: "Kanit", sans-serif;
  color: #5c5c5c;
  cursor: pointer;
}

input:focus + label {
  color: #a67c52;
}

.category-list li:hover,
.filter-list li:hover label {
  color: #a67c52;
  transition: color 0.3s ease;
}

.category-sidebar ul li {
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.category-sidebar ul li:hover {
  background-color: #fafafa;
  border-radius: 6px;
}

.category-sidebar {
  border: 1px solid #dcdcdc;
  background-image: linear-gradient(145deg, #ffffff, #f1f1f1);
}
</style>
