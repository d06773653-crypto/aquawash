const { useState, useEffect } = React;

/* ================= GLOBAL CSS ================= */
const style = document.createElement("style");
style.innerHTML = `
body { margin:0; font-family: Arial; background:#060b14; color:#fff; }
.container { max-width:900px; margin:auto; padding:30px; }
.center { text-align:center; }
.card {
  background:#111d2e;
  padding:25px;
  border-radius:16px;
  margin-top:20px;
}
.btn {
  padding:12px 20px;
  margin:8px;
  border:none;
  border-radius:10px;
  cursor:pointer;
}
.primary { background:#00d4ff; }
.gold { background:#f0c040; }
.ghost { background:#1e3250; color:#ccc; }

h1 { margin-bottom:10px; }
.plan {
  border:1px solid #1e3250;
  padding:20px;
  border-radius:14px;
  margin:10px 0;
}
.code {
  font-size:28px;
  letter-spacing:4px;
  background:#0d1825;
  padding:15px;
  border-radius:10px;
  display:inline-block;
  margin:15px 0;
}
`;
document.head.appendChild(style);

/* ================= UTILS ================= */
function today() {
  return new Date().toISOString().split("T")[0];
}

function genCode(uid, date) {
  let seed = uid + date;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
  }
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  let n = Math.abs(hash);
  for (let i = 0; i < 8; i++) {
    code += chars[n % chars.length];
    n = Math.floor(n / 2);
  }
  return code;
}

/* ================= APP ================= */
function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [db, setDb] = useState({});
  const [used, setUsed] = useState({});

  function go(p) {
    setPage(p);
  }

  function register(name, email) {
    const u = { id: Date.now(), name, email, sub: null };
    setDb({ ...db, [email]: u });
    setUser(u);
    setPage("dashboard");
  }

  function login(email) {
    if (db[email]) {
      setUser(db[email]);
      setPage("dashboard");
    } else {
      alert("Немає користувача");
    }
  }

  function buy(plan) {
    const end = new Date();
    if (plan === "month") end.setMonth(end.getMonth() + 1);
    if (plan === "year") end.setFullYear(end.getFullYear() + 1);

    const updated = {
      ...db,
      [user.email]: {
        ...user,
        sub: {
          plan,
          end: end.toISOString().split("T")[0],
        },
      },
    };

    setDb(updated);
    setUser(updated[user.email]);
    setPage("dashboard");
  }

  function markUsed() {
    setUsed({ ...used, [user.id + today()]: true });
  }

  const code = user?.sub ? genCode(user.id, today()) : null;
  const isUsed = used[user?.id + today()];

  return (
    <div className="container">

      {/* HOME */}
      {page === "home" && (
        <div className="center">
          <h1>💧 AQUAWASH</h1>
          <p>Підписка на автомийку</p>

          <button className="btn primary" onClick={() => go("login")}>Увійти</button>
          <button className="btn gold" onClick={() => go("register")}>Реєстрація</button>
        </div>
      )}

      {/* LOGIN */}
      {page === "login" && (
        <div className="card center">
          <h2>Вхід</h2>
          <button className="btn primary" onClick={() => login("test@mail.com")}>
            Увійти як тест
          </button>
          <button className="btn ghost" onClick={() => go("home")}>Назад</button>
        </div>
      )}

      {/* REGISTER */}
      {page === "register" && (
        <div className="card center">
          <h2>Реєстрація</h2>
          <button className="btn primary" onClick={() => register("Іван", "test@mail.com")}>
            Створити тест акаунт
          </button>
          <button className="btn ghost" onClick={() => go("home")}>Назад</button>
        </div>
      )}

      {/* DASHBOARD */}
      {page === "dashboard" && user && (
        <div className="card center">
          <h2>Привіт, {user.name}</h2>

          {user.sub ? (
            <>
              <p>Код на сьогодні:</p>
              <div className="code">{code}</div>

              <p>{isUsed ? "Використано" : "Доступний"}</p>

              {!isUsed && (
                <button className="btn primary" onClick={markUsed}>
                  Використати код
                </button>
              )}
            </>
          ) : (
            <>
              <p>Немає підписки</p>
              <button className="btn gold" onClick={() => go("plans")}>
                Купити підписку
              </button>
            </>
          )}

          <button className="btn ghost" onClick={() => go("home")}>
            Вийти
          </button>
        </div>
      )}

      {/* PLANS */}
      {page === "plans" && (
        <div className="card">
          <h2>Плани</h2>

          <div className="plan">
            <h3>Місячний — 299₴</h3>
            <button className="btn primary" onClick={() => buy("month")}>
              Купити
            </button>
          </div>

          <div className="plan">
            <h3>Річний — 2490₴</h3>
            <button className="btn gold" onClick={() => buy("year")}>
              Купити
            </button>
          </div>

          <button className="btn ghost" onClick={() => go("dashboard")}>
            Назад
          </button>
        </div>
      )}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
