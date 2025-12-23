import { useEffect } from "react";

export default function Map() {
    useEffect(() => {
        window.kakao.maps.load(() => {
            const container = document.getElementById("map");
            const options = {
                center: new window.kakao.maps.LatLng(36.5, 127.8), // 대한민국 중심
                level: 13,
            };
            new window.kakao.maps.Map(container, options);
        });
    }, []);

    return <div id="map" style={{ width: "100%", height: "100%" }} />;
}