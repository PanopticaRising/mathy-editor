import {
    createTheme,
    CssBaseline,
    ThemeProvider,
    Theme,
    StyledEngineProvider,
    adaptV4Theme,
} from '@mui/material';
import { useMemo, useState } from 'react';


export const GlobalTheme: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [prefersDarkMode, setPrefersDarkMode] = useState(true);

    const theme = useMemo(
        () =>
            createTheme(adaptV4Theme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                    primary: {
                        main: '#2196F3',
                        dark: '#012c4e',
                    },
                    secondary: {
                        main: '#f50057',
                    },
                },
            })),
        [prefersDarkMode],
    );

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
                <button onClick={() => setPrefersDarkMode(!prefersDarkMode)}>Lights</button>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default GlobalTheme;
