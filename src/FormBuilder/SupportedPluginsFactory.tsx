import React, { useContext, useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { ComponentPlugin, ComponentPluginState, getSupportedDisplayName, getSupportedInstanceName } from "../PluginManager/ComponentPlugin";
import { SupportedPluginTypes } from "../PluginManager/Loaders/PluginProvider";
import { EditableBoxWrapper } from "./EditableBoxWrapper";
import { SaveStateContext } from '../PluginManager/Loaders/SaveStateManager';

interface SupportedPluginFactoryProps {
    Item: SupportedPluginTypes;
    index: number;
    mode: ComponentPluginState;
}

// This isn't really a factory, but it returns the correct JSX based on the type of plugin.
export const SupportedPluginsFactory: React.FC<SupportedPluginFactoryProps> = ({ Item, index, mode }) => {
    const instanceName = getSupportedInstanceName(Item);
    const displayName = getSupportedDisplayName(Item);
    const { dispatch, state } = useContext(SaveStateContext);

    useEffect(() => {
        console.log('SupportedPluginsFactory rerendering', Item);
    });

    const toggleEditMode = () => {
        if (state.editFocus === instanceName) {
            dispatch?.({ type: 'ShiftEditFocus' })
        } else {
            dispatch?.({ type: 'ShiftEditFocus', uniqueName: instanceName })
        }
    };


    if (mode === ComponentPluginState.LOCKED) {
        return Item instanceof ComponentPlugin ?
            Item.getBodyHTML(Item.instanceName, console.log) :
            React.cloneElement(Item, { state: mode })
    }

    const isEditTarget = state.editFocus === instanceName;

    // TODO: Pass down to edit button
    return <Draggable key={instanceName} draggableId={instanceName} index={index}>
        {(provided, snapshot) => (
            <EditableBoxWrapper key={instanceName} componentName={displayName} innerRef={provided.innerRef} onClickEdit={toggleEditMode} dragHandleProps={provided.dragHandleProps} {...provided.draggableProps}>
                {/* <p><code>Debug Information ({displayName} &gt; {instanceName})</code></p> */}
                {/* TODO: Move itme.instanceName into a private API that calls getBodyHTML. */}
                {
                    Item instanceof ComponentPlugin ?
                        Item.getBodyHTML(Item.instanceName, console.log) :
                        React.cloneElement(Item, { state: isEditTarget ? ComponentPluginState.EDIT : ComponentPluginState.DISPLAY })
                }
            </EditableBoxWrapper>
        )}
    </Draggable>
}

// SupportedPluginsFactory.whyDidYouRender = {
//     customName: 'SupportedPluginsFactory',
//     logOnDifferentValues: true,
//     logOwnerReasons: true,
// }

export default SupportedPluginsFactory;