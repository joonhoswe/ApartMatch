import Navbar from './navbar'
import Footer from './footer'
import Head from "next/head"
 
export default function Layout({ children }) {
  return (
    <>
     <Head>
        <title> ApartMatch </title>
        <meta name="description" content="A platform dedicated to connecting college students with active off-campus housing listings where roommates from the same college are searching for housemates. Easily find and join partially filled apartments to save money and avoid the hassle of outdated Facebook threads." />
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}