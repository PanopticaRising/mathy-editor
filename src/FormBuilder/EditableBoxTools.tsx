import { Button, ButtonGroup } from "@material-ui/core"
import { Delete, DragHandle, Edit } from "@material-ui/icons";
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    // style rule
    floatingTools: (props: { visible: boolean }) => ({
        position: 'absolute',
        bottom: '0rem',
        right: '0rem',
        display: props.visible ? 'inherit' : 'none',
    }),
});

// This component provides a consistent border wrapper around GUI elements in the form.
export const EditableBoxTools: React.FC<{ visible: boolean, dragHandleProps: any, onClickEdit: () => void }> = ({ visible, dragHandleProps, onClickEdit }) => {
    const classes = useStyles({ visible });

    return <ButtonGroup size='small' aria-label='Component editing tools' className={classes.floatingTools}>
        <Button aria-label="edit" onClick={onClickEdit}>
            <Edit />
        </Button>
        <Button aria-label="delete" sx={{
            borderBottomRightRadius: '8px'
        }}>
            <Delete />
        </Button>
        <Button aria-label="drag to reorder" sx={{
            borderBottomRightRadius: '8px'
        }} {...dragHandleProps} >
            <DragHandle />
        </Button>
    </ButtonGroup>
}