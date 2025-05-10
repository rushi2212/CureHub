import { useState } from "react";
import { X } from "lucide-react";

export default function PopupModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-indigo-100">
        <div className="flex justify-between items-center border-b border-indigo-100 pb-3">
          <h2 className="text-xl font-semibold text-indigo-700">Notification</h2>
          <button onClick={onClose} className="text-indigo-400 hover:text-indigo-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <p className="mt-4 text-gray-700">{message}</p>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}