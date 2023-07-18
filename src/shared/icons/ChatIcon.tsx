import * as React from "react"

const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_215_434)">
            <path d="M22 7H20V16H7V18C7 18.55 7.45 19 8 19H19L23 23V8C23 7.45 22.55 7 22 7ZM18 13V4C18 3.45 17.55 3 17 3H4C3.45 3 3 3.45 3 4V18L7 14H17C17.55 14 18 13.55 18 13Z" fill="#24645D" />
            <path d="M21 6H19V15H6V17C6 17.55 6.45 18 7 18H18L22 22V7C22 6.45 21.55 6 21 6ZM17 12V3C17 2.45 16.55 2 16 2H3C2.45 2 2 2.45 2 3V17L6 13H16C16.55 13 17 12.55 17 12Z" fill="url(#paint0_linear_215_434)" />
        </g>
        <defs>
            <linearGradient id="paint0_linear_215_434" x1="-2.01201" y1="-2.21053" x2="28.2187" y2="22.0643" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FAE69E" />
                <stop offset="0.65625" stopColor="#42ABA0" />
            </linearGradient>
            <clipPath id="clip0_215_434">
                <rect width="24" height="24" fill="white" />
            </clipPath>
        </defs>
    </svg>
)

export default ChatIcon