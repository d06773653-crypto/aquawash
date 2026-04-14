const { useState } = React;

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>💧 AQUAWASH</h1>
      <p>Сайт працює ✅</p>

      <button onClick={() => setCount(count + 1)}>
        Натиснув: {count}
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
