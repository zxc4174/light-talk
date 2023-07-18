import { ChangeEvent, FC, Fragment, useEffect, useState } from 'react'
import {
    Box,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Stack,
    Text
} from '@chakra-ui/react'
import {
    OpenAIModelInfo,
    getUserConfig,
    updateUserConfig
} from '../../shared/config'
import { OpenAIModel } from '../../shared/types'
import { fetchOpenAIModels } from '../../shared/api'
import Browser from 'webextension-polyfill'

interface OpenAIModelSelectorProps {
    onUpdated: (label: string) => void
}

const OpenAIModelSelector: FC<OpenAIModelSelectorProps> = ({ onUpdated }) => {
    const [value, setValue] = useState<string>('gpt-3.5-turbo')
    const [openAIModels, setOpenAIModels] = useState<OpenAIModel[]>([])
    const [maxToken, setMaxToken] = useState<number>(256)
    const [temperature, setTemperature] = useState<number>(1)
    const [topP, setTopP] = useState<number>(1)

    useEffect(() => {
        getUserConfig().then((config) => {
            setValue(config.openAIModel)
            setMaxToken(config.maxTokens)
            setTemperature(config.temperature)
            setTopP(config.topP)

            if (config.apiKey) fetchModels()
        })

        const storageListener = () => {
            fetchModels()
        }
        Browser.storage.onChanged.addListener(storageListener)

        return () => {
            Browser.storage.onChanged.removeListener(storageListener)
        }
    }, [])

    const fetchModels = async () => {
        fetchOpenAIModels().then(models => {
            const chatModels = models?.filter(m => m.id.toLowerCase().includes("gpt")) ?? []
            setOpenAIModels(chatModels)
        })
    }

    const handleOnChangeOpenAIModel = (e: ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value)
        updateUserConfig({ openAIModel: e.target.value })
        onUpdated('OpenAI API Model updated')
    }
    const handleChangeMaxToken = (newValue: number) => {
        if (isNaN(newValue)) return
        updateUserConfig({ maxTokens: newValue })
        setMaxToken(newValue)
    }
    const handleChangeEndMaxToken = () => {
        onUpdated('Max Tokens updated')
    }

    const handleChangeTemperature = (newValue: number) => {
        if (isNaN(newValue)) return
        updateUserConfig({ temperature: newValue })
        setTemperature(newValue)
    }
    const handleChangeEndTemperature = () => {
        onUpdated('Temperature updated')
    }

    const handleChangeTopP = (newValue: number) => {
        if (isNaN(newValue)) return
        updateUserConfig({ topP: newValue })
        setTopP(newValue)
    }
    const handleChangeEndTopP = () => {
        onUpdated('Top_p updated')
    }

    const targetModelDesc = OpenAIModelInfo[value]

    return (
        <Stack spacing={1}>
            <Select
                value={value}
                onChange={handleOnChangeOpenAIModel}
                isDisabled={openAIModels.length === 0}
            >
                {
                    openAIModels.length > 0 ?
                        openAIModels.map((m, i) => <option key={i} value={m.id}>{m.id}</option>) :
                        <option value='gpt-3.5-turbo'>gpt-3.5-turbo</option>
                }
            </Select>
            {
                (openAIModels.length > 0 && targetModelDesc) &&
                <Box
                    borderWidth='1px'
                    borderRadius='6px'
                    borderStyle='solid'
                    px={4}
                    py={2}
                >
                    {
                        targetModelDesc?.description &&
                        <Text fontSize={'sm'} color={'gray.500'}>
                            {targetModelDesc.description}
                        </Text>
                    }
                    <Stack spacing={1} mt={2}>
                        <Stack spacing={1} paddingBottom={5}>
                            <Text fontSize={'sm'} >Max Tokens</Text>
                            <HStack>
                                <Text fontSize={'sm'} color={'gray.500'}>
                                    The maximum number of tokens to generate in the completion.
                                </Text>
                                <NumberInput
                                    maxW='100px'
                                    value={maxToken}
                                    min={1}
                                    max={targetModelDesc?.max_token}
                                    onChange={(_s, n) => { handleChangeMaxToken(n) }}
                                    onBlur={handleChangeEndMaxToken}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </HStack>
                            <Slider
                                aria-label='slider-max-tokens'
                                colorScheme='brand'
                                value={maxToken}
                                min={1}
                                max={Math.floor(targetModelDesc?.max_token / 2)}
                                onChange={handleChangeMaxToken}
                                onChangeEnd={handleChangeEndMaxToken}
                                focusThumbOnChange={false}
                            >
                                <SliderMark value={1} mt={2} fontSize='sm' color={'gray.500'}>
                                    1
                                </SliderMark>
                                <SliderMark value={Math.floor(targetModelDesc?.max_token / 2)} mt={2} ml={'-35px'} fontSize='sm' color={'gray.500'}>
                                    {Math.floor(targetModelDesc?.max_token / 2)}
                                </SliderMark>
                                <SliderTrack  >
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb
                                    border={'2px solid #42ABA0'}
                                    boxShadow={'0px 0px 0px 1px #99E1D4'}
                                />
                            </Slider>
                        </Stack>
                        <Stack spacing={1} paddingBottom={5}>
                            <Text fontSize={'sm'} >Temperature</Text>
                            <HStack>
                                <Text fontSize={'sm'} color={'gray.500'}>
                                    Temp adjusts output randomness: high = more randomness, low = more focus.
                                </Text>
                                <NumberInput
                                    maxW='100px'
                                    value={temperature}
                                    min={0}
                                    max={2}
                                    step={0.01}
                                    onChange={(_s, n) => { handleChangeTemperature(n) }}
                                    onBlur={handleChangeEndTemperature}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </HStack>
                            <Slider
                                aria-label='slider-temperature'
                                colorScheme='brand'
                                value={temperature}
                                min={0}
                                max={2}
                                step={0.01}
                                onChange={handleChangeTemperature}
                                onChangeEnd={handleChangeEndTemperature}
                                focusThumbOnChange={false}
                            >
                                <SliderMark value={0} mt={2} fontSize='sm' color={'gray.500'}>
                                    0
                                </SliderMark>
                                <SliderMark value={2} mt={2} ml={'-9px'} fontSize='sm' color={'gray.500'}>
                                    2
                                </SliderMark>
                                <SliderTrack >
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb
                                    border={'2px solid #42ABA0'}
                                    boxShadow={'0px 0px 0px 1px #99E1D4'}
                                />
                            </Slider>
                        </Stack>
                        <Stack spacing={1} paddingBottom={5}>
                            <Text fontSize={'sm'} >Top_p</Text>
                            <HStack>
                                <Text fontSize={'sm'} color={'gray.500'}>
                                    selects high probability tokens (up to a threshold) to generate text without temp
                                </Text>
                                <NumberInput
                                    maxW='100px'
                                    value={topP}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    onChange={(_s, n) => { handleChangeTopP(n) }}
                                    onBlur={handleChangeEndTopP}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </HStack>
                            <Slider
                                aria-label='slider-top_p'
                                colorScheme='brand'
                                value={topP}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={handleChangeTopP}
                                onChangeEnd={handleChangeEndTopP}
                                focusThumbOnChange={false}
                            >
                                <SliderMark value={0} mt={2} fontSize='sm' color={'gray.500'}>
                                    0
                                </SliderMark>
                                <SliderMark value={1} mt={2} ml={'-5px'} fontSize='sm' color={'gray.500'}>
                                    1
                                </SliderMark>
                                <SliderTrack  >
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb
                                    border={'2px solid #42ABA0'}
                                    boxShadow={'0px 0px 0px 1px #99E1D4'}
                                />
                            </Slider>
                        </Stack>
                    </Stack>
                </Box>
            }
        </Stack>
    )
}

export default OpenAIModelSelector