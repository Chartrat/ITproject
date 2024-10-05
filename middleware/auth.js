export default function ({ redirect }) {
  if (process.client) { // เช็คว่ารันในฝั่ง client
    const token = localStorage.getItem('token')
    if (!token) {
      return redirect('/login') // ถ้าไม่มี token redirect ไปหน้า login
    }
  }
}
