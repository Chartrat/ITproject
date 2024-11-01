<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <h4>เกี่ยวกับเรา</h4>
        <ul>
          <li><a href="/about">เกี่ยวกับเรา</a></li>
          <li><a href="/contact">ติดต่อเรา</a></li>
          <li><a href="/privacy">นโยบายความเป็นส่วนตัว</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>บริการลูกค้า</h4>
        <ul>
          <li><a href="/faq">คำถามที่พบบ่อย</a></li>
          <li><a href="/support">การสนับสนุน</a></li>
          <li><a href="/returns">นโยบายการคืนสินค้า</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>ช่องทางการติดตาม</h4>
        <ul class="social-media">
          <li><a href="https://facebook.com" target="_blank">Facebook</a></li>
          <li><a href="https://instagram.com" target="_blank">Instagram</a></li>
          <li><a href="https://twitter.com" target="_blank">Twitter</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2024 E-Commerce Website. สงวนลิขสิทธิ์</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.footer {
  font-family: "Kanit", sans-serif;
  background-color: #222;
  color: #fff;
  padding: 20px 0;
  text-align: center;
}

.footer-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 20px;
}

.footer-section {
  margin: 10px 0;
}

.footer-section h4 {
  margin-bottom: 10px;
  font-size: 16px;
  text-transform: uppercase;
  color: #ff6600;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #ff6600;
}

.footer-bottom {
  margin-top: 20px;
  font-size: 14px;
  color: #ccc;
}

.social-media {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-media li {
  list-style: none;
}

.social-media li a {
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  transition: color 0.3s;
}

.social-media li a:hover {
  color: #ff6600;
}
</style>
