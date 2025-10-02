import "../styles/globals.css";
import Header from "../components/Header";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isHome = router.pathname === "/";

  return (
    <>
      {!isHome && <Header />}
      <Component {...pageProps} />
    </>
  );
}
