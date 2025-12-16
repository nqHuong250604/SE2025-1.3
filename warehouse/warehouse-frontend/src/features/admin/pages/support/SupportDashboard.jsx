import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  Search,
  Mail,
  Phone,
  MessageCircle,
  Book,
  PlayCircle,
  FileText,
  Code,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function SupportDashboard() {
  const faqs = [
    {
      question: "Làm thế nào để theo dõi đơn hàng?",
      answer:
        "Bạn có thể theo dõi đơn hàng bằng cách nhập mã vận đơn vào trang 'Theo dõi đơn hàng'. Hệ thống sẽ hiển thị trạng thái và vị trí đơn hàng theo thời gian thực.",
    },
    {
      question: "Làm thế nào để thêm mặt hàng tồn kho mới?",
      answer:
        "Truy cập trang 'Quản lý kho' và nhấn nút 'Thêm mặt hàng'. Điền đầy đủ thông tin như SKU, tên, danh mục, số lượng tồn và vị trí.",
    },
    {
      question: "Tôi có thể xuất báo cáo không?",
      answer:
        "Có. Bạn có thể xuất báo cáo tại trang 'Báo cáo & Phân tích'. Nhấn vào biểu đồ hoặc bảng và chọn xuất dữ liệu dưới dạng CSV hoặc PDF.",
    },
    {
      question: "Làm thế nào để đặt lại mật khẩu?",
      answer:
        "Vào Cài đặt > Bảo mật và sử dụng biểu mẫu đặt lại mật khẩu. Bạn cần nhập mật khẩu hiện tại và mật khẩu mới.",
    },
    {
      question: "Quản lý phân quyền người dùng như thế nào?",
      answer:
        "Chỉ quản trị viên mới có quyền quản lý người dùng. Vào 'Quản lý người dùng' và chọn 'Chỉnh sửa' để thay đổi vai trò và quyền.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-[14px]">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-y-auto">
        <Topbar />

        <div className="p-4 space-y-5">
          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Trợ giúp & Hỗ trợ</h1>
            <p className="text-sm text-gray-500">
              Tìm câu trả lời và nhận hỗ trợ cho hệ thống LogiTrack
            </p>
          </div>

          {/* SEARCH */}
          <div className="bg-white p-3 shadow-sm rounded-lg flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết hỗ trợ..."
                className="w-full pl-9 pr-3 py-1 bg-gray-100 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800">
              Tìm kiếm
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* LEFT */}
            <div className="col-span-2 space-y-5">
              {/* QUICK LINKS */}
              <div className="bg-white p-4 shadow-sm rounded-lg">
                <h2 className="text-base mb-5">Liên kết nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <QuickItem
                    icon={<Book />}
                    title="Hướng dẫn bắt đầu"
                    desc="Những kiến thức cơ bản khi sử dụng hệ thống"
                  />
                  <QuickItem
                    icon={<FileText />}
                    title="Tài liệu người dùng"
                    desc="Hướng dẫn chi tiết toàn bộ chức năng"
                  />
                  <QuickItem
                    icon={<PlayCircle />}
                    title="Video hướng dẫn"
                    desc="Hướng dẫn từng bước"
                  />
                  <QuickItem
                    icon={<Code />}
                    title="Tài liệu API"
                    desc="Tài liệu dành cho lập trình viên"
                  />
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white p-4 shadow-sm rounded-lg">
                <h2 className="text-base mb-5">Câu hỏi thường gặp</h2>
                <div className="divide-y text-sm">
                  {faqs.map((faq, idx) => (
                    <div key={idx}>
                      <button
                        className="w-full flex justify-between items-center py-3 px-2 hover:bg-gray-50 hover:underline font-medium"
                        onClick={() => toggleFAQ(idx)}
                      >
                        <span>{faq.question}</span>
                        {openIndex === idx ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      {openIndex === idx && (
                        <div className="px-2 py-2 text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SYSTEM STATUS */}
              <div className="bg-white p-4 shadow-sm rounded-lg">
                <h2 className="text-base mb-5">Trạng thái hệ thống</h2>
                <div className="space-y-2">
                  <StatusItem label="Tất cả hệ thống hoạt động bình thường" status="Ổn định" />
                  <StatusItem label="Dịch vụ API" status="Đang hoạt động" />
                  <StatusItem label="Cơ sở dữ liệu" status="Đã kết nối" />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">
              {/* CONTACT */}
              <div className="bg-white p-4 shadow-sm rounded-lg">
                <h2 className="text-base mb-5">Liên hệ hỗ trợ</h2>
                <div className="flex flex-col gap-3">
                  <MiniButton icon={<MessageCircle />} label="Chat trực tiếp" />
                  <MiniButton icon={<Mail />} label="Hỗ trợ qua Email" />
                  <MiniButton icon={<Phone />} label="Gọi hỗ trợ" />
                </div>

                <div className="bg-gray-100 p-3 rounded-md text-xs text-gray-600 mt-4">
                  <p className="font-semibold text-sm">Giờ hỗ trợ:</p>
                  <p>Thứ 2 - Thứ 6: 9:00 - 18:00</p>
                  <p>Thứ 7: 10:00 - 16:00</p>
                </div>
              </div>

              {/* UPDATES */}
              <div className="bg-white p-4 shadow-sm rounded-lg">
                <h2 className="text-base mb-3">Cập nhật gần đây</h2>
                <div className="space-y-3">
                  <UpdateItem
                    version="2.1.0"
                    date="08/03/2024"
                    desc="Cải thiện tính năng theo dõi"
                  />
                  <UpdateItem
                    version="2.0.5"
                    date="28/02/2024"
                    desc="Sửa lỗi và tối ưu hệ thống"
                  />
                  <UpdateItem
                    version="2.0.0"
                    date="15/02/2024"
                    desc="Nâng cấp giao diện lớn"
                  />
                </div>
              </div>

              {/* FEEDBACK */}
              <div className="bg-white p-4 shadow-sm rounded-lg">
                <h2 className="text-base mb-3">Phản hồi</h2>
                <p className="text-xs text-gray-600 mb-2">
                  Hãy chia sẻ ý kiến của bạn để giúp hệ thống ngày càng tốt hơn.
                </p>
                <button className="w-full p-2 border rounded-md hover:bg-gray-200">
                  Gửi phản hồi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS giữ nguyên */


/* ----------------- COMPONENTS ----------------- */

const QuickItem = ({ icon, title, desc }) => (
  <div className="border p-3 rounded-md hover:bg-gray-50 cursor-pointer flex items-start gap-2 text-sm">
    {React.cloneElement(icon, { className: "w-4 h-4 text-gray-600 mt-0.5" })}
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  </div>
);

const MiniButton = ({ icon, label }) => (
  <button
    className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 
               justify-center w-full text-sm"
  >
    {React.cloneElement(icon, { className: "w-4 h-4 text-gray-500" })}
    {label}
  </button>
);

const StatusItem = ({ label, status }) => (
  <div className="flex items-center justify-between p-2 border rounded-md text-sm">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
      <span>{label}</span>
    </div>
    <span className="text-green-800 text-xs font-medium bg-green-100 px-2 py-1 rounded">
      {status}
    </span>
  </div>
);

const UpdateItem = ({ version, date, desc }) => (
  <div className="p-2.5 border rounded-md text-sm">
    <p className="font-semibold text-sm">Version {version}</p>
    <p className="text-[11px] text-gray-500 mb-1">{date}</p>
    <p className="text-gray-600 text-xs">{desc}</p>
  </div>
);
