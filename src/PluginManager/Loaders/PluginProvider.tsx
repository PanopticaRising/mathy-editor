// This component is responsible for exposing a Register function for plugins, and passing those plugins down to the UI.

import _ from "lodash";
import React from "react";
import { createContext, useCallback, useEffect, useState } from "react";
import { ComponentPlugin, ComponentPluginConstructor, ComponentPluginState, ReactComponentPlugin, ReactComponentPluginElement } from "../ComponentPlugin";

interface DefaultImport {
    default: SupportedPluginImports;
}

export type SupportedPluginTypes = ReactComponentPluginElement | ComponentPlugin;

export type SupportedPluginImports = ReactComponentPlugin | ComponentPluginConstructor;

type PluginContextProvides = {
    plugins: SupportedPluginImports[],
    utilities: {
        createComponentInstance?: (name: string, uniqueName: string) => SupportedPluginTypes,
        findPluginConstructorByName?: (name: string) => SupportedPluginImports | undefined
    }
};

export const PluginContext = createContext<PluginContextProvides>({ plugins: [], utilities: {} });

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

    const findPluginConstructorByName = useCallback((name: string) => _.find(components, ['name', name]), [components]);

    const createComponentInstance = useCallback((name: string, uniqueName: string): SupportedPluginTypes => {
        const pluginConstructor = findPluginConstructorByName(name);
        if (!pluginConstructor) {
            console.warn('Could not find a plugin for ', name);
            throw new Error(`Missing plugin ${name}`);
        }

        if ('_ComponentPlugin' in pluginConstructor) {
            return new pluginConstructor(uniqueName);
        } else {
            return React.createElement(pluginConstructor, { instanceName: uniqueName, state: ComponentPluginState.DISPLAY })
        }
    }, [findPluginConstructorByName]);


    return <PluginContext.Provider value={{ plugins: components, utilities: { createComponentInstance, findPluginConstructorByName } }}>
        {children}
    </PluginContext.Provider>
}