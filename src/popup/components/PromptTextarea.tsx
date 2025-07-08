import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Textarea } from '@chakra-ui/react'
import { getUserConfig, updateUserConfig } from '../../shared/config'

interface PromptTextareaProps {
    onUpdated: (label: string) => void
}

const PromptTextarea: FC<PromptTextareaProps> = ({
    onUpdated
}) => {
    const [value, setValue] = useState<string>('')

    useEffect(() => {
        getUserConfig().then((config) => {
            setValue(config.systemPrompt)
        })
    }, [])

    const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value)
    }

    const handleOnBlur = () => {
        updateUserConfig({ systemPrompt: value })
        onUpdated('System Prompt updated')
    }

    return (
        <Textarea
            placeholder='Example: You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: {knowledge_cutoff} Current date: {current_date}'
            size='sm'
            resize='none'
            borderRadius={'6px'}
            value={value}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
        />
    )
}

export default PromptTextarea