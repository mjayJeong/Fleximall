import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type ProductDetail = {
    id: number;
    name: string;
    price: number;
    stock: number;
    status: string;
    thumbnailUrl: string;
    wishCount: number;
    wished: boolean;
};

export default function ProductDetailPage() {
    const { id } = useParams();
    const productId = Number(id);

    const [data, setData] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [toggling, setToggling] = useState(false);

    const load = async() => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}`);
            const json = await res.json();
            setData(json);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!Number.isFinite(productId)) return;
        load();
    }, [productId]);

    const toggleWish = async() => {
        if (!data) return;
        setToggling(true);
        try {
            const res = await fetch(`/api/wishlist/${data.id}/toggle`, {method: "POST"});
            const json = await res.json();

            setData((prev) => {
                if (!prev) return prev;
                const nextWished = json.wished as boolean;
                const nextCount = 
                    nextWished === prev.wished
                        ? prev.wishCount
                        : prev.wishCount + (nextWished ? 1 : -1);
                
                return { ...prev, wished: nextWished, wishCount: Math.max(0, nextCount)};
            });
        } finally {
            setToggling(false);
        }
    };

    if (loading || !data) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <Link className="text-sm text-gray-600 hover:underline" to="/">
                    ← 상품 목록
                    </Link>
                    <p className="mt-6 text-gray-600">{loading ? "불러오는 중..." : "상품이 없어요."}</p>
                </div>
            </div>
        );
    }

    const soldOut = data.status === "SOLD_OUT";

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <Link className="text-sm text-gray-600 hover:underline" to="/">
                ← 상품 목록
                </Link>

                <div className="mt-4 bg-white rounded-2xl shadow p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img 
                            src={data.thumbnailUrl}
                            alt={data.name}
                            className="w-full h-72 object-cover rounded-xl"
                        />

                        <div>
                            <h1 className="text-2xl font-bold">{data.name}</h1>

                            <div className="mt-3 text-xl font-semibold">
                                {data.price.toLocaleString()}원
                            </div>

                            <div className="mt-2 text-sm text-gray-600">
                                재고: <span className="font-medium">{data.stock}</span>
                                {" / "}
                                상태: {" "} 
                                <span className={`font-medium ${soldOut ? "text-gray-500" : ""}`}>
                                    {soldOut ? "품절" : "판매중"}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <button 
                                    disabled={toggling}
                                    onClick={toggleWish}
                                    className={`px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-60 ${
                                        data.wished ? "border-black" : "border-gray-300"
                                    }`}
                                >
                                    {data.wished ? "❤️ 찜됨" : "🤍 찜하기"}
                                </button>

                                <div className="text-sm text-gray-600">
                                    찜 <span className="font-semibold">{data.wishCount}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-2">
                                {soldOut ? (
                                    <button className="flex-1 bg-gray-400 text-white py-3 rounded cursor-not-allowed">
                                        품절
                                    </button>
                                ) : (
                                    <button
                                        className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800"
                                        onClick={() => alert("다음 단계에서 붙임")}
                                    >
                                        장바구니 담기
                                    </button>
                                )}

                                <button 
                                    className="w-36 border py-3 rounded bg-white hover:bg-gray-50"
                                    onClick={load}
                                >
                                    새로고침 
                                </button>
                            </div>

                            <div className="mt-6 text-sm text-gray-500">
                                다음 단계: 장바구니/재고 + 재입고 알림 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}