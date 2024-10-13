<template>
  <div class="category-sidebar">
    <h2>Categories</h2>
    <ul class="category-list">
      <li>SOFA</li>
      <li>Light</li>
      <li>Bed</li>
    </ul>

    <h3>เลือกซื้อโดย</h3>

    <div class="filter-section">
      <h4>Shop by Category</h4>
      <ul class="filter-list">
        <li>
          <input id="kitten" type="checkbox" name="category">
          <label for="kitten">ห้องครัว</label>
        </li>
        <li>
          <input id="bedroom" type="checkbox" name="category">
          <label for="bedroom">ห้องนอน</label>
        </li>
      </ul>
    </div>

    <div class="filter-section">
      <h4>Shop by Price</h4>
      <ul class="filter-list">
        <li>
          <input id="under-100" type="radio" name="price">
          <label for="under-100">0 - 100</label>
        </li>
        <li>
          <input id="100-500" type="radio" name="price">
          <label for="100-500">100 - 500</label>
        </li>
        <li>
          <input id="500-1000" type="radio" name="price">
          <label for="500-1000">500 - 1000</label>
        </li>
        <li>
          <input id="1000-2000" type="radio" name="price">
          <label for="1000-2000">1000 - 2000</label>
        </li>
        <li>
          <input id="over-2000" type="radio" name="price">
          <label for="over-2000">2000 +</label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategorySidebar'
}
</script>

<style scoped>
.category-sidebar {
  padding: 20px;
  background-color: #fdfdfd;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  font-family: "Serif", "Georgia", sans-serif;
  color: #2c2c2c;
}

h2,
h3,
h4 {
  margin-bottom: 15px;
  color: #444;
  font-family: "Playfair Display", serif;
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
  accent-color: #a67c52; /* สีที่เน้นความหรูหรา */
}

label {
  font-size: 16px;
  font-family: "Serif", "Georgia", sans-serif;
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
