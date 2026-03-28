import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function Sidebar() {
  const { t } = useTranslation();
  const { isAuthed, user } = useAuth();
  if (!isAuthed) return null;

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm font-medium ${
      isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <aside className="w-64 shrink-0">
      <div className="rounded-xl border bg-white p-3">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {user?.role === "officer" ? t('officer') : t('citizen')} {t('menu')}
        </div>

        <nav className="mt-2 space-y-1">
          {user?.role === "citizen" ? (
            <>
              <NavLink to="/citizen" className={linkClass}>
                {t('dashboard')}
              </NavLink>
              <NavLink to="/citizen/create" className={linkClass}>
                {t('create_complaint')}
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/officer" className={linkClass}>
                {t('dashboard')}
              </NavLink>
              <NavLink to="/officer/complaints" className={linkClass}>
                {t('complaints')}
              </NavLink>
              <NavLink to="/officer/map" className={linkClass}>
                {t('map')}
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;