import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type CartItem = {
  productId: number;
  name: string;
  price: number;
  thumbnailUrl: string;
  stock: number;
  status: string;
  quantity: number;
  lineTotal: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.lineTotal, 0),
    [items]
  );

  const changeQty = async (productId: number, nextQty: number) => {
    // 낙관적 업데이트
    setItems((prev) =>
      prev
        .map((it) =>
          it.productId === productId
            ? { ...it, quantity: nextQty, lineTotal: it.price * nextQty }
            : it
        )
        .filter((it) => it.quantity > 0)
    );

    await fetch(`/api/cart/items/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: nextQty }),
    });
  };

  const remove = async (productId: number) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
    await fetch(`/api/cart/items/${productId}`, { method: "DELETE" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Link className="text-sm text-gray-600 hover:underline" to="/">
          ← 상품 목록
        </Link>

        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-bold">장바구니</h1>
          <button
            onClick={load}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
          >
            {loading ? "불러오는 중..." : "새로고침"}
          </button>
        </div>

        {items.length === 0 && !loading ? (
          <div className="mt-8 bg-white rounded-2xl shadow p-6 text-gray-600">
            장바구니가 비었어. 상품을 담아봐!
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {items.map((it) => {
              const soldOut = it.status === "SOLD_OUT" || it.stock <= 0;
              return (
                <div key={it.productId} className="bg-white rounded-2xl shadow p-4">
                  <div className="flex gap-4">
                    <img
                      src={it.thumbnailUrl}
                      alt={it.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{it.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {it.price.toLocaleString()}원
                            {soldOut && (
                              <span className="ml-2 text-gray-500 font-medium">
                                · 품절
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => remove(it.productId)}
                          className="text-sm text-gray-500 hover:underline"
                        >
                          삭제
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className="w-9 h-9 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
                            disabled={it.quantity <= 1}
                            onClick={() => changeQty(it.productId, it.quantity - 1)}
                          >
                            -
                          </button>

                          <div className="w-12 text-center font-medium">
                            {it.quantity}
                          </div>

                          <button
                            className="w-9 h-9 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
                            disabled={soldOut}
                            onClick={() => changeQty(it.productId, it.quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        <div className="font-semibold">
                          {it.lineTotal.toLocaleString()}원
                        </div>
                      </div>

                      {it.quantity > it.stock && (
                        <div className="mt-2 text-sm text-red-600">
                          재고({it.stock})보다 많이 담겼어. 수량을 줄여줘!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-white rounded-2xl shadow p-5 flex items-center justify-between">
              <div className="text-gray-600">총 금액</div>
              <div className="text-xl font-bold">{total.toLocaleString()}원</div>
            </div>

            <button
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 disabled:opacity-60"
              disabled={items.length === 0 || items.some((it) => it.quantity > it.stock)}
              onClick={() => alert("다음 단계에서 주문/결제 API 붙일 거야!")}
            >
              주문하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
