<template>
  <div>
    <AppHeader />
    <v-container>
      <v-card>
        <v-card-title>
          <h2>Orders</h2>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="orders"
            item-key="id"
            class="elevation-1"
          />
        </v-card-text>
      </v-card>
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
      paymentDialog: false,
      selectedPaymentProof: '',
      orders: [], // This will hold the list of orders fetched from the server
      headers: [
        { text: 'Buyer Name', value: 'buyerName' },
        { text: 'Purchased Items', value: 'items' },
        { text: 'Payment Proof', value: 'paymentProof', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  mounted () {
    this.fetchOrders() // Fetch orders when the component mounts
  },
  methods: {
    async fetchOrders () {
      // Replace with your API call to fetch orders
      const response = await this.$http.get('/orders/getOrders')
      this.orders = response.data // Assume the response data is an array of orders
    },
    viewPaymentProof (item) {
      this.selectedPaymentProof = item.paymentProof // URL or path to the payment proof image
      this.paymentDialog = true
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
