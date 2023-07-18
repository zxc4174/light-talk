import { FC, ReactElement, cloneElement, useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import { Placement } from '@popperjs/core'

interface TooltipProps {
    children: ReactElement
    title: string
    deps?: any[]
}

const Tooltip: FC<TooltipProps> = ({ children, title, deps = [] }) => {
    const [tooltipShow, setTooltipShow] = useState(false)
    const [referenceEl, setReferenceEl] = useState(null)
    const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null)
    const [arrowEl, setArrowEl] = useState(null)
    const [placement, setPlacement] = useState<Placement>('bottom')

    const { styles, attributes, update } = usePopper(referenceEl, popperEl, {
        placement,
        modifiers: [
            { name: "arrow", options: { element: arrowEl } },
            { name: 'offset', options: { offset: [0, 8] } }
        ]
    })

    useEffect(() => {
        if (referenceEl && update) {
            update()
        }
    }, [referenceEl, popperEl, update, tooltipShow, ...deps])

    const handleOnMouseEnter = () => {
        setTooltipShow(true)
    }
    const handleOnMouseLeave = () => {
        setTooltipShow(false)
    }

    const childWithRef = cloneElement(children, { ref: setReferenceEl });

    return (
        <div
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
        >
            {childWithRef}
            {tooltipShow && (
                <div
                    ref={setPopperEl}
                    style={styles.popper}
                    {...attributes.popper}
                    className='--light-talk__tooltip'
                >
                    {title}
                    <span
                        ref={setArrowEl}
                        style={styles.arrow}
                        {...attributes.arrow}
                        className="--light-talk__tooltip__arrow"
                    />
                </div>
            )}
        </div>
    )
}

export default Tooltip
