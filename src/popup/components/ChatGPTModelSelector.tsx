import { ChangeEvent, FC, Fragment, useEffect, useState } from 'react'
import {
    Box,
    HStack,
    Select,
    Stack,
    Text
} from '@chakra-ui/react'
import { getUserConfig, updateUserConfig } from '../../shared/config'
import { ChatGPTModel } from '../../shared/types'
import { fetchChatGPTModels } from '../../shared/api'


interface RatingProps {
    label: string
    value: number[]
}

const Rating: FC<RatingProps> = ({
    label = '-',
    value = [0, 5]
}) => {


    return (
        <HStack spacing={1}>
            <Text fontSize={'sm'} width={'40%'}>{label}</Text>
            {Array.from({ length: value[1] }, (_, i) => (
                <Box
                    key={i}
                    bg={i < value[0] ? '#42ABA0' : '#D9D9E3'}
                    w='18px'
                    h='8px'
                    borderRadius={'8px'}
                />
            ))}
        </HStack>
    )
}

interface ChatGPTModelSelectorProps {
    onUpdated: (label: string) => void
}

const ChatGPTModelSelector: FC<ChatGPTModelSelectorProps> = ({ onUpdated }) => {
    const [value, setValue] = useState<string>('text-davinci-002-render-sha')
    const [chatGPTmodels, setChatGPTModels] = useState<ChatGPTModel[]>([])

    useEffect(() => {
        getUserConfig().then((config) => {
            setValue(config.chatGPTModel)
        })

        fetchChatGPTModels().then(models => {
            const filtered = models.filter(m => !m.hasOwnProperty('enabled_tools'))
            setChatGPTModels(filtered)
        })
    }, [])

    const handleOnChangeChatGPTModel = (e: ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value)
        updateUserConfig({ chatGPTModel: e.target.value })
        onUpdated('ChatGPT Model updated')
    }

    const targetModel = chatGPTmodels?.find(m => m.slug === value)

    return (
        <Stack spacing={1}>
            <Select
                value={value}
                onChange={handleOnChangeChatGPTModel}
                isDisabled={chatGPTmodels.length === 0}
            >
                {
                    chatGPTmodels?.length > 0 ?
                        chatGPTmodels?.map((m, i) => <option key={i} value={m.slug}>{m.title}</option>) :
                        <option value='text-davinci-002-render-sha'>Turbo (Default for free users)</option>
                }
            </Select>
            {
                targetModel &&
                <Box
                    borderWidth='1px'
                    borderRadius='6px'
                    borderStyle='solid'
                    px={4}
                    py={2}
                >
                    {
                        targetModel?.description &&
                        <Text fontSize={'sm'} color={'gray.500'}>
                            {targetModel.description}
                        </Text>
                    }
                    {
                        targetModel?.qualitative_properties &&
                        <Fragment>
                            <Rating
                                label={'Reasoning'}
                                value={targetModel.qualitative_properties?.reasoning}
                            />
                            <Rating
                                label={'Speed'}
                                value={targetModel.qualitative_properties?.speed}
                            />
                            <Rating
                                label={'Conciseness'}
                                value={targetModel.qualitative_properties?.conciseness}
                            />
                        </Fragment>
                    }
                </Box>
            }
        </Stack>
    )
}

export default ChatGPTModelSelector