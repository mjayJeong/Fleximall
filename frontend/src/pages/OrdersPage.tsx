import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type OrderItem = {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    lineTotal: number;
};

type Order = {
    id: number;
    status: string;
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const load = async() => {
        setLoading(true);
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <Link className="text-sm text-gray-600 hover:underline" to="/">
                ← 상품 목록
                </Link>

                <div className="flex items-center justify-between mt-4">
                    <h1 className="text-2xl font-bold">주문 내역</h1>
                    <button 
                        onClick={load}
                        className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
                    >
                        {loading ? "불러오는 중..." : "새로고침"}    
                    </button>
                </div>

                {orders.length === 0 && !loading ? (
                    <div className="mt-8 bg-white rounded-2xl shadow p-6 text-gray-600">
                        주문 내역이 아직 없어.
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4">
                        {orders.map((o) => (
                            <div key={o.id} className="bg-white rounded-2xl shadow p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-semibold">주문 #{o.id}</div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            상태: <span className="font-medium">{o.status}</span>
                                        {" · "}
                                        {new Date(o.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold">
                                        {o.totalPrice.toLocaleString()}원
                                    </div>
                                </div>

                                <div className="mt-4 border-t pt-4 grid gap-2">
                                    {o.items.map((it) => (
                                        <div key={it.productId} className="flex justify-between text-sm">
                                            <div className="text-gray-700">
                                                {it.name} x {it.quantity}
                                            </div>
                                            <div className="font-medium">
                                                {it.lineTotal.toLocaleString()}원
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                        ))}
                        </div>
                )} 
            </div>
        </div>
    )
}