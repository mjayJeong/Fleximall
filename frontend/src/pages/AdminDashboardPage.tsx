import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';

type LowStock = {
  id: number;
  name: string;
  stock: number;
  status: string;
};

type Dashboard = {
  todayOrderCount: number;
  todayRevenue: number;
  lowStockTop5: LowStock[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/dashboard");
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
  }, []);

  if (!data) {
    return (
      <div className='min-h-screen bg-gray-100 p-6'>
        <div className='max-w-4xl mx-auto'>
          <Link className='text-sm text-gray-600 hover:underline' to="/">
          ← 상품 목록
          </Link>
          <div className='mt-6 text-gray-600'>{loading ? "불러오는 중..." : "데이터 없음"}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Link className="text-sm text-gray-600 hover:underline" to="/">
          ← 상품 목록
        </Link>

        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-bold">관리자 대시보드</h1>
          <button
            onClick={load}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
          >
            {loading ? "불러오는 중..." : "새로고침"}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-gray-600 text-sm">오늘 주문 수</div>
            <div className="text-3xl font-bold mt-2">{data.todayOrderCount}</div>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-gray-600 text-sm">오늘 매출</div>
            <div className="text-3xl font-bold mt-2">{data.todayRevenue.toLocaleString()}원</div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow p-5">
          <div className="font-semibold">재고 부족 TOP5</div>
          <div className="mt-4 grid gap-2">
            {data.lowStockTop5.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm border-b pb-2">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-gray-600">상태: {p.status}</div>
                </div>
                <div className={`font-semibold ${p.stock <= 0 ? "text-gray-500" : ""}`}>
                  재고 {p.stock}
                </div>
              </div>
            ))}
          </div>
          {data.lowStockTop5.length === 0 && (
            <div className="text-sm text-gray-600 mt-3">상품이 아직 없어요.</div>
          )}
        </div>
      </div>
    </div>
  );
}
