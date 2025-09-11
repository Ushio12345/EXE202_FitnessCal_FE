import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Users, Upload, Filter, Ban, Loader2 } from "lucide-react";
import type { Subscription } from "@/types/subscription-type";
import type { AllUserType } from "@/types/all-user-type";
import axiosInstance from "@/axios/instance";

interface UsersSectionProps {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  success: string | null;
  banningUser: string | null;
  fetchSubscriptions: () => void;
  handleBlockUser: (userId: string, isUserBanned: boolean) => void;
  getPlanColor: (packageType: string) => string;
  getStatusColor: (isUserBanned: boolean) => string;
  getStatusText: (isUserBanned: boolean) => string;
  formatDate: (dateString: string) => string;
  formatPrice: (price: number) => string;
  darkMode?: boolean;
}

const UsersSection = ({
  subscriptions,
  loading,
  error,
  banningUser,
  fetchSubscriptions,
  handleBlockUser,
  getPlanColor,
  getStatusColor,
  getStatusText,
  formatDate,
  formatPrice,
  darkMode = false,
}: UsersSectionProps) => {
  const [tab, setTab] = useState<'all' | 'subscribed'>('subscribed');
  // Paging state
  const [allUsers, setAllUsers] = useState<AllUserType[]>([]);
  const [allPage, setAllPage] = useState(1);
  const [subPage, setSubPage] = useState(1);
  const PAGE_SIZE = 7;
  const [loadingAll, setLoadingAll] = useState(false);
  const [errorAll, setErrorAll] = useState<string | null>(null);
  const [banningAllUser, setBanningAllUser] = useState<string | null>(null);

  // Fetch all users when tab is 'all'
  useEffect(() => {
    if (tab === 'all') {
      setLoadingAll(true);
      setErrorAll(null);
      axiosInstance.get('/user/get-all')
        .then(res => {
          if (res.data.success && Array.isArray(res.data.data)) {
            setAllUsers(res.data.data);
            setAllPage(1); // reset page when reload
          } else {
            setErrorAll('Không thể tải danh sách người dùng');
          }
        })
        .catch(err => {
          setErrorAll(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách người dùng');
        })
        .finally(() => setLoadingAll(false));
    }
  }, [tab]);

  const handleBlockUserAll = async (userId: string, isActive: boolean) => {
    if (banningAllUser === userId) return;
    try {
      setBanningAllUser(userId);
      const action = isActive ? 'ban' : 'unban';
      const endpoint = `/user/${action}/${userId}`;
      const res = await axiosInstance.post(endpoint);
      if (res.data?.success) {
        setAllUsers(prev => prev.map(u => u.userId === userId ? { ...u, isActive: isActive ? 0 : 1 } : u));
      }
    } finally {
      setBanningAllUser(null);
    }
  };

  // Reset page when tab changes
  useEffect(() => {
    if (tab === 'all') setAllPage(1);
    if (tab === 'subscribed') setSubPage(1);
  }, [tab]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-title'}`}>Người dùng</h2>
        <div className="flex gap-3">
          <Button className={`bg-primary hover:bg-primary/90 text-white ${darkMode ? 'border border-primary' : ''}`}>
            <Upload className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button variant="outline" className={`${darkMode ? 'border-gray-700 text-gray-200 bg-gray-900 hover:bg-gray-800' : 'border-gray-300'}`}> 
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </Button>
        </div>
      </div>
      {/* Navbar tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium border transition-colors ${tab === 'all' 
            ? 'bg-primary text-white border-primary' 
            : darkMode 
              ? 'bg-gray-900 text-gray-200 border-gray-700 hover:bg-gray-800' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          onClick={() => setTab('all')}
        >
          Tất cả người dùng
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium border transition-colors ${tab === 'subscribed' 
            ? 'bg-primary text-white border-primary' 
            : darkMode 
              ? 'bg-gray-900 text-gray-200 border-gray-700 hover:bg-gray-800' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          onClick={() => setTab('subscribed')}
        >
          Người dùng đã đăng ký gói
        </button>
      </div>
      {/* Section content */}
      {tab === 'all' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} shadow-lg`}> 
            {loadingAll ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
              </div>
            ) : errorAll ? (
              <div className="p-8 text-center">
                <p className="text-red-600 mb-4">{errorAll}</p>
                <Button onClick={() => setTab('all')} className="bg-primary text-white">Thử lại</Button>
              </div>
            ) : allUsers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Không có dữ liệu người dùng</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-b'}`}> 
                      <tr>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Họ</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Tên</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Email</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Vai trò</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Trạng thái</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Ngày tạo</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.slice((allPage-1)*PAGE_SIZE, allPage*PAGE_SIZE).map((user) => (
                        <tr key={user.userId} className={`${darkMode ? 'border-gray-800 hover:bg-gray-900' : 'border-b hover:bg-gray-50'}`}>
                          <td className={`p-4 ${darkMode ? 'text-gray-100' : ''}`}>{user.firstName || ''}</td>
                          <td className={`p-4 ${darkMode ? 'text-gray-100' : ''}`}>{user.lastName || ''}</td>
                          <td className={`p-4 ${darkMode ? 'text-gray-100' : ''}`}>{user.email}</td>
                          <td className={`p-4 ${darkMode ? 'text-gray-100' : ''}`}>{user.role}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.isActive 
                              ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800' 
                              : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                              {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </td>
                          <td className={`p-4 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : ''}</td>
                          <td className="p-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`p-2 ${user.isActive === 0 
                                ? darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700' 
                                : darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                              onClick={() => handleBlockUserAll(user.userId, user.isActive === 1)}
                              disabled={banningAllUser === user.userId}
                              title={user.isActive === 1 ? 'Chặn người dùng' : 'Bỏ chặn người dùng'}
                            >
                              {banningAllUser === user.userId ? (
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
                {/* Paging controls */}
                <div className="flex justify-end items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className={darkMode ? 'border-gray-700 text-gray-200 bg-gray-900 hover:bg-gray-800' : ''} disabled={allPage === 1} onClick={() => setAllPage(p => p-1)}>Trước</Button>
                  <span className={darkMode ? 'text-gray-200' : ''}>Trang {allPage} / {Math.max(1, Math.ceil(allUsers.length / PAGE_SIZE))}</span>
                  <Button variant="outline" size="sm" className={darkMode ? 'border-gray-700 text-gray-200 bg-gray-900 hover:bg-gray-800' : ''} disabled={allPage === Math.ceil(allUsers.length / PAGE_SIZE) || allUsers.length === 0} onClick={() => setAllPage(p => p+1)}>Sau</Button>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className={`${darkMode ? 'bg-gray-950 text-gray-100 border-gray-800' : 'bg-white text-gray-900'} shadow-lg`}>
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
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-b'}`}> 
                      <tr>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Người dùng</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Gói</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Trạng thái</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Ngày bắt đầu</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Ngày kết thúc</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Giá</th>
                        <th className={`text-left p-4 font-medium sticky top-0 z-10 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.slice((subPage-1)*PAGE_SIZE, subPage*PAGE_SIZE).map((subscription) => (
                        <tr key={subscription.subscriptionId} className={`${darkMode ? 'border-gray-800 hover:bg-gray-900' : 'border-b hover:bg-gray-50'}`}>
                          <td className="p-4">
                            <div>
                              <div className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{subscription.userName}</div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subscription.userEmail}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(subscription.package.packageType)}`}>{subscription.package.packageType}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.isUserBanned)}`}>{getStatusText(subscription.isUserBanned)}</span>
                          </td>
                          <td className={`p-4 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>{formatDate(subscription.startDate)}</td>
                          <td className={`p-4 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>{formatDate(subscription.endDate)}</td>
                          <td className={`p-4 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>{formatPrice(subscription.priceAtPurchase)}</td>
                          <td className="p-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`p-2 ${subscription.isUserBanned 
                                ? darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700' 
                                : darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
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
                {/* Paging controls */}
                <div className="flex justify-end items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className={darkMode ? 'border-gray-700 text-gray-200 bg-gray-900 hover:bg-gray-800' : ''} disabled={subPage === 1} onClick={() => setSubPage(p => p-1)}>Trước</Button>
                  <span className={darkMode ? 'text-gray-200' : ''}>Trang {subPage} / {Math.max(1, Math.ceil(subscriptions.length / PAGE_SIZE))}</span>
                  <Button variant="outline" size="sm" className={darkMode ? 'border-gray-700 text-gray-200 bg-gray-900 hover:bg-gray-800' : ''} disabled={subPage === Math.ceil(subscriptions.length / PAGE_SIZE) || subscriptions.length === 0} onClick={() => setSubPage(p => p+1)}>Sau</Button>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      )}
    </>
);
}

export default UsersSection;
