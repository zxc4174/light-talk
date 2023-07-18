import * as React from 'react'
import AlertIcon from '../../shared/icons/AlertIcon'

interface AlertProps {
    message: string
}

const Alert: React.FC<AlertProps> = ({ message }) => {
    return (
        <div className="--light-talk__alert --light-talk__alert__status">
            <span className="--light-talk__alert__icon">
                <AlertIcon />
            </span>
            <span className="--light-talk__alert__message">{message}</span>
        </div>
    )
}

export default Alert