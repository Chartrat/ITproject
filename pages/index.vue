<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="username">Username:</label>
          <input v-model="username" type="text" required>
        </div>
        <div class="input-group">
          <label for="password">Password:</label>
          <input v-model="password" type="password" required>
        </div>
        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
        <button type="submit" class="login-button">
          Login
        </button>
      </form>
      <!-- ปุ่ม Register ใหม่ -->
      <button class="register-button" @click="goToRegister">
        Register
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  layout: 'blank',

  data () {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  created () {
    // ตรวจสอบว่าโค้ดกำลังทำงานอยู่ใน client-side หรือไม่
    if (process.client) {
      const token = localStorage.getItem('token')
      if (token) {
        // ถ้ามี token ให้ redirect ไปยังหน้า home
        this.$router.push({ name: 'home' })
      }
    }
  },
  methods: {
    async login () {
      try {
        const response = await axios.post('http://localhost:8000/user/login', {
          UserName: this.username,
          Password: this.password
        })

        // ตรวจสอบว่ามี token และข้อมูลผู้ใช้หรือไม่
        if (response.data.status === 'success' && response.data.token) {
          localStorage.setItem('token', response.data.token)
          const result = Array.isArray(response.data.result) ? response.data.result : [response.data.result] // เช็คว่า result เป็น array หรือไม่

          // ล็อก Role ของผู้ใช้
          // console.log('Userผ Role:', result[0].Role) // ล็อก Role ของผู้ใช้
          localStorage.setItem('role', result[0].Role)

          this.$router.push({ name: 'home' })
        } else {
          // หากไม่สำเร็จให้แสดงข้อความผิดพลาด
          this.errorMessage =
            response.data.message || 'Username หรือ Password ไม่ถูกต้อง'
        }
      } catch (error) {
        // หากมีการตอบกลับผิดพลาดจาก server
        if (error.response) {
          // ตรวจสอบ response status
          if (error.response.status === 401) {
            this.errorMessage = 'Username หรือ Password ไม่ถูกต้อง'
          } else {
            this.errorMessage = 'เกิดข้อผิดพลาดขณะเข้าสู่ระบบ กรุณาลองอีกครั้ง'
          }
        } else {
          this.errorMessage = 'เกิดข้อผิดพลาดขณะเข้าสู่ระบบ กรุณาลองอีกครั้ง'
        }
      }
    },

    // เพิ่มเมธอดสำหรับไปยังหน้า Register
    goToRegister () {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.login-box {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3;
}

/* ปุ่ม Register */
.register-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-button:hover {
  background-color: #218838;
}

.error {
  color: white;
  margin-top: 1rem;
  font-weight: bold;
}
</style>
