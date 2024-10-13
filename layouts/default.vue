<template>
  <div>
    <AppHeader />
    <!-- ส่วน Header -->
    <main>
      <Nuxt />
    </main>

    <AppFooter />
    <!-- ส่วน Footer -->
  </div>
</template>

<script>
import AppFooter from '~/components/AppFooter.vue'
import AppHeader from '~/components/AppHeader.vue'

export default {
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<style scoped>
/* สไตล์สำหรับ layout หลัก */
main {
  min-height: calc(
    100vh - 200px
  ); /* ตัวอย่างเพื่อให้ main content กินพื้นที่หน้าจอ */
  padding: 20px;
}

body {
  margin: 0;
  font-family: "Arial", sans-serif;
}
</style>
