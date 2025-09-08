import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePercent, Calendar, Crown } from "lucide-react";
import { useMemo, useState } from "react";

interface PlansSectionProps {
  darkMode?: boolean;
}

type PlanKey = "1m" | "3m" | "6m";

const defaultPrices: Record<PlanKey, number> = {
  "1m": 0,
  "3m": 0,
  "6m": 0,
};

interface PlanCardProps {
  darkMode?: boolean;
  label: string;
  keyName: PlanKey;
  badge: string;
  icon: JSX.Element;
  prices: Record<PlanKey, number>;
  onChange: (key: PlanKey, value: string) => void;
}

const PlanCard = ({ darkMode, label, keyName, badge, icon, prices, onChange }: PlanCardProps) => {
  const months = keyName === "1m" ? 1 : keyName === "3m" ? 3 : 6;
  const perMonth = months > 1 ? Math.floor((prices[keyName] || 0) / months) : prices[keyName] || 0;
  return (
    <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} p-6 shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`${darkMode ? 'bg-gray-900 text-indigo-300' : 'bg-indigo-50 text-indigo-600'} w-9 h-9 rounded-lg flex items-center justify-center`}>{icon}</div>
          <div className="flex flex-col">
            <span className="font-semibold">{label}</span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{months} tháng</span>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>{badge}</span>
      </div>
      <div className="space-y-2">
        <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Giá gói (tổng)</label>
        <div className="relative">
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>₫</span>
          <input
            type="text"
            value={prices[keyName] === 0 ? '' : String(prices[keyName])}
            onChange={(e) => onChange(keyName, e.target.value)}
            className={`w-full rounded-md border pl-7 pr-3 py-2 outline-none transition-colors ${
              darkMode
                ? 'bg-gray-950 text-gray-100 border-gray-800 placeholder-gray-500 focus:border-primary'
                : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:border-primary'
            }`}
            placeholder="Nhập giá (VND)"
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hiển thị</span>
          <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(prices[keyName] || 0)}</span>
        </div>
        {months > 1 && (
          <div className="flex items-center justify-between text-xs">
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tương đương mỗi tháng</span>
            <span className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(perMonth)}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

const PlansSection = ({ darkMode }: PlansSectionProps) => {
  const [prices, setPrices] = useState<Record<PlanKey, number>>(defaultPrices);
  const [currentPrices, setCurrentPrices] = useState<Record<PlanKey, number>>(defaultPrices);
  const [saving, setSaving] = useState<boolean>(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(value || 0);

  const handleChange = (key: PlanKey, value: string) => {
    const num = Number(value.replace(/[^0-9]/g, ""));
    setPrices((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: call API to save prices when backend ready
    setTimeout(() => setSaving(false), 800);
  };

  const info = useMemo(() => ([
    { key: "1m" as PlanKey, label: "Gói 1 tháng", badge: "Linh hoạt", icon: <Calendar className="w-5 h-5" /> },
    { key: "3m" as PlanKey, label: "Gói 3 tháng", badge: "Phổ biến", icon: <BadgePercent className="w-5 h-5" /> },
    { key: "6m" as PlanKey, label: "Gói 6 tháng", badge: "Tiết kiệm nhất", icon: <Crown className="w-5 h-5" /> },
  ]), []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-title'}`}>Giá gói</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-white">
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>

      {/* Current applied prices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1m */}
        <Card className={`${darkMode ? 'bg-gradient-to-br from-gray-950 to-gray-900 border-gray-800' : 'bg-gradient-to-br from-white to-indigo-50/40'} p-5 shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Gói 1 tháng</span>
            <Calendar className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'} w-4 h-4`} />
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(currentPrices['1m'])}</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>Giá đang áp dụng</p>
        </Card>
        {/* 3m */}
        <Card className={`${darkMode ? 'bg-gradient-to-br from-gray-950 to-gray-900 border-gray-800' : 'bg-gradient-to-br from-white to-indigo-50/40'} p-5 shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Gói 3 tháng</span>
            <BadgePercent className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'} w-4 h-4`} />
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(currentPrices['3m'])}</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>Giá đang áp dụng</p>
        </Card>
        {/* 6m */}
        <Card className={`${darkMode ? 'bg-gradient-to-br from-gray-950 to-gray-900 border-gray-800' : 'bg-gradient-to-br from-white to-indigo-50/40'} p-5 shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Gói 6 tháng</span>
            <Crown className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'} w-4 h-4`} />
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(currentPrices['6m'])}</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>Giá đang áp dụng</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {info.map(p => (
          <PlanCard
            key={p.key}
            darkMode={darkMode}
            label={p.label}
            keyName={p.key}
            badge={p.badge}
            icon={p.icon}
            prices={prices}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
};

export default PlansSection;


