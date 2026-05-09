import React, { useState, useEffect } from 'react';
import ReceiptForm from './components/ReceiptForm';
import ReceiptPreview from './components/ReceiptPreview';
import { motion, AnimatePresence } from 'framer-motion';
import { History, User, IndianRupee, Calendar } from 'lucide-react';

function App() {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    donorName: '',
    phoneNumber: '',
    amount: '',
    paymentMethod: 'UPI',
  });
  const [savedReceipts, setSavedReceipts] = useState([]);

  useEffect(() => {
    const history = localStorage.getItem('temple_receipt_history');
    if (history) {
      setSavedReceipts(JSON.parse(history));
    }
  }, []);

  const handleGenerate = () => {
    if (formData.donorName && formData.amount) {
      const newReceipt = {
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString('ta-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        timestamp: new Date().toISOString()
      };

      const updatedHistory = [newReceipt, ...savedReceipts].slice(0, 50);
      setSavedReceipts(updatedHistory);
      localStorage.setItem('temple_receipt_history', JSON.stringify(updatedHistory));

      setShowPreview(true);
      // Scroll to top when switching to preview
      window.scrollTo(0, 0);
    }
  };

  const handleReset = () => {
    setFormData({
      donorName: '',
      phoneNumber: '',
      amount: '',
      paymentMethod: 'UPI',
    });
    setShowPreview(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF0] text-gray-900 font-sans selection:bg-orange-200 overflow-x-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-orange-100/50 blur-[100px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-amber-100/50 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 flex flex-col items-center">
        {/* Header - Compact for mobile */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 text-center"
        >
          <div className="inline-block p-3 bg-white rounded-2xl shadow-lg border border-orange-50 mb-3">
            <img 
              src="https://img.icons8.com/fluency/96/temple.png" 
              alt="Temple Icon" 
              className="w-12 h-12 mx-auto"
            />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-orange-800 to-amber-700 bg-clip-text text-transparent">
            கோயில் ரசீது
          </h1>
        </motion.div>

        <main className="w-full">
          <AnimatePresence mode="wait">
            {!showPreview ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <ReceiptForm 
                  formData={formData} 
                  setFormData={setFormData} 
                  onGenerate={handleGenerate} 
                />

                {/* History Section - More compact for one-screen usage */}
                {savedReceipts.length > 0 && (
                  <div className="w-full max-w-md mx-auto mt-12 pb-32">
                    <div className="flex items-center gap-2 mb-4 px-2">
                      <History size={18} className="text-orange-600" />
                      <h3 className="font-bold text-orange-900 uppercase tracking-wider text-xs">சமீபத்திய வரவுகள்</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {savedReceipts.slice(0, 3).map((receipt) => (
                        <div 
                          key={receipt.id}
                          className="bg-white/40 backdrop-blur-sm px-4 py-3 rounded-2xl border border-orange-100 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-xl text-orange-600 shadow-sm">
                              <User size={16} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm leading-tight">{receipt.donorName}</p>
                              <p className="text-[10px] text-gray-400 font-medium uppercase">{receipt.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-orange-600 text-lg">
                              ₹{receipt.amount}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <ReceiptPreview 
                  formData={formData} 
                  onReset={handleReset} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer - Only visible if not previewing or at the very bottom */}
        {!showPreview && (
          <footer className="mt-8 mb-4 text-center">
            <p className="text-orange-900/30 text-[10px] font-bold tracking-widest uppercase">
              © 2026 கோயில் நிர்வாகம்
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;
