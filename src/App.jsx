import { useRef, useState } from 'react'
import styles from './App.module.css'
import { Chat } from './components/Chat/Chat'
import { Controls } from './components/Controls/Controls'
import { Assistant as Gemini } from './assistants/googleai'
import { Assistant as OpenAi } from './assistants/openai'

function App() {
  const selectedAi = useRef();
  const geminiAssistant = new Gemini()
  const openAiAssistant = new OpenAi()
  const WELCOME_MESSAGE = {
    role: 'assistant',
    content: 'Hello! How can I assist you right now?',
  }

  const [messages, setMessages] = useState([WELCOME_MESSAGE])

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  async function handleGeminiContentSend(content) {
    addMessage({ content: content, role: 'user' })
    try {
      const result = await geminiAssistant.chat(content)
      addMessage({ content: result, role: 'assistant' });
    } catch (error) {
      console.error(error)
      addMessage({ content: "Sorry I couldn't process your request. please try again.", role: 'system' });
    }
  }

  async function handleOpenAiContentSend(content) {
    addMessage({ content: content, role: 'user' })
    try {
      const result = await openAiAssistant.chat(content, messages)
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
        <h2 className={styles.Title}>AI Chatbot
        </h2>
        <select className={styles.AiSelection} ref={selectedAi}>
          <option value="Gemini">Gemini</option>
          <option value="OpenAI">OpenAI</option>
          <option value="D-seek">Deep-seek</option>
        </select>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls onSend={(content) => {
        const ai = selectedAi.current.value
        if (ai === 'Gemini') {
          handleGeminiContentSend(content)
        } else if (ai === 'OpenAI') {
          handleOpenAiContentSend(content)
        }
      }} />
    </div>
  )
}
export default App
