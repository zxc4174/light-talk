import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

import { Answer, QueryStatus } from '../../shared/types'
import CompletionToolbar from './CompletionToolbar'


interface ChatCompletionProps {
    status?: QueryStatus
    completion: Answer
    onClickStop?: () => void
}

const ChatCompletion: React.FC<ChatCompletionProps> = ({
    status,
    completion,
    onClickStop,
}) => {
    if (completion.role === 'user') return (
        <div className='--light-talk__completion__container'>
            <p className='--light-talk__completion__user-message'>{completion.content}</p>
        </div>)

    return (
        <div className='--light-talk__completion__container --light-talk__completion__chat-message --light-talk__react-markdown'>
            <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
                {completion?.content}
            </ReactMarkdown>
            {
                status !== 'stop' &&
                <CompletionToolbar
                    completion={completion}
                    status={status}
                    onClickStop={onClickStop}
                />
            }
        </div >
    )
}

export default ChatCompletion