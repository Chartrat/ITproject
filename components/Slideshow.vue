<template>
  <v-row>
    <div class="main-container">
      <!-- ส่วนของสไลด์โชว์ -->
      <div class="slideshow-container">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="mySlides fade"
          :class="{ active: currentSlide === index }"
        >
          <img :src="image" alt="Slide image" class="slide-image">
        </div>
        <a class="prev" @click="prevSlide">&#10094;</a>
        <a class="next" @click="nextSlide">&#10095;</a>
      </div>

      <!-- ส่วนของแบนเนอร์ด้านข้าง -->
      <div class="sidebar">
        <div class="banner">
          <img src="@/assets/MAS5.jpg" alt="Banner 1">
        </div>
        <div class="banner">
          <img src="@/assets/MAS6.jpg" alt="Banner 2">
        </div>
      </div>
    </div>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      currentSlide: 0,
      images: [
        require('@/assets/MASTERhome.jpg'),
        require('@/assets/MAS2.jpg'),
        require('@/assets/MAS3.jpg')
      ]
    }
  },
  mounted () {
    setInterval(() => {
      this.nextSlide()
    }, 3000)
  },
  methods: {
    nextSlide () {
      this.currentSlide = (this.currentSlide + 1) % this.images.length
    },
    prevSlide () {
      this.currentSlide =
        (this.currentSlide - 1 + this.images.length) % this.images.length
    }
  }
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: row; /* จัดเรียงในแนวนอน */
  justify-content: space-between;
  gap: 10px; /* เพิ่มช่องว่างระหว่างสไลด์โชว์และแบนเนอร์ด้านข้าง */
  height: 100%;
}

.slideshow-container {
  flex: 2; /* ครอบคลุมพื้นที่ทางซ้ายมากกว่าพื้นที่ทางขวา */
  max-width: auto;
  height: 424px; /* ความสูงคงที่สำหรับสไลด์โชว์ */
  position: relative;
  overflow: hidden;
}

.mySlides {
  display: none;
}

.active {
  display: block;
}

.slide-image {
  width: 100%;
  height: 100%;
}

.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  padding: 16px;
  margin-top: -22px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  user-select: none;
}

.prev {
  left: 0;
}

.next {
  right: 0;
}

.sidebar {
  flex: 1; /* ครอบคลุมพื้นที่ด้านขวาน้อยกว่า */
  display: flex;
  max-width: auto;
  height: auto; /* ความสูงคงที่สำหรับสไลด์โชว์ */
  flex-direction: column;
}

.banner {
  margin-bottom: 10px;
}

.banner img {
  width: 100%;
  height: 200px; /* ครอบคลุมความสูงของแต่ละแบนเนอร์ */
  object-fit: cover; /* รักษาสัดส่วนของรูปภาพ */
}
</style>
