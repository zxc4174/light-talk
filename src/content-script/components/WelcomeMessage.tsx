import { FC, useContext } from 'react'
import LightTalkIcon from '../../shared/icons/LightTalkIcon'
import { LightTalkContext } from '../container/LightTalkContainer'
import { t } from '../../shared/i18n'

const WelcomeMessage: FC = () => {
    const { lang } = useContext(LightTalkContext)
    const handleOnClickOpenAI = () => {}

    return (
        <div className="--light-talk__welcome-message__container">
            <div className="--light-talk__welcome-message__icon">
                <LightTalkIcon />
            </div>
            <div className="--light-talk__welcome-message__content">
                <p className='--light-talk__welcome-message__content__title'>{t('hello', lang)}</p>
                {t('welcome', lang)}
            </div>
            <div className="--light-talk__welcome-message__action-container">
                <a
                    className="--light-talk__welcome-message__button"
                    href='https://platform.openai.com/'
                    target='_blank'
                    onClick={handleOnClickOpenAI}
                >{t('getApiKey', lang)}</a>
            </div>
        </div >
    )
}

export default WelcomeMessage