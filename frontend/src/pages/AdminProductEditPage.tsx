import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";

type ProductDetail = {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
  thumbnailUrl: string;
  wishCount?: number;
  wished?: boolean;
};

export default function AdminProductEditPage() {
  const nav = useNavigate();
  const { id } = useParams();
  const productId = Number(id);

  const [data, setData] = useState<ProductDetail | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const load = async () => {
    const res = await apiFetch(`/api/products/${productId}`);
    if (!res.ok) {
      setError("상품을 불러오지 못했어.");
      return;
    }
    const json = await res.json();
    setData(json);
    setName(json.name);
    setPrice(String(json.price));
    setStock(String(json.stock));
  };

  useEffect(() => {
    if (!Number.isFinite(productId)) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const saveBasic = async () => {
    setError(null);
    if (!name.trim()) return setError("상품명을 입력해줘.");
    if (!price || Number(price) <= 0) return setError("가격은 1원 이상.");
    if (stock === "" || Number(stock) < 0) return setError("재고는 0 이상.");

    setSaving(true);
    try {
      const res = await apiFetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          stock: Number(stock),
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setData((prev) => (prev ? { ...prev, ...updated } : prev));
      alert("기본 정보 저장 완료!");
    } catch (e: any) {
      setError(e?.message ?? "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const uploadThumb = async () => {
    setError(null);
    if (!file) return setError("업로드할 이미지를 선택해줘.");

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await apiFetch(`/api/admin/products/${productId}/thumbnail`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setData((prev) => (prev ? { ...prev, thumbnailUrl: updated.thumbnailUrl } : prev));
      setFile(null);
      alert("썸네일 변경 완료!");
    } catch (e: any) {
      setError(e?.message ?? "업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (!confirm("정말 삭제할까?")) return;
    const res = await apiFetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    if (!res.ok) {
      alert("삭제 실패");
      return;
    }
    alert("삭제 완료");
    nav("/admin/products");
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          <Link className="text-sm text-gray-600 hover:underline" to="/admin/products">
            ← 관리자 상품 목록
          </Link>
          <div className="mt-6 text-gray-600">불러오는 중...</div>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <Link className="text-sm text-gray-600 hover:underline" to="/admin/products">
          ← 관리자 상품 목록
        </Link>

        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-bold">상품 수정 #{data.id}</h1>
          <button
            onClick={remove}
            className="px-4 py-2 rounded border bg-white hover:bg-gray-50 text-gray-700"
          >
            삭제
          </button>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">현재 썸네일</div>
              <img
                src={data.thumbnailUrl}
                alt={data.name}
                className="w-full h-56 object-cover rounded-xl"
              />

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">썸네일 교체</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                {file && <div className="text-xs text-gray-600 mt-1">{file.name}</div>}

                <button
                  onClick={uploadThumb}
                  disabled={uploading}
                  className="mt-3 w-full border rounded py-2 hover:bg-gray-50 disabled:opacity-60"
                >
                  {uploading ? "업로드 중..." : "썸네일 업로드"}
                </button>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2">기본 정보</div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">상품명</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">가격</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      inputMode="numeric"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">재고</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      inputMode="numeric"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  상태: <span className="font-medium">{data.status}</span>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
                    {error}
                  </div>
                )}

                <button
                  onClick={saveBasic}
                  disabled={saving}
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-60"
                >
                  {saving ? "저장 중..." : "기본 정보 저장"}
                </button>

                <button
                  onClick={() => nav(`/p/${data.id}`)}
                  className="w-full border py-2 rounded hover:bg-gray-50"
                >
                  고객 화면에서 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}