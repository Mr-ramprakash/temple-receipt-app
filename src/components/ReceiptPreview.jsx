import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, RotateCcw, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

const ReceiptPreview = ({ formData, onReset }) => {
  const receiptRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentDate = new Date().toLocaleDateString('ta-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(receiptRef.current, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('.receipt-container');
          if (el) {
            el.style.boxShadow = 'none';
            el.style.fontFamily = 'sans-serif';
          }
        }
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `temple-receipt-${formData.donorName || 'donor'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setIsGenerating(false);
    }
  };

  const styles = {
    container: { backgroundColor: '#ffffff', border: '2px dashed #e5e7eb', color: '#1f2937' },
    header: { borderBottom: '2px solid #ffedd5' },
    orangeText: { color: '#ea580c' },
    orangeTextDeep: { color: '#c2410c' },
    grayTextLight: { color: '#9ca3af' },
    grayBorder: { borderBottom: '1px solid #f3f4f6' },
    divider: { backgroundColor: '#e5e7eb' }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto pb-48" // Large bottom padding for sticky buttons
    >
      <div 
        ref={receiptRef}
        style={styles.container}
        className="receipt-container p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div style={styles.header} className="text-center mb-8 pb-6">
            <h1 className="text-xl font-bold leading-tight mb-2" style={{ color: '#1f2937' }}>
              அருள் மிகு கூத்தப்பெருமாள் துணை
            </h1>
            <h2 className="text-lg font-semibold" style={styles.orangeTextDeep}>
              திருவிழா திரள் நிதி
            </h2>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest" style={styles.grayTextLight}>பெயர்</span>
              <p className="text-2xl font-black pb-1" style={{ ...styles.grayBorder, color: '#1f2937' }}>
                {formData.donorName}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest" style={styles.grayTextLight}>ரூபாய்</span>
              <p className="text-4xl font-black pb-1" style={{ ...styles.grayBorder, ...styles.orangeText }}>
                ₹{Number(formData.amount).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-widest" style={styles.grayTextLight}>தேதி</span>
                <p className="font-bold pb-1" style={{ ...styles.grayBorder, color: '#1f2937' }}>{currentDate}</p>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-xs font-bold uppercase tracking-widest" style={styles.grayTextLight}>முறை</span>
                <p className="font-bold pb-1" style={{ ...styles.grayBorder, ...styles.orangeText }}>
                  {formData.paymentMethod === 'UPI' ? 'UPI' : 'ரொக்கம்'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div style={{ ...styles.divider, width: '4rem', height: '1px', margin: '0 auto 1.5rem' }} />
            <p className="text-2xl font-bold" style={{ color: '#1f2937' }}>நன்றி 🙏</p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FFFBF0] via-[#FFFBF0] to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto space-y-4">
          <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-4 bg-orange-600 text-white py-6 rounded-[2rem] font-black text-2xl shadow-2xl shadow-orange-200 active:scale-95 transition-all"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={32} /> : <Download size={32} />}
            <span>ரசீது உருவாக்கு</span>
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 bg-white p-5 rounded-2xl shadow-lg border border-orange-100 text-orange-600 font-black">
              <Share2 size={24} />
              <span>பகிர்க</span>
            </button>
            <button 
              onClick={onReset}
              className="flex items-center justify-center gap-3 bg-white p-5 rounded-2xl shadow-lg border border-orange-100 text-orange-600 font-black"
            >
              <RotateCcw size={24} />
              <span>புதியது</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReceiptPreview;
