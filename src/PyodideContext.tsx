import { createContext, useRef } from "react"

// https://pyodide.org/en/stable/usage/api/js-api.html#pyproxy
interface PyProxy extends Iterable<unknown> {
    // The length of the object.
    length: number;

    // The name of the type of the object.
    type: string;

    // This translates to the Python code iter(obj).
    // [Symbol.iterator]: () => Iterator

    // Runs asyncio.ensure_future(awaitable) and executes onRejected(error) if the future fails.
    // catch(onRejected)

    // // This translates to the Python code del obj[key].
    // delete(key)

    // // Destroy the PyProxy.
    // destroy()

    // // Runs asyncio.ensure_future(awaitable) and executes onFinally(error) when the future resolves.
    // finally(onFinally)

    // // This translates to the Python code obj[key].
    // get(key)

    // // Get a view of the buffer data which is usable from Javascript.
    // getBuffer(type)

    // // This translates to the Python code key in obj.
    // has(key)

    // // This translates to the Python code next(obj).
    // next(value)

    // // This translates to the Python code obj[key] = value.
    // set(key, value)

    // // Runs asyncio.ensure_future(awaitable), executes onFulfilled(result) when the Future resolves successfully, executes onRejected(error) when the Future fails.
    // then(onFulfilled, onRejected)

    // // Converts the PyProxy into a Javascript object as best as possible.
    // toJs(depth)
}

// TODO: Contribute this to DefinitelyTyped
// Based off https://pyodide.org/en/stable/usage/api/js-api.html
interface IPyodide {

    loadedPackages: Record<string, unknown>;
    version: string;

    loadPackage: (names: string | Array<string> | PyProxy, messageCallback?: (progress: unknown) => void, errorCallback?: (error: unknown) => void) => Promise<unknown>;
    runPython: (code: string, globals?: Record<any, any>) => Promise<unknown>;
    runPythonAsync: (code: string, messageCallback: (progress: unknown) => void, errorCallback: (error: unknown) => void) => Promise<unknown>;
}

declare global {
    interface Window {
        pyodide: IPyodide;
        loadPyodide: (config: { indexURL: string }) => Promise<IPyodide>
    }
}

// export const PyodideContext = createContext<IPyodide | null | undefined>(undefined);
export const PyodideContext = createContext<((script: string, context: Object | undefined) => Promise<unknown>) | undefined>(undefined);

export const PyodideProvider: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
    const pyRef = useRef<Worker>(new Worker('./mathy-editor/pyodide.worker.js'));

    //    const {results, error} = await asyncRun(script, context);
    function asyncRun(script: string, context?: Object) {
        return new Promise(function (onSuccess, onError) {
            pyRef.current.onerror = onError;
            pyRef.current.onmessage = (e) => onSuccess(e.data.results);
            pyRef.current.postMessage({
                ...context,
                python: script,
            });
        });
    }

    return <PyodideContext.Provider value={asyncRun}>
        {children}
    </PyodideContext.Provider>
}

export default PyodideContext;