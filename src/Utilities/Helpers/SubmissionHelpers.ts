import _ from "lodash";
import { useContext, useCallback } from "react";
import { SaveStateContext, SUPPORTED_CODING_TYPES } from "../../PluginManager/Loaders/SaveStateManager";
import { StudentInputContext, StudentInputData } from "../../PluginManager/Loaders/StudentInputManager";
import { VarPluginContext } from "../../PluginManager/Loaders/VarPluginProvider";
import PyodideContext from "../../PyodideContext";
import { ComputeEngine, match } from '@cortex-js/compute-engine';

interface CodeComponents {
    localSeed: string;
    VARIABLES: string;
    STUDENT_INPUTS: string;
    code: string;
}


const interpolatePythonCode = ({ localSeed, VARIABLES, STUDENT_INPUTS, code }: CodeComponents) => {
    return `
from sympy import symbols

${VARIABLES}
${STUDENT_INPUTS}

${code}
`;
}

const interpolateJSCode = ({ localSeed, VARIABLES, STUDENT_INPUTS, code }: CodeComponents) => {
    return `
    ${VARIABLES}
    ${STUDENT_INPUTS}

    ${code}
`
}

const getJSRunner = (code: string) => {
    // eslint-disable-next-line no-new-func
    return Function('ce', 'match', code);
}

const interpolateStudentInputsToPython = (stateStudentInput: StudentInputData) => (
    _(stateStudentInput).keys().map(key => {
        const varNames = _.keys(stateStudentInput[key]);

        return varNames.map(v => {
            const value = stateStudentInput[key][v] ?? 'None';
            // If no value was inputted, use Python's Nonetype.
            if (value === '') {
                return `${v}=None`
            }
            const numeric = _.toNumber(value);

            // If the value is not numeric, treat it as a string.
            if (_.isNaN(numeric)) {
                return `${v}="${(value as string).toString().replaceAll('\\', '\\\\')}"`
            }

            // If the value is numeric, treat it as a number.
            return `${v}=${value}`
        });
    }).value().join('\n')
);

const interpolateStudentInputsToJS = (stateStudentInput: StudentInputData) => (
    _(stateStudentInput).keys().map(key => {
        const varNames = _.keys(stateStudentInput[key]);

        return varNames.map(v => {
            const value = stateStudentInput[key][v] ?? 'null';
            // If no value was inputted, use null.
            if (value === '') {
                return `const ${v} = null`
            }
            const numeric = _.toNumber(value);

            // If the value is not numeric, treat it as a string.
            if (_.isNaN(numeric)) {
                return `const ${v}="${(value as string).toString().replaceAll('\\', '\\\\')}"`
            }

            // If the value is numeric, treat it as a number.
            return `const ${v}=${value}`
        });
    }).value().join('\n')
);

interface InterpolaterFunctions {
    interpolateCode: (arg: CodeComponents) => string;
    interpolateStudentInputs: (arg: StudentInputData) => string;
}

const getInterpolaters = (lang: SUPPORTED_CODING_TYPES): InterpolaterFunctions => {
    switch (lang) {
        case SUPPORTED_CODING_TYPES.JAVASCRIPT:
            return { interpolateCode: interpolateJSCode, interpolateStudentInputs: interpolateStudentInputsToJS, };
        case SUPPORTED_CODING_TYPES.PYTHON:
            return { interpolateCode: interpolatePythonCode, interpolateStudentInputs: interpolateStudentInputsToPython, };
    }
}

export function useVarValueFunction() {
    const { state } = useContext(SaveStateContext);
    const varPlugins = useContext(VarPluginContext);
    const { localSeed } = useContext(StudentInputContext);

    const getVarValue = useCallback((uniqueName: string) => {
        const variable = _.find(state.Variables, ['uniqueName', uniqueName]);
        if (!variable) throw new Error('Could not find variable with name' + uniqueName);

        const varPlugin = _.find(varPlugins, ['type', variable.name]);
        if (!varPlugin) {
            console.error('failed to find ', variable.name, 'in ', varPlugins);
            throw new Error('Failed to load variable plugin.');
        }

        return varPlugin.function(`${variable.uniqueName}${localSeed}`, variable.customizations)
    }, [localSeed, state.Variables, varPlugins]);

    return getVarValue;
}

export function useSubmitter(eventUniqueName: string) {
    const { state: stateSaveState } = useContext(SaveStateContext);
    const { state: stateStudentInput, localSeed, setResult } = useContext(StudentInputContext);
    const pyodide = useContext(PyodideContext);
    const getVarValue = useVarValueFunction();

    const localPythonEvaluation = async () => {
        const codeData = stateSaveState.Code[eventUniqueName];
        if (!codeData) { throw new Error('Could not find code data for ' + eventUniqueName); }

        if (codeData.lang === SUPPORTED_CODING_TYPES.PYTHON && !pyodide) throw new Error('Pyodide not loaded in local environment.');

        const { interpolateCode, interpolateStudentInputs } = getInterpolaters(codeData.lang);

        const STUDENT_INPUTS = interpolateStudentInputs(stateStudentInput);

        // TODO: Move this into variable plugins
        const VARIABLES = _(stateSaveState.Variables).map(v => codeData.lang === SUPPORTED_CODING_TYPES.PYTHON ?
            `${v.uniqueName} = ${getVarValue(v.uniqueName)}` :
            `const ${v.uniqueName} = ${getVarValue(v.uniqueName)}`
        ).value().join('\n')


        // TODO: Match lang, if Javascript, run in some secure runtime.

        const runner = interpolateCode({
            // TODO: Is this necessary?
            localSeed: localSeed.toString(),
            VARIABLES,
            STUDENT_INPUTS,
            code: (codeData.code as any).doc
        });

        console.log(runner);

        const ce = new ComputeEngine();
        console.log(ce, match);

        let s = (codeData.lang === SUPPORTED_CODING_TYPES.PYTHON && pyodide) ? await pyodide(runner, undefined) : getJSRunner(runner)(ce, match);

        console.log(s);

        if (s === true) setResult({ score: 1 })
        else if (s === false) setResult({ score: 0 })
        else if (typeof s === 'number') setResult({ score: s })
        else {
            console.error('Unknown result from Python:' + s);
            setResult(null);
        }

        return s;
    }

    const submit = useCallback(localPythonEvaluation, [eventUniqueName, getVarValue, localSeed, pyodide, setResult, stateSaveState.Code, stateSaveState.Variables, stateStudentInput]);

    return submit;
}
