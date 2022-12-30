/**
 * This is a Context that provides a space to store student inputs.
 * This space will then be collected and ported into Python for solution comparisons.
 */

import _ from "lodash";
import { createContext, Dispatch, Reducer, useContext, useEffect, useReducer, useState } from "react";
import { Chance } from 'chance';

declare global {
    interface Window {
        chance: Chance.Chance;
    }
}


// TODO: Move to a more central location.
export type StudentInputs = {
    [nameToUseInPython: string]: any,
}

/**
 * 
 */
export interface StudentInputData {
    // The unique name of the Component the input is targetting
    [uniqueName: string]: StudentInputs
}

type SaveActions =
    | { type: 'SetStudentInput', uniqueName: string, studentInputs: StudentInputData }
    | { type: 'Download' }
    | { type: 'Load', json: StudentInputData }
    | { type: 'Submit' }


export function downloadObjectAsJson(exportObj: StudentInputData, exportName: string) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


function reducer(state: StudentInputData, action: SaveActions): StudentInputData {
    console.log(`Recieved action for ${action.type}`);
    switch (action.type) {
        case "SetStudentInput":
            state[action.uniqueName] = action.studentInputs;
            return { ...state };
        case "Download":
            downloadObjectAsJson(state, 'sample-problem');
            return state;
        case "Load":
            console.log(action.json);
            // return { ...action.json };
            return Object.assign({}, action.json);
        case "Submit":
            console.log(state);
            return state;
        default:
            return state;
    }
}

const emptySaveState = {};

type StudentInputContextType = {
    dispatch?: Dispatch<SaveActions>,
    state: StudentInputData,
    localSeed: number,
    setLocalSeed: (s: number) => void,
    result: ResultData | null,
    setResult: (x: ResultData | null) => void,
};

export const StudentInputContext = createContext<StudentInputContextType>({ state: emptySaveState, localSeed: 0, setLocalSeed: _.noop, result: null, setResult: _.noop });

/**
 * Pass in your component's uniqueName to access scoped storage.
 */
// TODO: Make a unique type for uniqueName to prevent accidental misuse.
export function useStudentInputs<T extends StudentInputs>(uniqueName: string) {
    const { dispatch, state } = useContext(StudentInputContext);

    return {
        updateStudentInputsState: (studentInputs: T): void => {
            dispatch?.({ type: 'SetStudentInput', uniqueName: uniqueName, studentInputs: studentInputs });
        },
        studentInputsState: state[uniqueName] as T,
    }
}

interface ResultData {
    score: number;
}

export const StudentInputProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer<Reducer<StudentInputData, SaveActions>>(reducer, emptySaveState);
    const [result, setResult] = useState<ResultData | null>(null);
    const [localSeed, setLocalSeed] = useState<number>(0);

    useEffect(() => {
        window.chance = new Chance(localSeed);
    }, [localSeed]);

    // Debug
    (window as any).StudentInputProvider = dispatch;

    return <StudentInputContext.Provider value={{ dispatch, state, localSeed, setLocalSeed, result, setResult }}>
        {children}
    </StudentInputContext.Provider>
}