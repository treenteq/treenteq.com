'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
    const APP_ID = process.env.PRIVY_APP_ID;

    if (!APP_ID) {
        throw new Error('PRIVY_APP_ID not configured in env');
    }

    return (
        <PrivyProvider
            appId={APP_ID}
            config={{
                appearance: {
                    theme: 'dark',
                    accentColor: '#676FFF',
                },
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}
