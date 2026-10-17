import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import nav1 from "./nav1.png";
import nav2 from "./nav2.png";
import nav3 from "./nav3.png";
import nav4 from "./nav4.png";
import { API_URL } from "../api";
import { useLanguage } from "../LanguageContext";
import LanguagePopup from "./LanguagePopup";
const Home = ({ user }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { lang, setLang, t } = useLanguage();
  const [showLangPopup, setShowLangPopup] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((json) => {
        if (!alive) return;
        const list = (json && json.success ? json.data : []) || [];
        const sorted = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setProducts(sorted);
      })
      .catch(() => {
        if (alive) setProducts([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const popularProducts = products.slice(0, 10);
  const trackRef = useRef(null);
  const scrollCarousel = (direction) => {
    if (trackRef.current) {
      const scrollAmount = 300;
      trackRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="main_container">
      <div className="language_setting">
        <div>
          <button className="language_btn" onClick={() => setShowLangPopup(true)}>
             {lang}
          </button>
        </div>
      </div>
      <div className="user_details">
        <div className="welcome_message">
          <span>{t("home.welcome")}</span>
        </div>
        <div className="username_show">
          <span>{user?.nickname || ''}</span>
        </div>
      </div>
      <div className="short_navigation">
        <div className="inner_navigation">
          <div className="short_nav_item" onClick={() => navigate('/deposit')}>
            <div>
              <img src={nav1} alt="" />
            </div>
            <div className="short_nav_text">
              <span>{t("home.deposit")}</span>
            </div>
          </div>
          <div className="short_nav_item" onClick={() => navigate('/withdraw')}>
            <div>
              <img src={nav2} alt="" />
            </div>
            <div className="short_nav_text">
              <span>{t("home.withdrawal")}</span>
            </div>
          </div>
          <div className="short_nav_item" onClick={() => navigate('/about-us')}>
            <div>
              <img src={nav3} alt="" />
            </div>
            <div className="short_nav_text">
              <span>{t("home.about_us")}</span>
            </div>
          </div>
          <div className="short_nav_item" onClick={() => navigate('/invite-friends')}>
            <div>
              <img src={nav4} alt="" />
            </div>
            <div className="short_nav_text">
              <span>{t("home.invite_friends")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="vip_carousel">
        <div className="vip_heading">
          <span>{t("home.vip_level")}</span>
        </div>
        <div className="main-carousel-wrapper">
          {/* Left Navigation Button */}
          <button
            className="carousel-btn prev-btn"
            onClick={() => scrollCarousel(-1)}
          >
            &#10094;
          </button>

          {/* Carousel Track with 20 Items */}
          <div ref={trackRef} className="carousel-track">
            {products.map((item) => (
              <div key={item._id} className="short-box-item">
                {item.picture && (
                  <img src={item.picture} alt={item.name} className="short-box-img" />
                )}
                <div className="box-content-left">
                  <h3>{item.name}</h3>
                </div>
                <div className="box-content-right">
                  <span className="rating">⭐ {item.rating}</span>
                  <span className="price">${item.price}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Navigation Button */}
          <button
            className="carousel-btn next-btn"
            onClick={() => scrollCarousel(1)}
          >
            &#10095;
          </button>
        </div>
      </div>
      <div className="popular_section">
        <div className="pop_heading">
          <span>{t("home.popular")}</span>
        </div>
        <div className="parent-container">
          {popularProducts.map((item) => (
            <div key={item._id} className="box-item">
              {item.picture && (
                <img src={item.picture} alt={item.name} className="pop-img" />
              )}
              <div className="box-content-left">
                <h3>{item.name}</h3>
              </div>
              <div className="box-content-right">
                <span className="rating">⭐ {item.rating}</span>
                <span className="price">${item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <LanguagePopup
        open={showLangPopup}
        onClose={() => setShowLangPopup(false)}
        lang={lang}
        setLang={setLang}
      />
    </div>
  );
};

export default Home;
