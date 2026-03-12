import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import ThemeRegistry from '../ThemeRegistry';
import { Provider } from 'react-redux';
import store from '@/store';
import StoreProvider from '../StoreProvider';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto'
})

export default function RootLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {

  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <StoreProvider>
              {children}
              {modal}
            </StoreProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}