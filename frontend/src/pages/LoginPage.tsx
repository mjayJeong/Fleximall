import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupRole, setSignupRole] = useState<"USER" | "ADMIN">("USER");
  const [err, setErr] = useState<string | null>(null);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const t = await res.text();
      setErr(t || "로그인 실패");
      return;
    }

    const data = await res.json(); // {accessToken,userId,role}
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("role", data.role);
    nav("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <form onSubmit={login} className="w-full max-w-sm bg-white p-6 rounded-2xl shadow space-y-3">
        <h1 className="text-xl font-bold">로그인</h1>
        <input className="w-full border rounded px-3 py-2" placeholder="email"
          value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="password" type="password"
          value={password} onChange={(e)=>setPassword(e.target.value)} />

        {err && <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">{err}</div>}

        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          로그인
        </button>

        <select
          className="w-full border rounded px-3 py-2"
          value={signupRole}
          onChange={(e) => setSignupRole(e.target.value as "USER" | "ADMIN")}
        >
          <option value="USER">USER로 가입</option>
          <option value="ADMIN">ADMIN으로 가입</option>
        </select>

        <button
          type="button"
          className="w-full border py-2 rounded hover:bg-gray-50"
          onClick={async () => {
            setErr(null);
            const res = await apiFetch("/api/auth/signup", {
              method: "POST",
              body: JSON.stringify({ email, password, role: signupRole }),
            });
            if (!res.ok) {
              const t = await res.text();
              setErr(t || "회원가입 실패");
              return;
            }
            const data = await res.json();
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("role", data.role);
            nav("/");
          }}
        >
          선택한 권한으로 회원가입 후 로그인
        </button>
      </form>
    </div>
  );
}
