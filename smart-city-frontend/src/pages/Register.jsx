import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
          department: role === "officer" ? department : null
        }
      );

      alert(response.data.message || "Registration successful");

      navigate("/login");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Register</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create your account as a citizen or officer.
        </p>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">

          <div>
            <label className="text-sm font-medium">Full name</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="citizen">Citizen</option>
              <option value="officer">Officer</option>
            </select>
          </div>

          {role === "officer" && (
            <div>
              <label className="text-sm font-medium">Department</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                type="text"
                placeholder="Roads / Water / Electricity"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white"
            type="submit"
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;