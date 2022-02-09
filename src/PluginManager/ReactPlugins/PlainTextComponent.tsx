import { ComponentPluginState, ReactComponentPlugin } from '../ComponentPlugin';
import { useComponentCustomization } from '../Loaders/SaveStateManager';

export interface PlainTextCustomization {
    text: string;
}

export const PlainTextComponent: ReactComponentPlugin<PlainTextCustomization> = ({ instanceName, state: mode }) => {
    const { state, updateState } = useComponentCustomization<PlainTextCustomization>(instanceName, mode);

    if (mode === ComponentPluginState.EDIT) {
        return <textarea defaultValue={state.text} onChange={(e) => updateState({ text: e.target.value })} />
    }

    return <p>{state.text}</p>;
}

PlainTextComponent.displayName = 'Plain Text';

PlainTextComponent.defaultValues = {
    text: 'Please answer the problem below.'
}

PlainTextComponent.defaultCustomization = {};

export default PlainTextComponent;