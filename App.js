import { useState } from "react";

const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta",
  "Dubai", "London", "New York", "Tokyo", "Paris",
  "Toronto", "Sydney", "Mumbai", "Delhi", "Riyadh"
];
const styles = {
  app: {
    minHeight: "100vh",
    background: "#0F172A",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 16px",
    fontFamily: "Arial, sans-serif",
  },
  container: { width: "100%", maxWidth: "480px" },
  title: { textAlign: "center", fontSize: "26px", fontWeight: "bold", color: "#60A5FA", marginBottom: "4px" },
  subtitle: { textAlign: "center", fontSize: "13px", color: "#64748B", marginBottom: "24px" },
  searchRow: { display: "flex", gap: "8px", marginBottom: "16px" },
  input: {
    flex: 1, padding: "10px 14px", fontSize: "14px",
    background: "#1E293B", border: "1px solid #334155",
    borderRadius: "10px", color: "#E2E8F0", outline: "none",
  },
  button: {
    padding: "10px 18px", fontSize: "14px", fontWeight: "bold",
    background: "#60A5FA", color: "#0F172A",
    border: "none", borderRadius: "10px", cursor: "pointer",
  },
  citiesRow: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" },
  pill: {
    padding: "5px 14px", fontSize: "12px", borderRadius: "20px",
    background: "#1E293B", border: "1px solid #334155",
    color: "#94A3B8", cursor: "pointer",
  },
  pillActive: {
    padding: "5px 14px", fontSize: "12px", borderRadius: "20px",
    background: "#1D4ED8", border: "1px solid #60A5FA",
    color: "#BFDBFE", cursor: "pointer",
  },
  card: {
    background: "#1E293B", border: "1px solid #334155",
    borderRadius: "16px", padding: "24px",
  },
  cityName: { fontSize: "20px", fontWeight: "bold", color: "#E2E8F0", marginBottom: "6px" },
  condition: { fontSize: "13px", color: "#94A3B8", marginBottom: "20px", textTransform: "capitalize" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "16px" },
  statBox: {
    background: "#0F172A", borderRadius: "10px",
    padding: "12px", textAlign: "center",
  },
  statVal: { fontSize: "20px", fontWeight: "bold", color: "#FBBF24" },
  statLabel: { fontSize: "11px", color: "#64748B", marginTop: "4px" },
  outfitBox: {
    background: "#0C4A6E", border: "1px solid #0EA5E9",
    borderRadius: "10px", padding: "14px 16px",
    fontSize: "14px", color: "#BAE6FD", fontWeight: "bold",
  },
  error: { color: "#F87171", textAlign: "center", marginTop: "16px", fontSize: "14px" },
  loading: { color: "#60A5FA", textAlign: "center", marginTop: "16px", fontSize: "14px" },
};

function App() {
  const [city, setCity] = useState("");
  const [activeCity, setActiveCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const res = await fetch(`http://127.0.0.1:5000/weather?city=${cityName}`);
      const data = await res.json();
      if (data.cod !== 200) {
        setError("City not found, please check the name!");
      } else {
        setWeather(data);
      }
    } catch {
      setError("Cannot connect to server. Is Flask running?");
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (city.trim()) {
      setActiveCity(city.trim());
      fetchWeather(city.trim());
    }
  };

  const handlePill = (c) => {
    setActiveCity(c);
    setCity(c);
    fetchWeather(c);
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>

        <div style={styles.title}>⛅ Weather + Outfit</div>
        <div style={styles.subtitle}>Check your city's weather & get outfit suggestions</div>

        <div style={styles.searchRow}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter city name... (e.g. Lahore)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button style={styles.button} onClick={handleSearch}>Search</button>
        </div>

        <div style={styles.citiesRow}>
          {CITIES.map((c) => (
            <span
              key={c}
              style={activeCity === c ? styles.pillActive : styles.pill}
              onClick={() => handlePill(c)}
            >
              {c}
            </span>
          ))}
        </div>

        {loading && <div style={styles.loading}>Fetching weather...</div>}
        {error && <div style={styles.error}>{error}</div>}

        {weather && weather.main && (
          <div style={styles.card}>
            <div style={styles.cityName}>📍 {weather.name}, {weather.sys.country}</div>
            <div style={styles.condition}>🌥️ {weather.weather[0].description}</div>

            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statVal}>{Math.round(weather.main.temp)}°C</div>
                <div style={styles.statLabel}>Temperature</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statVal}>{weather.main.humidity}%</div>
                <div style={styles.statLabel}>Humidity</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statVal}>{Math.round(weather.wind.speed)} km/h</div>
                <div style={styles.statLabel}>Wind</div>
              </div>
            </div>

            <div style={styles.outfitBox}>
              {weather.outfit_suggestion}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;