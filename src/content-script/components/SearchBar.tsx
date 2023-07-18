import React from 'react'
import SendIcon from '../../shared/icons/SendIcon'
import Spinner from './Spinner'

interface SearchBarProps {
    isLoading: boolean
    generatingStatus?: string
    placeholder?: string
    value?: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    addonLeft?: React.ReactNode
    addonRight?: React.ReactNode
}

export const SearchBar: React.FC<SearchBarProps> = ({
    isLoading = false,
    generatingStatus = undefined,
    placeholder = 'Send Message',
    value,
    onChange,
    onClick,
    addonLeft,
    addonRight,
}) => {
    const [textareaEl, setTextareaEl] = React.useState<HTMLTextAreaElement>(null)
    const [composition, setComposition] = React.useState<boolean>(false)

    const handleOnStartComposition = () => setComposition(true)
    const handleOnEndComposition = () => setComposition(false)

    const handleOnKeyDown = (e) => {
        e.stopPropagation()
        if (e.key === 'Enter' && !e.shiftKey && !composition) {
            e.preventDefault()
            onClick(e)
        }
    }

    React.useEffect(() => {
        if (textareaEl) {
            textareaEl.style.height = textareaEl.clientHeight <= 46 ? '24px' : 'auto'
            textareaEl.style.height = Math.min(
                textareaEl.scrollHeight <= 46 ? 24 : textareaEl.scrollHeight, 90
            ) + 'px'
        }
    }, [value, textareaEl])

    return (
        isLoading ?
            <div className="--light-talk__input-group__input_disabled">
                <Spinner /> ChatGpt is thinking...
            </div> :
            generatingStatus === 'success' ?
                <div className="--light-talk__input-group__input_disabled">
                    <Spinner /> ChatGpt is generating...
                </div> :
                <div className="--light-talk__input-group">
                    <div className="--light-talk__input-group__container">
                        {
                            addonLeft &&
                            <div className="--light-talk__input-group__addon-left">{addonLeft}</div>
                        }
                        <div className="--light-talk__input-group__input">
                            <textarea
                                ref={setTextareaEl}
                                placeholder={placeholder}
                                value={value}
                                onChange={onChange}
                                onKeyDown={handleOnKeyDown}
                                onCompositionStart={handleOnStartComposition}
                                onCompositionEnd={handleOnEndComposition}
                                autoFocus
                                className="--light-talk__input-group__textarea"
                                style={{ maxHeight: '200px', overflowY: 'auto' }}
                            />
                        </div>
                        <button
                            className="--light-talk__input-group__addon-right"
                            onClick={onClick}
                            disabled={value.length === 0}
                        >
                            {
                                <SendIcon />
                            }
                        </button>
                    </div>
                </div>
    )
}

export default SearchBar