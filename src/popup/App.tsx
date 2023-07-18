import { FC } from 'react'
import { ChakraBaseProvider } from '@chakra-ui/react'

import customTheme from '../shared/theme'

import SettingPanel from './components/SettingPanel'

const App: FC = () => {
    return (
        <ChakraBaseProvider theme={customTheme}>
            <SettingPanel />
        </ChakraBaseProvider>
    )
}

export default App