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
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12 text-luxury-gold text-center">
      <div className="countdown-box"><span className="text-4xl md:text-6xl font-bold">{String(timeLeft.days).padStart(3, '0')}</span> <span className="text-xs md:text-sm uppercase tracking-widest mt-2 text-gray-200">Days</span></div>
      <div className="countdown-box"><span className="text-4xl md:text-6xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span> <span className="text-xs md:text-sm uppercase tracking-widest mt-2 text-gray-200">Hours</span></div>
      <div className="countdown-box"><span className="text-4xl md:text-6xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span> <span className="text-xs md:text-sm uppercase tracking-widest mt-2 text-gray-200">Minutes</span></div>
      <div className="countdown-box"><span className="text-4xl md:text-6xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span> <span className="text-xs md:text-sm uppercase tracking-widest mt-2 text-gray-200">Seconds</span></div>
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
    <main className={`relative w-full overflow-x-hidden ${step !== 2 ? 'h-screen flex items-center justify-center' : 'min-h-screen py-10'}`}>
      
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
          
          <div className="absolute inset-0 bg-luxury-pattern rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] border-2 border-[#580c10] overflow-hidden">
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
            className={`absolute top-[55%] left-1/2 wax-seal w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center z-40 border border-red-950 transition-all cursor-pointer ${step === 1 ? 'animate-fade-out' : 'clickable-seal'}`}
          >
             <div className="absolute inset-[6px] rounded-full border-2 border-yellow-600/40 border-dashed flex items-center justify-center">
                <span className="font-pinyon text-4xl md:text-5xl text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {weddingConfig.initials.bride}<span className="text-2xl">&</span>{weddingConfig.initials.groom}
                </span>
             </div>
          </div>

          {step === 1 && explodingHearts.map((heart) => (
             <div key={heart.id} className="exploding-heart" style={{ '--tx': heart.tx, '--ty': heart.ty, '--rot': heart.rot } as React.CSSProperties}>❤️</div>
          ))}
        </div>
      )}

      {/* --- STEP 2: The Luxury Site --- */}
      {step === 2 && (
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 animate-unfold mt-4">
          
          <div className="text-center bg-white/10 p-8 md:p-20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-xl border border-white/30 backdrop-blur-sm">
            
            <p className="text-sm md:text-base italic text-white mb-2 drop-shadow-md">"Two hearts, two souls, one journey beginning today."</p>
            <p className="font-bodoni text-xs uppercase tracking-[0.3em] text-yellow-300 mb-10 drop-shadow-md">The Celebration of Love</p>

            <p className="text-sm md:text-base mb-1 text-gray-200">Together with their families,</p>
            <p className="font-bodoni text-xl md:text-2xl font-semibold mb-10 text-white drop-shadow-lg">We joyfully invite you to join us</p>

            <h1 className="font-pinyon text-6xl md:text-8xl text-luxury-gold drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-8">
              {weddingConfig.coupleFullName}
            </h1>

            <p className="max-w-md mx-auto text-sm md:text-base leading-relaxed mb-10 py-6 border-y border-white/30 text-white drop-shadow-md">
              to celebrate our union as we exchange vows and begin our life together.
            </p>

            <div className="mb-10 text-white">
              <p className="font-bodoni text-2xl md:text-3xl font-bold mb-6 border-t border-white/30 pt-6 drop-shadow-md">{weddingConfig.dateFormatted}</p>
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
                  <h3 className="text-2xl font-bodoni text-yellow-400 mb-2">Thank You!</h3>
                  <p className="text-white">Your RSVP has been received. We can't wait to celebrate with you!</p>
                  <button onClick={() => setSubmitStatus("idle")} className="mt-6 text-sm underline text-gray-300 hover:text-white">Submit another</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                  <div className="text-left flex flex-col justify-center h-full">
                    <h2 className="text-yellow-400 font-bold text-5xl md:text-6xl mb-2 drop-shadow-lg tracking-wide">Kindly Respond</h2>
                    <h3 className="font-pinyon text-3xl md:text-4xl text-gray-200 mb-6 drop-shadow-md">Reserve Your Seat</h3>
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
              <p className="font-bodoni text-xs uppercase tracking-[0.3em] text-yellow-400 mb-4 text-center drop-shadow-md">The Final Countdown</p>
              <h2 className="font-bodoni text-4xl md:text-6xl text-center text-luxury-white">Until We Say <span className="text-luxury-gold italic">"I Do"</span></h2>
              <CountdownTimer targetDate={weddingConfig.countdownTarget} />
            </div>

            {/* --- Wedding Schedule Timeline --- */}
            <div id="schedule" className="py-20 mt-8 border-t border-white/20">
              <p className="font-bodoni text-xs uppercase tracking-[0.3em] text-yellow-400 mb-4 text-center drop-shadow-md">The Itinerary</p>
              <h2 className="font-bodoni text-4xl md:text-6xl text-center text-luxury-white mb-20">Wedding <span className="text-luxury-gold italic">Schedule</span></h2>

              <div className="relative container mx-auto px-2 md:px-10">
                <div className="absolute left-[38px] md:left-1/2 transform md:-translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-transparent via-yellow-500 to-transparent opacity-60"></div>
                
                {weddingConfig.schedule.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <div key={idx} className={`reveal-on-scroll mb-12 flex flex-col md:flex-row justify-between items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                       <div className="order-1 hidden md:block md:w-5/12"></div>
                       <div className="z-20 flex items-center order-1 bg-red-950 w-12 h-12 rounded-full border-2 border-yellow-400 justify-center absolute left-[14px] md:relative md:left-auto shadow-[0_0_15px_rgba(202,138,4,0.6)] hover:scale-110 transition-transform">
                         <span className="text-xl">{item.icon}</span>
                       </div>
                       <div className={`order-1 w-full md:w-5/12 pl-16 md:pl-0 ${isEven ? 'md:pr-10 md:text-right' : 'md:pl-10 text-left'}`}>
                         <div className="p-6 bg-white/5 border border-white/20 rounded-2xl backdrop-blur-md shadow-2xl hover:bg-white/10 hover:border-yellow-400/50 transition-all duration-500 group">
                           <h4 className="text-yellow-400 font-bodoni text-xl md:text-2xl font-bold mb-2 group-hover:scale-105 origin-left md:origin-center transition-transform">{item.time}</h4>
                           <h3 className="text-white font-bodoni text-lg md:text-xl font-semibold tracking-wider mb-2">{item.title}</h3>
                           <p className="text-gray-300 text-sm italic leading-relaxed">{item.desc}</p>
                         </div>
                       </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* --- Advanced Creative Footer --- */}
            <div className="relative py-24 mt-20 bg-white/5 border-t border-white/20 rounded-b-3xl shadow-2xl backdrop-blur-sm overflow-hidden reveal-on-scroll">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
              <div className="flex flex-col items-center justify-center text-center px-4 relative z-10">
                <div className="relative flex items-center justify-center w-48 h-48 mb-8 hover:scale-110 transition-transform duration-700 cursor-pointer">
                  <svg viewBox="0 0 100 100" className="absolute w-full h-full animate-spin-slow drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                    <defs>
                      <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                    </defs>
                    <text className="text-[10.5px] uppercase tracking-[0.1em] fill-yellow-400 font-bold font-bodoni">
                      <textPath href="#circlePath" startOffset="0%" textLength="210" lengthAdjust="spacing">
                        {weddingConfig.spinningText}
                      </textPath>
                    </text>
                  </svg>
                  <div className="text-4xl animate-pulse drop-shadow-xl">💕</div>
                </div>
                <h2 className="font-pinyon text-5xl md:text-7xl text-luxury-gold drop-shadow-lg mb-6">{weddingConfig.coupleFullName}</h2>
                <p className="max-w-2xl text-sm md:text-lg italic text-gray-200 mb-12 leading-relaxed font-serif drop-shadow-md">
                  {weddingConfig.quote}
                </p>
                <div className="w-full max-w-lg border-y border-white/20 py-8 mb-12">
                  <h3 className="font-bodoni text-lg md:text-xl uppercase tracking-widest text-yellow-500 mb-6 drop-shadow-md">Contact More Details</h3>
                  <div className="flex flex-col items-center text-gray-200">
                    <span className="font-bodoni font-bold text-lg text-white mb-2 tracking-widest uppercase">{weddingConfig.contact.role}</span>
                    <span className="text-sm tracking-widest mb-2 hover:text-yellow-400 transition-colors cursor-pointer block">{weddingConfig.contact.phone}</span>
                    <span className="text-sm hover:text-yellow-400 transition-colors cursor-pointer block">{weddingConfig.contact.email}</span>
                  </div>
                </div>
                <p className="text-xl md:text-2xl text-white font-pinyon tracking-widest mb-4 drop-shadow-md">With all our love 💕</p>
                <p className="text-[10px] md:text-xs text-white/50 tracking-[0.2em] uppercase font-bodoni">© {weddingConfig.year} {weddingConfig.coupleFullName} Wedding</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}