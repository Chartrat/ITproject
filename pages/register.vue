<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="input-group">
          <div class="column">
            <label for="username">Username:</label>
            <input v-model="username" type="text" required>
          </div>
          <div class="column">
            <label for="password">Password:</label>
            <input v-model="password" type="password" required>
          </div>
        </div>
        <div class="input-group">
          <div class="column">
            <label for="email">Email:</label>
            <input v-model="email" type="email" required>
          </div>
          <div class="column">
            <label for="firstName">First Name:</label>
            <input v-model="firstName" type="text" required>
          </div>
        </div>
        <div class="input-group">
          <div class="column">
            <label for="lastName">Last Name:</label>
            <input v-model="lastName" type="text" required>
          </div>
          <div class="column">
            <label for="address">Address:</label>
            <input v-model="address" type="text" required>
          </div>
        </div>
        <div class="input-group">
          <div class="column">
            <label for="phoneNumber">Phone Number:</label>
            <input v-model="phoneNumber" type="text" required>
          </div>
        </div>
        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
        <button type="submit" class="register-button">
          Register
        </button>
      </form>

      <!-- ปุ่ม Back to Login -->
      <button class="back-button" @click="goToLogin">
        Back to Login
      </button>

      <!-- การแจ้งเตือนหลังการลงทะเบียน -->
      <div v-if="successMessage" class="modal-overlay">
        <div class="modal">
          <p>{{ successMessage }}</p>
          <button @click="goToLogin" class="confirm-button">Go to Login</button>
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
          this.successMessage = 'Register successful! You will be redirected to the login page.'
        } else {
          this.errorMessage = 'Register failed. Please try again.'
        }
      } catch (error) {
        console.error(error)
        this.errorMessage = 'Username or Email already exists. Please choose another one.'
      }
    },
    goToLogin () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
/* ส่วนเดิม */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
  padding: 20px;
  box-sizing: border-box;
}

.register-box {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;
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

.register-button {
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

.register-button:hover {
  background-color: #0056b3;
}

/* ปุ่ม Back to Login */
.back-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #5a6268;
}

/* ข้อความผิดพลาด */
.error {
  color: white;
  margin-top: 1rem;
  font-weight: bold;
}

/* การแจ้งเตือน */
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
</style>
