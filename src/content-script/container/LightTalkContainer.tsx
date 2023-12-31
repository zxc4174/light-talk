import * as React from 'react'
import Browser from 'webextension-polyfill'

import {
    Answer,
    PopoverWidthSize,
    QueryMode,
    QueryStatus,
    openAIError
} from '../../shared/types'
import {
    getCacheData,
    getUserConfig,
    resetCacheData,
    updateCacheData,
    updateUserConfig
} from '../../shared/config'
import { containerID } from '../../shared/constants'

interface LightTalkContextProps {
    showWelcomeMessage: boolean,
    isUseMemory: boolean,
    isVisible: boolean,
    queryMode: QueryMode,
    popoverSize: PopoverWidthSize,
    handelOnChangeMode: () => void,
    handelOnChangeSize: (value: string) => void,
    completions: Answer[],
    message: Answer,
    error: openAIError,
    retry: number,
    isLoading: boolean,
    status: QueryStatus,
    question: string,
    setQuestion: React.Dispatch<React.SetStateAction<string>>
    handelOnPostMessageToBackground: (question: string) => () => void,
    handleOnInitializeApiStates: () => void,
    handelOnStopGeneratingAnswer: () => void,
}

interface LightTalkContainerProps {
    children: React.ReactNode
}

export const LightTalkContext = React.createContext<LightTalkContextProps | null>(null)

const LightTalkContainer: React.FC<LightTalkContainerProps> = ({ children }) => {
    // LightTalk Setting
    const [showWelcomeMessage, setShowWelcomeMessage] = React.useState<boolean>(false)
    const [isUseMemory, setIsUseMemory] = React.useState<boolean>(false)
    const [isVisible, setIsVisible] = React.useState<boolean>(false)
    const [queryMode, setQueryMode] = React.useState<QueryMode>('completion')
    const [popoverSize, setPopoverSize] = React.useState<PopoverWidthSize>('md')

    React.useEffect(() => {
        // Todo Color Mode
        // const container = document.getElementById(containerID)
        // if (container && container.shadowRoot) {
        //     let styleTag = container.shadowRoot.querySelector('style');
        //     if (styleTag) {
        //         // Now you can work with the style tag
        //         console.log(styleTag.textContent);
        //     }
        // }

        // Get User setting
        getUserConfig()
            .then((config) => {
                setShowWelcomeMessage(config.showWelcomeMessage)
                setIsUseMemory(config.memory)
                setIsVisible(config.visibility)
                setQueryMode(config.queryMode)
                setPopoverSize(config.popoverSize)
            })

        const storageListener = (changes) => {
            for (let key in changes) {
                const change = changes[key]
                if (key === 'showWelcomeMessage') setShowWelcomeMessage(change.showWelcomeMessage)
                if (key === 'queryMode') setQueryMode(change.newValue)
                if (key === 'visibility') setIsVisible(change.newValue)
                if (key === 'memory') setIsUseMemory(change.memory)
            }
        }
        Browser.storage.onChanged.addListener(storageListener)

        // Get Cache Data 
        getCacheData().then((cache) => {
            setCompletions(cache.cacheCompletions)
            setQuestion(cache.lastQuestion)
        })

        // Handel shortcut
        const handleKeyDown = (e) => {
            if (e.key === 'Q' && e.shiftKey && e.ctrlKey) {
                setIsVisible((prev) => {
                    updateUserConfig({ visibility: !prev })
                    return !prev
                })
            }
        }
        window.addEventListener('keydown', handleKeyDown)

        // Listen from background message
        const handleMessageFromBackground = ({ selectionText }) => {
            if (selectionText && selectionText.trim().length > 0) {
                const q = selectionText.trim()
                setQuestion(q)
                handelOnPostMessageToBackground(`What is ${q}?`)

                const container = document.querySelector('#--light-talk-container')
                if (container) {
                    const shadowRoot = container?.shadowRoot
                    const popoverElement = shadowRoot?.querySelector('#--light-talk__popover')
                    popoverElement?.setAttribute("data-show", 'true')
                    if (!isVisible) {
                        setIsVisible(true)
                    }
                }
            }
        }
        Browser.runtime.onMessage.addListener(handleMessageFromBackground)

        return () => {
            Browser.storage.onChanged.removeListener(storageListener)
            window.removeEventListener('keydown', handleKeyDown)
            Browser.runtime.onMessage.removeListener(handleMessageFromBackground)
        }
    }, [])

    const handelOnChangeMode = () => {
        setQueryMode('chat')
    }

    const handelOnChangeSize = (value: string) => {
        const size = popoverSize == 'lg' ? 'md' : 'lg'
        setPopoverSize(size)
    }

    // For Api
    const portRef = React.useRef(null)
    const [completions, setCompletions] = React.useState<Answer[] | []>([])
    const [message, setMessage] = React.useState<Answer | null>(null)
    const [error, setError] = React.useState<openAIError | null>(null)
    const [retry, setRetry] = React.useState<number>(0)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [status, setStatus] = React.useState<QueryStatus>(undefined)
    const [question, setQuestion] = React.useState<string>('')
    const [conversationId, setConversationId] = React.useState<string | null>(null)
    const [parentMessageId, setParentMessageId] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (isUseMemory) {
            updateCacheData({
                cacheCompletions: completions
            })
        }
    }, [completions])

    const handelOnPostMessageToBackground = (q) => {
        if (!q.length) return

        setIsLoading(true)
        setStatus(undefined)
        setError(null)
        if (queryMode === 'chat') {
            setCompletions((prev) => [...prev, {
                role: 'user',
                content: q
            }])
        } else {
            setCompletions([{
                role: 'user',
                content: q
            }])
        }


        let lastMessage = null
        portRef.current = Browser.runtime.connect()
        const listener = (msg: any) => {
            if (msg.content) {
                setMessage(msg)
                lastMessage = msg
                setStatus('success')
            } else if (msg.error) {
                if (msg.error === "UNAUTHORIZED" || msg.error === "CLOUDFLARE") {
                    const _eStr = 'Access denied. To continue, please ensure your API key is valid or log in to ChatGPT.'
                    setError({ message: _eStr } as openAIError)
                } else {
                    const _e = JSON.parse(msg.error)
                    setError(_e.error)
                }
                setIsLoading(false)
                setStatus('error')

            }
            else if (msg.event === 'DONE') {
                if (lastMessage) {
                    setCompletions((prev) => {
                        const newValue = [...prev, lastMessage]
                        return newValue
                    })
                    setConversationId(lastMessage.conversationId)
                    setParentMessageId(lastMessage.parent_message_id)
                }
                setIsLoading(false)
                setStatus(undefined)
                setMessage(null)
            }
        }
        portRef.current.onMessage.addListener(listener)
        portRef.current.postMessage({
            question: q,
            completions: JSON.stringify(completions.map((c) => ({
                role: c.role,
                content: c.content,
            }))),
            conversationId: conversationId ?? null,
            parentMessageId: parentMessageId ?? null
        })
        return () => {
            portRef.current.onMessage.removeListener(listener)
            portRef.current.disconnect()
            portRef.current = null
        }
    }

    const handleOnInitializeApiStates = () => {
        setIsLoading(false)
        setStatus(undefined)
        setError(null)
        setRetry(0)
        setMessage(null)
        setCompletions([])
        setQuestion('')
        resetCacheData()
    }

    const handelOnStopGeneratingAnswer = () => {
        if (portRef.current) {
            portRef.current.disconnect()
            portRef.current = null
            setStatus('stop')
            setIsLoading(false)
        }
    }

    const value = {
        showWelcomeMessage,
        isUseMemory,
        isVisible,
        queryMode,
        popoverSize,
        handelOnChangeMode,
        handelOnChangeSize,
        completions,
        message,
        error,
        retry,
        isLoading,
        status,
        question,
        setQuestion,
        handelOnPostMessageToBackground,
        handleOnInitializeApiStates,
        handelOnStopGeneratingAnswer,
    }

    return (
        <LightTalkContext.Provider value={value}>
            {children}
        </LightTalkContext.Provider>
    )
}

export default LightTalkContainer