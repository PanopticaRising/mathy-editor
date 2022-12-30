import { Button, ButtonGroup } from "@mui/material"
import { Delete, DragHandle, Edit } from "@mui/icons-material";
import styled from '@emotion/styled';
import { css } from '@emotion/react'

// This component provides a consistent border wrapper around GUI elements in the form.
export const EditableBoxTools: React.FC<{ visible: boolean, dragHandleProps: any, onClickEdit: () => void }> = ({ visible, dragHandleProps, onClickEdit }) => {
    const FloatingTools = styled(ButtonGroup)`
    position: absolute;
    bottom: 0rem;
    right: 0rem;
    display: ${visible ? 'inherit' : 'none'};
`

    return <FloatingTools size='small' aria-label='Component editing tools' >
        {/* TODO: Pass in editMode so button can be styled differently when active */}
        <Button aria-label="edit" onClick={onClickEdit}>
            <Edit />
        </Button>
        <Button aria-label="delete" sx={{
            borderBottomRightRadius: '8px'
        }}>
            <Delete />
        </Button>
        {/* TODO: While using @hello-pangea/dnd hack, disable drag handle when editMode is not active on the parent. */}
        <Button aria-label="drag to reorder" sx={{
            borderBottomRightRadius: '8px'
        }} {...dragHandleProps} >
            <DragHandle />
        </Button>
    </FloatingTools>
}