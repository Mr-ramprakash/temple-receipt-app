import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, RotateCcw, Loader2, MessageCircle, MapPin } from 'lucide-react';
import html2canvas from 'html2canvas';
import logo from '../assets/logo.webp';

const ReceiptPreview = ({ formData, receiptNo, onReset }) => {
  const receiptRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentDate = new Date().toLocaleDateString('ta-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleGenerateAndShare = async () => {
    if (!receiptRef.current) return;
    
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(receiptRef.current, {
        scale: 4, // Ultra high quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('.receipt-container');
          if (el) {
            el.style.boxShadow = 'none';
            el.style.border = '1px solid #e5e7eb';
          }
        }
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `Receipt-${receiptNo}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (formData.phoneNumber) {
        const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
        const whatsappPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
        const message = `வணக்கம்! உங்கள் திருவிழா வரி ₹${formData.amount} வெற்றிகரமாக செலுத்தப்பட்டது. \n\nரசீது எண்: ${receiptNo}\nதேதி: ${currentDate}\n\nமிக்க நன்றி! 🙏`;
        const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('பிழை ஏற்பட்டது.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto pb-64"
    >
      {/* Professional Receipt Card */}
      <div 
        ref={receiptRef}
        className="receipt-container bg-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-gray-100"
        style={{ color: '#1a1a1a' }}
      >
        {/* Decorative Side Pattern */}
        <div className="absolute top-0 left-0 w-2 h-full bg-orange-600" />
        
        <div className="relative z-10 pl-2">
          {/* Top Logo & Header */}
          <div className="flex flex-col items-center mb-8 border-b-2 border-orange-50 pb-6">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-20 h-20 mb-4 object-contain"
              onError={(e) => { e.target.src = "https://img.icons8.com/fluency/96/horse.png"; }}
            />
            <h1 className="text-xl font-black text-center text-gray-900 tracking-tight">
              அருள் மிகு கூத்தப்பெருமாள் துணை
            </h1>
            <div className="mt-2 bg-orange-600 text-white px-6 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              திருவிழா வரி ரசீது
            </div>
          </div>

          {/* Receipt Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div>
              <span>ரசீது எண்</span>
              <p className="text-gray-900 text-sm font-black mt-0.5">{receiptNo}</p>
            </div>
            <div className="text-right">
              <span>தேதி</span>
              <p className="text-gray-900 text-sm font-black mt-0.5">{currentDate}</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-6 mb-10">
            <div className="relative">
              <span className="text-[10px] font-black text-orange-600/50 uppercase tracking-widest block mb-1">நன்கொடையாளர் விபரம்</span>
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                <p className="text-2xl font-black text-gray-800">{formData.donorName}</p>
                {formData.phoneNumber && (
                   <p className="text-sm font-bold text-gray-400 mt-1">{formData.phoneNumber}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between bg-orange-600 p-6 rounded-2xl shadow-lg shadow-orange-100 text-white">
              <div className="flex flex-col">
                <span className="text-[10px] font-black opacity-80 uppercase tracking-widest">செலுத்திய தொகை</span>
                <span className="text-4xl font-black">₹{Number(formData.amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right">
                 <span className="text-[10px] font-black opacity-80 uppercase tracking-widest">முறை</span>
                 <p className="text-lg font-black">{formData.paymentMethod === 'UPI' ? 'UPI' : 'CASH'}</p>
              </div>
            </div>
          </div>

          {/* Footer & Gratitude */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-[2px] w-8 bg-orange-100" />
              <MapPin size={14} className="text-orange-300" />
              <div className="h-[2px] w-8 bg-orange-100" />
            </div>
            <p className="text-2xl font-black text-gray-800 mb-1">மிக்க நன்றி 🙏</p>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">ADMINISTRATION</p>
          </div>
        </div>

        {/* Subtle Background Mark */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FFFBF0] via-[#FFFBF0] to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto space-y-4">
          <button 
            onClick={handleGenerateAndShare}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-4 bg-orange-600 text-white py-6 rounded-3xl font-black text-2xl shadow-2xl shadow-orange-200 active:scale-95 transition-all"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={32} /> : <Download size={32} />}
            <span>ரசீது உருவாக்கு</span>
          </button>
          
          <button 
            onClick={onReset}
            className="w-full flex items-center justify-center gap-3 bg-white p-6 rounded-3xl shadow-xl border-4 border-orange-600 text-orange-600 font-black text-xl active:scale-95 transition-all"
          >
            <RotateCcw size={28} />
            <span>புதிய ரசீது</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReceiptPreview;
