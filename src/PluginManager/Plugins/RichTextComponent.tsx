import { ComponentPlugin } from "../ComponentPlugin";

export class RichTextComponent extends ComponentPlugin {
    static displayName = 'Rich Text';

    getBodyHTML = () => (
        <p>This is placeholder <b>rich</b> text.</p>
    )

    getBodyAnswers = () => {
        // TODO
    }

    getCustomParameters = () => {
        return {};
    }
}

export default RichTextComponent;