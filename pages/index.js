import { ConfigProvider } from 'antd';
import App from './journalscreen';
import Head from "next/head";
import HomeScreen from './loginscreen';
import LoginScreen from './loginscreen';

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
      
      <LoginScreen />
    </ConfigProvider>
  );
}
