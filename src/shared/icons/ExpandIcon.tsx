import * as React from "react"

const ExpandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_227_445)">
            <path d="M5.83 12.0001L9 8.83009L7.59 7.42009L3 12.0001L7.59 16.5901L9 15.1701L5.83 12.0001ZM18.17 12.0001L15 15.1701L16.41 16.5801L21 12.0001L16.41 7.41009L15 8.83009L18.17 12.0001Z" />
        </g>
        <defs>
            <clipPath id="clip0_227_445">
                <rect width="24" height="24" />
            </clipPath>
        </defs>
    </svg>
)

export default ExpandIcon