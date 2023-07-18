import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

import { Answer, QueryMode, QueryStatus } from '../../shared/types'
import CompletionToolbar from './CompletionToolbar'

interface CompletionProps {
    status?: QueryStatus
    completion: Answer
    queryMode?: QueryMode
    onClickChatButton?: () => void
    onClickStop?: () => void
}

const Completion: React.FC<CompletionProps> = ({
    status,
    completion,
    queryMode,
    onClickChatButton,
    onClickStop,
}) => {
    if (!completion?.content) return

    return (
        <div className='--light-talk__react-markdown'>
            <ReactMarkdown
                rehypePlugins={[[rehypeHighlight, { detect: true }]]}
            >
                {completion?.content}
            </ReactMarkdown>
            {
                status !== 'stop' &&
                <CompletionToolbar
                    completion={completion}
                    status={status}
                    queryMode={queryMode}
                    onClickChatButton={onClickChatButton}
                    onClickStop={onClickStop}
                />
            }
        </div >
    )
}

export default Completion