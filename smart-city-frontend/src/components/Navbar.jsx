import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthed, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to={user?.role === "officer" ? "/officer" : "/citizen"} className="font-semibold">
          Smart City Portal
        </Link>

        <div className="flex items-center gap-3">
          {isAuthed ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">
                Role: <span className="font-medium text-slate-900">{user?.role}</span>
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" to="/login">
                Login
              </Link>
              <Link className="rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-800" to="/register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;