'use client';

import { SessionProvider } from 'next-auth/react';
import { PayPalScriptProvider /* PayPalButtons */ } from '@paypal/react-paypal-js';
import React, { type ReactNode, type ReactElement } from 'react';

interface ProviderProps {
  children: ReactNode;
}

type ProvidersType = [React.ElementType, Record<string, unknown>];
interface ChildrenType {
  children: React.ElementType[];
}

const buildProvidersTree = (componentsWithProps: ProvidersType[]): React.ElementType => {
  const initialComponent = ({ children }: ChildrenType): React.JSX.Element => <>{children}</>;

  return componentsWithProps.reduce(
    (AccumulatedComponents: React.ElementType, [Provider, props = {}]: ProvidersType) => {
      return function ProviderWrapper({ children }: ChildrenType) {
        return (
          <AccumulatedComponents>
            <Provider {...props}>{children}</Provider>
          </AccumulatedComponents>
        );
      };
    },
    initialComponent,
  );
};

const ProvidersTree = buildProvidersTree([
  [SessionProvider, { session: null }],
  [
    PayPalScriptProvider,
    {
      options: {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
        intent: 'capture',
        currency: 'USD',
      },
    },
  ],
  // [Provider, { prop: null }],
]);

export function Providers({ children }: ProviderProps): ReactElement {
  return <ProvidersTree>{children}</ProvidersTree>;
}
