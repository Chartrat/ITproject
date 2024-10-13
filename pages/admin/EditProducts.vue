<template>
  <div>
    <AppHeader />

    <v-container>
      <v-card>
        <v-card-title>
          <h2>Edit Products</h2>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="products"
            item-key="id"
            class="elevation-1"
          >
            <!-- ใช้ v-slot:item สำหรับจัดการการแสดงข้อมูลภายในตาราง -->
            <template #item="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.category }}</td>
                <td>
                  <!-- ปุ่มแก้ไขผลิตภัณฑ์ -->
                  <v-btn icon color="blue" @click="editProduct(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <!-- ปุ่มยืนยันการลบผลิตภัณฑ์ -->
                  <v-btn icon color="red" @click="confirmDeleteProduct(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-btn color="primary" class="mt-4" @click="openAddProductDialog">
            Add Product
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- Dialog สำหรับเพิ่มหรือแก้ไขผลิตภัณฑ์ -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <h2>{{ editMode ? "Edit Product" : "Add Product" }}</h2>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="currentProduct.name"
                label="Product Name"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                v-model="currentProduct.description"
                label="Description"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                v-model="currentProduct.price"
                label="Price"
                :rules="[rules.price]"
                required
              />
              <v-select
                v-model="currentProduct.category"
                :items="categories"
                label="Category"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                v-model="currentProduct.image_url"
                label="Image URL"
                :rules="[rules.url]"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="saveProduct">
              {{ editMode ? "Update" : "Add" }}
            </v-btn>
            <v-btn @click="dialog = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog ยืนยันการลบผลิตภัณฑ์ -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title>Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete {{ currentProduct.name }}?
          </v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" @click="deleteDialog = false">
              Cancel
            </v-btn>
            <v-btn color="red darken-1" @click="deleteProduct(currentProduct)">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue'

export default {
  components: { AppHeader },
  layout: 'blank',

  data () {
    return {
      valid: false,
      dialog: false,
      deleteDialog: false, // สำหรับ dialog ยืนยันการลบ
      editMode: false,
      currentProduct: {
        product_id: null,
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: ''
      },
      products: [], // รายการผลิตภัณฑ์ที่ได้จากเซิร์ฟเวอร์
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Price', value: 'price' },
        { text: 'Category', value: 'category' },
        { text: 'Actions', value: 'actions', sortable: false } // ใช้ slot สำหรับ actions
      ],
      rules: {
        required: value => !!value || 'Required.',
        price: value => (value && !isNaN(value)) || 'Must be a number.',
        url: value => !value || /^https?:\/\//.test(value) || 'Invalid URL.'
      },
      categories: ['Electronics', 'Clothing', 'Furniture'] // ตัวอย่างหมวดหมู่สินค้า
    }
  },
  mounted () {
    this.fetchProducts() // ดึงรายการผลิตภัณฑ์เมื่อ component ถูก mount
  },
  methods: {
    async fetchProducts () {
      // แทนที่ด้วย API ของคุณเพื่อดึงข้อมูลผลิตภัณฑ์
      const response = await this.$axios.get('http://localhost:8000/products/')
      console.log(response.data)
      this.products = response.data.result // สมมุติว่า response คือ array ของผลิตภัณฑ์
    },
    openAddProductDialog () {
      // รีเซ็ตข้อมูลผลิตภัณฑ์และเปลี่ยนโหมดเป็นการเพิ่ม
      this.currentProduct = {
        product_id: '',
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: ''
      }
      this.editMode = false // ตั้งค่าโหมดเป็นการเพิ่มผลิตภัณฑ์
      this.dialog = true // เปิด dialog
    },
    editProduct (item) {
      this.currentProduct = { ...item }
      this.editMode = true
      this.dialog = true
    },
    confirmDeleteProduct (item) {
      this.currentProduct = item
      this.deleteDialog = true // เปิด dialog ยืนยันการลบ
    },
    async deleteProduct (item) {
      // แทนที่ด้วย API ของคุณสำหรับการลบผลิตภัณฑ์
      await this.$axios.delete(
        `http://localhost:8000/products/DeleteProduct/${item.product_id}`
      )
      this.deleteDialog = false // ปิด dialog การลบ
      this.fetchProducts() // โหลดข้อมูลใหม่
    },
    async saveProduct () {
      if (this.$refs.form.validate()) {
        try {
          if (this.editMode) {
            // แก้ไขข้อมูลผลิตภัณฑ์ที่มีอยู่
            console.log(this.currentProduct.id)
            await this.$axios.put(
              `http://localhost:8000/products/UpdateProducts/${this.currentProduct.product_id}`,
              this.currentProduct
            )
          } else {
            // เพิ่มผลิตภัณฑ์ใหม่
            await this.$axios.post(
              'http://localhost:8000/products/CreateProducts',
              this.currentProduct
            )
          }
          this.dialog = false // ปิด dialog
          this.fetchProducts() // โหลดข้อมูลใหม่
        } catch (error) {
          console.error('Error saving product:', error)
        }
      }
    }
  }
}
</script>

<style scoped>
/* ปรับแต่งสไตล์เพิ่มเติมตามต้องการ */
</style>
