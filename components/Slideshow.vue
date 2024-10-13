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
          <img
            src="https://i.pinimg.com/originals/d8/16/97/d81697f38d65bb260b46537b6773ec0a.gif"
            alt="Banner 1"
          >
        </div>
        <div class="banner">
          <img
            src="https://www.brownderosa.com/wp-content/uploads/2023/01/%E0%B8%84%E0%B8%B2%E0%B8%AA%E0%B8%B4%E0%B9%82%E0%B8%99%E0%B8%AD%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%A5%E0%B8%99%E0%B9%8C%E0%B8%84%E0%B8%A3%E0%B8%9A%E0%B8%97%E0%B8%B8%E0%B8%81%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%A2-1.1.gif"
            alt="Banner 2"
          >
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
        'https://media.assettype.com/outlookindia/2024-07/42f6cd75-2689-4a9b-b8be-9f4a2fe7fd5d/1.png?w=1200&h=675&fit=crop&crop=smart',
        'https://static.wixstatic.com/media/c3bc47_73c03c0232cc48339913d2230a6b3c49~mv2.gif',
        'https://www.sqlchick.com/wp-content/uploads/2024/10/slot_03.jpg'
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
