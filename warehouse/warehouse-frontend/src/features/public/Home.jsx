import React from "react";
import bg from "../../assets/images/background.jpg";

import FeatureSection from "./FeatureSection";
import ServiceSection from "./ServiceSection";
import ShippingSection from "./ShippingSection";
import TrackingSection from "./TrackingSection";
import StatsSection from "./StatsSection";
import CTASection from "./CTASection";

import Header from "./components/Header";
import Footer from "./components/Footer";


export default function Home() {

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={bg}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Header */}
        <Header />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white pt-40 pb-40 px-4">
          <h1 className="text-5xl font-extrabold">Vận chuyển nhanh chóng</h1>
          <h2
            className="text-5xl font-extrabold mt-2"
            style={{ color: "#0089ed" }}
          >
            An toàn & Tin cậy
          </h2>
          <p className="mt-5 max-w-2xl text-lg">
            Giải pháp logistics toàn diện với công nghệ theo dõi thời gian thực,
            đảm bảo hàng hóa của bạn luôn được giao đúng hẹn.
          </p>
        </div>
      </div>

      {/* Feature Section */}
      <FeatureSection />
      {/* Service Section */}
      <ServiceSection />
      {/* ShippingSection */}
      <ShippingSection />
      {/* StatsSection */}
      <StatsSection />
      {/* TrackingSection */}
      <TrackingSection />
      {/* CTASection */}
      <CTASection />
      {/* Footer */}
      <Footer />
    </div>
  );
}
