import { theme as origTheme, extendTheme } from "@chakra-ui/react"

const customTheme = extendTheme({
    config: {
        initialColorMode: 'system',
        useSystemColorMode: true,
        prefix: 'light-talk'
    },
    styles: {
        global: () => ({
            html: {
                height: '623px',
                width: '446px',
            },
            body: {
                height: '623px',
                width: '446px',
                margin: 0
            },
            '&::-webkit-scrollbar': {
                width: '10px',
                height: '10px',
                backgroundColor: 'transparent'
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: '#f5f5f5',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c7c7c7',
                borderRadius: '50px',
                '&:hover': {
                    backgroundColor: '#a0a0a0'
                }
            },
        }),
    },
    colors: {
        // Add custom colors or override existing colors here.
        brand: {
            100: "#B3EDE7",
            200: "#99E1D4",
            300: "#80D4C0",
            400: "#66C8AD",
            500: "#4DBB99",
            600: "#42ABA0", // Main Color
            700: "#367F77",
            800: "#29535E",
            900: "#24645D", // Dark Color
        },
        brandLinerColor: 'linear-gradient(128.76deg, #FAE69E -20.5%, #42ABA0 69.99%)',
        borderColor: "rgb(219, 220, 224)",
    },
    components: {
        Alert: {
            variants: {
                solid: (props) => { // only applies to `subtle` variant
                    const { colorScheme: c } = props
                    return {
                        container: {
                            bg: `${c}.700`,
                            color: 'white'
                        },
                    }
                }
            }
        }
    }
})

export default customTheme
