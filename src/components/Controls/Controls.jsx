import { useState } from 'react'
import styles from './Controls.module.css'

export function Controls({ onSend }) {

    const [content, setContent] = useState("")

    function handleContentChange(event) {
        setContent(event.target.value)
    }

    function handleContentSend() {
        if (content.length > 0) {
            onSend(content)
            setContent("")
        }
    }

    function handleEnterPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleContentSend()
        }
    }

    return (
        <div className={styles.Controls}>
            <div className={styles.TextAreaContainer}>
                <textarea
                    placeholder="Message AI Chatbot"
                    className={styles.TextArea}
                    value={content}
                    onChange={(event) =>
                        handleContentChange(event)
                    }
                    onKeyDown={handleEnterPress}
                />
            </div>
            <button className={styles.Button}
                onClick={() => handleContentSend()}>
                <SendIcon className={styles.Button.svg} />
            </button>
        </div>
    )
}

function SendIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px" fill="#FFFFFF">
            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
        </svg>
    )
}