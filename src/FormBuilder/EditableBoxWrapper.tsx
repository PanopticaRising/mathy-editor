import { Box } from "@mui/material"
import styled from '@emotion/styled';
import { useState } from "react";
import { EditableBoxTools } from "./EditableBoxTools";
import { DraggableProvided } from "@hello-pangea/dnd";

const OutlinedBox = styled(Box)({
    borderWidth: 1,
    borderRadius: '8px',
    borderColor: 'primary.main',
    borderStyle: 'dashed',
    position: 'relative',
});

interface EditableBoxWrapperProps {
    dragHandleProps: any;
    innerRef: DraggableProvided['innerRef'];
    componentName: string;
    onClickEdit: () => void;
    [arg: string]: any;
}

// This component provides a consistent border wrapper around GUI elements in the form.
export const EditableBoxWrapper: React.FC<React.PropsWithChildren<EditableBoxWrapperProps>> = ({ children, dragHandleProps, componentName, innerRef, onClickEdit, ...props }) => {
    const [hover, setHover] = useState<boolean>(false);

    // TODO: Nesting fieldset to fix placeholder issue?
    return <OutlinedBox component={"fieldset"} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} ref={innerRef} {...props}>
        <legend>{componentName}</legend>
        {children}
        <EditableBoxTools visible={hover} dragHandleProps={dragHandleProps} onClickEdit={onClickEdit} />
    </OutlinedBox>
}