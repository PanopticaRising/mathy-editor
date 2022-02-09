import { useCallback, useContext, useEffect, useRef } from "react"

import { keymap, highlightSpecialChars, drawSelection, highlightActiveLine, EditorView } from "@codemirror/view"
import { Compartment, EditorState } from "@codemirror/state"
import { history, historyKeymap } from "@codemirror/history"
import { foldGutter, foldKeymap } from "@codemirror/fold"
import { indentOnInput } from "@codemirror/language"
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter"
import { defaultKeymap } from "@codemirror/commands"
import { bracketMatching } from "@codemirror/matchbrackets"
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import { autocompletion, completionKeymap, completeFromList } from "@codemirror/autocomplete"
import { commentKeymap } from "@codemirror/comment"
import { rectangularSelection } from "@codemirror/rectangular-selection"
import { defaultHighlightStyle } from "@codemirror/highlight"
import { lintKeymap } from "@codemirror/lint"
import { oneDark } from "@codemirror/theme-one-dark"
import { SaveStateContext, SUPPORTED_CODING_TYPES } from "../PluginManager/Loaders/SaveStateManager"
import { Accordion, AccordionSummary, Typography, AccordionDetails, Select, MenuItem } from "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import _ from "lodash"
import { StudentInputContext } from "../PluginManager/Loaders/StudentInputManager"

import { python } from '@codemirror/lang-python'
import { javascript, snippets } from '@codemirror/lang-javascript'

import "./CodeMirror.css"

interface CodeBlockProps {
    uniqueName: string;
    code: unknown;
    lang: SUPPORTED_CODING_TYPES,
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ uniqueName, code, lang }) => {
    const window = useRef<HTMLDivElement>(null);
    const editor = useRef<EditorView | null>(null);
    const langCompartment = useRef(new Compartment());
    const { dispatch, state } = useContext(SaveStateContext);
    const { dispatch: dispatchStudentInput, state: stateStudentInput } = useContext(StudentInputContext);

    const getLangPackage = (lang: SUPPORTED_CODING_TYPES) => {
        switch (lang) {
            case SUPPORTED_CODING_TYPES.PYTHON:
                return python();
            case SUPPORTED_CODING_TYPES.JAVASCRIPT:
                return javascript({
                    jsx: false,
                    typescript: true,
                });
        }
    }

    const saveCode = useCallback(update => {
        if (update.docChanged) {
            dispatch?.({ type: 'SaveCode', uniqueName, code: update.state.toJSON() })
        }
    }, [dispatch, uniqueName]);

    useEffect(() => {
        if (!editor.current) return;

        editor.current.dispatch({
            effects: langCompartment.current.reconfigure(getLangPackage(lang))
        })
    }, [lang]);

    useEffect(() => {
        // TODO: Reload on a lang change
        if (!window.current || editor.current) {
            return;
        }

        let startState = EditorState.fromJSON(code, {
            extensions: [
                langCompartment.current.of(getLangPackage(lang)),
                lineNumbers(),
                highlightActiveLineGutter(),
                highlightSpecialChars(),
                history(),
                foldGutter(),
                drawSelection(),
                EditorState.allowMultipleSelections.of(true),
                indentOnInput(),
                defaultHighlightStyle.fallback,
                bracketMatching(),
                closeBrackets(),
                autocompletion({
                    override: [
                        completeFromList(state.Variables.map(v => `${v.uniqueName}`)),
                        completeFromList(
                            _(stateStudentInput).keys().map(key => {
                                const varNames = _.keys(stateStudentInput[key]);
                                return varNames;
                            }).flatten().value())
                    ]
                }),
                rectangularSelection(),
                highlightActiveLine(),
                highlightSelectionMatches(),
                oneDark,
                keymap.of([
                    ...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...searchKeymap,
                    ...historyKeymap,
                    ...foldKeymap,
                    ...commentKeymap,
                    ...completionKeymap,
                    ...lintKeymap
                ]),
                EditorView.updateListener.of(saveCode)
            ],
        })

        editor.current = new EditorView({
            state: startState,
            parent: window.current,
        });

        // return () => { 
        //     editor.current = null; 
        // }
        // Intentionally not reloading when code changes; It can only change because of this effect right now.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, lang, uniqueName, window, editor.current])


    return <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography variant='h5' fontFamily='monospace'>
                Event: {uniqueName}
            </Typography>
            <Select
                value={lang}
                onClick={e => e.stopPropagation()}
                onChange={(e) => dispatch?.({ type: 'ChangeCodeLang', uniqueName: uniqueName, lang: e.target.value as SUPPORTED_CODING_TYPES })}>
                <MenuItem value={SUPPORTED_CODING_TYPES.PYTHON}>Python</MenuItem>
                <MenuItem value={SUPPORTED_CODING_TYPES.JAVASCRIPT}>Javascript</MenuItem>
            </Select>
        </AccordionSummary>
        <AccordionDetails>
            <div className='codemirror' ref={window} style={{ backgroundColor: 'grey', width: '100%', height: '300px' }}></div>
        </AccordionDetails>
    </Accordion>;
}

export default CodeBlock;
