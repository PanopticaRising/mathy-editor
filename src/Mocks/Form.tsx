import { FC, useState } from "react";
import { PyodideContext } from "../PyodideContext";

// TODO: Don't pass the raw pyodide object.
export const Form: FC<{pyodide: any}> = ({pyodide}) => {
    const [problemCode, setProblemCode] = useState('2+2')
    const [msg, setMsg] = useState<string | null>(null);
    
    const onSubmit = (x: any) => {
        x.preventDefault()
        console.log(x);
        const val = (document?.getElementById('hw') as HTMLInputElement)?.value;
        console.log(val);
        setMsg(null);
        const sol = pyodide.runPython(problemCode);
        console.log(sol);
        setMsg(`${sol === parseInt(val, 10)}`);
        return false;
    }
    
    const showAnswer = () => {
        setMsg(`Solution: ${pyodide.runPython(problemCode)}`);
    }

    const updateProblemCode = () => {
        const val = (document?.getElementById('code') as HTMLTextAreaElement)?.value;
        setProblemCode(val);
    }

    return <form onSubmit={onSubmit}>
        Write your Python solver code here:<br/>
        <textarea id='code' onKeyUp={updateProblemCode} /><br/>
        {msg}<br/>
        Solve {problemCode}.<br/>
        <input id='hw' /><br/>
        <button onClick={showAnswer} type='button'>Show Answer</button><br/>
        <button type='submit'>Solve</button><br/>
    </form>
}