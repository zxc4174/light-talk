import * as React from 'react'
import ChatIcon from '../../shared/icons/ChatIcon'

interface ChatButtonProps {
    onClick: () => void
}

const ChatButton: React.FC<ChatButtonProps> = ({
    onClick
}) => {
    return (
        <button
            className='--light-talk__popover__body__toolbar__chat-button'
            onClick={onClick}
        >
            <ChatIcon />
            <p>Let's chat</p>
        </button>
    )
}

export default ChatButton