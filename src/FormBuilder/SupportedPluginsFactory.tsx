import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { ComponentPlugin, ComponentPluginState, getSupportedDisplayName, getSupportedInstanceName } from "../PluginManager/ComponentPlugin";
import { SupportedPluginTypes } from "../PluginManager/Loaders/PluginProvider";
import { EditableBoxWrapper } from "./EditableBoxWrapper";


// This isn't really a factory, but it returns the correct JSX based on the type of plugin.
export const SupportedPluginsFactory: React.FC<{Item: SupportedPluginTypes, index: number,}> = ({ Item, index, }) => {
    const instanceName = getSupportedInstanceName(Item);
    const displayName = getSupportedDisplayName(Item);
    const [formState, setFormState] = useState<ComponentPluginState>(ComponentPluginState.DISPLAY);

    const toggleEditMode = () => setFormState( formState === ComponentPluginState.EDIT ? ComponentPluginState.DISPLAY : ComponentPluginState.EDIT);

    return <Draggable key={instanceName} draggableId={instanceName} index={index}>
        {(provided, snapshot) => (
            <EditableBoxWrapper key={instanceName} componentName={displayName} innerRef={provided.innerRef} onClickEdit={toggleEditMode} dragHandleProps={provided.dragHandleProps} {...provided.draggableProps}>
                <p><code>Debug Information ({displayName} &gt; {instanceName})</code></p>
                {/* TODO: Move itme.instanceName into a private API that calls getBodyHTML. */}
                { 
                    Item instanceof ComponentPlugin ? 
                        Item.getBodyHTML(Item.instanceName, console.log) :
                        React.cloneElement(Item, { state: formState })
                }
            </EditableBoxWrapper>
        )}
    </Draggable>
}