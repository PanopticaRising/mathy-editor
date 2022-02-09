interface VariablePluginProps {
    uniqueIdentifier: string
}

export type VariablePluginUI<T = any> = React.FC<VariablePluginProps> & { defaultCustomization: T };

type CustomInputs = {
    [x: string]: unknown;
}

export interface VariablePlugin {
    type: string,
    interface: VariablePluginUI,
    function: (randomSeed: string, customInputs: CustomInputs) => unknown,
}