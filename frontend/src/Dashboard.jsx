import { useEffect, useState} from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

const socket = io("http://localhost:4000");
const STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

export default function Dashboard() {
  const [prices, setPrices] = useState({});
  const [prevPrices, setPrevPrices] = useState({});
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      navigate("/");
    } else {
      setEmail(storedEmail);
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    socket.on("priceUpdate", ({ stock, price }) => {
      setPrevPrices((prev) => ({ ...prev, [stock]: prices[stock] }));
      setPrices((prev) => ({ ...prev, [stock]: price }));
    });

    return () => socket.off("priceUpdate");
  }, [prices]);

  const subscribe = (stock) => {
    socket.emit("subscribe", stock);
  };

  const logout = () => {
    localStorage.removeItem("email");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(to right, #667eea, #764ba2)",
      }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold">Stock Dashboard</span>
        <div>
          <span className="text-white me-3">{email}</span>
          <button className="btn btn-danger btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container py-4">
        {/* Subscribe */}
        <div className="card shadow mb-4">
          <div className="card-body">
            <h4 className="mb-3">Subscribe to Stocks</h4>
            {STOCKS.map((s) => (
              <button
                key={s}
                className="btn btn-outline-primary me-2 mb-2"
                onClick={() => subscribe(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Live Prices */}
        <div className="card shadow">
          <div className="card-body">
            <h4 className="mb-3">Live Prices</h4>

            {Object.keys(prices).length === 0 ? (
              <p className="text-muted">
                Subscribe to stocks to see live updates
              </p>
            ) : (
              <table className="table table-hover text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Stock</th>
                    <th>Price ($)</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(prices).map(([stock, price]) => {
                    const prev = prevPrices[stock];
                    const isUp = prev && price > prev;
                    const isDown = prev && price < prev;

                    return (
                      <tr key={stock}>
                        <td className="fw-bold">{stock}</td>
                        <td
                          className={
                            isUp
                              ? "text-success fw-bold"
                              : isDown
                              ? "text-danger fw-bold"
                              : ""
                          }
                        >
                          {price}
                        </td>
                        <td>
                          {isUp && "🟢"}
                          {isDown && "🔴"}
                          {!prev && "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
