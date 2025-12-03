import React from 'react'
import Header from '../../public/components/Header'
import Footer from '../../public/components/Footer'

const TrackingPage = () => {
  return (
    <div className="min-h-screen bg-[#f0f6ff] flex flex-col">
      {/* Header */}
      <Header disableScrollEffect/>

      {/* Nội dung */}
      <div className="max-w-5xl mx-auto flex-1 w-full px-4 pt-[120px] pb-20">   
        <h1 className="text-3xl font-semibold mb-8 text-[#0a2b47]">
          Tracking
        </h1>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default TrackingPage
