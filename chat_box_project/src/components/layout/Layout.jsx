import { Outlet } from "react-router-dom"

import Header from "./Header"
import Footer from "./Footer"
import SideNav from "./SideNav"

const Layout = () => {
    return (
        <>
            <Header />
            <SideNav />
            <main className="App">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}


export default Layout
