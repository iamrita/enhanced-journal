import { ConfigProvider } from "antd";
import Head from "next/head";
import LoginScreen from "./loginscreen";
import { EmailProvider } from "../EmailProvider";

export default function Home() {
  return (
    // <ConfigProvider
    //   theme={{
    //     token: { colorPrimary: '#10a37f', borderRadius: '4px', },
    //   }}
    // >
    <EmailProvider>
      <Head>
        <link rel="icon" href="favicon.ico" />
      </Head>

      <LoginScreen />
    </EmailProvider>
    // </ConfigProvider>
  );
}
