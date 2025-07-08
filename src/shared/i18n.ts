export const translations = {
  en: {
    settings: 'Settings',
    defaultMode: 'Default Mode',
    defaultModeDesc: 'Default mode for LightTalk',
    prompt: 'Prompt',
    promptDesc: 'Prompt for system',
    language: 'Language',
    languageDesc: 'Change interface language',
    apiKey: 'API Key',
    apiKeyDesc: 'The key used for access OpenAI (required)',
    organizationId: 'Organization ID',
    organizationIdDesc: 'OpenAI organization ID (optional)',
    model: 'Model',
    modelDesc: 'The OpenAI chat LLM used for generating answer',
    colorTheme: 'Color Theme',
    colorThemeDesc: 'Change the color theme of LightTalk',
    memory: 'Memory',
    memoryDesc: 'Use the previous conversion, and it will start from the next conversion.',
    visibility: 'Visibility',
    visibilityDesc: 'LightTalk allows users to toggle it using the shortcut (Ctrl+Shift+Q)',
    size: 'Size',
    sizeDesc: 'The default popover size',
    languageUpdated: 'Language updated',
    memoryUpdated: 'Memory updated',
    visibilityUpdated: 'Visibility updated',
    hello: 'Hello!',
    welcome: 'Before you begin, please ensure that your OpenAI API Key is set. You can access the popup menu by clicking the icon in the extensions bar.',
    getApiKey: 'Let\u2019s get API Key',
    thinking: 'ChatGPT is thinking...',
    generating: 'ChatGPT is generating...',
    stopGenerating: 'Stop Generating',
    like: 'Like',
    liked: 'Liked',
    dislike: 'Dislike',
    disliked: 'Disliked',
    copy: 'Copy',
    copied: 'Copied',
    openChatGPT: 'Open ChatGPT webapp',
    clearCompletions: 'Clear completions',
    closeWindow: 'Close window',
    sendMessage: 'Send Message'
  },
  'zh-tw': {
    settings: '設定',
    defaultMode: '預設模式',
    defaultModeDesc: 'LightTalk 的預設模式',
    prompt: '系統提示',
    promptDesc: '系統提示詞',
    language: '介面語言',
    languageDesc: '更改介面語言',
    apiKey: 'API 金鑰',
    apiKeyDesc: '存取 OpenAI 所需的金鑰 (必填)',
    organizationId: '組織 ID',
    organizationIdDesc: 'OpenAI 組織 ID (選填)',
    model: '模型',
    modelDesc: '用來產生答案的 OpenAI 聊天模型',
    colorTheme: '主題',
    colorThemeDesc: '切換 LightTalk 的主題',
    memory: '記憶功能',
    memoryDesc: '使用上一段對話，並從下一次開始對話。',
    visibility: '顯示狀態',
    visibilityDesc: '可使用快捷鍵 (Ctrl+Shift+Q) 顯示或隱藏 LightTalk',
    size: '尺寸',
    sizeDesc: '預設的彈窗大小',
    languageUpdated: '語言已更新',
    memoryUpdated: '記憶功能已更新',
    visibilityUpdated: '顯示狀態已更新',
    hello: '哈囉!',
    welcome: '在開始之前，請先設定您的 OpenAI API 金鑰。您可以點擊擴充功能圖示開啟設定面板。',
    getApiKey: '前往取得 API 金鑰',
    thinking: 'ChatGPT 思考中...',
    generating: 'ChatGPT 生成中...',
    stopGenerating: '停止生成',
    like: '喜歡',
    liked: '已喜歡',
    dislike: '不喜歡',
    disliked: '已不喜歡',
    copy: '複製',
    copied: '已複製',
    openChatGPT: '開啟 ChatGPT 網頁',
    clearCompletions: '清除紀錄',
    closeWindow: '關閉視窗',
    sendMessage: '傳送訊息'
  }
} as const

export type TranslationKey = keyof typeof translations.en

export function resolveLang(lang: string): keyof typeof translations {
  if (lang === 'zh' || lang.startsWith('zh')) return 'zh-tw'
  return lang in translations ? (lang as keyof typeof translations) : 'en'
}

export function t(key: TranslationKey, lang: keyof typeof translations): string {
  const langMap = translations[lang] ?? translations.en
  return langMap[key] || translations.en[key]
}
