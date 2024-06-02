import { React } from 'react';
import Layout from '@components/layout';
import '../globals.css';  

export default function MyApp({ Component, pageProps }) {

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
