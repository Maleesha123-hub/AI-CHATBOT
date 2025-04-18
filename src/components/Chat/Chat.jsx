import styles from './Chat.module.css'
import Markdown from 'react-markdown'

export function Chat({ messages }) {
    return (
        <div className={styles.Chat}>
            {
                messages.map(({ role, content }, index) => (
                    <div key={index} className={styles.Message} data-role={role}>
                        <Markdown>{content}</Markdown>
                    </div>
                ))
            }
        </div>
    )
}