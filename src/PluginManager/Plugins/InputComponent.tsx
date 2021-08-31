import { ComponentPlugin } from "../ComponentPlugin";

export class InputComponent extends ComponentPlugin {
    static displayName = 'Input';

    getBodyHTML = () => (
        <><label>Input your answer here: </label><input /></>
    )

    getBodyAnswers = () => {
        // TODO
    }

    getCustomParameters = () => {
        return {};
    }
}

export default InputComponent;