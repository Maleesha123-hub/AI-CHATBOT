
import { Assistant as Gemini } from './assistants/googleai'
import { Assistant as OpenAi } from './assistants/openai'
import { Assistant as DeepSeekAi } from './assistants/deepSeekai'
import { Loader } from './components/Loader/Loader'
import { useRef, useState } from 'react'
import styles from './App.module.css'
import { Chat } from './components/Chat/Chat'
import { Controls } from './components/Controls/Controls'

function App() {
  const selectedAi = useRef(null);
  const geminiAssistant = new Gemini();
  const openAiAssistant = new OpenAi();
  const deepSeekAiAssistant = new DeepSeekAi();

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  function updateLastMessageContent(content) {
    setMessages((prevMessages) => prevMessages.map((newMessage, index) =>
      index === prevMessages.length - 1 ? { ...newMessage, content: `${newMessage.content}${content}` }
        : newMessage
    ))
  }

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  async function handleGeminiContentSend(content) {
    addMessage({ content: content, role: 'user' })
    setIsLoading(true)
    try {
      const result = geminiAssistant.chatStream(content)
      let isFirstChunk = false;

      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: result, role: 'assistant' });
          setIsLoading(false)
          setIsStreaming(true)
        }
        updateLastMessageContent(chunk)
      }

    } catch (error) {
      console.error(error)
      addMessage({ content: "Sorry I couldn't process your request. please try again.", role: 'system' });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  async function handleOpenAiContentSend(content) {
    addMessage({ content: content, role: 'user' })
    setIsLoading(true)
    try {
      const result = openAiAssistant.chatStream(content, messages)
      addMessage({ content: result, role: 'assistant' });
    } catch (error) {
      console.error(error)
      addMessage({ content: "Sorry I couldn't process your request. please try again.", role: 'system' });
    } finally { setIsLoading(false) }
  }

  async function handleDeepSeekAiContentSend(content) {
    addMessage({ content: content, role: 'user' })
    setIsLoading(true)
    try {
      const result = await deepSeekAiAssistant.chat(content, messages)
      addMessage({ content: result, role: 'assistant' });
    } catch (error) {
      console.error(error)
      addMessage({ content: "Sorry I couldn't process your request. please try again.", role: 'system' });
      setIsLoading(false);
    } finally { setIsLoading(false) }
  }

  function handleColorScheme(event) {
    const scheme = event.target.value;
    if (scheme === 'Dark') {
      document.documentElement.style.setProperty('color-scheme', 'Dark');
    } else {
      document.documentElement.style.setProperty('color-scheme', 'light');
    }
  }

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbot
        </h2>
        <div className={styles.Settings}>
          <select className={styles.AiSelection} ref={selectedAi}>
            <option value="Gemini">Gemini</option>
            <option value="OpenAI">OpenAI</option>
            <option value="DeepSeek">Deep-seek</option>
          </select>

          <label>
            <input
              type="radio"
              name="colorScheme"
              value="Light"
              onClick={(event) => handleColorScheme(event)}
            />
            Light
          </label>
          <label>
            <input
              type="radio"
              name="colorScheme"
              value="Dark"
              onClick={(event) => handleColorScheme(event)}
              defaultChecked
            />
            Dark
          </label>
        </div>

      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls isDisabled={isLoading} onSend={(content) => {
        const ai = selectedAi.current.value
        if (ai === 'Gemini') {
          handleGeminiContentSend(content)
        } else if (ai === 'OpenAI') {
          handleOpenAiContentSend(content)
        } else if (ai === 'DeepSeek') {
          handleDeepSeekAiContentSend(content)
        }
      }} />
    </div>
  )
}
export default App
