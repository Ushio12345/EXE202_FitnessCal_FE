import { BarChart3 } from "lucide-react";

const OverviewSection = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">Tổng quan</h3>
      <p className="text-gray-500">Chọn một menu để xem thông tin chi tiết</p>
    </div>
  </div>
);

export default OverviewSection;
