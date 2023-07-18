import * as React from 'react'
import { usePopper } from 'react-popper'
import { Placement } from '@popperjs/core'

import { LightTalkContext } from '../container/LightTalkContainer'
import { updateCacheData } from '../../shared/config'
import useWindowDimensions from '../../shared/hooks/useWindowDimensions'

import WelcomeMessage from './WelcomeMessage'
import ChatCompletion from './ChatCompletion'
import ExpandButton from './ExpandButton'
import FloatingButton from './FloatingButton'
import SearchBar from './SearchBar'
import Completion from './Completion'
import Alert from './Alert'
import Tooltip from './Tooltip'

import CloseIcon from '../../shared/icons/CloseIcon'
import LightTalkIcon from '../../shared/icons/LightTalkIcon'
import ClearIcon from '../../shared/icons/ClearIcon'
import ConnectIcon from '../../shared/icons/ConnectIcon'

interface QueryPopoverProps {
}

const QueryPopover: React.FC<QueryPopoverProps> = ({ }) => {
    const {
        showWelcomeMessage,
        isUseMemory,
        isVisible,
        queryMode,
        popoverSize,
        handelOnChangeMode,
        handelOnChangeSize,
        completions = [],
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
    } = React.useContext(LightTalkContext)

    const [_windowHeight, windowWidth] = useWindowDimensions()

    const [referenceEl, setReferenceEl] = React.useState(null)
    const [popperEl, setPopperEl] = React.useState<HTMLDivElement | null>(null)
    const [arrowEl, setArrowEl] = React.useState(null)
    const [placement, setPlacement] = React.useState<Placement>('top')
    const [cardBodyEl, setCardBodyEl] = React.useState<HTMLDivElement | null>(null)

    const [inputValue, setInputValue] = React.useState<string>('')

    const isPopoverExpanded = popoverSize == 'lg'
    const popoverWidth = windowWidth < 480 ? `${windowWidth * 0.85}px` :
        isPopoverExpanded ? '600px' : '448px'

    React.useEffect(() => {
        if (cardBodyEl && status === 'success') {
            cardBodyEl.scrollTop = cardBodyEl.scrollHeight
        }
    }, [status, message])

    const { styles, attributes, update } = usePopper(referenceEl, popperEl, {
        placement,
        modifiers: [
            { name: "arrow", options: { element: arrowEl } },
            { name: "offset", options: { offset: [0, 10] } }
        ]
    })

    React.useEffect(() => {
        if (referenceEl && update) {
            update()
        }
    }, [referenceEl, update, popoverSize, isVisible])

    const handleOnTogglePopover = () => {
        if (popperEl) {
            popperEl.hasAttribute("data-show") ?
                popperEl.removeAttribute("data-show") :
                popperEl.setAttribute("data-show", 'true')
        }
    }

    const handleOnClosePopover = () => {
        if (popperEl) {
            popperEl.removeAttribute("data-show")
        }
    }

    const handleOnClear = () => {
        setInputValue('')
        setQuestion('')
        handleOnInitializeApiStates()
    }

    const handleOnChangeInputValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value)
    }

    const handleOnClickSubmit = () => {
        if (inputValue.trim() == '') return
        const q = inputValue.trim()
        setQuestion(q)
        setInputValue('')

        if (isUseMemory) {
            updateCacheData({ lastQuestion: q })
        }

        handelOnPostMessageToBackground(q)
    }

    return (
        <div style={{ display: isVisible ? 'block' : 'none' }}>
            <div>
                <FloatingButton
                    icon={<LightTalkIcon />}
                    aria-label="Ask button"
                    ref={setReferenceEl}
                    onClick={handleOnTogglePopover}
                />
                <div
                    ref={setPopperEl}
                    style={styles.popper}
                    {...attributes.popper}
                    id='--light-talk__popover'
                    className='--light-talk__popover__container'
                >
                    <section
                        className="--light-talk__popover__content"
                        style={{
                            width: popoverWidth
                        }}
                    >
                        <header className="--light-talk__popover__header">
                            <div className="--light-talk__popover__header-content">
                                <div className='--light-talk__popover__header-content__title-container'>
                                    {/* <ChatGPTIcon /> */}
                                    <p className="--light-talk__popover__header-content__title">
                                        ChatGPT
                                    </p>

                                    <Tooltip title="Open ChatGPT webapp">
                                        <a
                                            className="--light-talk__popover__action-button"
                                            href='https://chat.openai.com/'
                                            target='_blank'
                                        >
                                            <ConnectIcon />
                                        </a>
                                    </Tooltip>
                                </div>
                                {
                                    queryMode === 'completion' && question.length !== 0 &&
                                    <p className="--light-talk__popover__header-content__subtitle">
                                        {question}
                                    </p>
                                }
                            </div>
                            {
                                (completions.length > 0 && status !== 'success') &&
                                <Tooltip title="Clear completions">
                                    <button
                                        className="--light-talk__popover__action-button --light-talk__popover__action-button__clear"
                                        onClick={handleOnClear}
                                    >
                                        <ClearIcon />
                                    </button>
                                </Tooltip>
                            }
                            <ExpandButton
                                isExpand={isPopoverExpanded}
                                onClick={handelOnChangeSize}
                            />
                            <Tooltip title="Close window">
                                <button
                                    className="--light-talk__popover__action-button --light-talk__popover__action-button__close"
                                    onClick={handleOnClosePopover}
                                >
                                    <CloseIcon />
                                </button>
                            </Tooltip>
                        </header>
                        <div
                            ref={setCardBodyEl}
                            className={question.length > 0 ? '--light-talk__popover__body' : ''}
                            style={{
                                backgroundColor: queryMode === 'chat' ?
                                    'rgba(246, 248, 250, 0.8)' : 'white',
                                maxWidth: popoverWidth
                            }}
                        >
                            {
                                (showWelcomeMessage && completions.length === 0) && <WelcomeMessage />
                            }
                            {
                                queryMode === 'chat' ?
                                    <React.Fragment>
                                        {
                                            completions.map((completion, i) => (
                                                <ChatCompletion
                                                    key={i}
                                                    completion={completion}
                                                />
                                            ))
                                        }
                                        {
                                            message &&
                                            <ChatCompletion
                                                completion={message}
                                                status={status}
                                                onClickStop={handelOnStopGeneratingAnswer}
                                            />
                                        }
                                    </React.Fragment> :
                                    <React.Fragment>
                                        {
                                            message ?
                                                <Completion
                                                    completion={message}
                                                    status={status}
                                                    onClickStop={handelOnStopGeneratingAnswer}
                                                /> :
                                                <Completion
                                                    completion={
                                                        completions.findLast(c => c.role === 'assistant')
                                                    }
                                                    queryMode={queryMode}
                                                    onClickChatButton={handelOnChangeMode}
                                                />
                                        }
                                    </React.Fragment>
                            }
                            {
                                error &&
                                <Alert message={error.message} />
                            }
                        </div>
                        <footer className="--light-talk__popover__footer">
                            <SearchBar
                                isLoading={isLoading}
                                generatingStatus={status}
                                value={inputValue}
                                onChange={handleOnChangeInputValue}
                                onClick={handleOnClickSubmit}
                            />
                        </footer>
                    </section>
                    <span
                        ref={setArrowEl}
                        style={styles.arrow}
                        {...attributes.arrow}
                        className="--light-talk__popover__arrow"
                    />
                </div>
            </div >
        </div >
    )
}

export default React.memo(QueryPopover)