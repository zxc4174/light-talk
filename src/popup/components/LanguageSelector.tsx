import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Select } from '@chakra-ui/react'
import { Language, LanguageName, getUserConfig, updateUserConfig } from '../../shared/config'
import { t, resolveLang, translations } from '../../shared/i18n'

interface LanguageSelectorProps {
    onUpdated: (label: string) => void
    onChange?: (lang: keyof typeof translations) => void
}

const LanguageSelector: FC<LanguageSelectorProps> = ({ onUpdated, onChange }) => {
    const [value, setValue] = useState<Language>(Language.Auto)

    useEffect(() => {
        getUserConfig().then((config) => {
            setValue(config.language)
        })
    }, [])

    const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value as Language
        setValue(lang)
        updateUserConfig({ language: lang })
        const uiLang = resolveLang(lang === Language.Auto ? navigator.language : lang)
        onUpdated(t('languageUpdated', uiLang))
        onChange?.(uiLang)
    }

    return (
        <Select
            value={value}
            onChange={handleOnChange}
        >
            {
                LanguageName.map((l, i) => <option key={i} value={l.key}>{l.name}</option>)
            }
        </Select>
    )
}


export default LanguageSelector

