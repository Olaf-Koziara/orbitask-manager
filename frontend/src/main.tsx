import React from 'react';
import ReactDOM from 'react-dom/client';
import {  QueryClientProvider } from '@tanstack/react-query';
import { queryClient, trpc, trpcClient } from './api/trpc';
import App from './App';
import './index.css';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>,
);
