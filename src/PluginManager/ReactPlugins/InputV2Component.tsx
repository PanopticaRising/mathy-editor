import { useEffect } from 'react';
import { MathLive } from '../../Utilities/Components/MathLive';
import { ComponentPluginState, ReactComponentPlugin } from '../ComponentPlugin';
import { useComponentCustomization } from '../Loaders/SaveStateManager';
import { useStudentInputs } from '../Loaders/StudentInputManager';
interface InputV2ComponentCustomization {
    label: string;
}

interface InputV2StudentInputs {
    answerbox: string;
}

export const InputV2Component: ReactComponentPlugin<InputV2ComponentCustomization, InputV2StudentInputs> = ({ instanceName, state: mode }) => {
    const { state, updateState } = useComponentCustomization<InputV2ComponentCustomization>(instanceName, mode);
    const { studentInputsState, updateStudentInputsState } = useStudentInputs<InputV2StudentInputs>(instanceName);

    useEffect(() => {
        console.log('rerendering', instanceName, state);
    });

    if (mode === ComponentPluginState.EDIT) {
        return <>
            <input defaultValue={state.label} onInput={(e) => updateState({ label: (e.target as HTMLInputElement).value })} />
            {/* <input disabled value={studentInputsState?.answerbox ?? ''} /> */}
            <MathLive disabled value={studentInputsState?.answerbox ?? ''} />
        </>
    }

    return <>
        <label>{state.label}</label>
        {/* TODO: Disable this for locked condition, when Student Input is frozen in time. */}
        {/* <input disabled={false} onInput={(e) => updateStudentInputsState({ answerbox: (e.target as HTMLInputElement).value })} value={studentInputsState?.answerbox ?? ''} /> */}
        <MathLive onInput={(e) => updateStudentInputsState({ answerbox: (e.target as HTMLInputElement).value })} value={studentInputsState?.answerbox ?? ''} />
    </>
}

InputV2Component.displayName = 'Input v2';

InputV2Component.defaultValues = {
    label: 'Generic Label: '
}

InputV2Component.defaultCustomization = {
    answerbox: ''
}

export default InputV2Component;