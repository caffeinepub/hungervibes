import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type PanelType = "customer" | "restaurant" | "delivery" | "admin";

interface Panel {
  id: PanelType;
  icon: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const panels: Panel[] = [
  {
    id: "customer",
    icon: "🛒",
    title: "Customer",
    description: "Order food from your favourite restaurants",
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
  {
    id: "restaurant",
    icon: "🍽️",
    title: "Restaurant Partner",
    description: "Manage your restaurant, menu & orders",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    id: "delivery",
    icon: "🛵",
    title: "Delivery Agent",
    description: "Pick up and deliver orders to customers",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    id: "admin",
    icon: "⚙️",
    title: "Admin Panel",
    description: "Manage the entire platform",
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
];

export default function HomePage({
  onSelectPanel,
}: {
  onSelectPanel: (panel: PanelType) => void;
}) {
  const { identity } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col">
      {/* Header */}
      <header className="px-6 pt-10 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-5xl mb-3">🔥</div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            HungerVibes
          </h1>
          <p className="mt-2 text-gray-500 text-base">
            India's favourite food delivery platform
          </p>
          {identity && (
            <p className="mt-1 text-sm text-green-600 font-medium">
              ✓ Signed in
            </p>
          )}
        </motion.div>
      </header>

      {/* Panel Cards */}
      <main className="flex-1 px-4 pb-10 max-w-lg mx-auto w-full">
        <p className="text-center text-sm text-gray-500 mb-6 font-medium uppercase tracking-widest">
          Select your panel
        </p>
        <div className="grid grid-cols-1 gap-4">
          {panels.map((panel, idx) => (
            <motion.button
              key={panel.id}
              type="button"
              data-ocid={`home.${panel.id}.button`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectPanel(panel.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer ${panel.bgColor}`}
            >
              <span className="text-4xl">{panel.icon}</span>
              <div className="flex-1">
                <div className={`font-bold text-lg ${panel.color}`}>
                  {panel.title}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {panel.description}
                </div>
              </div>
              <span className="text-gray-400 text-xl">›</span>
            </motion.button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400">
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
