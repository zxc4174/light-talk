import { createRoot } from "react-dom/client"
import { containerID, shadowRootID } from "../shared/constants"

import App from "./App"

import lightTheme from './light-theme.scss'

export async function getContainer(): Promise<HTMLElement> {
    let $container: HTMLElement | null = document.getElementById(containerID)
    if (!$container) {
        $container = document.createElement('div')
        $container.id = containerID

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const $container_: HTMLElement | null = document.getElementById(containerID)
                if ($container_) {
                    resolve($container_)
                    return
                }
                if (!$container) {
                    reject(new Error('Failed to create container'))
                    return
                }
                const shadowRoot = $container.attachShadow({ mode: 'open' })
                const $style = document.createElement('style')
                $style.textContent = lightTheme
                const $inner = document.createElement('div')
                shadowRoot.appendChild($style)
                shadowRoot.appendChild($inner)
                const $html = document.body.parentElement
                if ($html) {
                    $html.appendChild($container as HTMLElement)
                } else {
                    document.appendChild($container as HTMLElement)
                }
                resolve($container)
            }, 100)
        })
    }
    return new Promise((resolve) => {
        resolve($container as HTMLElement)
    })
}

export async function queryPopupThumbElement(): Promise<HTMLDivElement | null> {
    const $container = await getContainer()
    return $container.shadowRoot?.querySelector(`#${shadowRootID}`) as HTMLDivElement | null
}

async function injectionChatBotButton(text?: string) {
    let $popupThumb: HTMLDivElement | null = await queryPopupThumbElement()
    if (!$popupThumb) {
        $popupThumb = document.createElement('div')
        $popupThumb.id = shadowRootID
        const root = createRoot($popupThumb)
        root.render(<App />)
        const $container = await getContainer()
        $container.shadowRoot?.querySelector('div')?.appendChild($popupThumb)
    }
}

async function main() {
    injectionChatBotButton()
}

main()