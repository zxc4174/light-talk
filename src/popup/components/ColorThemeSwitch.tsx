import { FC, useEffect, useState } from 'react'
import { Select, useColorMode } from '@chakra-ui/react'
import { Theme, getUserConfig, updateUserConfig } from '../../shared/config'

const ColorThemeSwitch: FC = () => {
    const { setColorMode } = useColorMode()
    const [value, setValue] = useState<Theme>(Theme.System)

    const applyMode = (mode: Theme) => {
        if (mode === Theme.System) {
            setColorMode(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        } else {
            setColorMode(mode)
        }
    }

    useEffect(() => {
        getUserConfig().then(config => {
            setValue(config.theme)
            applyMode(config.theme)
        })
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const next = e.target.value as Theme
        setValue(next)
        updateUserConfig({ theme: next })
        applyMode(next)
    }

    return (
        <Select size='sm' value={value} onChange={handleChange} width='120px'>
            <option value={Theme.System}>System</option>
            <option value={Theme.Light}>Light</option>
            <option value={Theme.Dark}>Dark</option>
        </Select>
    )
}

export default ColorThemeSwitch
