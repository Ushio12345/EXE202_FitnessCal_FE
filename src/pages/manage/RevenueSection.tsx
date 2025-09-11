import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Upload } from "lucide-react";
import axiosInstance from "@/axios/instance";
import { useEffect, useState } from "react";

interface RevenueSectionProps {
  darkMode?: boolean;
}

const plans = [
  { label: "Gói 1 tháng", key: "1m" },
  { label: "Gói 3 tháng", key: "3m" },
  { label: "Gói 6 tháng", key: "6m" },
];

interface RevenueStatistics {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueGrowthPercentage: number;
  totalRevenueYTD: number;
  totalRevenueYTDLastYear: number;
  totalRevenueYTDGrowthPercentage: number;
}

interface RevenueStatsResponse {
  success: boolean;
  message: string;
  data: RevenueStatistics;
}

const RevenueSection = ({ darkMode }: RevenueSectionProps) => {
  const [stats, setStats] = useState<RevenueStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get<RevenueStatsResponse>("/Dashboard/revenue-statistics");
        if (res.data.success) {
          setStats(res.data.data);
        } else {
          setError("Không thể tải thống kê doanh thu");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Có lỗi xảy ra khi tải doanh thu");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="space-y-6">
      {/* Header with export button */}
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-title'}`}>Doanh thu</h2>
        <div>
          <Button className={`bg-primary hover:bg-primary/90 text-white ${darkMode ? 'border border-primary' : ''}`}>
            <Upload className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>
      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tháng này */}
        <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} p-6 shadow-lg`}>
          <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-indigo-200' : 'text-indigo-600'}`}>Tháng này</p>
          {loading ? (
            <div className="animate-pulse h-7 w-40 bg-gray-300/40 rounded" />
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(stats?.revenueThisMonth || 0)}</p>
          )}
          {!loading && !error && stats && (
            <div className="mt-2 text-sm">
              <span className={`font-medium ${stats.revenueGrowthPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.revenueGrowthPercentage >= 0 ? '+' : ''}{stats.revenueGrowthPercentage}%
              </span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} ml-1`}>từ tháng trước</span>
            </div>
          )}
        </Card>

        {/* Quý này (placeholder nếu chưa có API) */}
        <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} p-6 shadow-lg`}>
          <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-indigo-200' : 'text-indigo-600'}`}>Quý này</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(0)}</p>
          <div className="mt-2 text-sm">
            <span className="text-green-500 font-medium">+0%</span>
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} ml-1`}>từ quý trước</span>
          </div>
        </Card>

        {/* Năm này dùng YTD */}
        <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} p-6 shadow-lg`}>
          <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-indigo-200' : 'text-indigo-600'}`}>Năm này</p>
          {loading ? (
            <div className="animate-pulse h-7 w-40 bg-gray-300/40 rounded" />
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(stats?.totalRevenueYTD || 0)}</p>
          )}
          {!loading && !error && stats && (
            <div className="mt-2 text-sm">
              <span className={`font-medium ${stats.totalRevenueYTDGrowthPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.totalRevenueYTDGrowthPercentage >= 0 ? '+' : ''}{stats.totalRevenueYTDGrowthPercentage}%
              </span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} ml-1`}>từ năm trước</span>
            </div>
          )}
        </Card>
      </div>
      {/* Removed mid three plan cards as requested */}

      <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} p-6 shadow-lg`}>
        <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Doanh thu theo gói</h3>
        <div className="space-y-5">
          {plans.map((p) => (
            <div key={p.key} className="flex items-start justify-between">
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.label}</p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} text-sm`}>0 ₫ / tháng · 0 người đăng ký</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>0 ₫</p>
                <p className="text-green-500 text-xs">0% of total</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RevenueSection;
