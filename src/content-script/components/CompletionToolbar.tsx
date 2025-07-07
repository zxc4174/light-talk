import * as React from 'react'
import Browser from 'webextension-polyfill'

import { Answer, QueryMode, QueryStatus } from '@src/shared/types'

import ChatButton from './ChatButton'

import CopyIcon from '../../shared/icons/CopyIcon'
import DislikeIcon from '../../shared/icons/DisLikeIcon'
import DoneIcon from '../../shared/icons/DoneIcon'
import LikeIcon from '../../shared/icons/LikeIcon'
import StopIcon from '../../shared/icons/StopIcon'
import Tooltip from './Tooltip'

interface CompletionToolbarProps {
    status?: QueryStatus
    completion: Answer
    queryMode?: QueryMode
    onClickChatButton?: () => void
    onClickStop?: () => void
}

type actionStatus = 'success' | 'ready'

const CompletionToolbar: React.FC<CompletionToolbarProps> = ({
    status,
    completion,
    queryMode = undefined,
    onClickChatButton,
    onClickStop,
}) => {
    const [liked, setLiked] = React.useState<boolean>(false)
    const [disliked, setDisliked] = React.useState<boolean>(false)
    const [likeStatus, setLikeStatus] = React.useState<actionStatus>('ready')
    const [dislikeStatus, setDislikeStatus] = React.useState<actionStatus>('ready')
    const [copyStatus, setCopyStatus] = React.useState<actionStatus>('ready')

    const handleOnClickLikeButton = async () => {
        setLikeStatus('success')
        setTimeout(() => {
            setLiked(true)
        }, 700)
        await Browser.runtime.sendMessage({
            type: 'FEEDBACK',
            data: {
                conversation_id: completion.conversationId,
                rating: 'like',
            },
        })
    }

    const handleOnClickDislikeButton = async () => {
        setDislikeStatus('success')
        setTimeout(() => {
            setDisliked(true)
        }, 700)
        await Browser.runtime.sendMessage({
            type: 'FEEDBACK',
            data: {
                conversation_id: completion.conversationId,
                rating: 'dislike',
            },
        })
    }

    const handleOnClickCopyButton = () => {
        navigator.clipboard.writeText(completion.content).then(
            () => {
                setCopyStatus('success')
                setTimeout(() => {
                    setCopyStatus('ready')
                }, 1500)
            },
            (err) => {
                console.error('Failed to copy text: ', err)
            }
        )
    }

    return (
        <div className='--light-talk__popover__body__toolbar__container'>
            {
                queryMode === 'completion' &&
                <ChatButton
                    onClick={onClickChatButton}
                />
            }
            {
                status === 'success' ?
                    <button
                        className='--light-talk__popover__body__toolbar__stop-generating_button'
                        onClick={onClickStop}
                    >
                        <StopIcon className='--light-talk__stop-icon' />Stop Generating
                    </button> :
                    <div className='--light-talk__popover__body__toolbar__options'>
                        {
                            !liked &&
                            <Tooltip title={likeStatus === 'ready' ? 'Like' : 'Liked'}>
                                <button
                                    className='--light-talk__popover__body__toolbar__options__button'
                                    onClick={handleOnClickLikeButton}
                                    disabled={likeStatus === 'success'}
                                >
                                    {
                                        likeStatus === 'ready' ?
                                            <LikeIcon /> : <DoneIcon />
                                    }
                                </button>
                            </Tooltip>
                        }
                        {
                            !disliked &&
                            <Tooltip title={dislikeStatus === 'ready' ? 'Dislike' : 'Disliked'}>
                                <button
                                    className='--light-talk__popover__body__toolbar__options__button'
                                    onClick={handleOnClickDislikeButton}
                                    disabled={dislikeStatus === 'success'}
                                >
                                    {
                                        dislikeStatus === 'ready' ?
                                            <DislikeIcon /> : <DoneIcon />
                                    }
                                </button>
                            </Tooltip>
                        }
                        <Tooltip title={copyStatus === 'ready' ? 'Copy' : 'Copied'}>
                            <button
                                className='--light-talk__popover__body__toolbar__options__button'
                                onClick={handleOnClickCopyButton}
                                disabled={copyStatus === 'success'}
                            >
                                {
                                    copyStatus === 'ready' ?
                                        <CopyIcon /> : <DoneIcon />
                                }
                            </button>
                        </Tooltip>
                    </div>
            }
        </div>
    )
}

export default CompletionToolbar