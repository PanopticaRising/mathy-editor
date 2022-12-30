import { useContext } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { ComponentPluginState, getSupportedInstanceName, ReactComponentPlugin } from '../ComponentPlugin';
import { SavedData, useCodeBlock, useComponentCustomization } from '../Loaders/SaveStateManager';
import { Button, List } from '@mui/material';
import { SaveStateContext } from '../../PluginManager/Loaders/SaveStateManager';
import { SupportedPluginsFactory } from '../../FormBuilder/SupportedPluginsFactory';
import { PluginContext, SupportedPluginTypes } from '../Loaders/PluginProvider';
import { useSubmitter } from '../../Utilities/Helpers/SubmissionHelpers';

interface OnePageSubmitLayout {
    children: SavedData['Components']
}

export const OnePageSubmit: ReactComponentPlugin = ({ instanceName, state: mode, }) => {
    const { state } = useComponentCustomization<OnePageSubmitLayout>(instanceName);
    // TODO: Pass a prop of isDropDisabled instead of giving access to SaveStateManager.
    const { state: savedState } = useContext(SaveStateContext);
    const { utilities: { createComponentInstance } } = useContext(PluginContext);
    const { submitAnswers } = useCodeBlock(`${instanceName}-code`);
    const submit = useSubmitter(`${instanceName}-code`);

    if (!createComponentInstance) {
        return <p>Loading...</p>;
    }

    // TODO: This component should have a different state so people don't have to unlock it to drag and drop into it.
    // NOTE: This is currently the way it has to be due to the limitations of @hello-pangea/dnd.
    if (mode === ComponentPluginState.LOCKED) {
        return <>
            <List>
                {state.children &&
                    state.children
                        .map(
                            ({ name, uniqueName, customizations }) => createComponentInstance(name, uniqueName)
                        ).map(
                            (Item: SupportedPluginTypes, ind: number) => <SupportedPluginsFactory key={getSupportedInstanceName(Item)} Item={Item} index={ind} mode={mode} />
                        )}
            </List>
            <Button onClick={() => submit()}>Submit</Button>
        </>
    }

    // TODO: Right now, control is ceded to the FormDnDManager. This works for simple, linear representations of problems. However, if Layouts ever
    //       need to be more complicated, we should figure out some way for the FormDnDManager to cede control to the ComponentCustomization, or create
    //       another workflow for layouts.
    // NOTE: droppableId is 'components' to match FormGUI's droppableid. This is because @hello-pangea/dnd does not support nested droppables.
    //       To know where things need to be dropped, use the editFocus in the context.
    return <>
        <Droppable isDropDisabled={savedState.editFocus !== instanceName} droppableId={instanceName}>
            {(provided, snapshot) => (
                <List ref={provided.innerRef} {...provided.droppableProps} style={{ backgroundColor: savedState.editFocus === instanceName ? "gray" : "inherit" }}>
                    {state.children &&
                        state.children
                            .map(
                                ({ name, uniqueName, customizations }) => createComponentInstance(name, uniqueName))
                            .map(
                                (Item: SupportedPluginTypes, ind: number) => <SupportedPluginsFactory key={getSupportedInstanceName(Item)} Item={Item} index={ind} mode={getSupportedInstanceName(Item) === savedState.editFocus ? ComponentPluginState.EDIT : ComponentPluginState.DISPLAY} />)
                    }
                    {provided.placeholder}
                </List>
            )}
        </Droppable>
        <Button onClick={() => submit()}>Submit (Edit)</Button>
    </>
}

OnePageSubmit.displayName = 'One Page Submit';

OnePageSubmit.defaultValues = {};

OnePageSubmit.defaultCustomization = {};

export default OnePageSubmit;
