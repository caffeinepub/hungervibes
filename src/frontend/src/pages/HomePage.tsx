import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

type PanelType = "customer" | "restaurant" | "delivery" | "admin";

const ROLE_CARDS: {
  panel: PanelType;
  emoji: string;
  title: string;
  subtitle: string;
  ocid: string;
  gradient: string;
  border: string;
  badge: string;
}[] = [
  {
    panel: "customer",
    emoji: "🛒",
    title: "Customer",
    subtitle: "Order food from your favourite restaurants",
    ocid: "home.customer.button",
    gradient: "from-orange-50 to-amber-50",
    border: "border-orange-200 hover:border-orange-400",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    panel: "restaurant",
    emoji: "🍽️",
    title: "Restaurant Partner",
    subtitle: "Manage your menu, orders & deliveries",
    ocid: "home.restaurant.button",
    gradient: "from-rose-50 to-pink-50",
    border: "border-rose-200 hover:border-rose-400",
    badge: "bg-rose-100 text-rose-700",
  },
  {
    panel: "delivery",
    emoji: "🛵",
    title: "Delivery Partner",
    subtitle: "Pick up & deliver orders near you",
    ocid: "home.delivery.button",
    gradient: "from-emerald-50 to-teal-50",
    border: "border-emerald-200 hover:border-emerald-400",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    panel: "admin",
    emoji: "🔐",
    title: "Admin",
    subtitle: "Manage platform users, approvals & KYC",
    ocid: "home.admin.button",
    gradient: "from-slate-50 to-gray-100",
    border: "border-slate-200 hover:border-slate-400",
    badge: "bg-slate-100 text-slate-700",
  },
];

export default function HomePage({
  onSelectPanel: _onSelectPanel,
}: {
  onSelectPanel: (panel: PanelType) => void;
}) {
  const baseUrl = window.location.href.split("?")[0];

  function handleCardClick(panel: PanelType) {
    window.open(`${baseUrl}?panel=${panel}`, "_blank");
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(150deg, #fff7ed 0%, #ffffff 40%, #fff1f2 100%)",
      }}
    >
      {/* Header */}
      <header className="w-full pt-10 pb-4 flex flex-col items-center gap-2 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="flex flex-col items-center gap-2"
        >
          <div
            className="text-6xl mb-1"
            style={{
              filter: "drop-shadow(0 4px 20px rgba(251,146,60,0.5))",
            }}
          >
            🔥
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
            style={{ color: "#ea580c" }}
          >
            HungerVibes
          </h1>
          <p className="text-base text-gray-500 font-medium">
            India's favourite food delivery platform
          </p>
        </motion.div>
      </header>

      {/* Role cards grid */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6"
        >
          Choose your role to continue
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
          {ROLE_CARDS.map((card, i) => (
            <motion.button
              key={card.panel}
              type="button"
              data-ocid={card.ocid}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + i * 0.08,
                duration: 0.45,
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCardClick(card.panel)}
              className={`
                group relative flex flex-col text-left
                rounded-2xl border-2 p-6 cursor-pointer
                bg-gradient-to-br ${card.gradient} ${card.border}
                shadow-sm hover:shadow-md
                transition-all duration-200
              `}
            >
              {/* Icon + title row */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-3xl p-2 rounded-xl ${card.badge} select-none`}
                >
                  {card.emoji}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {card.title}
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-sm text-gray-500 flex-1 leading-relaxed">
                {card.subtitle}
              </p>

              {/* Login arrow */}
              <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
                <span>Login</span>
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-5 text-xs text-gray-400">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline hover:text-gray-600"
          target="_blank"
          rel="noreferrer"
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
