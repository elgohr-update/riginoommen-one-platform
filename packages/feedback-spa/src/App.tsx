import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createClient, Provider } from 'urql';
import { Loader } from 'components';
import { Router } from 'routes';

import opcBase from '@one-platform/opc-base';
import '@one-platform/opc-base/dist/opc-provider';

import './app.css';

opcBase.configure({
  apiBasePath: import.meta.env.VITE_OPC_BASE_API_URL,
  subscriptionsPath: import.meta.env.VITE_OPC_BASE_SUBSCRIPTION_URL,
  keycloakUrl: import.meta.env.VITE_OPC_BASE_KEYCLOAK_IDP_URL,
  keycloakClientId: import.meta.env.VITE_OPC_BASE_KEYCLOAK_CLIENT_ID,
  keycloakRealm: import.meta.env.VITE_OPC_BASE_KEYCLOAK_REALM,
});

const client = createClient({
  url: import.meta.env.VITE_API_URL,
  requestPolicy: 'cache-and-network',
  fetchOptions: () => {
    const token = opcBase.auth?.jwtToken;
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<Loader />}>
        <Provider value={client}>
          <opc-provider>
            <opc-nav />
            <opc-menu-drawer />
            <opc-notification-drawer />
            <opc-feedback />
          </opc-provider>
          <Router />
        </Provider>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
