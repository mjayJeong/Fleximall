import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";

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

type PageResp<T> = {
  content: T[];
  totalPages: number;
  number: number;
};

const STATUSES = ["PAID", "SHIPPING", "COMPLETED", "CANCELED"] as const;

export default function AdminOrdersPage() {
  const [page, setPage] = useState(0);
  const size = 10;

  const [data, setData] = useState<PageResp<Order> | null>(null);
  const [loading, setLoading] = useState(false);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("size", String(size));
    return p.toString();
  }, [page]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/orders?${params}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const orders = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const updateStatus = async (orderId: number, status: string) => {
    const res = await apiFetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const text = await res.text();
      alert(text || "상태 변경 실패");
      return;
    }
    // 화면 즉시 반영
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content: prev.content.map((o) => (o.id === orderId ? { ...o, status } : o)),
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Link className="text-sm text-gray-600 hover:underline" to="/">
          ← 상품 목록
        </Link>

        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-bold">관리자 주문관리</h1>
          <button
            onClick={load}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
          >
            {loading ? "불러오는 중..." : "새로고침"}
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">주문 #{o.id}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold">{o.totalPrice.toLocaleString()}원</div>
                  <div className="mt-2">
                    <select
                      className="border rounded px-3 py-2 text-sm"
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t pt-4 grid gap-2">
                {o.items.map((it) => (
                  <div key={it.productId} className="flex justify-between text-sm">
                    <div className="text-gray-700">
                      {it.name} × {it.quantity}
                    </div>
                    <div className="font-medium">{it.lineTotal.toLocaleString()}원</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {orders.length === 0 && !loading && (
            <div className="bg-white rounded-2xl shadow p-6 text-gray-600">
              주문이 아직 없어요.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              className="px-3 py-2 rounded border bg-white disabled:opacity-50"
              disabled={page <= 0}
              onClick={() => setPage((p) => p - 1)}
            >
              이전
            </button>

            <div className="text-sm text-gray-600">
              {page + 1} / {totalPages}
            </div>

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
    </div>
  );
}
