import { AppProps } from 'next/app';
import { Header } from '../components/header';
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globalStyle.scss';

function MyApp({ Component, pageProps } : AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header/>
      <Component {...pageProps} />
      <ToastContainer/>
    </SessionProvider>
  )
}

export default MyApp
