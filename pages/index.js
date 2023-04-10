import { ConfigProvider } from 'antd';
import App from './app';
import Head from "next/head";

export default function Home() {
  return (
    <ConfigProvider
      theme={{ 
        token: { colorPrimary: '#10a37f', borderRadius: '4px', },
      }}
    >
      <Head>
        <link rel="icon" href="favicon.ico" />
      </Head>
      
      <App />
    </ConfigProvider>
  );
}
