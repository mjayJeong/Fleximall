import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Form = {
    name: string;
    price: string;
    stock: string;
    thumbnailUrl: string;
};

export default function AdminProductNewPage() {
  const nav = useNavigate();
  const [form, setForm] = useState<Form>({
    name: "",
    price: "",
    stock: "",
    thumbnailUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (key: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 간단 검증
    if (!form.name.trim()) return setError("상품명을 입력해줘.");
    if (!form.price || Number(form.price) <= 0) return setError("가격은 1원 이상.");
    if (form.stock === "" || Number(form.stock) < 0) return setError("재고는 0 이상.");
    if (!form.thumbnailUrl.trim()) return setError("썸네일 URL을 입력해줘.");

    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          thumbnailUrl: form.thumbnailUrl,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "등록 실패");
      }

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
                    onChange={(e) => onChange("name", e.target.value)}
                    placeholder="ex) 무선 마우스"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">가격(원)</label>
                    <input
                    className="w-full border rounded px-3 py-2"
                    value={form.price}
                    onChange={(e) => onChange("price", e.target.value)}
                    placeholder="19900"
                    inputMode="numeric"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">재고</label>
                    <input
                    className="w-full border rounded px-3 py-2"
                    value={form.stock}
                    onChange={(e) => onChange("stock", e.target.value)}
                    placeholder="12"
                    inputMode="numeric"
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium mb-1">썸네일 URL</label>
                <input
                    className="w-full border rounded px-3 py-2"
                    value={form.thumbnailUrl}
                    onChange={(e) => onChange("thumbnailUrl", e.target.value)}
                    placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">
                    일단은 URL로. (나중에 파일 업로드로 바꿀 거야)
                </p>
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
