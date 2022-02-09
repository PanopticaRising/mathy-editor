import { useTheme } from '@material-ui/core';
import { MathfieldElement, MathfieldConfig } from 'mathlive';
import { FC, useEffect, useRef } from 'react';

interface MathLiveProps {
    disabled?: boolean,
    onInput?: (e: any) => void,
    value: any,
}

export const MathLive: FC<MathLiveProps> = ({ disabled, onInput, value }) => {
    const ref = useRef<HTMLDivElement>(null);
    const elem = useRef<MathfieldElement | null>(null);
    const theme = useTheme();

    useEffect(() => {
        if (!ref.current || elem.current) return;
        console.log('Use effect running again, creating new ML');

        const parent = ref.current;

        // TODO: Bundling the folders from node_modules seems to translate into a root-relative localhost request.
        const ml = new MathfieldElement({
            fontsDirectory: "//unpkg.com/mathlive/dist/fonts/",
            soundsDirectory: "//unpkg.com/mathlive/dist/sounds/",
            readOnly: disabled === true,
        });

        ml.style.backgroundColor = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)';
        ml.style.color = theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)';
        ml.style.border = '2px inset rgb(227, 227, 227)';

        if (onInput)
            ml.addEventListener('input', onInput);

        ref.current.appendChild(ml);

        elem.current = ml;

        // return () => { parent.removeChild(ml) };
    }, [disabled, onInput, ref, theme]);

    useEffect(() => {
        if (!elem.current) return;

        elem.current.setValue(value, { suppressChangeNotifications: true });
    }, [elem, value])

    return <div ref={ref} style={{
        backgroundColor: 'white',
        border: '1px solid darkgray',
        boxShadow: '1px 1px 1px 0 lightgray inset',
        font: '-moz-field',
        marginTop: '5px',
        padding: '2px 3px',
        width: '398px',
        display: 'inline-block',
        minHeight: '2em'
    }}></div>
}

// MathLive.whyDidYouRender = {
//     trackHooks: true,
//     logOnDifferentValues: true,
//     customName: 'MathLive'
// };

export default MathLive;
