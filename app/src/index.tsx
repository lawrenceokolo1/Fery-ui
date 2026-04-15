import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { AppContextProvider } from './core/context';
import { LocaleProvider } from './core/locale';
import store, { persistor } from './store';

import ChatPage from './components/pages/chat';
import LandingPage from './components/pages/landing';
import ToolDeepLinkRedirect from './components/pages/tool-deeplink';
import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppContextProvider>
            <LandingPage landing={true} />
        </AppContextProvider>,
    },
    {
        path: "/tools/:toolId",
        element: <AppContextProvider>
            <ToolDeepLinkRedirect />
        </AppContextProvider>,
    },
    {
        path: "/chat/:id",
        element: <AppContextProvider>
            <ChatPage />
        </AppContextProvider>,
    },
    {
        path: "/s/:id",
        element: <AppContextProvider>
            <ChatPage share={true} />
        </AppContextProvider>,
    },
    {
        path: "/s/:id/*",
        element: <AppContextProvider>
            <ChatPage share={true} />
        </AppContextProvider>,
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

async function bootstrapApplication() {
    root.render(
        <React.StrictMode>
            <LocaleProvider>
                <MantineProvider theme={{ colorScheme: "dark" }}>
                    <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <ModalsProvider>
                                <RouterProvider router={router} />
                            </ModalsProvider>
                        </PersistGate>
                    </Provider>
                </MantineProvider>
            </LocaleProvider>
        </React.StrictMode>
    );
}

bootstrapApplication();
