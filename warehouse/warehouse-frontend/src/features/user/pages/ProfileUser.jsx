import React, { useState, useCallback, useEffect } from "react";
import HeaderUser from "../components/HeaderUser";
import {
    FiUser, FiMail, FiPhone, FiMapPin,
    FiShield, FiPackage, FiEdit3, FiCheck, FiX, FiCamera, FiLoader
} from "react-icons/fi";

import { getCurrentUserAPI } from '../../auth/authServices'; 

// InfoRow (Giữ nguyên)
const InfoRow = React.memo(({ label, name, value, type = "text", readOnly = false, editMode, handleChange, icon }) => {
    const isEditable = editMode && !readOnly;

    return (
        <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all duration-200">
            <div className={`p-3 rounded-full ${readOnly ? "bg-gray-100 text-gray-400" : "bg-blue-100 text-blue-600"}`}>
                {icon}
            </div>

            <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>

                {isEditable ? (
                    <input
                        type={type}
                        name={name}
                        value={value || ''}
                        onChange={handleChange}
                        placeholder={`Nhập ${label.toLowerCase()}`}
                        className="w-full bg-white border border-blue-300 rounded-lg px-3 py-1.5 text-gray-800 font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"
                    />
                ) : (
                    <p className="text-gray-800 font-medium text-base truncate">
                        {value || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                    </p>
                )}
            </div>
        </div>
    );
});


// COMPONENT CHÍNH
const ProfileUser = () => {
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Dữ liệu mặc định
    const [editableUser, setEditableUser] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        role: "Nhân viên kho", 
        warehouse: "Kho Tổng HCM",
        employeeCode: "NV-2023-889",
        status: "Đang hoạt động"
    });
    
    // State lưu dữ liệu gốc từ API (để hủy chỉnh sửa)
    const [originalUser, setOriginalUser] = useState(null); 

    // 1. TẢI DỮ LIỆU NGƯỜI DÙNG TỪ API
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const apiData = await getCurrentUserAPI(); 
                
                const initialData = {
                    ...editableUser, // Giữ các giá trị mặc định/readOnly
                    // Lấy dữ liệu từ API
                    fullName: apiData.full_name || apiData.fullName || "",
                    email: apiData.email || "",
                    // Giả định phone, address, v.v. là null/empty nếu API không trả về
                    phone: apiData.phone || "",
                    address: apiData.address || "",
                    role: apiData.role || editableUser.role,
                    warehouse: apiData.warehouse || editableUser.warehouse,
                    employeeCode: apiData.employee_code || editableUser.employeeCode,
                };

                setEditableUser(initialData);
                setOriginalUser(initialData); // Lưu bản gốc
            } catch (error) {
                console.error("Failed to load user data:", error.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, []);

    // 2. Handler cập nhật State
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setEditableUser((prev) => ({ ...prev, [name]: value }));
    }, []);

    // 3. Xử lý lưu thay đổi (CHỈ LƯU TRÊN STATE)
    const handleSave = useCallback(() => {
        // Cập nhật OriginalUser để giữ giá trị mới
        setOriginalUser(editableUser); 
        setEditMode(false); 
        alert("Cập nhật thông tin thành công.");
    }, [editableUser]);

    // 4. Xử lý hủy
    const handleCancel = useCallback(() => {
        // Reset editableUser về trạng thái ban đầu
        if (originalUser) {
            setEditableUser(originalUser);
        }
        setEditMode(false);
    }, [originalUser]);

    // ... (Giữ nguyên infoFields và logic hiển thị)
    const infoFields = [
        { label: "Họ và tên", name: "fullName", icon: <FiUser size={18} /> },
        { label: "Chức vụ", value: editableUser.role, readOnly: true, icon: <FiShield size={18} /> },
        { label: "Email", name: "email", type: "email", icon: <FiMail size={18} /> },
        { label: "Số điện thoại", name: "phone", icon: <FiPhone size={18} /> },
        {
            label: "Địa chỉ thường trú",
            name: "address",
            icon: <FiMapPin size={18} />,
            full: true,
        },
        {
            label: "Đơn vị quản lý",
            value: editableUser.warehouse,
            readOnly: true,
            icon: <FiPackage size={18} />,
            full: true,
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F3F4F6] text-blue-600">
                <FiLoader size={32} className="animate-spin mr-2" /> Đang tải dữ liệu người dùng...
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F3F4F6] text-gray-800">
            <HeaderUser />

            <div className="flex-1 pt-[110px] pb-10 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* PROFILE CARD */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-transparent"></div>
                            <div className="relative mb-4">
                                <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg ring-2 ring-blue-100">
                                    <img
                                        src="https://i.pravatar.cc/150?img=12"
                                        alt="Avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                {editMode && (
                                    <button className="absolute bottom-1 right-1 bg-blue-600/90 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition">
                                        <FiCamera size={16} />
                                    </button>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{editableUser.fullName}</h2>
                            <p className="text-gray-500 font-medium mt-1">{editableUser.role}</p>
                            <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-100">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {editableUser.status}
                            </div>
                        </div>

                        {/* SYSTEM INFO CARD */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Thông tin hệ thống</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                    <span className="text-gray-500">Mã nhân viên</span>
                                    <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded text-sm">
                                        {editableUser.employeeCode}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-1">
                                    <span className="text-gray-500">Kho làm việc</span>
                                    <span className="font-semibold text-blue-600">{editableUser.warehouse}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* HEADER */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h1>
                                <p className="text-gray-500 text-sm mt-1">Quản lý thông tin liên hệ và hồ sơ của bạn</p>
                            </div>

                            <div className="flex gap-3">
                                {editMode ? (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                                        >
                                            <FiX size={18} /> Hủy
                                        </button>

                                        <button
                                            onClick={handleSave}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition font-medium text-sm"
                                        >
                                            <FiCheck size={18} /> Lưu thay đổi
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition font-medium text-sm group"
                                    >
                                        <FiEdit3 size={18} className="group-hover:scale-110 transition-transform" />
                                        Chỉnh sửa
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* INFO SECTION */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {infoFields.map((field, i) => (
                                    <div key={i} className={field.full ? "md:col-span-2" : ""}>
                                        <InfoRow
                                            {...field}
                                            value={field.name ? editableUser[field.name] : field.value}
                                            editMode={editMode}
                                            handleChange={handleChange}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUser;