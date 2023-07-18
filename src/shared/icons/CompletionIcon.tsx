import * as React from "react"

const CompletionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.8 1.06665H21.8667C23.04 1.06665 24 2.02665 24 3.19998V10.6666V16C24 17.1782 23.0449 18.1333 21.8667 18.1333H17.0667L13.3333 21.3333L10.1333 18.1333H4.8C3.62667 18.1333 2.66667 17.1733 2.66667 16V3.19998C2.66667 2.02665 3.62667 1.06665 4.8 1.06665Z" fill="#24645D" />
        <path d="M19.1893 0H2.12267C0.949333 0 0 0.96 0 2.13333V14.944C0 16.1163 0.950353 17.0667 2.12267 17.0667V17.0667H7.45601L10.656 21.3333L13.856 17.0667H19.1893C20.3627 17.0667 21.3227 16.1067 21.3227 14.9333V2.13333C21.3227 0.96 20.3627 0 19.1893 0ZM4.256 7.46667H17.056V9.6H4.256V7.46667ZM12.7893 12.8H4.256V10.6667H12.7893V12.8ZM17.056 6.4H4.256V4.26667H17.056V6.4Z" fill="url(#paint0_linear_10_13)" />
        <defs>
            <linearGradient id="paint0_linear_10_13" x1="-4.27734" y1="-4.49123" x2="27.9653" y2="21.3862" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FAE69E" />
                <stop offset="0.65625" stopColor="#42ABA0" />
            </linearGradient>
        </defs>
    </svg>
)

export default CompletionIcon