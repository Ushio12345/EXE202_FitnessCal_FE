import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  Upload, 
  Filter,
  Bell,
  Settings,
  User,
  Ban,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import axiosInstance from "@/axios/instance";
import type { Subscription, SubscriptionResponse } from "@/types/subscription-type";

const ManagePage = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("overview");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [banningUser, setBanningUser] = useState<string | null>(null);

  // Fetch subscription data
  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<SubscriptionResponse>("/Subscription/all");
      if (response.data.success) {
        setSubscriptions(response.data.data);
      } else {
        setError("Không thể tải dữ liệu subscription");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Load data when users menu is selected
  useEffect(() => {
    if (selectedMenu === "users") {
      fetchSubscriptions();
    }
  }, [selectedMenu]);

  const getPlanColor = (packageType: string) => {
    switch (packageType) {
      case "Premium":
        return "bg-primary text-white";
      case "Pro":
        return "bg-primary text-white";
      case "Basic":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getStatusColor = (isUserBanned: boolean) => {
    return isUserBanned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";
  };

  const getStatusText = (isUserBanned: boolean) => {
    return isUserBanned ? "Bị chặn" : "Hoạt động";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleBlockUser = async (userId: string, isUserBanned: boolean) => {
    if (banningUser === userId) return;
    
    setBanningUser(userId);
    setError(null);
    setSuccess(null);
    
    try {
      const action = isUserBanned ? 'unban' : 'ban';
      const endpoint = `/user/${action}/${userId}`;
      
      const response = await axiosInstance.post(endpoint);
      
      if (response.data.success) {
        setSuccess(`Đã ${isUserBanned ? 'bỏ chặn' : 'chặn'} người dùng thành công`);
        setTimeout(() => setSuccess(null), 3000);
        
        setSubscriptions(prevSubscriptions => 
          prevSubscriptions.map(subscription => 
            subscription.userId === userId 
              ? { ...subscription, isUserBanned: !isUserBanned }
              : subscription
          )
        );
      } else {
        setError(response.data.message || `Không thể ${isUserBanned ? 'bỏ chặn' : 'chặn'} người dùng`);
      }
    } catch (err: any) {
      let errorMessage = `Có lỗi xảy ra khi ${isUserBanned ? 'bỏ chặn' : 'chặn'} người dùng`;
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 404) {
        errorMessage = 'Không tìm thấy người dùng';
      } else if (err.response?.status === 401) {
        errorMessage = 'Không có quyền thực hiện hành động này';
      } else if (err.response?.status === 500) {
        errorMessage = 'Lỗi server, vui lòng thử lại sau';
      }
      
      setError(errorMessage);
    } finally {
      setBanningUser(null);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-x-hidden overflow-y-hidden relative bg-white">

      <div className="bg-gradient-login absolute w-[1809px] -top-[400px] h-[1100px] rounded-bl-full -right-[900px] blur-3xl opacity-30"></div>

      {/* Notification Toast - Top Right */}
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
          <Alert className="bg-red-50 border-red-200 text-red-800 max-w-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
          <Alert className="bg-green-50 border-green-200 text-green-800 max-w-sm">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="bg-gradient-login absolute w-[1809px] h-[1100px] rounded-tr-full blur-3xl -bottom-[500px] -left-[1000px] opacity-30"></div>
      
      {/* Header */}
      <header className="p-5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <h1 className="text-xl font-bold text-title">FinessCal Admin</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="w-5 h-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 relative z-10">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6">
          <nav className="space-y-2">
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMenu === "overview" 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedMenu("overview")}
            >
              <BarChart3 className={`w-5 h-5 ${selectedMenu === "overview" ? "text-primary" : "text-gray-600"}`} />
              <span className={`${selectedMenu === "overview" ? "text-primary font-medium" : "text-gray-700"}`}>
                Tổng quan
              </span>
            </div>
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMenu === "revenue" 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedMenu("revenue")}
            >
              <DollarSign className={`w-5 h-5 ${selectedMenu === "revenue" ? "text-primary" : "text-gray-600"}`} />
              <span className={`${selectedMenu === "revenue" ? "text-primary font-medium" : "text-gray-700"}`}>
                Doanh thu
              </span>
            </div>
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMenu === "users" 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedMenu("users")}
            >
              <Users className={`w-5 h-5 ${selectedMenu === "users" ? "text-primary" : "text-gray-600"}`} />
              <span className={`${selectedMenu === "users" ? "text-primary font-medium" : "text-gray-700"}`}>
                Người dùng
              </span>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {selectedMenu === "users" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-title">Người dùng</h2>
                <div className="flex gap-3">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Xuất báo cáo
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    <Filter className="w-4 h-4 mr-2" />
                    Lọc
                  </Button>
                </div>
              </div>

              {/* User Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white shadow-lg">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                  ) : error ? (
                    <div className="p-8 text-center">
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button onClick={fetchSubscriptions} className="bg-primary text-white">
                        Thử lại
                      </Button>
                    </div>
                  ) : subscriptions.length === 0 ? (
                    <div className="p-8 text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Không có dữ liệu subscription</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-700">Người dùng</th>
                          <th className="text-left p-4 font-medium text-gray-700">Gói</th>
                          <th className="text-left p-4 font-medium text-gray-700">Trạng thái</th>
                          <th className="text-left p-4 font-medium text-gray-700">Ngày bắt đầu</th>
                          <th className="text-left p-4 font-medium text-gray-700">Ngày kết thúc</th>
                          <th className="text-left p-4 font-medium text-gray-700">Giá</th>
                          <th className="text-left p-4 font-medium text-gray-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.map((subscription) => (
                          <tr key={subscription.subscriptionId} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div>
                                <div className="font-medium text-gray-900">{subscription.userName}</div>
                                <div className="text-sm text-gray-500">{subscription.userEmail}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(subscription.package.packageType)}`}>
                                {subscription.package.packageType}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.isUserBanned)}`}>
                                {getStatusText(subscription.isUserBanned)}
                              </span>
                            </td>
                            <td className="p-4 text-gray-700">{formatDate(subscription.startDate)}</td>
                            <td className="p-4 text-gray-700">{formatDate(subscription.endDate)}</td>
                            <td className="p-4 text-gray-700">{formatPrice(subscription.priceAtPurchase)}</td>
                            <td className="p-4">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`p-2 ${subscription.isUserBanned ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}
                                onClick={() => handleBlockUser(subscription.userId, subscription.isUserBanned)}
                                disabled={banningUser === subscription.userId}
                                title={subscription.isUserBanned ? 'Bỏ chặn người dùng' : 'Chặn người dùng'}
                              >
                                {banningUser === subscription.userId ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Ban className="w-4 h-4" />
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  )}
                </Card>
              </motion.div>
            </>
          )}

          {selectedMenu === "overview" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Tổng quan</h3>
                <p className="text-gray-500">Chọn một menu để xem thông tin chi tiết</p>
              </div>
            </div>
          )}

          {selectedMenu === "revenue" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Doanh thu</h3>
                <p className="text-gray-500">Chọn một menu để xem thông tin chi tiết</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagePage;
