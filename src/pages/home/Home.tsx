// Home.jsx (또는 app/page.jsx)
import { useEffect, useState } from "react";
import { selectCamppingList } from '../../api/home/HomeApi';


type CamppingItem = {

    id?: string | number;

    doNm: string;

};




export default function Home() {

    const [camppingList, setCamppingList] = useState<CamppingItem[]>([]);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCamppingList = async () => {
            try {
                setLoadError(null);
                const res = await selectCamppingList();
                const list = Array.isArray(res.data) ? res.data : res.data?.data;
                setCamppingList(Array.isArray(list) ? list : []);
            } catch (err) {
                setCamppingList([]);
                setLoadError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
        };

        fetchCamppingList();
    }, []);




    const onSearch = (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        console.log("search:", q);
    };

    const onClickMenu = (doNm: string) => {
        console.log("menu:", doNm);
        // 여기서 라우팅(Next.js면 router.push) 혹은 모달/필터 이동 등
    };

    return (
        <div className="home">

            {loadError && (
                <div className="errorBanner" role="alert">
                    {loadError}
                </div>
            )}

            {/* 검색 */}
            <section className="searchSection">
                <form className="searchBar" onSubmit={onSearch}>
                    <span className="searchIcon">🔎</span>
                    <input
                        name="q"
                        className="searchInput"
                        placeholder="올 겨울엔 어디로 캠핑을 떠날까요?"
                        autoComplete="off"
                    />
                </form>
            </section>

            {/* 아이콘 그리드 */}
            <section className="quickMenuSection">
                <div className="quickGrid">
                    {camppingList.map((m, idx) => (
                        <button
                            key={m.id ?? `${m.doNm}-${idx}`}
                            className="quickItem"
                            type="button"
                            onClick={() => onClickMenu(m.doNm)}
                        >
                            <div className="quickIcon">🏕️</div>
                            <div className="quickLabel">{m.doNm}</div>
                        </button>
                    ))}
                </div>
            </section>

            {/* 배너 (일단 1장만) */}
            <section className="bannerSection">
                <div className="banner">
                    <div className="bannerTitle">트렁크 보관 그냥 하시겠어요?</div>
                    <div className="bannerDesc">이제는 안전하게 하세요!</div>
                    <button className="bannerCta" type="button">지금 구매하기</button>
                    <div className="bannerPager">1 / 10</div>
                </div>
            </section>

            {/* 아래 컨텐츠 예시 */}
            <section className="contentSection">
                <div className="sectionHead">
                    <h3>신규 입점 📍</h3>
                    <button className="linkBtn" type="button">전체보기</button>
                </div>
                <div className="card">
                    따끈따끈한 신상 캠핑장을 가장 먼저 경험해보세요!
                </div>
            </section>
        </div>
    );
}
