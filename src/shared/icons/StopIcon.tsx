import * as React from "react"

const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.3333 1.79089H2.33329C1.41663 1.79089 0.666626 2.54089 0.666626 3.45756V13.4576C0.666626 14.3742 1.41663 15.1242 2.33329 15.1242H12.3333C13.25 15.1242 14 14.3742 14 13.4576V3.45756C14 2.54089 13.25 1.79089 12.3333 1.79089ZM12.3333 13.4576H2.33329V3.45756H12.3333V13.4576Z" fill="#C9D1D9" />
    </svg>
)

export default StopIcon