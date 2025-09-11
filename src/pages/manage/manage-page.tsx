import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { 
  BarChart3,
  DollarSign,
  Users,
  Bell,
  Settings,
  User,
  AlertCircle,
  CheckCircle,
  Sun,
  Moon,
  LogOut
} from "lucide-react";
import OverviewSection from "./OverviewSection";
import RevenueSection from "./RevenueSection";
import UsersSection from "./UsersSection";
import PlansSection from "./PlansSection";
import axiosInstance from "@/axios/instance";
import type { Subscription, SubscriptionResponse } from "@/types/subscription-type";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/auth-slice";

const ManagePage = () => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const dispatch = useDispatch();
  
  // Fallback user info from localStorage or session
  const getUserDisplayName = () => {
    if (authLoading) return "Đang tải...";
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email;
    return "Admin";
  };
  
  const getUserEmail = () => {
    if (authLoading) return "...";
    if (user?.email) return user.email;
    return "admin@fitnesscal.com";
  };
  
  // Logout handler
  const handleLogout = () => {
    dispatch(logoutUser() as any);
  };

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
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
    return isUserBanned ? "Không hoạt động" : "Hoạt động";
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
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`h-screen w-screen flex flex-col overflow-x-hidden overflow-y-hidden relative ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
      >

  <div className={`bg-gradient-login absolute w-[1809px] -top-[400px] h-[1100px] rounded-bl-full -right-[900px] blur-3xl opacity-30 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800' : ''}`}></div>

      {/* Notification Toast - Top Right */}
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
          <Alert className={`max-w-sm ${darkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
          <Alert className={`max-w-sm ${darkMode ? 'bg-green-900 border-green-700 text-green-200' : 'bg-green-50 border-green-200 text-green-800'}`}>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        </div>
      )}
  <div className={`bg-gradient-login absolute w-[1809px] h-[1100px] rounded-tr-full blur-3xl -bottom-[500px] -left-[1000px] opacity-30 ${darkMode ? 'bg-gradient-to-tl from-gray-900 via-indigo-900 to-gray-800' : ''}`}></div>
      
      {/* Header */}
  <header className={`p-5 flex justify-between items-center relative z-10 ${darkMode ? 'bg-gray-950 border-b border-gray-800' : ''}`}> 
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-title'}`}>FitnessCal Admin</h1>
        </div>
  <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="w-5 h-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-8 h-8">
                <AvatarImage
                  src={user?.user_metadata?.avatar_url}
                  alt="User Avatar"
                />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {getUserEmail()}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Tài khoản</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
  <main className={`flex flex-1 relative z-10 ${darkMode ? 'bg-gray-900' : ''}`}>
        {/* Sidebar */}
  <aside className={`w-64 p-6 border-r ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
          <nav className="space-y-2">
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMenu === "overview" 
                  ? darkMode ? "bg-primary/20 border border-primary/30" : "bg-primary/10 border border-primary/20" 
                  : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedMenu("overview")}
            >
              <BarChart3 className={`w-5 h-5 ${selectedMenu === "overview" ? "text-primary" : darkMode ? "text-gray-300" : "text-gray-600"}`} />
              <span className={`${selectedMenu === "overview" ? "text-primary font-medium" : darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Tổng quan
              </span>
            </div>
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMenu === "revenue" 
                  ? darkMode ? "bg-primary/20 border border-primary/30" : "bg-primary/10 border border-primary/20" 
                  : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedMenu("revenue")}
            >
              <DollarSign className={`w-5 h-5 ${selectedMenu === "revenue" ? "text-primary" : darkMode ? "text-gray-300" : "text-gray-600"}`} />
              <span className={`${selectedMenu === "revenue" ? "text-primary font-medium" : darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Doanh thu
              </span>
            </div>
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMenu === "users" 
                  ? darkMode ? "bg-primary/20 border border-primary/30" : "bg-primary/10 border border-primary/20" 
                  : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedMenu("users")}
            >
              <Users className={`w-5 h-5 ${selectedMenu === "users" ? "text-primary" : darkMode ? "text-gray-300" : "text-gray-600"}`} />
              <span className={`${selectedMenu === "users" ? "text-primary font-medium" : darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Người dùng
              </span>
            </div>
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMenu === "plans" 
                  ? darkMode ? "bg-primary/20 border border-primary/30" : "bg-primary/10 border border-primary/20" 
                  : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedMenu("plans")}
            >
              <DollarSign className={`w-5 h-5 ${selectedMenu === "plans" ? "text-primary" : darkMode ? "text-gray-300" : "text-gray-600"}`} />
              <span className={`${selectedMenu === "plans" ? "text-primary font-medium" : darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Giá gói
              </span>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
  <div className={`flex-1 p-6 ${darkMode ? 'bg-gray-900' : ''}`}>
          {selectedMenu === "users" && (
            <UsersSection
              subscriptions={subscriptions}
              loading={loading}
              error={error}
              success={success}
              banningUser={banningUser}
              fetchSubscriptions={fetchSubscriptions}
              handleBlockUser={handleBlockUser}
              getPlanColor={getPlanColor}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              formatDate={formatDate}
              formatPrice={formatPrice}
              darkMode={darkMode}
            />
          )}

          {selectedMenu === "overview" && <OverviewSection darkMode={darkMode} />}

          {selectedMenu === "revenue" && <RevenueSection darkMode={darkMode} />}

          {selectedMenu === "plans" && <PlansSection darkMode={darkMode} />}
        </div>
      </main>
  </motion.div>
  );
};

export default ManagePage;
