import { PyodideProvider } from './PyodideContext';
import GlobalTheme from './GlobalTheme';
import { Routing } from './Routing';
import { PluginProvider } from './PluginManager/Loaders/PluginProvider';
import { VarPluginProvider } from './PluginManager/Loaders/VarPluginProvider';
import { SaveStateProvider } from './PluginManager/Loaders/SaveStateManager';
import { StudentInputProvider } from './PluginManager/Loaders/StudentInputManager';

function App() {
  return (
    <GlobalTheme>
      <PyodideProvider>
        <PluginProvider>
          <VarPluginProvider>
            <SaveStateProvider>
              <StudentInputProvider>
                <Routing />
              </StudentInputProvider>
            </SaveStateProvider>
          </VarPluginProvider>
        </PluginProvider>
      </PyodideProvider>
    </GlobalTheme>
  );
}

export default App;
