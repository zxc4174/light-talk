import { FC, Fragment, useEffect, useState } from 'react'
import { ButtonGroup, IconButton, Tag, Tooltip, UseRadioProps, useId, useRadio, useRadioGroup } from '@chakra-ui/react'

import { QueryMode, getUserConfig, updateUserConfig } from '../../shared/config'
import CompletionIcon from '../../shared/icons/CompletionIcon'
import ChatIcon from '../../shared/icons/ChatIcon'

interface ModeRadioButtonProps extends UseRadioProps {
    label: string
    description: string
    icon: React.ReactElement
}

const ModeRadioButton: FC<ModeRadioButtonProps> = ({
    label, description, icon,
    ...useRadioProps
}) => {
    const id = useId(useRadioProps.id, 'modeIcons')
    const { getInputProps, getCheckboxProps } = useRadio({ id, ...useRadioProps })

    const input = getInputProps()
    const checkbox = getCheckboxProps()

    return (
        <Fragment>
            <Tooltip
                hasArrow
                label={
                    <div>
                        <Tag my={1}>{label}</Tag>
                        <p>{description}</p>
                    </div>
                }
                bg='gray.700'
                color='white'
                mx={2}
                borderRadius={4}
                py={2}
            >
                <IconButton
                    aria-label={label}
                    size='lg'
                    icon={icon}
                    as='label'
                    htmlFor={input.id}
                    {...checkbox}
                    borderRadius='50%'
                    borderWidth={1}
                    bg='white'
                    opacity={0.8}
                    cursor='pointer'
                    _checked={{
                        borderColor: '#42ABA0',
                        borderWidth: '2px',
                        bg: 'blackAlpha.100',
                        opacity: 1,
                        cursor: 'default'
                    }}
                    _hover={{
                        bg: 'blackAlpha.100',
                        opacity: 1,
                    }}
                />
            </Tooltip>
            <input {...input} />
        </Fragment>
    )
}

interface DefaultModeRadioGroupProps {
    onUpdated: (label: string) => void
}

const DefaultModeRadioGroup: FC<DefaultModeRadioGroupProps> = ({ onUpdated }) => {
    const [value, setValue] = useState<QueryMode>(QueryMode.Completion)
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'mode',
        value,
        onChange(nextValue) {
            setValue(nextValue as QueryMode)
            updateUserConfig({ queryMode: nextValue as any })
            onUpdated('Default Mode Updated')
        },
    })

    const group = getRootProps()

    useEffect(() => {
        getUserConfig().then((config) => {
            setValue(config.queryMode)
        })
    }, [])

    return (
        <ButtonGroup {...group}>
            <ModeRadioButton
                {...getRadioProps({ value: QueryMode.Completion })}
                label='Base Mode'
                description='Given a prompt, AI assistant will return answer, but it does not retain memory of previous interactions or conversations'
                icon={<CompletionIcon />}
            />
            <ModeRadioButton
                {...getRadioProps({ value: QueryMode.Chat })}
                label='Chart Mode'
                description='Enable more interactive and dynamic conversations by considering the context of the ongoing dialogue'
                icon={<ChatIcon />}
            />
        </ButtonGroup>
    )
}


export default DefaultModeRadioGroup