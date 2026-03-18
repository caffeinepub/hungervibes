import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type PanelType = "customer" | "restaurant" | "delivery" | "admin";

// Reduced from 10 to 6 emojis to cut simultaneous animation cost
const foodEmojis = [
  {
    emoji: "🍕",
    id: "pizza",
    style: {
      top: "8%",
      left: "5%",
      animationDelay: "0s",
      animationDuration: "18s",
    },
  },
  {
    emoji: "🍔",
    id: "burger",
    style: {
      top: "15%",
      right: "8%",
      animationDelay: "2s",
      animationDuration: "22s",
    },
  },
  {
    emoji: "🌮",
    id: "taco",
    style: {
      top: "30%",
      left: "3%",
      animationDelay: "4s",
      animationDuration: "20s",
    },
  },
  {
    emoji: "🍜",
    id: "noodle",
    style: {
      top: "45%",
      right: "5%",
      animationDelay: "1s",
      animationDuration: "25s",
    },
  },
  {
    emoji: "🍣",
    id: "sushi",
    style: {
      top: "60%",
      left: "8%",
      animationDelay: "6s",
      animationDuration: "19s",
    },
  },
  {
    emoji: "🥗",
    id: "salad",
    style: {
      top: "70%",
      right: "10%",
      animationDelay: "5s",
      animationDuration: "21s",
    },
  },
];

export default function HomePage({
  onSelectPanel,
}: {
  onSelectPanel: (panel: PanelType) => void;
}) {
  const { identity } = useInternetIdentity();

  return (
    <div className="home-page min-h-screen flex flex-col overflow-hidden relative">
      {/* Animated background */}
      <div className="home-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      {/* Floating food emojis */}
      <div aria-hidden="true">
        {foodEmojis.map((item) => (
          <span
            key={item.id}
            className="food-float"
            style={item.style as React.CSSProperties}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div
            className="text-7xl mb-4"
            style={{ filter: "drop-shadow(0 4px 24px rgba(251,146,60,0.5))" }}
          >
            🔥
          </div>
          <h1
            className="text-5xl font-extrabold tracking-tight mb-3"
            style={{ color: "#1a1a1a" }}
          >
            HungerVibes
          </h1>
          <p className="text-lg text-gray-500 mb-2 font-medium">
            India's favourite food delivery platform
          </p>
          {identity && (
            <p className="text-sm text-green-600 font-semibold">✓ Signed in</p>
          )}
        </motion.div>

        {/* Customer CTA */}
        <motion.button
          type="button"
          data-ocid="home.customer.button"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectPanel("customer")}
          className="customer-cta-btn group relative overflow-hidden"
        >
          <span className="relative z-10 flex flex-col items-center gap-1">
            <span className="text-3xl">🛒</span>
            <span className="text-2xl font-black tracking-tight">
              Order Now
            </span>
            <span className="text-sm font-medium opacity-90">
              {identity ? "Just logged in" : "Login or Sign Up"}
            </span>
          </span>
          <span className="cta-shimmer" aria-hidden="true" />
        </motion.button>
      </main>

      {/* Bottom bar */}
      <nav className="bottom-bar" aria-label="Partner panels">
        <button
          type="button"
          data-ocid="home.restaurant.button"
          onClick={() => onSelectPanel("restaurant")}
          className="bottom-bar-btn"
        >
          <span className="text-xl">🍽️</span>
          <span className="text-xs font-semibold">Restaurant</span>
        </button>
        <div className="bottom-bar-divider" aria-hidden="true" />
        <button
          type="button"
          data-ocid="home.delivery.button"
          onClick={() => onSelectPanel("delivery")}
          className="bottom-bar-btn"
        >
          <span className="text-xl">🛵</span>
          <span className="text-xs font-semibold">Delivery Agent</span>
        </button>
        <div className="bottom-bar-divider" aria-hidden="true" />
        <button
          type="button"
          data-ocid="home.admin.button"
          onClick={() => onSelectPanel("admin")}
          className="bottom-bar-btn"
        >
          <span className="text-xl">🔐</span>
          <span className="text-xs font-semibold">Admin</span>
        </button>
      </nav>

      {/* Footer credit */}
      <div className="absolute bottom-20 w-full text-center text-xs text-gray-400 z-10">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline hover:text-gray-600"
          target="_blank"
          rel="noreferrer"
        >
          Built with love using caffeine.ai
        </a>
      </div>
    </div>
  );
}
