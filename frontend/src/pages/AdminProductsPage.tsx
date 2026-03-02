import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';

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
  totalPages: number;
  number: number;
};

export default function AdminProductsPage() {
  const nav = useNavigate();
  const [page, setPage] = useState(0);
  const size = 12;
  const [data, setData] = useState<PageResp<Product> | null>(null);
  const [loading, setLoading] = useState(false);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("size", String(size));
    p.set("sort", "LATEST");
    return p.toString();
  }, [page]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/products?${params}`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [params]);

  const products = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const remove = async (id: number) => {
    if (!confirm("정말 삭제할까요?")) return;
    const res = await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert('삭제 실패');
      return;
    }
    await load();
  };

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>관리자 상품 목록</h1>
          <div className='flex gap-2'>
            <Link
              to="/admin/products/new"
              className='px-4 py-2 rounded bg-black text-white hover:bg-gray-800'
            >
              상품 등록
            </Link>
            <button
              onClick={load}
              className='px-4 py-2 rounded border bg-white hover:bg-gray-50'
            >
              {loading ? "불러오는 중..." : "새로고침"}
            </button>
          </div>
        </div>
        
        <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
          {products.map((p) => (
            <div key={p.id} className='bg-white rounded-2xl shadow p-4'>
              <img 
                src={p.thumbnailUrl}
                alt={p.name}
                className='w-full h-40 object-cover rounded-xl'
              />
              <div className='mt-3 font-semibold'>{p.name}</div>
              <div className='text-sm text-gray-600 mt-1'>
                {p.price.toLocaleString()}원 · 재고 {p.stock} · {p.status}
              </div>

              <div className='mt-4 flex gap-2'>
                <button 
                  className='flex-1 border rounded py-2 hover:bg-gray-50'
                  onClick={() => nav(`/admin/products/${p.id}/edit`)}
                >
                  수정
                </button>
                <button 
                  className='w-24 border rounded py-2 hover:bg-gray-50 text-red-500'
                  onClick={() => remove(p.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className='mt-8 bg-white rounded-2xl shadow p-6 text-gray-600'>
            아직 상품이 없어요. 등록해보세요! 
          </div>
        )}

        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-2 mt-8'>
            <button 
              className='px-3 py-2 rounded border bg-white disabled:opacity-50'
              disabled={page <= 0}
              onClick={() => setPage((p) => p - 1)}
            >
              이전
            </button>
            <div className='text-sm text-gray-600'>
              {page + 1} / {totalPages}
            </div>
            <button 
              className='px-3 py-2 rounded border bg-white disabled:opacity-50'
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}