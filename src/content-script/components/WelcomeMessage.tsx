import { FC } from 'react'

import LightTalkIcon from '../../shared/icons/LightTalkIcon'

const WelcomeMessage: FC = () => {
    const handleOnClickOpenAI = () => {}

    return (
        <div className="--light-talk__welcome-message__container">
            <div className="--light-talk__welcome-message__icon">
                <LightTalkIcon />
            </div>
            <div className="--light-talk__welcome-message__content">
                <p className='--light-talk__welcome-message__content__title'>Hello!</p>
                Before you begin, please ensure that your OpenAI API Key is set.
                You can access the popup menu by clicking the icon in the extensions bar.
            </div>
            <div className="--light-talk__welcome-message__action-container">
                <a
                    className="--light-talk__welcome-message__button"
                    href='https://platform.openai.com/'
                    target='_blank'
                    onClick={handleOnClickOpenAI}
                >Let’s get API Key</a>
            </div>
        </div >
    )
}

export default WelcomeMessage