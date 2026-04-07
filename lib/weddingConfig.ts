// lib/weddingConfig.ts

export const weddingConfig = {
  // --- Couple Details ---
  brideName: "Tharu",
  groomName: "Ishara",
  coupleFullName: "Tharu & Ishara",
  initials: { bride: "T", groom: "I" }, // For the Wax Seal
  
  // --- Event Details ---
  dateFormatted: "20 . 08 . 2026", // Display format
  countdownTarget: "2026-08-20T10:30:00", // For the timer
  time: "10:30 AM",
  
  // --- Location Details ---
  venue: "Kingsbury Hotel",
  city: "Colombo",
  country: "Sri Lanka",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.645894375997!2d79.8393656745412!3d6.932858218271887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259259a6157fb%3A0x8c0cebb288af4419!2sThe%20Kingsbury%20Colombo!5e0!3m2!1sen!2slk!4v1775581623658!5m2!1sen!2slk",

  // --- Text & Quotes ---
  // මෙහි උද්ධෘත (Quotes) ගැටලුව විසඳා ඇත
  quote: '"A journey of a thousand miles begins with a single step, and we\'re so incredibly happy to take it together."',
  hashtag: "#TharuAndIshara2026",
  spinningText: "THARU AND ISHARA • LOVE FOREVER • ",
  year: "2026",
  
  // --- Contact Details ---
  contact: {
    role: "Groom",
    phone: "+94 77 123 4567",
    email: "isharawedding@example.com",
  },

  // --- Wedding Schedule ---
  schedule: [
    { time: "09:30 AM", title: "Welcome & Guest Arrival", desc: "Arrival of guests, welcome drinks, and finding seats.", icon: "🥂" },
    { time: "10:30 AM", title: "Wedding Ceremony", desc: "The beautiful moment we exchange our vows and rings.", icon: "💍" },
    { time: "12:30 PM", title: "Celebration Luncheon", desc: "Join us for a grand festive feast and refreshments.", icon: "🍽️" },
    { time: "02:30 PM", title: "First Dance & Toasts", desc: "Celebrating the newlyweds with heartfelt speeches and dancing.", icon: "💃" },
    { time: "04:00 PM", title: "Evening Party", desc: "Hit the dance floor and make unforgettable memories with us.", icon: "🎶" }
  ],

  // --- Assets ---
  musicFile: "/music.mp3",
  backgroundImage: "url('/bg-image.jpg')"
};