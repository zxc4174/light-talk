import * as React from "react"

const AlertIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_209_422)">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
        </g>
        <defs>
            <clipPath id="clip0_209_422">
                <rect width="24" height="24" />
            </clipPath>
        </defs>
    </svg>
)

export default AlertIcon