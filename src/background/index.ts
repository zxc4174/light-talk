import Browser from "webextension-polyfill"
import { Language, LanguageName, getUserConfig, updateUserConfig } from "../shared/config"
import { OpenAIProvider } from '../shared/providers/openai'
import { Answer } from '../shared/types'



async function generateAnswers(
  port: Browser.Runtime.Port,
  question: string,
  completions: Answer[] = [],
  conversationId: string | null,
  parentMessageId: string | null,
) {
  const config = await getUserConfig()
  const language = config.language === Language.Auto ? '' :
    `And always response in ${LanguageName.find(l => l.key === config.language).name} `
  const prompts = [
    {
      role: 'system',
      content: config.systemPrompt.trim().length > 0 ?
        `${config.systemPrompt}. ${language}` :
        language
    }
  ]

  const provider = new OpenAIProvider(
    config.apiKey,
    config.organizationId,
    config.openAIModel,
    [...prompts, ...completions],
    config.maxTokens,
    config.temperature,
    config.topP
  )
  const q = question

  const controller = new AbortController()

  const { cleanup } = await provider.generateAnswer({
    prompt: q,
    signal: controller.signal,
    onEvent(event) {
      if (event.type === 'done') {
        port.postMessage({ event: 'DONE' })
        return
      }

      port.postMessage(event.data)
    },
  })

  port.onDisconnect.addListener(() => {
    cleanup?.()
    controller.abort()
  })
}

Browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    console.debug('received msg', msg)
    try {
      if (msg.question.length) await generateAnswers(
        port,
        msg.question,
        JSON.parse(msg.completions),
        msg.conversationId,
        msg.parentMessageId
      )
    } catch (err: unknown) {
      console.error(err)
      if (err instanceof Error) {
        port.postMessage({ error: err.message })
      }
    }
  })
})



// Listener for contextMenus
Browser.contextMenus.create(
  {
    id: 'light-talk',
    type: 'normal',
    title: 'Ask ChatGPT',
    contexts: ['selection'],
  },
  () => {
    Browser.runtime.lastError
  }
)

Browser.contextMenus.onClicked.addListener(async function (info, tab) {
  try {
    if (info?.selectionText?.length) {
      Browser.tabs.sendMessage(tab.id, {
        selectionText: info.selectionText.trim().toString(),
      })
    }
  } catch (err: unknown) {
    console.error(err)
  }
})

Browser.tabs.onActivated.addListener(async (tab) => {
  if (tab.tabId) {
    getUserConfig().then((config) => {
      updateUserConfig({ showWelcomeMessage: config.apiKey.length < 1 })
    })
  }
})
