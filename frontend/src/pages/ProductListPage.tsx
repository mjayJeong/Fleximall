import { useEffect, useState } from "react";

type Product = {
    id: number;
    name: string; 
    price: number;
    stock: number;
    status: string;
    thumbnailUrl: string;
};

export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load()
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">상품 목록 </h1>
                <button 
                    onClick={load}
                    className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
                >
                    {loading ? "불러오는 중..." : "새로고침"}
                </button>
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
                    </div>
                ))}
            </div>

            {products.length === 0 && !loading && (
                <p className="text-gray-500 mt-8">상품이 아직 없습니다. 등록하세요!</p>
            )}
        </div>
    );
}

