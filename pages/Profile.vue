<template>
  <div>
    <AppHeader />
    <div class="profile">
      <h1>Profile</h1>
      <div v-if="loading">
        Loading...
      </div>
      <div v-else>
        <h2>User Information</h2>
        <div class="info-block">
          <p>
            <strong>Username:</strong>
            <input v-model="user.UserName" :readonly="!editingField.userName">
          </p>
        </div>

        <div class="info-block">
          <p>
            <strong>Status:</strong>
            <input v-model="user.Status" :readonly="!editingField.status">
          </p>
        </div>

        <div class="info-block">
          <p>
            <strong>Role:</strong>
            <input v-model="user.Role" :readonly="!editingField.role">
          </p>
        </div>

        <h2>Customer Information</h2>

        <div class="info-block">
          <p>
            <strong>First Name:</strong>
            <input
              v-model="customer.first_name"
              :readonly="!editingField.firstName"
            >
            <button class="edit-btn" @click="toggleEdit('firstName')">
              {{ editingField.firstName ? "Save" : "Edit" }}
            </button>
          </p>
        </div>

        <div class="info-block">
          <p>
            <strong>Last Name:</strong>
            <input
              v-model="customer.last_name"
              :readonly="!editingField.lastName"
            >
            <button class="edit-btn" @click="toggleEdit('lastName')">
              {{ editingField.lastName ? "Save" : "Edit" }}
            </button>
          </p>
        </div>

        <div class="info-block">
          <p>
            <strong>Email:</strong>
            <input v-model="customer.email" :readonly="!editingField.email">
            <button class="edit-btn" @click="toggleEdit('email')">
              {{ editingField.email ? "Save" : "Edit" }}
            </button>
          </p>
        </div>

        <div class="info-block">
          <p>
            <strong>Address:</strong>
            <input
              v-model="customer.address"
              :readonly="!editingField.address"
            >
            <button class="edit-btn" @click="toggleEdit('address')">
              {{ editingField.address ? "Save" : "Edit" }}
            </button>
          </p>
        </div>

        <div class="info-block">
          <p>
            <strong>Phone Number:</strong>
            <input
              v-model="customer.phone_number"
              :readonly="!editingField.phoneNumber"
            >
            <button class="edit-btn" @click="toggleEdit('phoneNumber')">
              {{ editingField.phoneNumber ? "Save" : "Edit" }}
            </button>
          </p>
        </div>

        <!-- Logout Button -->
        <button class="logout-btn" @click="logout">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import AppHeader from '~/components/AppHeader.vue'

export default {
  components: { AppHeader },
  layout: 'blank',

  data () {
    return {
      loading: true,
      user: {},
      customer: {},
      editingField: {
        userName: false,
        status: false,
        role: false,
        firstName: false,
        lastName: false,
        email: false,
        address: false,
        phoneNumber: false
      }
    }
  },
  created () {
    this.fetchProfileData()
  },

  methods: {
    toggleEdit (field) {
      if (this.editingField[field]) {
        this.saveChanges(field)
      }
      this.editingField[field] = !this.editingField[field]
    },
    async saveChanges (field) {
      try {
        const token = localStorage.getItem('token')
        const UserID = this.getUserIdFromToken(token)
        if (field in this.user) {
          await axios.put(
            `http://localhost:8000/user/updateUser/${UserID}`,
            this.user,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        } else if (field in this.customer) {
          await axios.put(
            `http://localhost:8000/user/updateCustomer/${UserID}`,
            this.customer,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        }
      } catch (error) {
        console.error('Error saving changes:', error)
      }
    },
    getUserIdFromToken (token) {
      const payload = token.split('.')[1]
      const decodedPayload = JSON.parse(atob(payload))

      if (decodedPayload && decodedPayload[0]) {
        return decodedPayload[0].UserID
      }

      return null
    },
    async fetchProfileData () {
      try {
        const token = localStorage.getItem('token')
        const UserID = this.getUserIdFromToken(token)

        if (!UserID) {
          console.error('UserID is undefined or null')
          return
        }

        const response = await axios.get(
          `http://localhost:8000/user/getCustomerAndUser/${UserID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.data.status === 'success') {
          this.user = response.data.result.user || {}
          this.customer = response.data.result.customer || {}
        } else {
          console.error('Failed to fetch profile data:', response.data.message)
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      } finally {
        this.loading = false
      }
    },
    logout () {
      localStorage.removeItem('token')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.profile {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 600px;
  margin: 20px auto;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
  text-align: center;
  color: #333;
}

.info-block {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

p {
  margin: 0;
  color: #555;
  display: flex;
  align-items: center;
  width: 100%;
}

strong {
  color: #000;
  width: 30%;
  min-width: 100px; /* กำหนดความกว้างขั้นต่ำให้กับข้อความ */
}

input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  width: 50%;
  margin-right: 10px; /* เพิ่มระยะห่างระหว่าง input กับปุ่ม */
}

input[readonly] {
  background-color: #f3f3f3;
  color: #888;
}

.edit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  flex-shrink: 0; /* ป้องกันปุ่มถูกบีบ */
}

.edit-btn:hover {
  background-color: #0056b3;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  margin-top: 20px;
  display: block;
  width: 100%;
  cursor: pointer;
  text-align: center;
}

.logout-btn:hover {
  background-color: #c82333;
}

@media (max-width: 600px) {
  .profile {
    padding: 10px;
    max-width: 100%;
  }

  input {
    width: 100%;
  }

  .edit-btn {
    margin-top: 10px;
    width: 100%;
  }
}
</style>
