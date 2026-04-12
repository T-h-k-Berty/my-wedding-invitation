"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase"; 
import { weddingConfig } from "../lib/weddingConfig"; // දත්ත ගොනුව Import කිරීම

// Countdown Timer Component
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12 text-[#d4af37] text-center">
      <div className="countdown-box"><span className="text-4xl md:text-6xl font-bold">{String(timeLeft.days).padStart(3, '0')}</span> <span className="text-xs md:text-sm uppercase tracking-widest mt-2 text-gray-200 block">Days</span></div>
      <div className="countdown-box"><span className="text-4xl md:text-6xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span> <span className="text-xs md:text-sm uppercase tracking-widest mt-2 text-gray-200 block">Hours</span></div>
      <div className="countdown-box"><span className="text-4xl md:text-6xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span> <span className="text-xs md:text-sm uppercase tracking-widest mt-2 text-gray-200 block">Minutes</span></div>
      <div className="countdown-box"><span className="text-4xl md:text-6xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span> <span className="text-xs md:text-sm uppercase tracking-widest mt-2 text-gray-200 block">Seconds</span></div>
    </div>
  );
};

export default function WeddingInvitation() {
  const [step, setStep] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [hearts, setHearts] = useState<number[]>([]);
  const [explodingHearts, setExplodingHearts] = useState<{ id: number, tx: string, ty: string, rot: string }[]>([]);

  // RSVP Form States
  const [fullName, setFullName] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    setHearts(Array.from({ length: 40 }).map((_, i) => i));
    setExplodingHearts(Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      tx: `${(Math.random() - 0.5) * 1200}px`,
      ty: `${(Math.random() - 0.5) * 1200}px`,
      rot: `${Math.random() * 360}deg`,
    })));
  }, []);

  useEffect(() => {
    if (step === 2) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      }, { threshold: 0.2 });
      const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
      hiddenElements.forEach((el) => observer.observe(el));
      return () => hiddenElements.forEach((el) => observer.unobserve(el));
    }
  }, [step]);

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('guests')
      .insert([{ full_name: fullName, guest_count: parseInt(guestCount), dietary_notes: dietaryNotes }]);

    if (error) {
      console.error("Supabase Error:", JSON.stringify(error, null, 2));
      setSubmitStatus("error");
    } else {
      setSubmitStatus("success");
      setFullName(""); setGuestCount("1"); setDietaryNotes("");
    }
    setIsSubmitting(false);
  };

  const handleOpenInvitation = () => {
    if (step === 0) {
      if (audioRef.current) {
        audioRef.current.volume = 0.6;
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      }
      setStep(1); 
      
      setTimeout(() => {
        setStep(2); 
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1800);
    }
  };

  return (
    <main className={`relative w-full overflow-x-hidden ${step !== 2 ? 'h-screen flex items-center justify-center' : 'min-h-screen py-10 pb-0'}`}>
      
      <audio ref={audioRef} loop src={weddingConfig.musicFile} />

      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: weddingConfig.backgroundImage }}
      ></div>
      <div className={`fixed inset-0 z-0 ${step === 2 ? 'bg-black/50' : 'bg-black/70'} transition-colors duration-1000`}></div>

      {step === 2 && (
        <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
          {hearts.map((i) => (
            <div key={i} className="heart-drop" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 7}s`, fontSize: `${15 + Math.random() * 25}px` }}>❤</div>
          ))}
        </div>
      )}

      {/* --- ADVANCED LUXURY ENVELOPE --- */}
      {(step === 0 || step === 1) && (
        <div className="relative w-[360px] md:w-[600px] h-[260px] md:h-[400px] z-20 transition-transform duration-700 hover:scale-105">
          
          <div className="absolute inset-0 bg-[#580c10] rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] border-2 border-[#580c10] overflow-hidden">
             <div className="absolute inset-3 border border-yellow-500/50 rounded-lg pointer-events-none"></div>
             <div className="absolute inset-4 border border-yellow-500/20 rounded-md pointer-events-none"></div>
          </div>
          
          <div className={`absolute top-0 left-0 w-full h-full envelope-flap z-30 ${step === 1 ? 'flap-open' : ''}`}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-[65%] drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]">
              <polygon points="0,0 100,0 50,100" fill="#600f13" stroke="#ca8a04" strokeWidth="0.8"/>
              <polygon points="4,0 96,0 50,92" fill="none" stroke="#fef08a" strokeWidth="0.3" strokeOpacity="0.6"/>
              <polygon points="8,0 92,0 50,84" fill="none" stroke="#fef08a" strokeWidth="0.1" strokeOpacity="0.4"/>
            </svg>
          </div>

          <div className="absolute inset-0 z-20 overflow-hidden rounded-xl pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-2xl">
              <polygon points="0,0 55,55 0,100" fill="#580c10" stroke="#ca8a04" strokeWidth="0.5"/>
              <polygon points="100,0 45,55 100,100" fill="#580c10" stroke="#ca8a04" strokeWidth="0.5"/>
              <polygon points="0,100 50,60 100,100" fill="#450a0a" stroke="#ca8a04" strokeWidth="0.5"/>
              <polygon points="4,100 50,66 96,100" fill="none" stroke="#fef08a" strokeWidth="0.2" strokeOpacity="0.5"/>
            </svg>
          </div>

          <div 
            onClick={handleOpenInvitation}
            className={`absolute top-[55%] left-1/2 wax-seal -translate-x-1/2 -translate-y-1/2 bg-red-900 w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center z-40 border border-red-950 shadow-2xl transition-all cursor-pointer ${step === 1 ? 'opacity-0 scale-150 duration-500' : 'hover:scale-110'}`}
          >
             <div className="absolute inset-[6px] rounded-full border-2 border-yellow-600/40 border-dashed flex items-center justify-center">
                <span className="font-serif text-4xl md:text-5xl text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {weddingConfig.initials?.bride || 'B'}<span className="text-2xl">&</span>{weddingConfig.initials?.groom || 'G'}
                </span>
             </div>
          </div>

          {step === 1 && explodingHearts.map((heart) => (
             <div key={heart.id} className="exploding-heart absolute top-1/2 left-1/2 text-2xl" style={{ '--tx': heart.tx, '--ty': heart.ty, '--rot': heart.rot, transform: 'translate(-50%, -50%)' } as React.CSSProperties}>❤️</div>
          ))}
        </div>
      )}

      {/* --- STEP 2: The Luxury Site --- */}
      {step === 2 && (
        <>
          <div className="relative z-20 w-full max-w-5xl mx-auto px-4 animate-unfold mt-4">
            
            <div className="text-center bg-white/10 p-8 md:p-20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-xl border border-white/30 backdrop-blur-sm">
              
              <p className="text-sm md:text-base italic text-white mb-2 drop-shadow-md">"Two hearts, two souls, one journey beginning today."</p>
              <p className="font-serif text-xs uppercase tracking-[0.3em] text-yellow-300 mb-10 drop-shadow-md">The Celebration of Love</p>

              <p className="text-sm md:text-base mb-1 text-gray-200">Together with their families,</p>
              <p className="font-serif text-xl md:text-2xl font-semibold mb-10 text-white drop-shadow-lg">We joyfully invite you to join us</p>

              <h1 className="font-serif text-6xl md:text-8xl text-[#d4af37] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-8">
                {weddingConfig.coupleFullName}
              </h1>

              <p className="max-w-md mx-auto text-sm md:text-base leading-relaxed mb-10 py-6 border-y border-white/30 text-white drop-shadow-md">
                to celebrate our union as we exchange vows and begin our life together.
              </p>

              <div className="mb-10 text-white">
                <p className="font-serif text-2xl md:text-3xl font-bold mb-6 border-t border-white/30 pt-6 drop-shadow-md">{weddingConfig.dateFormatted}</p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-sm uppercase tracking-widest text-yellow-200">
                  <div className="text-center"><p className="font-bold text-white text-base drop-shadow-md">{weddingConfig.venue}</p><p>{weddingConfig.city}</p></div>
                  <div className="hidden md:block w-px h-10 bg-white/30"></div>
                  <div className="text-center"><p className="font-bold text-white text-base drop-shadow-md">{weddingConfig.time}</p><p>{weddingConfig.country}</p></div>
                </div>
              </div>

              <div className="w-full max-w-3xl mx-auto mt-10 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl mb-10">
                <iframe 
                  src={weddingConfig.mapUrl} 
                  width="100%" 
                  height="300" 
                  style={{border:0}} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* --- RSVP Form Section --- */}
              <div className="w-full max-w-4xl mx-auto mt-20 mb-10 py-10">
                {submitStatus === "success" ? (
                  <div className="text-center p-8 border border-yellow-400/50 rounded-xl bg-white/5 backdrop-blur-sm">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-serif text-yellow-400 mb-2">Thank You!</h3>
                    <p className="text-white">Your RSVP has been received. We can't wait to celebrate with you!</p>
                    <button onClick={() => setSubmitStatus("idle")} className="mt-6 text-sm underline text-gray-300 hover:text-white">Submit another</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div className="text-left flex flex-col justify-center h-full">
                      <h2 className="text-yellow-400 font-bold text-5xl md:text-6xl mb-2 drop-shadow-lg tracking-wide">Kindly Respond</h2>
                      <h3 className="font-serif text-3xl md:text-4xl text-gray-200 mb-6 drop-shadow-md">Reserve Your Seat</h3>
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed italic pr-0 md:pr-8">
                        Your presence means the world to us. Please kindly let us know if you will be able to join our celebration.
                      </p>
                    </div>
                    <form className="flex flex-col gap-6 text-left w-full" onSubmit={handleRSVPSubmit}>
                      <div className="flex flex-col">
                        <label className="text-white text-xs md:text-sm mb-2 tracking-widest uppercase font-medium">Full Name</label>
                        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your name" className="bg-transparent border-b border-white/40 focus:border-yellow-400 outline-none text-white py-2 transition-colors placeholder:text-gray-400 font-sans" />
                      </div>
                      <div className="flex flex-col relative">
                        <label className="text-white text-xs md:text-sm mb-2 tracking-widest uppercase font-medium">Number of Guests</label>
                        <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="bg-transparent border-b border-white/40 focus:border-yellow-400 outline-none text-white py-2 appearance-none cursor-pointer transition-colors font-sans">
                          <option className="bg-red-950 text-white" value="1">1 Guest</option>
                          <option className="bg-red-950 text-white" value="2">2 Guests</option>
                          <option className="bg-red-950 text-white" value="3">3 Guests</option>
                          <option className="bg-red-950 text-white" value="4">4 Guests</option>
                          <option className="bg-red-950 text-white" value="5">5 Guests</option>
                        </select>
                        <span className="absolute right-2 bottom-3 text-red-500 pointer-events-none text-sm drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">❤</span>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-white text-xs md:text-sm mb-2 tracking-widest uppercase font-medium">Dietary Notes (Optional)</label>
                        <input type="text" value={dietaryNotes} onChange={(e) => setDietaryNotes(e.target.value)} placeholder="Any allergies or preferences?" className="bg-transparent border-b border-white/40 focus:border-yellow-400 outline-none text-white py-2 transition-colors placeholder:text-gray-400 font-sans" />
                      </div>
                      {submitStatus === "error" && <p className="text-red-400 text-sm text-center mt-2">Something went wrong. Please try again.</p>}
                      <button type="submit" disabled={isSubmitting} className={`mt-6 mx-auto text-5xl md:text-6xl transition-transform drop-shadow-[0_0_20px_rgba(255,0,0,0.9)] ${isSubmitting ? 'opacity-50 animate-pulse' : 'hover:scale-110'}`} title="Submit RSVP">❤️</button>
                    </form>
                  </div>
                )}
              </div>

              {/* --- Countdown Timer Section --- */}
              <div id="countdown" className="py-20 mt-16 border-t border-white/20">
                <p className="font-serif text-xs uppercase tracking-[0.3em] text-yellow-400 mb-4 text-center drop-shadow-md">The Final Countdown</p>
                <h2 className="font-serif text-4xl md:text-6xl text-center text-white">Until We Say <span className="text-[#d4af37] italic">"I Do"</span></h2>
                <CountdownTimer targetDate={weddingConfig.countdownTarget} />
              </div>

              {/* --- Wedding Schedule Timeline --- */}
              <div id="schedule" className="py-20 mt-8 border-t border-white/20">
                <p className="font-serif text-xs uppercase tracking-[0.3em] text-yellow-400 mb-4 text-center drop-shadow-md">The Itinerary</p>
                <h2 className="font-serif text-4xl md:text-6xl text-center text-white mb-20">Wedding <span className="text-[#d4af37] italic">Schedule</span></h2>

                <div className="relative container mx-auto px-2 md:px-10">
                  <div className="absolute left-[38px] md:left-1/2 transform md:-translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-transparent via-yellow-500 to-transparent opacity-60"></div>
                  
                  {weddingConfig.schedule && weddingConfig.schedule.map((item, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <div key={idx} className={`reveal-on-scroll mb-12 flex flex-col md:flex-row justify-between items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                         <div className="order-1 hidden md:block md:w-5/12"></div>
                         <div className="z-20 flex items-center order-1 bg-red-950 w-12 h-12 rounded-full border-2 border-yellow-400 justify-center absolute left-[14px] md:relative md:left-auto shadow-[0_0_15px_rgba(202,138,4,0.6)] hover:scale-110 transition-transform">
                           <span className="text-xl">{item.icon}</span>
                         </div>
                         <div className={`order-1 w-full md:w-5/12 pl-16 md:pl-0 ${isEven ? 'md:pr-10 md:text-right' : 'md:pl-10 text-left'}`}>
                           <div className="p-6 bg-white/5 border border-white/20 rounded-2xl backdrop-blur-md shadow-2xl hover:bg-white/10 hover:border-yellow-400/50 transition-all duration-500 group">
                             <h4 className="text-yellow-400 font-serif text-xl md:text-2xl font-bold mb-2 group-hover:scale-105 origin-left md:origin-center transition-transform">{item.time}</h4>
                             <h3 className="text-white font-serif text-lg md:text-xl font-semibold tracking-wider mb-2">{item.title}</h3>
                             <p className="text-gray-300 text-sm italic leading-relaxed">{item.desc}</p>
                           </div>
                         </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* --- Advanced Creative Footer --- */}
              <div className="relative py-24 mt-20 bg-white/5 border-t border-white/20 rounded-t-3xl shadow-2xl backdrop-blur-sm overflow-hidden reveal-on-scroll">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
                <div className="flex flex-col items-center justify-center text-center px-4 relative z-10">
                  <div className="relative flex items-center justify-center w-48 h-48 mb-8 hover:scale-110 transition-transform duration-700 cursor-pointer">
                    <svg viewBox="0 0 100 100" className="absolute w-full h-full animate-spin-slow drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                      <defs>
                        <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                      </defs>
                      <text className="text-[10.5px] uppercase tracking-[0.1em] fill-yellow-400 font-bold font-serif">
                        <textPath href="#circlePath" startOffset="0%" textLength="210" lengthAdjust="spacing">
                          {weddingConfig.spinningText}
                        </textPath>
                      </text>
                    </svg>
                    <div className="text-4xl animate-pulse drop-shadow-xl">💕</div>
                  </div>
                  <h2 className="font-serif text-5xl md:text-7xl text-[#d4af37] drop-shadow-lg mb-6">{weddingConfig.coupleFullName}</h2>
                  <p className="max-w-2xl text-sm md:text-lg italic text-gray-200 mb-12 leading-relaxed font-serif drop-shadow-md">
                    {weddingConfig.quote}
                  </p>
                  <div className="w-full max-w-lg border-y border-white/20 py-8 mb-12">
                    <h3 className="font-serif text-lg md:text-xl uppercase tracking-widest text-yellow-500 mb-6 drop-shadow-md">Contact More Details</h3>
                    <div className="flex flex-col items-center text-gray-200">
                      <span className="font-serif font-bold text-lg text-white mb-2 tracking-widest uppercase">{weddingConfig.contact?.role}</span>
                      <span className="text-sm tracking-widest mb-2 hover:text-yellow-400 transition-colors cursor-pointer block">{weddingConfig.contact?.phone}</span>
                      <span className="text-sm hover:text-yellow-400 transition-colors cursor-pointer block">{weddingConfig.contact?.email}</span>
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl text-white font-serif tracking-widest mb-4 drop-shadow-md">With all our love 💕</p>
                </div>
              </div>

            </div>
          </div>

          {/* --- NEW ADDED FOOTER (NEXTGEN INVITES) --- */}
          {/* තේමාවට ගැලපෙන පරිදි වර්ණ (bg-[#1a0101] සහ text-[#d4af37]) වෙනස් කර ඇත */}
          <footer className="relative z-20 w-full bg-[#1a0101]/95 backdrop-blur-md mt-10 py-12 border-t border-yellow-500/20 text-center shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
              
              <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full border border-[#d4af37]/50 mb-6 shadow-[0_0_15px_rgba(212,175,55,0.3)] object-cover" />
              
              {/* Social Links */}
              <div className="flex gap-6 mb-8">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:bg-white/10 transition-all border border-white/10 hover:border-[#d4af37] shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24h11.495v-9.294h-3.128v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:bg-white/10 transition-all border border-white/10 hover:border-[#d4af37] shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:bg-white/10 transition-all border border-white/10 hover:border-[#d4af37] shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.67-5.46-.22-2.14.49-4.33 1.97-5.91 1.35-1.47 3.32-2.39 5.36-2.47v4.06c-1.2.03-2.38.64-3.09 1.63-.5.71-.7 1.6-.57 2.47.16 1.05.86 1.96 1.77 2.42 1.25.63 2.87.53 3.98-.38.64-.54 1.05-1.33 1.13-2.17.03-1.63.01-3.26.02-4.89V.02z"/></svg>
                </a>
              </div>

              <h2 className="text-xl font-bold tracking-[0.2em] text-white mb-2 font-serif">NEXTGEN <span className="text-[#d4af37]">INVITES</span></h2>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                &copy; {new Date().getFullYear()} NextGen Invites. All rights reserved. <br/>
                <span className="italic text-gray-500 mt-1 block">Digital Solutions • Events • Celebrations</span>
              </p>
            </div>
          </footer>
        </>
      )}
    </main>
  );
} 