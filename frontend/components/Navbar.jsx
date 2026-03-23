import { Link } from "react-router-dom";

export default function Navbar() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <nav className="w-full flex justify-between items-center px-10 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">

      {/* LEFT LOGO */}
      <h1 className="text-xl font-bold text-cyan-400 tracking-widest">
        AUTHENTIX
      </h1>

      {/* RIGHT LINKS */}
      <div className="flex items-center gap-8">

        <Link className="hover:text-cyan-400" to="/">Home</Link>
        <Link className="hover:text-cyan-400" to="/image">Image</Link>
        <Link className="hover:text-cyan-400" to="/gaze">Gaze</Link>
        <Link className="hover:text-cyan-400" to="/text">Text</Link>
        <Link className="hover:text-cyan-400" to="/about">About</Link>

        {isLoggedIn ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="btn"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}