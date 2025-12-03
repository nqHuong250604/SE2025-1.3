import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import Footer from "../../public/components/Footer";
import Header from "../../public/components/Header";

export default function CartPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cartItems = [];

  return (
    <div className="min-h-screen bg-[#f0f6ff] flex flex-col">
      {/* Header */}
      <Header disableScrollEffect/>

      {/* Nội dung */}
      <div className="max-w-5xl mx-auto flex-1 w-full px-4 pt-[120px] pb-20">   
        <h1 className="text-3xl font-semibold mb-8 text-[#0a2b47]">
          Giỏ hàng của bạn
        </h1>

        {/* ❗ Chưa đăng nhập */}
        {!isLoggedIn && (
          <div className="bg-white py-16 px-6 rounded-2xl shadow-lg border border-[#e2ecf5] text-center">
            <div className="w-20 h-20 rounded-full bg-[#e8f4ff] flex items-center justify-center mx-auto">
              <ShoppingCart size={48} className="text-[#0089ed]" />
            </div>

            <h2 className="text-2xl font-bold mt-5 text-[#0a2b47]">
              Bạn chưa đăng nhập
            </h2>
            <p className="text-gray-600 mt-2">
              Hãy đăng nhập để xem các sản phẩm trong giỏ hàng của bạn.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <button onClick={() => {setIsLoggedIn(true)}} className="px-6 py-3 bg-[#0089ed] text-white rounded-xl font-medium shadow hover:bg-[#0073c9] transition">
                Đăng nhập
              </button>

              <button className="px-6 py-3 border border-[#0089ed] text-[#0089ed] rounded-xl font-medium hover:bg-[#e7f5ff] transition">
                Tiếp tục mua hàng
              </button>
            </div>
          </div>
        )}

        {/* ❗ Đã đăng nhập nhưng giỏ trống */}
        {isLoggedIn && cartItems.length === 0 && (
          <div className="bg-white py-16 px-6 rounded-2xl shadow-lg border border-[#e2ecf5] text-center">
            <div className="w-20 h-20 rounded-full bg-[#e8f4ff] flex items-center justify-center mx-auto">
              <ShoppingCart size={48} className="text-[#0089ed]" />
            </div>

            <h2 className="text-2xl font-bold mt-5 text-[#0a2b47]">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mt-2">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>

            <button className="mt-8 px-6 py-3 bg-[#0089ed] text-white rounded-xl font-medium shadow hover:bg-[#0073c9] transition">
              Tiếp tục mua hàng
            </button>
          </div>
        )}

        {/* ❗ Đã đăng nhập và có sản phẩm */}
        {isLoggedIn && cartItems.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#e2ecf5]">
            <h2 className="text-xl font-semibold mb-4 text-[#0a2b47]">
              Sản phẩm trong giỏ:
            </h2>

            {cartItems.map((item) => (
              <div key={item.id} className="border-b py-4">
                <p className="font-medium">{item.name}</p>
              </div>
            ))}

            <button className="mt-6 px-6 py-3 bg-[#0089ed] text-white rounded-xl font-medium shadow hover:bg-[#0073c9] transition">
              Thanh toán
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
