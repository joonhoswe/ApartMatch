import Navbar from './navbar'
import Footer from './footer'
import Head from "next/head"
 
export default function Layout({ children }) {
  return (
    <div className=''>
     <Head>
        <title> ApartMatch </title>
        <meta name="description" content="A platform to find off-campus roommates" />
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}