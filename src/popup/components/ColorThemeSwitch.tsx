import { FC, useState } from 'react'
import { Box, FormLabel, Icon, Input, useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

const ColorThemeSwitch: FC = () => {
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <FormLabel
            htmlFor='color-theme-switch'
            as={'label'}
            display='flex'
            alignItems='center'
            justifyContent='center'
            gap={2}
            position='relative'
        >
            <Input
                id='color-theme-switch'
                type='checkbox'
                checked={colorMode === 'light' ? true : false}
                onChange={toggleColorMode}
                display='inline-block'
                appearance='none'
                cursor='pointer'
                height='24px'
                width='48px'
                backgroundColor='blue.50'
                border='1px solid'
                borderColor='blue.200'
                borderRadius='full'
            />
            <Box
                className={`iconMove `}
                transition='all 0.2s ease-in'
                transform={`${colorMode === 'light' ? 'translateX(0)' : 'translateX(24px)'}`}
                position='absolute'
                cursor='pointer'
                top={'1px'}
                left={'1px'}
                w={'22px'}
                h={'22px'}
                bg='blue.900'
                borderRadius='full'
            >
                <Icon
                    as={colorMode === 'light' ? SunIcon : MoonIcon}
                    padding='2px'
                    w={'22px'}
                    h={'22px'}
                />
            </Box>
        </FormLabel>
    )
}

export default ColorThemeSwitch