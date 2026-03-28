import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function Navbar() {
  const { isAuthed, user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to={user?.role === "officer" ? "/officer" : "/citizen"} className="font-semibold text-lg">
          {t('app_name')}
        </Link>

        <div className="flex items-center gap-4">
          <select 
            onChange={(e) => changeLanguage(e.target.value)} 
            value={i18n.language}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="en">English</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="hi">हिन्दी</option>
          </select>

          <div className="flex items-center gap-3">
            {isAuthed ? (
              <>
                <span className="hidden text-sm text-slate-600 sm:inline">
                  {t('status')}: <span className="font-medium text-slate-900 uppercase">{user?.role}</span>
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" to="/login">
                  {t('login')}
                </Link>
                <Link className="rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-800 transition-colors" to="/register">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;