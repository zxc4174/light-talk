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
import { QueryMode, Language, getUserConfig, resetCacheData, updateUserConfig } from '../../shared/config'
import { t, translations, resolveLang } from '../../shared/i18n'

import QueryModeRadioGroup from './QueryModeRadioGroup'
import LanguageSelector from './LanguageSelector'
import OpenAIModelSelector from './OpenAIModelSelector'
import SecretInput from './SecretInput'
import PromptTextarea from './PromptTextarea'
import SizeRadioGroup from './SizeRadioGroup'
import ColorThemeSwitch from './ColorThemeSwitch'

const SettingPanel: FC = () => {
    const toast = useToast()
    const [visibility, setVisibility] = useState<boolean>(true)
    const [useMemory, setUseMemory] = useState<boolean>(true)
    const [lang, setLang] = useState<keyof typeof translations>('en')

    useEffect(() => {
        getUserConfig().then((config) => {
            setVisibility(config.visibility)
            setUseMemory(config.memory)
            const uiLang = config.language === Language.Auto
                ? resolveLang(navigator.language)
                : resolveLang(config.language)
            setLang(uiLang)
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

    const handleOnChangeUseMemory = () => {
        setUseMemory(prev => {
            if (prev) resetCacheData()
            updateUserConfig({ memory: !prev })
            return !prev
        })
        handleOnShowToast(t('memoryUpdated', lang))
    }

    const handleOnChangeVisibility = () => {
        setVisibility((prev) => {
            updateUserConfig({ visibility: !prev })
            return !prev
        })
        handleOnShowToast(t('visibilityUpdated', lang))
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
                    <Heading size='md'>{t('settings', lang)}</Heading>
                </Flex>
            </CardHeader>
            <CardBody>
                <Stack spacing={4}>
                    <Stack spacing={1}>
                        <Heading size='sm'>{t('defaultMode', lang)}</Heading>
                        <Text fontSize={'sm'} color={'gray.500'}>{t('defaultModeDesc', lang)}</Text>
                        <QueryModeRadioGroup onUpdated={handleOnShowToast} />
                    </Stack>
                    <Stack spacing={1}>
                        <Heading size='sm'>{t('prompt', lang)}</Heading>
                        <Text fontSize={'sm'} color={'gray.500'}>{t('promptDesc', lang)}</Text>
                        <PromptTextarea onUpdated={handleOnShowToast} />
                    </Stack>
                    <Stack spacing={1}>
                        <Heading size='sm'>{t('language', lang)}</Heading>
                        <Text fontSize={'sm'} color={'gray.500'}>{t('languageDesc', lang)}</Text>
                        <LanguageSelector onUpdated={handleOnShowToast} onChange={setLang} />
                    </Stack>
                    {/* LLM Model Setting  */}
                    <Stack spacing={4}>
                        <Stack spacing={1}>
                            <Heading size='sm'>{t('apiKey', lang)}</Heading>
                            <Box>
                                <Text fontSize={'sm'} color={'gray.500'}>{t('apiKeyDesc', lang)}</Text>
                                <Text fontSize={'sm'} color={'gray.500'}>
                                    You can get the api key from{' '}
                                    <Link color={'brand.600'} href='https://platform.openai.com/account/api-keys' target='_blank'>OpenAI</Link>
                                </Text>
                            </Box>
                            <SecretInput type='apiKey' onUpdated={handleOnShowToast} />
                        </Stack>
                        <Stack spacing={1}>
                            <Heading size='sm'>{t('organizationId', lang)}</Heading>
                            <Box>
                                <Text fontSize={'sm'} color={'gray.500'}>{t('organizationIdDesc', lang)}</Text>
                            </Box>
                            <SecretInput type='organizationId' onUpdated={handleOnShowToast} />
                        </Stack>
                        <Stack spacing={1}>
                            <Heading size='sm'>{t('model', lang)}</Heading>
                            <Text fontSize={'sm'} color={'gray.500'}>{t('modelDesc', lang)}</Text>
                            <OpenAIModelSelector onUpdated={handleOnShowToast} />
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack spacing={1}>
                        <Heading size='sm'>{t('colorTheme', lang)}</Heading>
                        <Stack direction='row' justifyContent='space-between'>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                {t('colorThemeDesc', lang)}
                            </Text>
                            <ColorThemeSwitch />
                        </Stack>
                    </Stack>
                    <Stack spacing={1}>
                        <Heading size='sm'>{t('memory', lang)}</Heading>
                        <Stack direction='row' justifyContent='space-between'>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                {t('memoryDesc', lang)}
                            </Text>
                            <Switch
                                size='lg'
                                colorScheme='brand'
                                isChecked={useMemory}
                                onChange={handleOnChangeUseMemory}
                            />
                        </Stack>
                    </Stack>
                    <Stack spacing={1}>
                        <Heading size='sm'>{t('visibility', lang)}</Heading>
                        <Stack direction='row' justifyContent='space-between'>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                {t('visibilityDesc', lang)} ({
                                    <span>
                                        <Kbd>control</Kbd> + <Kbd>shift</Kbd> + <Kbd>Q</Kbd>
                                    </span>
                                })
                            </Text>
                            <Switch
                                size='lg'
                                colorScheme='brand'
                                isChecked={visibility}
                                onChange={handleOnChangeVisibility}
                            />
                        </Stack>
                    </Stack>
                    <Stack spacing={1}>
                        <Heading size='sm'>{t('size', lang)}</Heading>
                        <Stack direction='row' justifyContent='space-between'>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                {t('sizeDesc', lang)}
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