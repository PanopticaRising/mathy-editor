/**
 * This is a Context that provides a space to store student inputs.
 * This space will then be collected and ported into Python for solution comparisons.
 */

import _, { uniq } from "lodash";
import { createContext, Dispatch, Reducer, useContext, useReducer } from "react";

// TODO: Move to a more central location.
export type StudentInputs = {
    [nameToUseInPython: string]: any,
}

/**
 * 
 */
interface StudentInputData {
    // The unique name of the Component the input is targetting
    [uniqueName: string]: StudentInputs
}

type SaveActions =
    | { type: 'SetStudentInput', uniqueName: string, studentInputs: StudentInputData }
    | { type: 'Download' }
    | { type: 'Load', json: StudentInputData }


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
            return action.json;
        default:
            return state;
    }
}

const emptySaveState = {};

export const StudentInputContext = createContext<{ dispatch?: Dispatch<SaveActions>, state: StudentInputData }>({ state: emptySaveState });

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

export const StudentInputProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer<Reducer<StudentInputData, SaveActions>>(reducer, emptySaveState);

    // Debug
    (window as any).StudentInputProvider = dispatch;

    return <StudentInputContext.Provider value={{ dispatch, state }}>
        {children}
    </StudentInputContext.Provider>
}