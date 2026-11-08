import { useEffect, useState } from "react";
import { API_URL } from "../api";
import "./VipLevels.css";

const formatCommissionRate = (value) => {
  const rate = Number(value);
  if (!Number.isFinite(rate) || rate <= 0) return "0%";

  const percentage = rate < 1 ? rate * 100 : rate;
  return `${Number.isInteger(percentage) ? percentage : percentage.toFixed(2)}%`;
};

const VipCard = ({ title, profit, application, icon, color }) => {
  return (
    <div className="vip-card-wrap">
      <div className="vip-card">
        <div className="vip-card-inner">
          <span className="vip-card-title">{title}</span>
          <div className="vip-card-info">
            <p className="vip-card-line">
              Profit: <strong>{profit}</strong>
            </p>
            <p className="vip-card-line">
              Application: <strong>{application}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="vip-badge">
        {icon ? (
          <img src={icon} alt={title} className="vip-badge-img" />
        ) : (
          <span
            className="vip-badge-fallback"
            style={{
              background: `radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.75), transparent 45%), ${color}`,
            }}
          >
            N
          </span>
        )}
      </div>
    </div>
  );
};

const VipLevels = () => {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    let alive = true;

    fetch(`${API_URL}/api/membership-levels`)
      .then((res) => res.json())
      .then((json) => {
        if (!alive) return;
        const list = json && json.success && Array.isArray(json.data) ? json.data : [];
        setLevels([...list].sort((a, b) => (a.grade || 0) - (b.grade || 0)));
      })
      .catch(() => {
        if (alive) setLevels([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="vip-levels">
      <div className="vip-levels-track">
        {levels.map((level, index) => (
          <VipCard
            key={level._id || `${level.name}-${index}`}
            title={level.name || `VIP${level.grade || index + 1}`}
            profit={formatCommissionRate(level.orderCommissionRate)}
            application={level.dailyOrderVolume || "0"}
            icon={level.picture || null}
            color={["#f5a623", "#9fb3c8", "#f5c842", "#3b6fd4", "#4caf50"][index % 5]}
          />
        ))}
      </div>
    </section>
  );
};

export default VipLevels;
