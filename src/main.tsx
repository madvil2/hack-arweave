import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ArweaveWalletKit } from 'arweave-wallet-kit';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ArweaveWalletKit>
            <App />
        </ArweaveWalletKit>
    </React.StrictMode>,
)
