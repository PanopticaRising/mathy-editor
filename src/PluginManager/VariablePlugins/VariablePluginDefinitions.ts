interface VariablePluginProps {
    uniqueIdentifier: string
}

export type VariablePluginUI = React.FC<VariablePluginProps>;

type CustomInputs = {
    [x: string]: unknown;
}

export interface VariablePlugin {
    type: string,
    interface: VariablePluginUI,
    function: (randomSeed: number, customInputs: CustomInputs) => unknown,
}