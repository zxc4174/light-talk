import { createRoot } from "react-dom/client"
import { containerID, shadowRootID } from "../shared/constants"

import App from "./App"

import baseTheme from '../shared/styles/base-theme.scss'
import lightTheme from './light-theme.scss'
import darkTheme from './dark-theme.scss'
import { Theme, getUserConfig } from '../shared/config'
import Browser from 'webextension-polyfill'

let styleEl: HTMLStyleElement | null = null

async function applyTheme(theme: Theme) {
    if (!styleEl) {
        const container = await getContainer()
        styleEl = container.shadowRoot?.querySelector('style') as HTMLStyleElement | null
    }
    if (!styleEl) return
    const useDark = theme === Theme.Dark || (theme === Theme.System && window.matchMedia('(prefers-color-scheme: dark)').matches)
    styleEl.textContent = baseTheme + (useDark ? darkTheme : lightTheme)
}

export async function getContainer(): Promise<HTMLElement> {
    let $container: HTMLElement | null = document.getElementById(containerID)
    if (!$container) {
        $container = document.createElement('div')
        $container.id = containerID

        return new Promise((resolve, reject) => {
            setTimeout(async () => {
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
                styleEl = $style
                const config = await getUserConfig()
                await applyTheme(config.theme)
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

Browser.storage.onChanged.addListener(async (changes, area) => {
    if (area === 'local' && changes.theme) {
        const next: Theme = changes.theme.newValue
        applyTheme(next)
    }
})
