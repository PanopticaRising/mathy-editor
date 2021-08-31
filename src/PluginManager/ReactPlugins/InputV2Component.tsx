import { useState } from 'react';
import { ComponentPluginState, ReactComponentPlugin } from '../ComponentPlugin';
import { useComponentCustomization } from '../Loaders/SaveStateManager';
import { useStudentInputs } from '../Loaders/StudentInputManager';

interface InputV2ComponentCustomization {
    label: string;
}

interface InputV2StudentInputs {
    answerbox: string;
}

export const InputV2Component: ReactComponentPlugin<InputV2ComponentCustomization> = ({ instanceName, state: mode }) => {
    const { state, updateState } = useComponentCustomization<InputV2ComponentCustomization>(instanceName);
    const { studentInputsState, updateStudentInputsState } = useStudentInputs<InputV2StudentInputs>(instanceName);

    if (mode === ComponentPluginState.EDIT) {
        return <>
            <input defaultValue={state.label} onInput={(e) => updateState({ label: (e.target as HTMLInputElement).value })} />
            <input disabled />
        </>
    }

    return <>
        <label>{state.label}</label>
        <input disabled={mode !== ComponentPluginState.DISPLAY} onInput={(e) => updateStudentInputsState({ answerbox: (e.target as HTMLInputElement).value })} />
    </>
}

InputV2Component.displayName = 'Input v2';

InputV2Component.defaultValues = {
    label: 'Generic Label: '
}

export default InputV2Component;