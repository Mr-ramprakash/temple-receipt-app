import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, RotateCcw, Loader2, MessageCircle, MapPin, Send } from 'lucide-react';
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

  const generateImageBlob = async () => {
    if (!receiptRef.current) return null;
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });
    } catch (error) {
      console.error('Blob generation failed:', error);
      return null;
    }
  };

  // Modern File Sharing (Navigator Share API)
  const handleSmartShare = async () => {
    setIsGenerating(true);
    const blob = await generateImageBlob();
    
    if (blob) {
      const file = new File([blob], `Receipt-${receiptNo}.png`, { type: 'image/png' });
      const message = `வணக்கம்! உங்கள் திருவிழா வரி ₹${formData.amount} வெற்றிகரமாக செலுத்தப்பட்டது. \n\nரசீது எண்: ${receiptNo}\nதேதி: ${currentDate}\n\nமிக்க நன்றி! 🙏`;

      // Check if browser supports sharing files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            text: message,
          });
        } catch (error) {
          console.log('User cancelled or error:', error);
          // Fallback to manual WhatsApp link if sharing failed
          handleManualWhatsAppFallback();
        }
      } else {
        // Fallback for browsers that don't support file sharing
        handleManualWhatsAppFallback();
      }
    }
    setIsGenerating(false);
  };

  const handleManualWhatsAppFallback = () => {
    // 1. Trigger download as backup
    handleDownloadOnly();
    
    // 2. Open WhatsApp link
    if (formData.phoneNumber) {
      const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
      const whatsappPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
      const message = `வணக்கம்! உங்கள் திருவிழா வரி ₹${formData.amount} வெற்றிகரமாக செலுத்தப்பட்டது. \n\nரசீது எண்: ${receiptNo}\nதேதி: ${currentDate}\n\nமிக்க நன்றி! 🙏`;
      const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
      alert('உங்கள் மொபைல் இந்த நேரடி பகிர்தலை ஆதரிக்கவில்லை. ரசீது பதிவிறக்கம் செய்யப்பட்டுள்ளது, தயவுசெய்து வாட்ஸ்அப்பில் இணைத்து அனுப்பவும்.');
    }
  };

  const handleDownloadOnly = async () => {
    if (!receiptRef.current) return;
    setIsGenerating(true);
    try {
      const blob = await generateImageBlob();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Receipt-${receiptNo}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert('பதிவிறக்கம் செய்வதில் பிழை!');
    } finally {
      setIsGenerating(false);
    }
  };

  const hexColors = {
    primary: '#ea580c',
    primaryLight: '#fff7ed',
    textMain: '#111827',
    textMuted: '#9ca3af',
    borderLight: '#f3f4f6',
    white: '#ffffff'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto pb-72"
    >
      <div 
        ref={receiptRef}
        className="receipt-container p-8 rounded-3xl shadow-2xl relative overflow-hidden"
        style={{ backgroundColor: hexColors.white, border: `1px solid ${hexColors.borderLight}`, color: hexColors.textMain }}
      >
        <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: hexColors.primary }} />
        <div className="relative z-10 pl-2">
          <div className="flex flex-col items-center mb-8 pb-6" style={{ borderBottom: `2px solid ${hexColors.primaryLight}` }}>
            <img 
              src={logo} 
              alt="Logo" 
              className="w-20 h-20 mb-4 object-contain"
              onError={(e) => { e.target.src = "https://img.icons8.com/fluency/96/horse.png"; }}
            />
            <h1 className="text-xl font-black text-center tracking-tight">அருள் மிகு கூத்தப்பெருமாள் துணை</h1>
            <div className="mt-2 text-white px-6 py-1 rounded-full text-xs font-black uppercase tracking-widest" style={{ backgroundColor: hexColors.primary }}>
              திருவிழா வரி ரசீது
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-[10px] font-bold uppercase tracking-widest" style={{ color: hexColors.textMuted }}>
            <div>
              <span>ரசீது எண்</span>
              <p className="text-sm font-black mt-0.5" style={{ color: hexColors.textMain }}>{receiptNo}</p>
            </div>
            <div className="text-right">
              <span>தேதி</span>
              <p className="text-sm font-black mt-0.5" style={{ color: hexColors.textMain }}>{currentDate}</p>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div className="relative">
              <span className="text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color: hexColors.primary, opacity: 0.5 }}>நன்கொடையாளர் விபரம்</span>
              <div className="p-4 rounded-2xl border" style={{ backgroundColor: hexColors.primaryLight, borderColor: hexColors.primaryLight }}>
                <p className="text-2xl font-black">{formData.donorName}</p>
                {formData.phoneNumber && <p className="text-sm font-bold mt-1" style={{ color: hexColors.textMuted }}>{formData.phoneNumber}</p>}
              </div>
            </div>
            <div className="flex items-center justify-between p-6 rounded-2xl shadow-lg text-white" style={{ backgroundColor: hexColors.primary }}>
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

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-[2px] w-8" style={{ backgroundColor: hexColors.primaryLight }} />
              <MapPin size={14} style={{ color: '#fdba74' }} />
              <div className="h-[2px] w-8" style={{ backgroundColor: hexColors.primaryLight }} />
            </div>
            <p className="text-2xl font-black mb-1">மிக்க நன்றி 🙏</p>
          </div>
        </div>
      </div>

      {/* Action Buttons Container */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FFFBF0] via-[#FFFBF0] to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto space-y-3">
          {/* Smart Share Button */}
          <button 
            onClick={handleSmartShare}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-4 bg-green-600 text-white py-6 rounded-3xl font-black text-2xl shadow-2xl active:scale-95 transition-all disabled:opacity-70"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={32} /> : <MessageCircle size={32} />}
            <span>நேரடியாகப் பகிர்க</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
             <button 
              onClick={handleDownloadOnly}
              disabled={isGenerating}
              className="flex items-center justify-center gap-3 bg-orange-600 text-white py-5 rounded-3xl font-bold text-lg active:scale-95 transition-all disabled:opacity-50"
            >
              <Download size={24} />
              <span>பதிவிறக்குக</span>
            </button>
            <button 
              onClick={onReset}
              className="flex items-center justify-center gap-3 bg-white text-orange-600 py-5 rounded-3xl font-bold text-lg border-2 border-orange-600 active:scale-95 transition-all"
            >
              <RotateCcw size={24} />
              <span>புதிய ரசீது</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReceiptPreview;
