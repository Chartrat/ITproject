<template>
  <div>
    <AppHeader />

    <v-container>
      <v-card class="elevation-2 mb-5">
        <v-card-title class="text-h5">
          จัดการผลิตภัณฑ์
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="products"
            item-key="id"
            class="elevation-1"
            dense
            hide-default-footer
          >
            <template #item="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.price }}</td>
                <td>{{ getCategoryName(item.category_id) }}</td>
                <td class="text-right">
                  <v-btn icon color="primary" @click="editProduct(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="red darken-2"
                    @click="confirmDeleteProduct(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
          <div class="text-right mt-3">
            <v-btn color="success" dark @click="openAddProductDialog">
              เพิ่มผลิตภัณฑ์
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Dialog สำหรับเพิ่มหรือแก้ไขผลิตภัณฑ์ -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title class="text-h5">
            {{ editMode ? "แก้ไขผลิตภัณฑ์" : "เพิ่มผลิตภัณฑ์" }}
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="currentProduct.name"
                label="ชื่อผลิตภัณฑ์"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                v-model="currentProduct.description"
                label="คำอธิบาย"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                v-model="currentProduct.price"
                label="ราคา"
                :rules="[rules.price]"
                required
              />
              <!-- เลือกหมวดหมู่ย่อย -->
              <v-select
                v-model="currentProduct.category_id"
                :items="subCategories"
                item-text="name"
                item-value="category_id"
                label="หมวดหมู่ย่อย"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                v-model="currentProduct.image_url"
                label="URL ของรูปภาพ"
                :rules="[rules.url]"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              :disabled="!valid"
              @click="saveProduct"
            >
              {{ editMode ? "แก้ไข" : "เพิ่ม" }}
            </v-btn>
            <v-btn color="grey darken-1" @click="dialog = false">
              ยกเลิก
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog ยืนยันการลบผลิตภัณฑ์ -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="text-h5">
            ยืนยันการลบ
          </v-card-title>
          <v-card-text>
            คุณแน่ใจหรือไม่ว่าต้องการลบผลิตภัณฑ์ {{ currentProduct.name }}?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green darken-1" @click="deleteDialog = false">
              ยกเลิก
            </v-btn>
            <v-btn color="red darken-1" @click="deleteProduct(currentProduct)">
              ลบ
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
      deleteDialog: false,
      editMode: false,
      currentProduct: {
        product_id: null,
        name: '',
        description: '',
        price: '',
        category_id: null,
        image_url: ''
      },
      products: [],
      headers: [
        { text: 'ชื่อผลิตภัณฑ์', value: 'name' },
        { text: 'คำอธิบาย', value: 'description' },
        { text: 'ราคา', value: 'price' },
        { text: 'หมวดหมู่', value: 'category_id' },
        { text: 'จัดการ', value: 'actions', sortable: false }
      ],
      rules: {
        required: value => !!value || 'ต้องระบุ.',
        price: value => (value && !isNaN(value)) || 'ต้องเป็นตัวเลข.',
        url: value => !value || /^https?:\/\//.test(value) || 'URL ไม่ถูกต้อง.'
      },
      subCategories: [] // เก็บหมวดหมู่ย่อยทั้งหมด
    }
  },
  mounted () {
    this.fetchProducts()
    this.fetchCategories()
  },
  methods: {
    async fetchProducts () {
      const response = await this.$axios.get('http://localhost:8000/products/')
      this.products = response.data.result
    },
    async fetchCategories () {
      const response = await this.$axios.get(
        'http://localhost:8000/categories/categories'
      )
      // กรองเฉพาะหมวดหมู่ย่อยที่มี parent_id ไม่เป็น null
      this.subCategories = response.data.result.filter(
        c => c.parent_id !== null
      )
    },
    getCategoryName (categoryId) {
      const category = this.subCategories.find(
        c => c.category_id === categoryId
      )
      return category ? category.name : 'ไม่ทราบหมวดหมู่'
    },
    openAddProductDialog () {
      this.currentProduct = {
        product_id: '',
        name: '',
        description: '',
        price: '',
        category_id: null,
        image_url: ''
      }
      this.editMode = false
      this.dialog = true
    },
    editProduct (item) {
      this.currentProduct = { ...item }
      this.editMode = true
      this.dialog = true
    },
    confirmDeleteProduct (item) {
      this.currentProduct = item
      this.deleteDialog = true
    },
    async deleteProduct (item) {
      await this.$axios.delete(
        `http://localhost:8000/products/DeleteProduct/${item.product_id}`
      )
      this.deleteDialog = false
      this.fetchProducts()
    },
    async saveProduct () {
      if (this.$refs.form.validate()) {
        if (this.editMode) {
          await this.$axios.put(
            `http://localhost:8000/products/UpdateProducts/${this.currentProduct.product_id}`,
            this.currentProduct
          )
        } else {
          await this.$axios.post(
            'http://localhost:8000/products/CreateProducts',
            this.currentProduct
          )
        }
        this.dialog = false
        this.fetchProducts()
      }
    }
  }
}
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
  color: #4a4a4a;
}

.v-card-text {
  font-size: 16px;
}

.v-btn {
  margin-right: 8px;
}

.v-data-table {
  background-color: #f9f9f9;
}

.v-dialog {
  border-radius: 10px;
}

.v-card-actions {
  justify-content: flex-end;
}
</style>
