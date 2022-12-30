import { Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { PluginContext, SupportedPluginTypes } from '../PluginManager/Loaders/PluginProvider';
import { FormComponentPane } from './FormComponentPane';
import { FormGUI } from './FormGUI';
import React from 'react';
import { SaveStateContext } from '../PluginManager/Loaders/SaveStateManager';
import { StudentInputContext } from '../PluginManager/Loaders/StudentInputManager';

export const FormDnDManager: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [formList, setFormList] = useState<SupportedPluginTypes[]>([]);
    const { plugins, utilities: { createComponentInstance, findPluginConstructorByName } } = useContext(PluginContext);
    const { dispatch, state } = useContext(SaveStateContext);
    const { dispatch: studentInputDispatch } = useContext(StudentInputContext);

    // When a drag finishes, we should update the SaveState and let that inform our UI reconstruction.
    function onDragEnd(result: DropResult) {
        console.log(result);
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
                parent: state.editFocus,
            });
            // Else, insert at the intended index.
        } else {
            const pluginConstructor = findPluginConstructorByName?.(result.draggableId);
            if (!pluginConstructor) {
                console.warn('Could not find a plugin for ', result.draggableId);
                throw new Error(`Missing plugin ${result.draggableId}`);
            }

            console.log('bad default values?', JSON.stringify((pluginConstructor as any).defaultValues));

            dispatch?.({
                type: 'AddNewComponent',
                newIndex: result.destination.index,
                component: {
                    name: result.draggableId,
                    customizations: Object.assign({}, (pluginConstructor as any).defaultValues),
                    uniqueName: `${result.draggableId}-${formList.length}`,
                },
                parent: state.editFocus
            });

            studentInputDispatch?.({
                type: 'SetStudentInput',
                uniqueName: `${result.draggableId}-${formList.length}`,
                // TODO: Fix for class components
                studentInputs: (pluginConstructor as any).defaultCustomization
            })
        }
    }

    // Generate the GUI view state from the saved state.
    useEffect(() => {
        if (plugins.length === 0 || !createComponentInstance) return;
        const instances = state.Components.map(({ name, uniqueName, customizations }) => createComponentInstance(name, uniqueName));
        setFormList(instances);
    }, [createComponentInstance, plugins.length, state]);

    return <DragDropContext onDragEnd={onDragEnd}>
        <Grid container>
            {/* Left pane is a Drag and Drop 1D List */}
            <Grid item xs={6}><FormGUI addedComponents={formList} /></Grid>
            {/* Right pane is a pane of drawers/accordions */}
            <Grid item xs={6}><FormComponentPane variableList={state.Variables} /></Grid>
        </Grid>
    </DragDropContext>
}