// This component is responsible for exposing a Register function for plugins, and passing those plugins down to the UI.

import _ from "lodash";
import { createContext, useCallback, useEffect, useState } from "react";
import { VariablePlugin } from "../VariablePlugins/VariablePluginDefinitions";

interface DefaultVarImport {
    default: SupportedVarPluginImports;
}

// Currently, I'm not planning on instantiating vars.
// export type SupportedPluginTypes = ReactComponentPluginElement | ComponentPlugin;

export type SupportedVarPluginImports = VariablePlugin;

export const VarPluginContext = createContext<SupportedVarPluginImports[]>([]);

export const VarPluginProvider: React.FC = ({ children }) => {
    const [varPlugins, setVarPlugins] = useState<SupportedVarPluginImports[]>([]);

    const importAllPlugins = (): DefaultVarImport[] => {
        function importAll(r: __WebpackModuleApi.RequireContext) {
            return r.keys().map(r);
        }

        return importAll(require.context('../VariablePlugins', true, /\.tsx$/)) as DefaultVarImport[];
    }

    useEffect(() => {
        const plugins = importAllPlugins().map(classDef => {
            classDef.default.function = _.memoize(classDef.default.function);
            return classDef.default
        });
        setVarPlugins(plugins);
    }, []);

    return <VarPluginContext.Provider value={varPlugins}>
        {children}
    </VarPluginContext.Provider>
}