import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function DefaultLayout() {
    return (
        <div className="app">
            <header className="app-header">
                <Header />
            </header>

            <main className="app-main">
                <Outlet />
            </main>

            <footer className="app-footer">
                <Footer />
            </footer>
        </div>
    );
}