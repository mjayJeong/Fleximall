import { useEffect, useState, useMemo } from "react";

type Product = {
    id: number;
    name: string; 
    price: number;
    stock: number;
    status: string;
    thumbnailUrl: string;
};

type PageResp<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;     // 현재 페이지
    size: number;
};

type SortOption = "LATEST" | "PRICE_ASC" | "PRICE_DESC" | "POPULAR";

export default function ProductListPage() {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<SortOption>("LATEST");
    const [page, setPage] = useState(0);
    const size = 12;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PageResp<Product> | null>(null);

    const [wishedMap, setWishedMap] = useState<Record<number, boolean>>({});

    const params = useMemo(() => {
        const p = new URLSearchParams();
        if (query.trim()) p.set("query", query.trim());
        p.set("sort", sort);
        p.set("page", String(page));
        p.set("size", String(size));
        return p.toString();
    }, [query, sort, page]);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?${params}`);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `HTTP ${res.status}`);
            }
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [params]);

    const products = data?.content ?? [];
    const totalPages = data?.totalPages ?? 0;

    const pageButtons = useMemo(() => {
        if (!data) return [];
        const cur = data.number;
        const start = Math.max(0, cur - 2);
        const end = Math.min(totalPages - 1, cur + 2);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [data, totalPages]);

    const onSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);     // 검색/정렬 바뀌면 첫 페이지로 
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">상품 목록</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        검색/정렬/페이징 붙이는 중 
                    </p>
                </div>

                <button
                    onClick={load}
                    className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
                >
                    {loading ? "불러오는 중..." : "새로고침"}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow p-4 mb-6">
                <form onSubmit={onSearchSubmit} className="flex flex-col md:flex-row gap-3">
                    <input
                        className="flex-1 border rounded px-3 py-2"
                        placeholder="상품 검색 (ex/ 마우스)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <select 
                        className="border rounded px-3 py-2"
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value as SortOption);
                            setPage(0);
                        }}
                    >
                        <option value="LATEST">최신순</option>
                        <option value="PRICE_ASC">가격 낮은순</option>
                        <option value="PRICE_DESC">가격 높은순</option>
                        <option value="POPULAR">인기순</option>
                    </select>

                    <button className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800">
                        검색
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow p-4">
                    <img
                    src={p.thumbnailUrl}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded"
                    />
                    <h2 className="mt-4 text-lg font-semibold">{p.name}</h2>
                    <p className="text-gray-600 mt-2">{p.price.toLocaleString()}원</p>

                    {p.status === "SOLD_OUT" ? (
                    <button className="mt-3 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed">
                        품절
                    </button>
                    ) : (
                    <button className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                        장바구니 담기
                    </button>
                    )}

                    <button 
                        onClick={async() => {
                            const res = await fetch(`/api/wishlist/${p.id}/toggle`, {method: "POST"});
                            const json = await res.json();
                            setWishedMap((prev) => ({ ...prev, [p.id]: json.wished }));
                        }}
                        className={`w-28 border py-2 rounded hover:bg-gray-50 ${
                            wishedMap[p.id] ? "border-black" : "border-gray-300"
                        }`}
                        title="찜하기"
                    >
                        {wishedMap[p.id] ? "❤️" : "🤍"}
                    </button>
                </div>
                ))}
            </div>

            {!loading && products.length === 0 && (
                <p className="text-gray-500 mt-8">검색 결과가 없어요.</p>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        className="px-3 py-2 rounded border bg-white disabled:opacity-50"
                        disabled={page < 0}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        이전
                    </button>

                    {pageButtons.map((p) => (
                        <button 
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-2 rounded border ${
                                p === page ? "bg-black text-white" : "bg-white"
                            }`}
                        >
                            {p + 1}
                        </button>
                    ))}

                    <button
                        className="px-3 py-2 rounded border bg-white disabled:opacity-50"
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

