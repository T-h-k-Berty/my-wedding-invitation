"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Guest = {
  id: string;
  full_name: string;
  guest_count: number;
  dietary_notes: string;
  created_at: string;
};

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error("Error fetching guests:", error);
    else setGuests(data || []);
    
    setLoading(false);
  };

  const totalGuests = guests.reduce((sum, guest) => sum + guest.guest_count, 0);

  return (
    <div className="min-h-screen relative font-bodoni text-white overflow-hidden">
      
      {/* Background Image (Same as main page) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      ></div>
      <div className="fixed inset-0 z-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-10">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-unfold">
          <h1 className="font-pinyon text-5xl md:text-7xl text-luxury-gold mb-2 drop-shadow-lg">
            Guest Count Dashboard
          </h1>
          <p className="text-gray-300 tracking-[0.3em] uppercase text-xs md:text-sm">
            Guest List & Responses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center transition-transform hover:scale-105">
            <h3 className="text-gray-300 uppercase tracking-widest text-sm mb-2">Total Expected Guests</h3>
            <p className="text-6xl font-bold text-luxury-gold drop-shadow-md">{totalGuests}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center transition-transform hover:scale-105">
            <h3 className="text-gray-300 uppercase tracking-widest text-sm mb-2">Total RSVP Responses</h3>
            <p className="text-6xl font-bold text-white drop-shadow-md">{guests.length}</p>
          </div>
        </div>

        {/* Guest Table Section */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold tracking-widest uppercase text-luxury-gold">Recent Responses</h2>
          </div>

          {loading ? (
            <div className="p-20 text-center">
              <div className="inline-block animate-spin text-4xl mb-4">⌛</div>
              <p className="text-gray-400">Loading guest data...</p>
            </div>
          ) : guests.length === 0 ? (
            <p className="p-20 text-center text-gray-400 italic">No RSVPs received yet.</p>
          ) : (
            /* Fixed height container for scroll (Approx 7 rows) */
            <div className="overflow-x-auto">
              <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-20 bg-[#2a0507] shadow-xl">
                    <tr className="text-luxury-gold uppercase text-xs tracking-widest">
                      <th className="p-5 border-b border-white/10 font-bold">Guest Name</th>
                      <th className="p-5 border-b border-white/10 font-bold text-center">Count</th>
                      <th className="p-5 border-b border-white/10 font-bold">Dietary Notes</th>
                      <th className="p-5 border-b border-white/10 font-bold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {guests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-5 text-white font-medium group-hover:text-luxury-gold">
                          {guest.full_name}
                        </td>
                        <td className="p-5 text-center">
                          <span className="bg-red-900/50 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full font-bold text-sm">
                            {guest.guest_count}
                          </span>
                        </td>
                        <td className="p-5 text-gray-300 text-sm italic">
                          {guest.dietary_notes || <span className="opacity-30">-</span>}
                        </td>
                        <td className="p-5 text-gray-400 text-xs">
                          {new Date(guest.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="mt-10 text-center">
            <p className="text-xs text-white/40 uppercase tracking-widest">
                © 2026 Dewmi & Charuka Wedding Dashboard
            </p>
        </div>
        
      </div>

      {/* Adding custom scrollbar styling in JSX */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ca8a04;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #fef08a;
        }
      `}</style>
    </div>
  );
}