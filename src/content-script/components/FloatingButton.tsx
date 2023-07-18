import React from "react"

interface FloatingButtonProps {
    icon: JSX.Element
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
    ({ icon, onClick, ...props }, ref) => {
        return (
            <button
                {...props}
                ref={ref}
                onClick={onClick}
                className="--light-talk__icon-button --light-talk__floating-button"
            >
                {icon}
            </button>
        )
    },
)

export default FloatingButton