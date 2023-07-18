import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Select } from '@chakra-ui/react'
import { Language, LanguageName, getUserConfig, updateUserConfig } from '../../shared/config'

interface LanguageSelectorProps {
    onUpdated: (label: string) => void
}

const LanguageSelector: FC<LanguageSelectorProps> = ({ onUpdated }) => {
    const [value, setValue] = useState<Language>(Language.Auto)

    useEffect(() => {
        getUserConfig().then((config) => {
            setValue(config.language)
        })
    }, [])

    const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value as Language)
        updateUserConfig({ language: e.target.value as Language })
        onUpdated('Language updated')
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