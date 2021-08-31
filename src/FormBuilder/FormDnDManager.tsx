import { Grid } from '@material-ui/core';
import _ from 'lodash';
import { useContext, useEffect, useState, useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { ComponentPlugin, ComponentPluginState, ReactComponentPluginElement } from '../PluginManager/ComponentPlugin';
import { PluginContext, SupportedPluginTypes } from '../PluginManager/Loaders/PluginProvider';
import { FormComponentPane } from './FormComponentPane';
import { FormGUI } from './FormGUI';
import React from 'react';
import { SaveStateContext } from '../PluginManager/Loaders/SaveStateManager';

export const FormDnDManager: React.FC = ({ children }) => {
    const [formList, setFormList] = useState<SupportedPluginTypes[]>([]);
    const pluginContext = useContext(PluginContext);
    const { dispatch, state } = useContext(SaveStateContext);

    // When a drag finishes, we should update the SaveState and let that inform our UI reconstruction.
    function onDragEnd(result: DropResult) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index && result.source.droppableId === result.destination.droppableId) {
            return;
        }

        // If from the same source, reorder.
        if (result.source.droppableId === result.destination.droppableId) {
            dispatch?.({
                type: 'ReorderComponent',
                startIndex: result.source.index,
                newIndex: result.destination.index,
            });
            // Else, insert at the intended index.
        } else {
            const pluginConstructor = _.find(pluginContext, ['name', result.draggableId]);
            if (!pluginConstructor) {
                console.warn('Could not find a plugin for ', result.draggableId);
                throw new Error(`Missing plugin ${result.draggableId}`);
            }

            dispatch?.({
                type: 'AddNewComponent',
                newIndex: result.destination.index,
                component: {
                    name: result.draggableId,
                    customizations: (pluginConstructor as any).defaultValues ?? {},
                    uniqueName: `${result.draggableId}-${formList.length}`
                }
            });
        }
    }

    const createComponentInstance = useCallback((name: string, uniqueName: string): ComponentPlugin | ReactComponentPluginElement => {
        const pluginConstructor = _.find(pluginContext, ['name', name]);
        if (!pluginConstructor) {
            console.warn('Could not find a plugin for ', name);
            throw new Error(`Missing plugin ${name}`);
        }

        if ('_ComponentPlugin' in pluginConstructor) {
            return new pluginConstructor(uniqueName);
        } else {
            return React.createElement(pluginConstructor, { instanceName: uniqueName, state: ComponentPluginState.DISPLAY })
        }
    }, [pluginContext]);

    //
    useEffect(() => {
        const instances = state.Components.map(({ name, uniqueName, customizations }) => createComponentInstance(name, uniqueName));
        setFormList(instances);
    }, [createComponentInstance, state]);

    return <DragDropContext onDragEnd={onDragEnd}>
        <Grid container>
            {/* Left pane is a Drag and Drop 1D List */}
            <Grid item xs={6}><FormGUI addedComponents={formList} /></Grid>
            {/* Right pane is a pane of drawers/accordions */}
            <Grid item xs={6}><FormComponentPane variableList={state.Variables} /></Grid>
        </Grid>
    </DragDropContext>
}