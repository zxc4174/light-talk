import { ChangeEvent, FC, useEffect, useState } from 'react'
import { IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { getUserConfig, updateUserConfig } from '../../shared/config'

interface SecretInputProps {
    type: 'apiKey' | 'organizationId'
    onUpdated: (label: string) => void
}

const SecretInput: FC<SecretInputProps> = ({
    type, onUpdated
}) => {
    const [value, setValue] = useState<string>('')
    const [show, setShow] = useState<boolean>(false)

    useEffect(() => {
        getUserConfig().then((config) => {
            setValue(type === 'apiKey' ? config.apiKey : config.organizationId)
        })
    }, [])

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value.trim())
    }

    const handleOnBlur = () => {
        updateUserConfig({ [type === 'apiKey' ? 'apiKey' : 'organizationId']: value })
        onUpdated(type === 'apiKey' ? 'Api Key updated' : 'organization ID updated')
    }

    const handleOnToggleVisibility = () => {
        setShow((prev) => !prev)
    }

    return (
        <InputGroup>
            <Input
                type={show ? 'text' : 'password'}
                placeholder='Enter your key here'
                value={value}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
            />
            <InputRightElement>
                <IconButton
                    aria-label={show ? 'Hide API key' : 'Show API key'}
                    icon={show ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={handleOnToggleVisibility}
                />
            </InputRightElement>
        </InputGroup>
    )
}

export default SecretInput