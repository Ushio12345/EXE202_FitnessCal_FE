import { Card } from "@/components/ui/card";
import { 
  Users, 
  Camera,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/axios/instance";

interface UserStatistics {
  totalUsers: number;
  newUsersThisMonth: number;
  newUsersLastMonth: number;
  growthFromLastMonth: number;
  growthPercentage: number;
  premiumUsers: number;
  newPremiumUsersThisMonth: number;
  newPremiumUsersLastMonth: number;
  premiumGrowthFromLastMonth: number;
  premiumGrowthPercentage: number;
}

interface UserStatsResponse {
  success: boolean;
  message: string;
  data: UserStatistics;
}

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

interface OverviewSectionProps {
  darkMode?: boolean;
}

const OverviewSection = ({ darkMode }: OverviewSectionProps) => {
  // State for user statistics
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for revenue statistics
  const [revenueStats, setRevenueStats] = useState<RevenueStatistics | null>(null);
  const [revLoading, setRevLoading] = useState(true);
  const [revError, setRevError] = useState<string | null>(null);

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<UserStatsResponse>("/Dashboard/user-statistics");
        if (response.data.success) {
          setUserStats(response.data.data);
        } else {
          setError("Không thể tải thống kê người dùng");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Có lỗi xảy ra khi tải thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  // Fetch revenue statistics
  useEffect(() => {
    const fetchRevenueStats = async () => {
      try {
        setRevLoading(true);
        const response = await axiosInstance.get<RevenueStatsResponse>("/Dashboard/revenue-statistics");
        if (response.data.success) {
          setRevenueStats(response.data.data);
        } else {
          setRevError("Không thể tải thống kê doanh thu");
        }
      } catch (err: any) {
        setRevError(err.response?.data?.message || "Có lỗi xảy ra khi tải doanh thu");
      } finally {
        setRevLoading(false);
      }
    };

    fetchRevenueStats();
  }, []);

  const monthlyData = [
    { month: "T1", revenue: 1080000000, percentage: 13.7, change: 12, isPositive: true },
    { month: "T2", revenue: 1248000000, percentage: 15.9, change: 15, isPositive: true },
    { month: "T3", revenue: 1080000000, percentage: 14.6, change: -8, isPositive: false },
    { month: "T4", revenue: 1080000000, percentage: 18.6, change: 27, isPositive: true },
    { month: "T5", revenue: 1080000000, percentage: 16.8, change: -10, isPositive: false },
    { month: "T6", revenue: 1080000000, percentage: 20.4, change: 22, isPositive: true }
  ];

  const recentActivities = [
    { user: "Tran Minh Quan Bao", action: "đã nâng lên Premium", time: "2 giờ trước" },
    { user: "Tran Nhat Anh", action: "đã nâng lên Pro", time: "2 giờ trước" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Top Row - 4 Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tổng doanh thu */}
        <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} p-6 relative overflow-hidden shadow-lg`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-600'}`}>Tổng doanh thu</p>
              {revLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
              ) : revError ? (
                <p className="text-red-500 text-sm">Lỗi tải dữ liệu</p>
              ) : (
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(revenueStats?.totalRevenue || 0)}</p>
              )}
            </div>
            <Camera className="w-5 h-5 text-gray-400" />
          </div>
          {!revLoading && !revError && revenueStats && (
            <div className="flex items-center text-sm">
              {revenueStats.totalRevenueYTDGrowthPercentage >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`${revenueStats.totalRevenueYTDGrowthPercentage >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                {revenueStats.totalRevenueYTDGrowthPercentage >= 0 ? '+' : ''}{revenueStats.totalRevenueYTDGrowthPercentage}%
              </span>
              <span className="text-gray-500 ml-1">so với cùng kỳ năm trước</span>
            </div>
          )}
        </Card>

        {/* Người dùng hoạt động */}
        <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} p-6 shadow-lg`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-600'}`}>Người dùng hoạt động</p>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              ) : error ? (
                <p className="text-red-500 text-sm">Lỗi tải dữ liệu</p>
              ) : (
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userStats ? formatNumber(userStats.totalUsers) : "0"}
                </p>
              )}
            </div>
          </div>
          {!loading && !error && userStats && (
            <div className="flex items-center text-sm">
              {userStats.growthFromLastMonth >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`font-medium ${userStats.growthFromLastMonth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {userStats.growthFromLastMonth >= 0 ? '+' : ''}{userStats.growthFromLastMonth}
              </span>
              <span className="text-gray-500 ml-1">so với tháng trước</span>
            </div>
          )}
        </Card>

        {/* Người dùng đăng ký */}
        <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} p-6 shadow-lg`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-600'}`}>Người dùng đăng ký</p>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              ) : error ? (
                <p className="text-red-500 text-sm">Lỗi tải dữ liệu</p>
              ) : (
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userStats ? formatNumber(userStats.premiumUsers) : "0"}
                </p>
              )}
            </div>
          </div>
          {!loading && !error && userStats && (
            <div className="flex items-center text-sm">
              {userStats.premiumGrowthFromLastMonth >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`font-medium ${userStats.premiumGrowthFromLastMonth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {userStats.premiumGrowthFromLastMonth >= 0 ? '+' : ''}{userStats.premiumGrowthFromLastMonth}
              </span>
              <span className="text-gray-500 ml-1">so với tháng trước</span>
            </div>
          )}
        </Card>

        {/* Doanh thu tháng này */}
        <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} p-6 relative overflow-hidden shadow-lg`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-600'}`}>Doanh thu tháng này</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(revenueStats?.revenueThisMonth || 0)}</p>
            </div>
            <Camera className="w-5 h-5 text-gray-400" />
          </div>
          {!revLoading && !revError && revenueStats && (
            <div className="flex items-center text-sm">
              {revenueStats.revenueGrowthPercentage >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`${revenueStats.revenueGrowthPercentage >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                {revenueStats.revenueGrowthPercentage >= 0 ? '+' : ''}{revenueStats.revenueGrowthPercentage}%
              </span>
              <span className="text-gray-500 ml-1">so với tháng trước</span>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Row - Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} p-6 shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Phân bố doanh thu hàng tháng trong 6 tháng qua</h3>
          
          <div className="flex items-center justify-between">
            {/* Donut Chart Placeholder */}
            <div className="flex-shrink-0">
              <div
                className={`w-32 h-32 rounded-full border-8 flex items-center justify-center bg-gradient-to-br ${
                  darkMode
                    ? 'border-purple-400/30 from-purple-900/40 to-purple-700/20'
                    : 'border-purple-200 from-purple-100 to-purple-50'
                }`}
              >
                <div className="text-center">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-600'}`}>Total</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>+7.8B</p>
                </div>
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="flex-1 ml-6 space-y-3">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>{item.month}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(item.revenue)}</p>
                    <div className="flex items-center text-xs">
                      <span className={`${darkMode ? 'text-white' : 'text-gray-500'} mr-1`}>{item.percentage}%</span>
                      {item.isPositive ? (
                        <span className="text-purple-600 font-medium">+{item.change}%</span>
                      ) : (
                        <span className="text-red-500 font-medium">{item.change}%</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} p-6 shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Giao dịch mới nhất của người dùng</h3>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} flex items-center justify-center mr-3`}>
                  <Users className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} w-4 h-4`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OverviewSection;
