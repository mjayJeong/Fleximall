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

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">
                상품 목록    
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div 
                        key={product.id}
                        className="bg-white rounded-xl shadow p-4"
                    >
                        <img 
                            src={product.thumbnailUrl}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded"
                        />

                        <h2 className="mt-4 text-lg font-semibold">
                            {product.name}
                        </h2>

                        <p className="text-gray-600 mt-2">
                            {product.price.toLocaleString()}원
                        </p>

                        {product.status === "SOLD_OUT" ? (
                            <button className="mt-3 w-full bg-gray-400 text-white py-2 rounded">
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
        </div>
    );
}

