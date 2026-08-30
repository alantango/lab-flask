import React from 'react'
import { env } from "@config/env";

function App() {
    return (
        <div className="app">
            <h1>Minimal Enterprise React + TS</h1>
            <p>API base: {env.apiBaseUrl || 'not set'}</p>
        </div>
    );
}

export default App;
