<template>
  <div class="product-details">
    <img :src="product.image_url" alt="product.name" class="product-image">
    <div class="product-info">
      <h1>{{ product.name }}</h1>
      <p>{{ product.description }}</p>
      <p>ราคา: {{ product.price }} บาท</p>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ params, $axios }) {
    try {
      const response = await $axios.get(
        `http://localhost:8000/products/GetProductById/${params.product_id}`
      )
      return {
        product: response.data.result
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      return {
        product: {}
      }
    }
  }
}
</script>

<style scoped>
.product-details {
  display: flex;
  align-items: flex-start;
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  border: 1px solid #dcdcdc;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  gap: 40px; /* ระยะห่างระหว่างรูปกับข้อความ */
}

.product-image {
  width: 50%; /* ให้รูปภาพใช้พื้นที่ครึ่งหนึ่งของความกว้าง */
  height: auto;
  border-radius: 12px;
}

.product-info {
  flex: 1; /* ข้อความใช้พื้นที่ที่เหลือ */
  text-align: left;
}

h1 {
  margin-bottom: 16px;
  font-size: 28px;
  font-family: "Kanit", sans-serif;
  color: #2c2c2c;
}

p {
  margin-bottom: 12px;
  font-size: 18px;
  color: #666;
  font-family: "Kanit", sans-serif;
}

p:last-child {
  font-size: 20px;
  color: #a67c52;
  font-weight: bold;
}
</style>
