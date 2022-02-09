import { SupportedPluginImports, SupportedPluginTypes } from "./Loaders/PluginProvider";
import { Customizations } from "./Loaders/SaveStateManager";

// TODO: This type needs to limit what Plugins can pass to the Solver, because not every language feature may be easily passed to a Solver.
type SerializableAnswer = unknown;

// This function provides stable storage for Plugins that don't need to write imperative getBodyAnswers code to store their solutions.
type AnswerStorageFunction = (content: SerializableAnswer) => void;

// A VariablePluginType is a type of Randomized Variable that is shown in the interface. While some types are just builtins, like Strings,
// some are custom, complex, or validated to match specific needs. 
type VariablePluginType = unknown;

// A plugin may expose CustomParameters that a user can pass Variables into. A CustomParameter may accept a group of types.
type CustomParameters = { [name: string]: VariablePluginType[] };

// This is a cheap hack we'll use to dangerously assert that we're working with instantiated children of the ComponentPlugin.
type Constructor<T> = {
    new(arg: string): T;
};

export type ComponentPluginConstructor = { _ComponentPlugin: boolean } & Constructor<ComponentPlugin>;

export const getSupportedDisplayName = (arg: SupportedPluginImports | SupportedPluginTypes) => {
    // Functional React
    if ('displayName' in arg) {
        return arg.displayName;
    } else if ('type' in arg) {
        return arg.type.displayName;
    } else {
        return Object.getPrototypeOf(arg).constructor.displayName;
    }
}

// Instance names are, obviously, not static, and therefore not applicable on base imports.
export const getSupportedInstanceName = (arg: SupportedPluginTypes) => {
    if ('instanceName' in arg) {
        return arg.instanceName;
    } else if ('props' in arg) {
        return arg.props.instanceName;
    } else {
        return 'Unsupported Plugin - Instance Name Missing';
    }
}

export abstract class ComponentPlugin {
    static readonly _ComponentPlugin = true;

    // A name that describes, at-a-glance, the functionality of this Component.
    static readonly displayName: string = 'Override DisplayName in Plugin.tsx';
    // abstract readonly displayName: string;
    readonly instanceName: string;

    constructor(instanceName: string) {
        this.instanceName = instanceName;
    }

    /* A function that generates the HTML that is displayed to the user.
     *   @param uniqueIdentifier      - This value must be prepended to all `name` and `id` attributes used in your HTML for organization,
                                        and to enable the use of the getBodyAnswers function.
     *   @param answerStorageCallback - If answers are generated in real-time, they can be passed to this callback function.
     *                                  They will be converted to the appropriate language and made available in the Solver language.
     *                                  There may be limitations on the type or form that answers may be stored.
     */
    abstract getBodyHTML: (uniqueIdentifier: string, answerStorageCallback: AnswerStorageFunction) => JSX.Element;

    // This function gets called when answers are being collected and the AnswerStorageFunction has not been used.
    // Plugins should iteratively collect answers from the HTML that they generated, i.e. document.getElementById(`equation${uniqueIdentifier}`).value
    abstract getBodyAnswers: (uniqueIdentifier: string) => SerializableAnswer;

    abstract getCustomParameters: () => CustomParameters;
}

export enum ComponentPluginState {
    DISPLAY,
    EDIT,
    LOCKED,
}

// This is the successor to the ComponentPluginState. The intention is that there are only 2 types of page, which makes for
// a better descriptor of how the component is displayed.
export enum ComponentPluginPageType {
    DESIGNER,
    VIEW
}

// Have a context to store Answers.
// If a component needs to imperitavely collect answers, let it register a Collect() function with the context that can be called at submit-time.
// Otherwise, components can use a wrapper around the context to dynamically update the context with Answers.

interface ReactComponentProps {
    instanceName: string,
    state: ComponentPluginState,
};

export type ReactComponentPlugin<T extends Customizations = {}, C = {}> = React.FC<ReactComponentProps> & { displayName: string } & { defaultValues: T } & { defaultCustomization: C };
export type ReactComponentPluginElement = React.FunctionComponentElement<ReactComponentProps>;

