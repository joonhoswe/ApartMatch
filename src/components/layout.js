import Navbar from './navbar'
import Footer from './footer'
import Head from "next/head"
 
export default function Layout({ children }) {
  return (
    <div className=''>
     <Head>
        <title> TutorHive </title>
        <meta name="description" content="The first learning platform that rewards you for learning and retaining information!" />
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}