import * as React from "react"

const ConnectIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_228_442)">
            <path d="M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z" fill="url(#paint0_linear_228_442)" />
        </g>
        <defs>
            <linearGradient id="paint0_linear_228_442" x1="-0.61081" y1="-0.789474" x2="26.5968" y2="21.0579" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FAE69E" />
                <stop offset="0.65625" stopColor="#42ABA0" />
            </linearGradient>
            <clipPath id="clip0_228_442">
                <rect width="24" height="24" fill="white" />
            </clipPath>
        </defs>
    </svg>
)

export default ConnectIcon