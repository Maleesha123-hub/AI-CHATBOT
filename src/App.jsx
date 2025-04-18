import { useState } from 'react'
import styles from './App.module.css'
import { Chat } from './components/Chat/Chat'
import { Controls } from './components/Controls/Controls'
import { Assistant } from './assistants/googleai'

function App() {
  const assistant = new Assistant()
  const WELCOME_MESSAGE = {
    role: 'assistant',
    content: 'Hello! How can I assist you right now?',
  }

  const [messages, setMessages] = useState([WELCOME_MESSAGE])

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  async function handleContentSend(content) {
    addMessage({ content: content, role: 'user' })
    try {
      const result = await assistant.chat(content)
      addMessage({ content: result, role: 'assistant' });
    } catch (error) {
      console.error(error)
      addMessage({ content: "Sorry I couldn't process your request. please try again.", role: 'system' });
    }
  }

  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls onSend={handleContentSend} />
    </div>
  )
}
export default App
