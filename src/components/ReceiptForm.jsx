import React from 'react';
import { User, Phone, IndianRupee, CreditCard, Banknote } from 'lucide-react';

const ReceiptForm = ({ formData, setFormData, onGenerate }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-md mx-auto px-2 pb-24"> {/* Extra padding for sticky button */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-orange-50 space-y-8">
        <h2 className="text-2xl font-black text-orange-900 text-center tracking-tight">
          புதிய ரசீது
        </h2>
        
        <div className="space-y-6">
          {/* Donor Name - Large Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 ml-2 uppercase tracking-widest">
              நன்கொடையாளர் பெயர்
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-orange-500">
                <User size={24} />
              </div>
              <input
                type="text"
                name="donorName"
                value={formData.donorName}
                onChange={handleChange}
                className="block w-full pl-12 pr-4 py-5 bg-orange-50/50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-3xl text-xl font-bold transition-all placeholder:text-orange-200"
                placeholder="பெயர்"
              />
            </div>
          </div>

          {/* Amount - Very Large Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 ml-2 uppercase tracking-widest">
              தொகை (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-orange-600">
                <IndianRupee size={28} strokeWidth={3} />
              </div>
              <input
                type="number"
                inputMode="decimal"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="block w-full pl-12 pr-4 py-6 bg-orange-100/30 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-3xl text-4xl font-black text-orange-600 transition-all placeholder:text-orange-200"
                placeholder="0"
              />
            </div>
          </div>

          {/* Phone - Compact but large */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 ml-2 uppercase tracking-widest">
              தொலைபேசி (விரும்பினால்)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Phone size={20} />
              </div>
              <input
                type="tel"
                inputMode="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-400 focus:bg-white rounded-2xl text-lg font-bold transition-all"
                placeholder="எண்"
              />
            </div>
          </div>

          {/* Payment Method - Large Toggle Buttons */}
          <div className="space-y-3 pt-2">
            <label className="text-sm font-bold text-gray-400 ml-2 uppercase tracking-widest">
              முறை
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                className={`flex flex-col items-center justify-center gap-2 py-5 rounded-[2rem] border-4 transition-all active:scale-95 ${
                  formData.paymentMethod === 'UPI'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                    : 'border-transparent bg-gray-50 text-gray-400 opacity-60'
                }`}
              >
                <CreditCard size={28} />
                <span className="font-black text-lg">UPI</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'Cash' })}
                className={`flex flex-col items-center justify-center gap-2 py-5 rounded-[2rem] border-4 transition-all active:scale-95 ${
                  formData.paymentMethod === 'Cash'
                    ? 'border-orange-600 bg-orange-50 text-orange-800 shadow-md'
                    : 'border-transparent bg-gray-50 text-gray-400 opacity-60'
                }`}
              >
                <Banknote size={28} />
                <span className="font-black text-lg">ரொக்கம்</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#FFFBF0] via-[#FFFBF0] to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <button
            onClick={onGenerate}
            disabled={!formData.donorName || !formData.amount}
            className="w-full py-6 bg-orange-600 text-white rounded-3xl font-black text-2xl shadow-2xl shadow-orange-200 active:scale-95 transition-all disabled:grayscale disabled:opacity-30 flex items-center justify-center gap-3"
          >
            ரசீது உருவாக்குக
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm;
