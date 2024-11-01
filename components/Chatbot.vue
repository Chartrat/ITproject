<template>
  <div>
    <button class="chat-toggle-btn" @click="toggleChatbot">
      <i class="fas fa-comments" />
    </button>
    <div v-if="isChatOpen" class="chat-popup">
      <div class="chat-header">
        <h2>Chatbot</h2>
        <button class="close-btn" @click="toggleChatbot">
          X
        </button>
      </div>
      <div class="chat-window">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="{
            'user-message': message.sender === 'User',
            'bot-message': message.sender === 'Bot',
          }"
        >
          <p>{{ message.text }}</p>
          <div v-if="message.sender === 'Bot' && message.options">
            <div class="options-container">
              <button
                v-for="(option, index) in message.options"
                :key="index"
                class="option-button"
                @click="selectOption(option)"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="input-container">
        <input
          v-model="userInput"
          placeholder="พิมพ์ข้อความของคุณที่นี่..."
          @keyup.enter="sendMessage"
        >
        <button @click="sendMessage">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userInput: '',
      messages: [],
      isChatOpen: false,
      awaitingOptions: false,
      isError: false, // ตัวแปรเพื่อติดตามสถานะข้อผิดพลาด
      isAdminContact: false // ตัวแปรเพื่อติดตามการติดต่อแอดมิน
    }
  },
  methods: {
    sendMessage () {
      if (this.userInput.trim() === '') {
        return
      }

      this.messages.push({ sender: 'User', text: this.userInput })

      const response = this.getBotResponse(this.userInput)
      this.messages.push(response)

      this.userInput = '' // ล้างกล่องข้อความหลังส่ง

      // ตรวจสอบเงื่อนไขให้บอทแสดงตัวเลือกเฉพาะบางกรณี
      if (response.showOptions && !response.disableOptions) {
        this.awaitingOptions = true
        this.messages.push({
          sender: 'Bot',
          text: 'คุณต้องการทำอะไรต่อ?',
          options: ['สอบถามข้อมูล', 'ติดต่อแอดมิน', 'tracking']
        })
      } else {
        this.awaitingOptions = false
      }

      // เรียกใช้งานฟังก์ชันเพื่อเลื่อนหน้าต่างไปที่ข้อความล่าสุด
      this.scrollToBottom()
    },
    selectOption (option) {
      this.messages.push({ sender: 'User', text: option })

      const response = this.getBotResponse(option)
      this.messages.push(response)

      // ตรวจสอบเงื่อนไขในการแสดงตัวเลือกในข้อความตอบกลับ
      if (response.showOptions && !response.disableOptions) {
        this.awaitingOptions = true
        this.messages.push({
          sender: 'Bot',
          text: 'คุณต้องการทำอะไรต่อ?',
          options: ['สอบถามข้อมูล', 'ติดต่อแอดมิน', 'tracking']
        })
      } else {
        this.awaitingOptions = false
      }

      // เรียกใช้งานฟังก์ชันเพื่อเลื่อนหน้าต่างไปที่ข้อความล่าสุด
      this.scrollToBottom()
    },
    scrollToBottom () {
      this.$nextTick(() => {
        const chatWindow = this.$el.querySelector('.chat-window')
        chatWindow.scrollTop = chatWindow.scrollHeight
      })
    },
    getBotResponse (input) {
      if (input === 'สอบถามข้อมูล') {
        return {
          sender: 'Bot',
          text: 'คุณต้องการสอบถามข้อมูลเกี่ยวกับอะไร?',
          options: ['เวลาเปิดทำการ', 'สถานที่ตั้งร้าน'],
          showOptions: false
        }
      } else if (input === 'ติดต่อแอดมิน') {
        this.isAdminContact = true // ตั้งค่าให้เข้าสู่โหมดการติดต่อแอดมิน
        return {
          sender: 'Bot',
          text: 'สวัสดีครับ ห้าง Master Home ยินดีให้บริการครับ หากคุณต้องการข้อมูลเพิ่มเติม บอกกับทางเราได้เลยนะครับ',
          options: null,
          showOptions: true,
          disableOptions: true // ไม่แสดงตัวเลือกต่อ
        }
      } else if (this.isAdminContact) {
        // ถ้าอยู่ในโหมดการติดต่อแอดมิน
        if (input === 'ไม่') {
          return {
            sender: 'Bot',
            text: 'ขอบคุณที่ใช้บริการครับ',
            options: null,
            showOptions: false,
            disableOptions: true
          }
        } else {
          // แสดงข้อมูลเพิ่มเติมเกี่ยวกับบริการ
          this.messages.push({
            sender: 'Bot',
            text: 'ห้าง Master Home จำหน่ายสินค้าหลากหลายประเภท เช่น เฟอร์นิเจอร์, เครื่องใช้ไฟฟ้า และของตกแต่งบ้าน',
            options: null,
            showOptions: false
          })

          return {
            sender: 'Bot',
            text: 'หากมีคำถามเพิ่มเติม แจ้งได้เลยครับ',
            options: null,
            showOptions: false,
            disableOptions: true
          }
        }
      } else if (input === 'เวลาเปิดทำการ') {
        return {
          sender: 'Bot',
          text: 'เปิดทุกวัน 09.00 - 21.00 น.',
          options: null,
          showOptions: true
        }
      } else if (input === 'สถานที่ตั้งร้าน') {
        return {
          sender: 'Bot',
          text: 'มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน',
          options: null,
          showOptions: true
        }
      } else {
        // หากข้อความไม่เข้าเงื่อนไขที่กำหนด
        // eslint-disable-next-line no-lonely-if
        if (this.isError) {
          if (input === 'ไม่') {
            return {
              sender: 'Bot',
              text: 'ขอบคุณที่ใช้บริการครับ',
              options: null,
              showOptions: false,
              disableOptions: true
            }
          } else {
            // แสดงข้อความไม่เข้าใจและให้ตัวเลือกติดต่อแอดมิน
            return {
              sender: 'Bot',
              text: 'ขอโทษครับ ฉันไม่เข้าใจสิ่งที่คุณพูด กรุณาอธิบายใหม่อีกครั้ง!',
              options: ['ติดต่อแอดมิน'], // แสดงเฉพาะตัวเลือกนี้
              showOptions: true,
              disableOptions: true // ไม่แสดงตัวเลือกอื่น
            }
          }
        } else {
          this.isError = true // ตั้งค่าเป็นข้อผิดพลาด
          return {
            sender: 'Bot',
            text: 'ขอโทษครับ ฉันไม่เข้าใจสิ่งที่คุณพูด กรุณาอธิบายใหม่อีกครั้ง!',
            options: ['ติดต่อแอดมิน'], // แสดงเฉพาะตัวเลือกนี้
            showOptions: true,
            disableOptions: true // ไม่แสดงตัวเลือกอื่น
          }
        }
      }
    },
    toggleChatbot () {
      this.isChatOpen = !this.isChatOpen
      if (this.isChatOpen) {
        this.messages = []
        this.messages.push({
          sender: 'Bot',
          text: 'สวัสดี มีอะไรให้เราช่วย?',
          options: ['สอบถามข้อมูล', 'ติดต่อแอดมิน', 'tracking'],
          showOptions: true
        })
        this.awaitingOptions = true
      } else {
        this.messages = []
      }
    }
  }
}
</script>

<style scoped>
.chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #009688;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
}

.chat-popup {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 350px;
  border-radius: 10px;
  background-color: #1f1f1f;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #009688;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.chat-window {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  flex-grow: 1;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 15px;
  display: block;
  word-wrap: break-word;
  color: white;
}

.user-message {
  background-color: #4a90e2;
  align-self: flex-end;
  margin-left: auto;
  text-align: right;
  padding: 8px;
  border-radius: 15px;
  max-width: fit-content;
  display: block;
}

.bot-message {
  background-color: #2c2c2c;
  align-self: flex-start;
  padding: 8px;
  border-radius: 15px;
  max-width: fit-content;
  display: block;
}

.options-container {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
}

.input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #333;
}

input {
  width: calc(100% - 70px);
  padding: 8px;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #333;
  background-color: #333;
  color: white;
}

button {
  background-color: #009688;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
}

button:hover {
  background-color: #00796b;
}

.close-btn {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.option-button {
  margin: 5px 0;
  background-color: #333;
  color: white;
  border: 1px solid #555;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
}

.option-button:hover {
  background-color: #555;
}
</style>
