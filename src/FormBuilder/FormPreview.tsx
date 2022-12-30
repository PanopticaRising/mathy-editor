/**
 * The FormPreview is really just the FormGUI centered without the debug tools.
 */

import React, { useContext, useEffect, useState } from "react";
import { PluginContext, SupportedPluginTypes } from '../PluginManager/Loaders/PluginProvider';
import { SupportedPluginsFactory } from './SupportedPluginsFactory';
import { ComponentPluginState, getSupportedInstanceName } from '../PluginManager/ComponentPlugin';
import { SaveStateContext } from "../PluginManager/Loaders/SaveStateManager";
import { StudentInputContext } from "../PluginManager/Loaders/StudentInputManager";
import { Alert } from "@mui/material";

export const FormPreview: React.FC = () => {
    const [formList, setFormList] = useState<SupportedPluginTypes[]>([]);
    const { utilities: { createComponentInstance } } = useContext(PluginContext);
    const { state } = useContext(SaveStateContext);
    const { result, setResult } = useContext(StudentInputContext);

    useEffect(() => {
        if (!createComponentInstance) {
            console.warn('Context has not initialized yet.');
            return;
        }
        const instances = state.Components.map(({ name, uniqueName }) => createComponentInstance(name, uniqueName));
        setFormList(instances);
    }, [createComponentInstance, state]);


    return <>
        {result &&
            <Alert
                severity={result.score > 0.75 ? 'success' : 'warning'}
                onClose={() => setResult(null)}
            >
                You recieved a score of {result.score * 100} on this problem.
            </Alert>}
        {formList.map((Item, ind) => <SupportedPluginsFactory key={getSupportedInstanceName(Item)} Item={Item} index={ind} mode={ComponentPluginState.LOCKED} />)}
    </>;
}