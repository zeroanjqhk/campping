import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        kakao?: any;
    }
}

const KAKAO_SRC = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false`;

export default function Map() {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const kakaoMapRef = useRef<any>(null);
    const myMarkerRef = useRef<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastSearch, setLastSearch] = useState<string | null>(null);
    const [locating, setLocating] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadKakao = () =>
            new Promise<void>((resolve, reject) => {
                if (window.kakao?.maps) {
                    resolve();
                    return;
                }

                const existing = document.querySelector<HTMLScriptElement>('script[data-kakao-map="true"]');
                if (existing) {
                    existing.addEventListener("load", () => resolve());
                    existing.addEventListener("error", () => reject(new Error("Kakao script load failed")));
                    return;
                }

                const script = document.createElement("script");
                script.src = KAKAO_SRC;
                script.async = true;
                script.defer = true;
                script.dataset.kakaoMap = "true";
                script.onload = () => resolve();
                script.onerror = () => reject(new Error("Kakao script load failed"));
                document.head.appendChild(script);
            });

        const initMap = async () => {
            try {
                if (!import.meta.env.VITE_KAKAO_MAP_KEY) {
                    setError("Kakao 지도 키가 설정되지 않았습니다.");
                    return;
                }

                await loadKakao();
                if (cancelled || !mapRef.current) return;

                window.kakao.maps.load(() => {
                    if (cancelled || !mapRef.current) return;
                    const defaultCenter = new window.kakao.maps.LatLng(37.5665, 126.9780);
                    const map = new window.kakao.maps.Map(mapRef.current, {
                        center: defaultCenter,
                        level: 7,
                        draggable: true,
                        scrollwheel: true,
                    });
                    const marker = new window.kakao.maps.Marker({ position: defaultCenter });
                    marker.setMap(map);
                    kakaoMapRef.current = map;

                    const setCenterWithMarker = (lat: number, lng: number) => {
                        const target = new window.kakao.maps.LatLng(lat, lng);
                        map.setCenter(target);
                        if (!myMarkerRef.current) {
                            myMarkerRef.current = new window.kakao.maps.Marker({ position: target });
                            myMarkerRef.current.setMap(map);
                        } else {
                            myMarkerRef.current.setPosition(target);
                        }
                    };

                    if (navigator.geolocation) {
                        setLoadingLocation(true);
                        navigator.geolocation.getCurrentPosition(
                            (pos) => {
                                const { latitude, longitude } = pos.coords;
                                setCenterWithMarker(latitude, longitude);
                                setLoadingLocation(false);
                            },
                            () => {
                                setCenterWithMarker(37.5665, 126.9780);
                                setLoadingLocation(false);
                            },
                            { enableHighAccuracy: true, timeout: 8000 }
                        );
                    } else {
                        setCenterWithMarker(37.5665, 126.9780);
                    }
                });
            } catch (e) {
                if (!cancelled) {
                    setError("지도를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
                }
            }
        };

        initMap();
        //searchInView();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        document.body.classList.add("map-route");
        return () => {
            document.body.classList.remove("map-route");
        };
    }, []);

    const moveToMyLocation = () => {
        if (!navigator.geolocation) {
            setError("현재 위치를 사용할 수 없습니다.");
            return;
        }
        if (!kakaoMapRef.current) {
            setError("지도가 아직 준비되지 않았습니다.");
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const target = new window.kakao.maps.LatLng(latitude, longitude);
                kakaoMapRef.current.setCenter(target);

                if (!myMarkerRef.current) {
                    myMarkerRef.current = new window.kakao.maps.Marker({ position: target });
                    myMarkerRef.current.setMap(kakaoMapRef.current);
                } else {
                    myMarkerRef.current.setPosition(target);
                }
                setLocating(false);
            },
            () => {
                setError("현재 위치 권한이 필요합니다.");
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const searchInView = () => {
        if (!kakaoMapRef.current) {
            setError("지도가 아직 준비되지 않았습니다.");
            return;
        }
        const bounds = kakaoMapRef.current.getBounds();
        const info = `이 지역으로 재검색 (SW:${bounds.getSouthWest().toString()} / NE:${bounds.getNorthEast().toString()})`;
        setLastSearch(info);
        console.log("search in view:", bounds);
    };

    return (
        <div className="map-page">
            {error && (
                <div className="errorBanner" role="alert">
                    {error}
                </div>
            )}
            <div className="map-canvas" ref={mapRef} />
            <button className="map-mypos-btn" type="button" onClick={moveToMyLocation} disabled={locating}>
                {locating ? "위치 찾는중..." : "내 위치"}
            </button>
            <button className="map-reload-btn" type="button" onClick={searchInView}>
                이 지역으로 재검색
            </button>
            {lastSearch && <div className="map-reload-toast">{lastSearch}</div>}
            {loadingLocation && <div className="map-loading">내 위치 불러오는 중...</div>}
        </div>
    );
}
