<template>
  <div class="login-container">
    <div class="login-box">
      <h2>เข้าสู่ระบบ</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="username">ชื่อผู้ใช้:</label>
          <input
            v-model="username"
            type="text"
            required
            placeholder="กรอกชื่อผู้ใช้"
          >
        </div>
        <div class="input-group">
          <label for="password">รหัสผ่าน:</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="กรอกรหัสผ่าน"
          >
        </div>
        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
        <button type="submit" class="login-button">
          เข้าสู่ระบบ
        </button>
      </form>
      <button class="register-button" @click="goToRegister">
        สมัครสมาชิก
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
    if (process.client) {
      const token = localStorage.getItem('token')
      if (token) {
        this.$router.push('/')
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

        if (response.data.status === 'success' && response.data.token) {
          localStorage.setItem('token', response.data.token)
          const result = Array.isArray(response.data.result)
            ? response.data.result
            : [response.data.result]
          localStorage.setItem('role', result[0].Role)
          this.$router.push('/')
        } else {
          this.errorMessage =
            response.data.message || 'Username หรือ Password ไม่ถูกต้อง'
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Username หรือ Password ไม่ถูกต้อง'
        } else {
          this.errorMessage = 'เกิดข้อผิดพลาดขณะเข้าสู่ระบบ กรุณาลองอีกครั้ง'
        }
      }
    },
    goToRegister () {
      this.$router.push('/user/register')
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
  background: linear-gradient(135deg, #6b8cff, #b8d3ff);
}

.login-box {
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
}

h2 {
  font-family: "Kanit", sans-serif;
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
}

.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #f9f9f9;
}

input:focus {
  border-color: #6b8cff;
  box-shadow: 0 0 10px rgba(107, 140, 255, 0.2);
  outline: none;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #6b8cff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.login-button:hover {
  background-color: #4c66cc;
  box-shadow: 0 8px 20px rgba(107, 140, 255, 0.5);
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.register-button:hover {
  background-color: #218838;
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.5);
}

.error {
  color: white;
  margin-top: 1rem;
  font-weight: bold;
}

@media (max-width: 600px) {
  .login-box {
    padding: 1.5rem;
    max-width: 90%;
  }

  h2 {
    font-size: 1.8rem;
  }

  input {
    padding: 0.65rem;
  }

  .login-button,
  .register-button {
    font-size: 1rem;
  }
}
</style>
