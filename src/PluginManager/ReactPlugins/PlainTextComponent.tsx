import { useState } from 'react';
import { ComponentPluginState, ReactComponentPlugin } from '../ComponentPlugin';
import { useComponentCustomization } from '../Loaders/SaveStateManager';

export interface PlainTextCustomization {
    text: string;
}

export const PlainTextComponent: ReactComponentPlugin<PlainTextCustomization> = ({ instanceName, state: mode }) => {
    const { state, updateState } = useComponentCustomization<PlainTextCustomization>(instanceName);

    if (mode === ComponentPluginState.EDIT) {
        return <textarea defaultValue={state.text} onChange={(e) => updateState({ text: e.target.value })} />
    }

    return <p>{state.text}</p>;
}

PlainTextComponent.displayName = 'Plain Text';

PlainTextComponent.defaultValues = {
    text: 'Please answer the problem below.'
}

export default PlainTextComponent;