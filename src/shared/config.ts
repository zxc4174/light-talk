import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'

export enum QueryMode {
  Completion = 'completion',
  Chat = 'chat',
}

export enum popoverSize {
  Medium = 'md',
  Large = 'lg',
}

export enum Theme {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

export enum Language {
  Auto = 'auto',
  English = 'en',
  Chinese = 'zh',
  ChineseTW = 'zh-tw',
  Spanish = 'spanish',
  French = 'french',
  Korean = 'korean',
  Japanese = 'ja',
  German = 'german',
  Portuguese = 'portuguese',
}

export const LanguageName: { key: Language, name: string }[] = [
  { key: Language.Auto, name: 'Auto' },
  { key: Language.English, name: 'English' },
  { key: Language.Chinese, name: '简体中文' },
  { key: Language.ChineseTW, name: '繁體中文' },
  { key: Language.Spanish, name: 'español' },
  { key: Language.French, name: 'français' },
  { key: Language.Korean, name: '한국어' },
  { key: Language.Japanese, name: '日本語' },
  { key: Language.German, name: 'Deutsch' },
  { key: Language.Portuguese, name: 'português' },
]

export enum apiProvider {
  OpenAI = 'openai',
  ChatGPT = 'chatgpt',
}

export const OpenAIModelInfo = {
  'gpt-3.5-turbo': {
    description: 'Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration.',
    max_token: 4096,
    training_data: 'Up to Sep 2021'
  },
  'gpt-3.5-turbo-0301': {
    description: 'Snapshot of gpt-3.5-turbo from March 1st 2023. Unlike gpt-3.5-turbo, this model will not receive updates, and will be deprecated 3 months after a new version is released.',
    max_token: 4096,
    training_data: 'Up to Sep 2021'
  },
  'gpt-4': {
    description: 'More capable than any GPT-3.5 model, able to do more complex tasks, and optimized for chat. Will be updated with our latest model iteration.',
    max_token: 8192,
    training_data: 'Up to Sep 2021'
  },
  'gpt-4-0314': {
    description: 'Snapshot of gpt-4 from March 14th 2023. Unlike gpt-4, this model will not receive updates, and will be deprecated 3 months after a new version is released.',
    max_token: 8192,
    training_data: 'Up to Sep 2021'
  },
  'gpt-4-32k': {
    description: 'Same capabilities as the base gpt-4 mode but with 4x the context length. Will be updated with our latest model iteration.',
    max_token: 32768,
    training_data: 'Up to Sep 2021'
  },
  'gpt-4-32k-0314': {
    description: 'Snapshot of gpt-4-32 from March 14th 2023. Unlike gpt-4-32k, this model will not receive updates, and will be deprecated 3 months after a new version is released.',
    max_token: 32768,
    training_data: 'Up to Sep 2021'
  }
}

const userConfigWithDefaultValue = {
  showWelcomeMessage: true,
  theme: Theme.System,
  queryMode: QueryMode.Completion,
  systemPrompt: '',
  language: Language.Auto,
  apiKey: '',
  organizationId: '',
  apiProvider: 0,
  chatGPTModel: 'text-davinci-002-render-sha',
  openAIModel: 'gpt-3.5-turbo',
  maxTokens: 256,
  temperature: 1,
  topP: 1,
  memory: false,
  visibility: true,
  popoverSize: popoverSize.Medium,
}

// User Config
export type UserConfig = typeof userConfigWithDefaultValue

export async function getUserConfig(): Promise<UserConfig> {
  const result = await Browser.storage.local.get(Object.keys(userConfigWithDefaultValue))
  return defaults(result, userConfigWithDefaultValue)
}

export async function updateUserConfig(updates: Partial<UserConfig>) {
  return Browser.storage.local.set(updates)
}

// Local Cache Data
const cacheDataWithDefaultValue = {
  lastQuestion: '',
  cacheCompletions: [],
}

export type CacheData = typeof cacheDataWithDefaultValue

export async function getCacheData(): Promise<CacheData> {
  const result = await Browser.storage.local.get(Object.keys(cacheDataWithDefaultValue))
  return defaults(result, cacheDataWithDefaultValue)
}

export async function updateCacheData(updates: Partial<CacheData>) {
  const keys = Object.keys(updates)
  keys.forEach(k => Browser.storage.local.remove(k))
  return Browser.storage.local.set(updates)
}

export async function resetCacheData() {
  const keys = Object.keys(cacheDataWithDefaultValue)
  keys.forEach(k => Browser.storage.local.remove(k))
}
