// This component is responsible for exposing a Register function for plugins, and passing those plugins down to the UI.

import { createContext, useEffect, useState } from "react";
import { ComponentPlugin, ComponentPluginConstructor, ReactComponentPlugin, ReactComponentPluginElement } from "../ComponentPlugin";

interface DefaultImport {
    default: SupportedPluginImports;
}

export type SupportedPluginTypes = ReactComponentPluginElement | ComponentPlugin;

export type SupportedPluginImports = ReactComponentPlugin | ComponentPluginConstructor;

export const PluginContext = createContext<SupportedPluginImports[]>([]);

export const PluginProvider: React.FC = ({ children }) => {
    const [components, setComponents] = useState<SupportedPluginImports[]>([]);

    const importAllPlugins = (): DefaultImport[] => {
        function importAll(r: __WebpackModuleApi.RequireContext) {
            return r.keys().map(r);
        }

        const ClassPlugins = importAll(require.context('../Plugins', true, /\.tsx$/)) as DefaultImport[];
        const FunctionalPlugins = importAll(require.context('../ReactPlugins', true, /\.tsx$/)) as DefaultImport[];
        return ClassPlugins.concat(FunctionalPlugins);
    }

    useEffect(() => {
        const plugins = importAllPlugins().map(classDef => classDef.default);
        setComponents(plugins);
    }, []);

    return <PluginContext.Provider value={components}>
        {children}
    </PluginContext.Provider>
}