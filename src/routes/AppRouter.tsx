import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "../components/layout/DefaultLayout";
import Home from "../pages/home/Home";
import Map from "../pages/map/Map";
import Slang from "../pages/slang/Slang";
import My from "../pages/my/My"

export default function AppRouter() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                {/* 최초 진입(/) → /home */}
                <Route index element={<Navigate to="/home" replace />} />
                {/* 실제 홈 페이지 */}
                <Route path="home" element={<Home />} />
                <Route path="map" element={<Map />} />
                <Route path="slang" element={<Slang />} />
                <Route path="my" element={<My />} />
            </Route>
        </Routes>
    );
}
