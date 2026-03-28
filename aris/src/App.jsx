import React from 'react';
import ArisLiveView from './components/ArisLiveView';
import { ArisProvider } from './context/ArisContext';

function App() {
  return (
    <ArisProvider>
      <div className="w-screen h-screen bg-black overflow-hidden relative">
        <ArisLiveView />
      </div>
    </ArisProvider>
  );
}

export default App;
