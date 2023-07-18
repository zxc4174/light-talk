import { FC, useEffect, useState } from "react"
import { Box, HStack, Text, useRadio, useRadioGroup } from "@chakra-ui/react"
import { getUserConfig, popoverSize, updateUserConfig } from "../../shared/config"

function RadioCard(props) {
    const { getInputProps, getRadioProps } = useRadio(props)

    const input = getInputProps()
    const checkbox = getRadioProps()

    return (
        <Box as='label'>
            <input {...input} />
            <Box
                {...checkbox}
                cursor='pointer'
                borderWidth='1px'
                borderRadius='25px'
                color='gray.500'
                userSelect='none'
                _checked={{
                    color: 'white',
                    bg: 'brand.600',
                    borderColor: 'brand.600',
                    cursor: 'default',
                    _hover: {
                        color: 'white',
                        bg: 'brand.600',
                    }
                }}
                _hover={{
                    color: 'gray.500',
                    bg: 'blackAlpha.100'
                }}
                px='12px'
                py='8px'
            >
                {props.children}
            </Box>
        </Box >
    )
}

interface SizeRadioGroupProps {
    onUpdated: (label: string) => void
}

const SizeRadioGroup: FC<SizeRadioGroupProps> = ({ onUpdated }) => {
    const [value, setValue] = useState<popoverSize>(popoverSize.Medium)
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'size',
        value,
        onChange(nextValue) {
            setValue(nextValue as popoverSize)
            updateUserConfig({ popoverSize: nextValue as any })
            onUpdated('Size updated')
        },
    })

    const group = getRootProps()

    useEffect(() => {
        getUserConfig().then((config) => {
            setValue(config.popoverSize)
        })
    }, [])

    const options = [
        {
            value: popoverSize.Medium,
            label: 'Medium'
        },
        {
            value: popoverSize.Large,
            label: 'Large'
        }
    ]

    return (
        <HStack {...group}>
            {options.map((o) => {
                const radio = getRadioProps({ value: o.value })
                return (
                    <RadioCard key={o.value} {...radio}>
                        <Text fontWeight='bold'>{o.label}</Text>
                    </RadioCard>
                )
            })}
        </HStack>
    )
}

export default SizeRadioGroup