import { createTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import { useMemo, useState } from 'react';

export const GlobalTheme: React.FC<{}> = ({ children }) => {
    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [prefersDarkMode, setPrefersDarkMode] = useState(true);

    const theme = useMemo(
        () =>
            createTheme({
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
            }),
        [prefersDarkMode],
    );

    return <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <button onClick={() => setPrefersDarkMode(!prefersDarkMode)}>Lights</button>
    </ThemeProvider>;
}

export default GlobalTheme;
