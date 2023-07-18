import { useState, useEffect } from 'react'

interface WindowDimensions {
    width: number | undefined
    height: number | undefined
}

function useWindowDimensions(): [number, number] {
    const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
        width: undefined,
        height: undefined,
    })

    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)

    }, [])

    return [windowDimensions.height, windowDimensions.width]
}

export default useWindowDimensions
