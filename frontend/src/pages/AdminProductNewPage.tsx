import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from '../lib/api';

type Form = {
    name: string;
    price: string;
    stock: string;
};

type ProductDto = {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
  thumbnailUrl: string;
};

export default function AdminProductNewPage() {
  const nav = useNavigate();
  const [form, setForm] = useState<Form>({
    name: "",
    price: "",
    stock: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 간단 검증
    if (!form.name.trim()) return setError("상품명을 입력해줘.");
    if (!form.price || Number(form.price) <= 0) return setError("가격은 1원 이상.");
    if (form.stock === "" || Number(form.stock) < 0) return setError("재고는 0 이상.");
    if (!file) return setError("썸네일 이미지를 선택해줘.");

    setSaving(true);
    try {
      // 1. 상품 생성
     const createRes = await apiFetch("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      if (!createRes.ok) throw new Error(await createRes.text());
      const created: ProductDto = await createRes.json();
      
      // 2. 썸네일 업로드
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await apiFetch(`/api/admin/products/${created.id}/thumbnail`, {
        method: "POST",
        body: fd,
      });

      if (!uploadRes.ok) throw new Error(await uploadRes.text());

      // 등록 성공 -> 상품 목록으로 이동
      nav("/");
    } catch (err: any) {
      setError(err.message ?? "에러 발생");
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-6">관리자: 상품 등록</h1>

        <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-xl shadow">
            <div>
                <label className="block text-sm font-medium mb-1">상품명</label>
                <input 
                    className="w-full border rounded px-3 py-2"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">가격(원)</label>
                    <input
                    className="w-full border rounded px-3 py-2"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    inputMode="numeric"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">재고</label>
                    <input
                    className="w-full border rounded px-3 py-2"
                    value={form.stock}
                    onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                    inputMode="numeric"
                    />
                </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">이미지</label>
                  <input
                      type='file'
                      accept='image/*'
                      className='w-full'
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  {file && <p className='text-xs text-gray-600 mt-1'>선택됨: {file.name}</p>}
                </div>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
                        {error}
                    </div>
                )}

                <button
                    disabled={saving}
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-60"
                >
                    {saving ? "등록 중... " : "등록하기"}
                </button>
        </form>
    </div>
  );
}
