import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

const demoAccounts = [
  ["Admin", "admin@opencharity.vn", "ADMIN"],
  ["Donor", "donor@opencharity.vn", "DONOR"],
  ["Charity", "charity@opencharity.vn", "CHARITY"],
  ["Supplier", "supplier@opencharity.vn", "SUPPLIER"]
];

function landingFor(role) {
  if (role === "ADMIN") return "/admin";
  if (role === "CHARITY") return "/organization";
  if (role === "SUPPLIER") return "/supplier";
  return "/campaigns";
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("donor@opencharity.vn");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      navigate(landingFor(user.role));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="shell">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_0.95fr]">
        <div>
          <h1 className="section-title">Đăng nhập phân quyền</h1>
          <p className="section-lead">Bốn vai trò bắt buộc từ báo cáo được tách luồng rõ: donor, charity organization, supplier và admin/platform operator.</p>
          <div className="mt-6 grid gap-3">
            {demoAccounts.map(([label, account, role]) => (
              <button
                key={account}
                className="rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-teal-brand"
                onClick={() => {
                  setEmail(account);
                  setPassword("123456");
                }}
              >
                <span className="font-semibold text-slate-950">{label}</span>
                <span className="ml-2 rounded-md bg-teal-soft px-2 py-1 text-xs font-semibold text-teal-ink">{role}</span>
                <p className="mt-1 text-sm text-slate-500">{account} / 123456</p>
              </button>
            ))}
          </div>
        </div>

        <form className="panel p-6" onSubmit={submit}>
          <h2 className="text-2xl font-semibold text-slate-950">Mở phiên demo</h2>
          <div className="mt-5 grid gap-4">
            <label>
              <span className="label">Email</span>
              <input className="field mt-1" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              <span className="label">Mật khẩu</span>
              <input className="field mt-1" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
            <button className="btn-primary" type="submit">Đăng nhập</button>
          </div>
        </form>
      </div>
    </section>
  );
}
