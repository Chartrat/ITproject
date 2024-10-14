<template>
  <div class="register-container">
    <div class="register-box">
      <h2>สมัครสมาชิก</h2>
      <form @submit.prevent="register">
        <div class="input-group">
          <div class="column">
            <label for="username">ชื่อผู้ใช้:</label>
            <input
              v-model="username"
              type="text"
              required
              placeholder="กรอกชื่อผู้ใช้"
            >
          </div>
          <div class="column">
            <label for="password">รหัสผ่าน:</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="กรอกรหัสผ่าน"
            >
          </div>
        </div>
        <div class="input-group">
          <div class="column">
            <label for="email">อีเมล:</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="กรอกอีเมล"
            >
          </div>
          <div class="column">
            <label for="firstName">ชื่อ:</label>
            <input
              v-model="firstName"
              type="text"
              required
              placeholder="กรอกชื่อ"
            >
          </div>
        </div>
        <div class="input-group">
          <div class="column">
            <label for="lastName">นามสกุล:</label>
            <input
              v-model="lastName"
              type="text"
              required
              placeholder="กรอกนามสกุล"
            >
          </div>
          <div class="column">
            <label for="address">ที่อยู่:</label>
            <input
              v-model="address"
              type="text"
              required
              placeholder="กรอกที่อยู่"
            >
          </div>
        </div>
        <div class="input-group">
          <div class="column">
            <label for="phoneNumber">เบอร์โทรศัพท์:</label>
            <input
              v-model="phoneNumber"
              type="text"
              required
              placeholder="กรอกเบอร์โทรศัพท์"
            >
          </div>
        </div>
        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
        <button type="submit" class="register-button">
          สมัครสมาชิก
        </button>
      </form>

      <!-- ปุ่ม Back to Login -->
      <button class="back-button" @click="goToLogin">
        กลับสู่หน้าล็อกอิน
      </button>

      <!-- การแจ้งเตือนหลังการลงทะเบียน -->
      <div v-if="successMessage" class="modal-overlay">
        <div class="modal">
          <p>{{ successMessage }}</p>
          <button class="confirm-button" @click="goToLogin">
            เข้าสู่หน้าล็อกอิน
          </button>
        </div>
      </div>
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
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
      errorMessage: '',
      successMessage: '' // เพิ่มการแสดงข้อความสำเร็จ
    }
  },
  methods: {
    async register () {
      try {
        const response = await axios.post(
          'http://localhost:8000/user/CreateUser',
          {
            UserName: this.username,
            Password: this.password,
            email: this.email,
            Status: 'Active',
            Role: 'user',
            first_name: this.firstName,
            last_name: this.lastName,
            address: this.address,
            phone_number: this.phoneNumber
          }
        )

        if (response.data.code === 1) {
          this.successMessage =
            'สมัครสมาชิกสำเร็จ! คุณจะถูกเปลี่ยนหน้าไปยังหน้าล็อกอิน'
        } else {
          this.errorMessage = 'การสมัครไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
        }
      } catch (error) {
        console.error(error)
        this.errorMessage = 'ชื่อผู้ใช้หรืออีเมลมีอยู่แล้ว กรุณาเลือกอันใหม่'
      }
    },
    goToLogin () {
      this.$router.push('/user/login')
    }
  }
}
</script>

<style scoped>
/* พื้นหลังแบบ gradient เพื่อความหรูหรา */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6b8cff, #b8d3ff);
  padding: 20px;
  box-sizing: border-box;
}

/* กล่องสมัครสมาชิก */
.register-box {
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;
  position: relative;
}

h2 {
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
}

.input-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.column {
  flex: 1;
  margin: 0 10px;
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

/* ปุ่มสมัครสมาชิก */
.register-button {
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

.register-button:hover {
  background-color: #4c66cc;
  box-shadow: 0 8px 20px rgba(107, 140, 255, 0.5);
}

/* ปุ่ม Back to Login */
.back-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.back-button:hover {
  background-color: #5a6268;
  box-shadow: 0 8px 20px rgba(108, 117, 125, 0.5);
}

/* ข้อความผิดพลาด */
.error {
  color: red;
  margin-top: 1rem;
  font-weight: bold;
}

/* การแจ้งเตือนสำเร็จ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
}

.confirm-button {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.confirm-button:hover {
  background-color: #0056b3;
}

@media (max-width: 600px) {
  .register-box {
    padding: 1.5rem;
    max-width: 90%;
  }

  h2 {
    font-size: 1.8rem;
  }

  input {
    padding: 0.65rem;
  }

  .register-button,
  .back-button {
    font-size: 1rem;
  }
}
</style>
