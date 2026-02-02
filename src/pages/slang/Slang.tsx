import { useState } from "react";

interface FavoriteItem {
    id: string;
    name: string;
    location: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    category: "camping" | "glamping" | "caravan" | "pension";
    imageUrl?: string;
    discount?: number;
    isSoldOut?: boolean;
}

const initialFavorites: FavoriteItem[] = [
    {
        id: "cj-01",
        name: "별빛야영 캠핑장",
        location: "강원도 춘천시",
        price: 129000,
        originalPrice: 150000,
        rating: 4.8,
        reviews: 214,
        category: "glamping",
        discount: 14,
    },
    {
        id: "cj-02",
        name: "솔숲힐링 캠핑장",
        location: "경기도 가평군",
        price: 159000,
        rating: 4.6,
        reviews: 98,
        category: "caravan",
    },
    {
        id: "cj-03",
        name: "해돋이 오토캠핑",
        location: "강원도 양양군",
        price: 79000,
        originalPrice: 100000,
        rating: 4.7,
        reviews: 143,
        category: "camping",
        discount: 21,
    },
    {
        id: "cj-04",
        name: "숲속 작은 캠핑장",
        location: "충북 제천시",
        price: 55000,
        rating: 4.5,
        reviews: 64,
        category: "camping",
        isSoldOut: true,
    },
];

type CategoryFilter = "all" | "camping" | "glamping" | "caravan" | "pension";
type SortOption = "recent" | "price-low" | "price-high" | "rating";

const categoryLabels: Record<CategoryFilter, string> = {
    all: "전체",
    camping: "캠핑장",
    glamping: "글램핑",
    caravan: "카라반",
    pension: "펜션",
};

const sortLabels: Record<SortOption, string> = {
    recent: "최신순",
    "price-low": "낮은가격순",
    "price-high": "높은가격순",
    rating: "평점순",
};

export default function Slang() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>(initialFavorites);
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
    const [sortBy, setSortBy] = useState<SortOption>("recent");
    const [showSortModal, setShowSortModal] = useState(false);

    const handleRemoveFavorite = (id: string) => {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
    };

    const filteredFavorites = favorites
        .filter((item) => activeCategory === "all" || item.category === activeCategory)
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "rating":
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });

    const formatPrice = (price: number) => {
        return price.toLocaleString("ko-KR");
    };

    return (
        <div className="slang">
            {/* 헤더 영역 */}
            <header className="slang-header">
                <h2 className="slang-title">찜</h2>
                <span className="slang-count">{favorites.length}</span>
            </header>

            {/* 카테고리 필터 */}
            <nav className="slang-filters">
                {(Object.keys(categoryLabels) as CategoryFilter[]).map((cat) => (
                    <button
                        key={cat}
                        className={`slang-chip ${activeCategory === cat ? "slang-chip--active" : ""}`}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                    >
                        {categoryLabels[cat]}
                    </button>
                ))}
            </nav>

            {/* 정렬 옵션 */}
            <div className="slang-sort">
                <span className="slang-result-count">
                    총 <strong>{filteredFavorites.length}</strong>개
                </span>
                <button
                    className="slang-sort-btn"
                    type="button"
                    onClick={() => setShowSortModal(!showSortModal)}
                >
                    {sortLabels[sortBy]} ▼
                </button>
                {showSortModal && (
                    <ul className="slang-sort-dropdown">
                        {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                            <li key={opt}>
                                <button
                                    type="button"
                                    className={sortBy === opt ? "active" : ""}
                                    onClick={() => {
                                        setSortBy(opt);
                                        setShowSortModal(false);
                                    }}
                                >
                                    {sortLabels[opt]}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 찜 목록 */}
            {filteredFavorites.length === 0 ? (
                <div className="slang-empty">
                    <span className="slang-empty-icon">💔</span>
                    <p className="slang-empty-text">찜한 캠핑장이 없어요</p>
                    <p className="slang-empty-sub">마음에 드는 캠핑장을 찜해보세요!</p>
                </div>
            ) : (
                <section className="slang-list">
                    {filteredFavorites.map((item) => (
                        <article
                            key={item.id}
                            className={`slang-card ${item.isSoldOut ? "slang-card--soldout" : ""}`}
                        >
                            {/* 썸네일 */}
                            <div className="slang-thumb">
                                {item.discount && (
                                    <span className="slang-badge">{item.discount}%</span>
                                )}
                                {item.isSoldOut && (
                                    <div className="slang-soldout-overlay">예약마감</div>
                                )}
                            </div>

                            {/* 정보 영역 */}
                            <div className="slang-info">
                                <div className="slang-info-top">
                                    <span className="slang-category">
                                        {categoryLabels[item.category]}
                                    </span>
                                    <span className="slang-rating">
                                        ⭐ {item.rating}
                                        <span className="slang-reviews">({item.reviews})</span>
                                    </span>
                                </div>

                                <h3 className="slang-name">{item.name}</h3>
                                <p className="slang-location">📍 {item.location}</p>

                                <div className="slang-price-row">
                                    {item.originalPrice && (
                                        <span className="slang-original-price">
                                            {formatPrice(item.originalPrice)}원
                                        </span>
                                    )}
                                    <span className="slang-price">
                                        {formatPrice(item.price)}
                                        <span className="slang-price-unit">원~</span>
                                    </span>
                                </div>
                            </div>

                            {/* 찜 해제 버튼 */}
                            <button
                                className="slang-heart"
                                type="button"
                                onClick={() => handleRemoveFavorite(item.id)}
                                aria-label="찜 해제"
                            >
                                ❤️
                            </button>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}
