import { FC, useEffect, useState } from 'react'
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    Heading,
    Kbd,
    Link,
    Stack,
    Switch,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react'

import SettingIcon from '../../shared/icons/SettingIcon'
import { QueryMode, apiProvider, getUserConfig, resetCacheData, updateUserConfig } from '../../shared/config'

import QueryModeRadioGroup from './QueryModeRadioGroup'
import LanguageSelector from './LanguageSelector'
import OpenAIModelSelector from './OpenAIModelSelector'
import SecretInput from './SecretInput'
import PromptTextarea from './PromptTextarea'
import SizeRadioGroup from './SizeRadioGroup'
import ChatGPTModelSelector from './ChatGPTModelSelector'
import ColorThemeSwitch from './ColorThemeSwitch'

const SettingPanel: FC = () => {
    const toast = useToast()
    const [visibility, setVisibility] = useState<boolean>(true)
    const [useMemory, setUseMemory] = useState<boolean>(true)
    const [apiProviderType, setApiProviderType] = useState<number>(0)

    const apiProviderArr: string[] = Object.values(apiProvider)

    useEffect(() => {
        getUserConfig().then((config) => {
            setVisibility(config.visibility)
            setUseMemory(config.memory)
            setApiProviderType(config.apiProvider)
        })
        const handleKeyDown = (e) => {
            if (e.key === 'Q' && e.shiftKey && e.ctrlKey) {
                setVisibility((prev) => {
                    updateUserConfig({ visibility: !prev })
                    return !prev
                })
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const handelOnChangeUseMemory = () => {
        setUseMemory(prev => {
            if (prev) resetCacheData()
            updateUserConfig({ memory: !prev })
            return !prev
        })
        handleOnShowToast('Memory updated')
    }

    const handelOnChangeVisibility = () => {
        setVisibility((prev) => {
            updateUserConfig({ visibility: !prev })
            return !prev
        })
        handleOnShowToast('Visibility updated')
    }

    const handelOnChangeApiProvider = (index: number) => {
        setApiProviderType(index)
        updateUserConfig({ apiProvider: index })
        if (index === apiProviderArr.findIndex((value) => value === apiProvider.ChatGPT)) {
            updateUserConfig({ queryMode: QueryMode.Completion })
        }
        handleOnShowToast('API provider updated')
    }

    const handleOnShowToast = (label: string) => {
        toast({
            title: label,
            duration: 1000,
            isClosable: true,
            variant: 'solid',
            colorScheme: 'gray'
        })
    }

    const [scrollPosition, setScrollPosition] = useState<number>(0)
    const handleScroll = () => {
        const position = window.pageYOffset
        setScrollPosition(position)
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <Card maxW='md' variant='outline' border={0} borderRadius={0}>
            <CardHeader
                py={3}
                position='sticky'
                top={0}
                borderBottom={'1px solid'}
                borderColor={useColorModeValue('borderColor', 'gray.600')}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={scrollPosition > 50 ? 'md' : 'none'}
                zIndex={999}
            >
                <Flex
                    flex='1'
                    gap='1'
                    alignItems='center'
                    flexWrap='wrap'
                    color={useColorModeValue('gray.700', 'white')}
                >
                    <SettingIcon fill='currentColor' />
                    <Heading size='md'>Settings</Heading>
                </Flex>
            </CardHeader>
            <CardBody>
                <Stack spacing={4}>
                    <Stack spacing={1}>
                        <Heading size='sm'>Default Mode</Heading>
                        <Text fontSize={'sm'} color={'gray.500'}>Default mode for  LightTalk</Text>
                        <QueryModeRadioGroup
                            apiProviderType={apiProviderType}
                            onUpdated={handleOnShowToast}
                        />
                    </Stack>
                    <Stack spacing={1}>
                        <Heading size='sm'>Prompt</Heading>
                        <Text fontSize={'sm'} color={'gray.500'}>Prompt for system</Text>
                        <PromptTextarea onUpdated={handleOnShowToast} />
                    </Stack>
                    <Stack spacing={1}>
                        <Heading size='sm'>Language</Heading>
                        <Text fontSize={'sm'} color={'gray.500'}>The language used in response</Text>
                        <LanguageSelector onUpdated={handleOnShowToast} />
                    </Stack>
                    {/* LLM Model Setting  */}
                    <Tabs
                        isFitted
                        variant='enclosed'
                        colorScheme='brand'
                        index={apiProviderType}
                        onChange={handelOnChangeApiProvider}

                    >
                        <TabList>
                            <Tab>Use OpenAI API</Tab>
                            <Tab>Use ChatGPT API</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Stack spacing={4}>
                                    <Stack spacing={1}>
                                        <Heading size='sm'>API Key</Heading>
                                        <Box>
                                            <Text fontSize={'sm'} color={'gray.500'}>The key used for access OpenAI (required)</Text>
                                            <Text fontSize={'sm'} color={'gray.500'}>
                                                You can get the api key from{' '}
                                                <Link color={'brand.600'} href='https://platform.openai.com/account/api-keys' target='_blank'>OpenAI</Link>
                                            </Text>
                                        </Box>
                                        <SecretInput type='apiKey' onUpdated={handleOnShowToast} />
                                    </Stack>
                                    <Stack spacing={1}>
                                        <Heading size='sm'>Organization ID</Heading>
                                        <Box>
                                            <Text fontSize={'sm'} color={'gray.500'}>OpenAI organization ID (optional)</Text>
                                        </Box>
                                        <SecretInput type='organizationId' onUpdated={handleOnShowToast} />
                                    </Stack>
                                    <Stack spacing={1}>
                                        <Heading size='sm'>Model</Heading>
                                        <Text fontSize={'sm'} color={'gray.500'}>The OpenAI chat LLM used for generating answer</Text>
                                        <OpenAIModelSelector onUpdated={handleOnShowToast} />
                                    </Stack>
                                </Stack>
                            </TabPanel>
                            <TabPanel>
                                <Stack spacing={4}>
                                    <Text fontSize={'sm'} color={'gray.500'}>
                                        To use the ChatGPT API, you need to remain logged in to{' '}
                                        <Link color={'brand.600'} href='https://chat.openai.com/' target='_blank'>ChatGPT</Link>.
                                        And only can use in Base mode.
                                    </Text>
                                    <Stack spacing={1}>
                                        <Heading size='sm'>Model</Heading>
                                        <Text fontSize={'sm'} color={'gray.500'}>The OpenAI chat LLM used for generating answer</Text>
                                        <ChatGPTModelSelector onUpdated={handleOnShowToast} />
                                    </Stack>
                                </Stack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                    <Divider />
                    {/* <Stack spacing={1}>
                        <Heading size='sm'>Color Theme</Heading>
                        <Stack direction='row' justifyContent='space-between'>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                Change the color theme of LightTalk
                            </Text>
                            <ColorThemeSwitch />
                        </Stack>
                    </Stack> */}
                    <Stack spacing={1}>
                        <Heading size='sm'>Memory</Heading>
                        <Stack direction='row' justifyContent='space-between'>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                Use the previous conversion, and it will start from the next conversion.
                            </Text>
                            <Switch
                                size='lg'
                                colorScheme='brand'
                                isChecked={useMemory}
                                onChange={handelOnChangeUseMemory}
                            />
                        </Stack>
                    </Stack>
                    <Stack spacing={1}>
                        <Heading size='sm'>Visibility</Heading>
                        <Stack direction='row' justifyContent='space-between'>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                LightTalk and allows users to toggle it using the shortcut ({
                                    <span>
                                        <Kbd>control</Kbd> + <Kbd>shift</Kbd> + <Kbd>Q</Kbd>
                                    </span>
                                })
                            </Text>
                            <Switch
                                size='lg'
                                colorScheme='brand'
                                isChecked={visibility}
                                onChange={handelOnChangeVisibility}
                            />
                        </Stack>
                    </Stack>
                    <Stack spacing={1}>
                        <Heading size='sm'>Size</Heading>
                        <Stack direction='row' justifyContent='space-between'>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                The default popover size
                            </Text>
                            <SizeRadioGroup onUpdated={handleOnShowToast} />
                        </Stack>
                    </Stack>
                </Stack>
            </CardBody>
        </Card >
    )
}

export default SettingPanel