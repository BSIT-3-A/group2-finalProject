import React, { useState, useEffect } from 'react';
import cmLogo from '../cm.jpg';

// --- INITIAL FALLBACK DATA ---
const INITIAL_OFFICES = [
  {
    _id: "off-1",
    officeName: "Registrar's Office",
    description: "Handles student admissions, academic records, TOR requests, enrollment verification, and diploma processing.",
    location: "Administration Building, 1st Floor, Room 102",
    contactEmail: "registrar@collegeofmaasin.edu.ph",
    contactNumber: "(053) 570-8123",
    officeHours: "Mon - Fri: 8:00 AM - 5:00 PM",
    services: ["Transcript of Records (TOR)", "Enrollment Verification", "Adding/Dropping Subjects", "Transfer Credentials", "Graduation Clearance"],
    isPublished: true,
  },
  {
    _id: "off-2",
    officeName: "Cashier & Finance Office",
    description: "Manages student tuition assessment, fee collection, official receipts, payment plans, and financial clearances.",
    location: "Administration Building, 1st Floor, Room 104",
    contactEmail: "finance@collegeofmaasin.edu.ph",
    contactNumber: "(053) 570-8124",
    officeHours: "Mon - Fri: 8:00 AM - 4:00 PM",
    services: ["Tuition Fee Payment", "Statement of Account (SOA)", "Exam Permits", "Refund Requests", "Promissory Notes"],
    isPublished: true,
  },
  {
    _id: "off-3",
    officeName: "Guidance & Counseling Office",
    description: "Provides academic counseling, personal support, career guidance, and issues Certificate of Good Moral Character.",
    location: "Student Center Building, 2nd Floor",
    contactEmail: "guidance@collegeofmaasin.edu.ph",
    contactNumber: "(053) 570-8128",
    officeHours: "Mon - Fri: 8:30 AM - 4:30 PM",
    services: ["Counseling Services", "Good Moral Certificate", "Career Guidance", "Exit Interviews", "Mental Health Support"],
    isPublished: true,
  },
  {
    _id: "off-4",
    officeName: "Information Technology Services (ITS)",
    description: "Supports campus Wi-Fi access, student portal accounts, learning management system (LMS) assistance, and technical support.",
    location: "Main Academic Building, 3rd Floor, Room 305",
    contactEmail: "itservices@collegeofmaasin.edu.ph",
    contactNumber: "(053) 570-8135",
    officeHours: "Mon - Fri: 8:00 AM - 5:00 PM",
    services: ["Portal Password Reset", "Campus Wi-Fi Registration", "LMS Support", "Student ID Activation"],
    isPublished: true,
  }
];

const INITIAL_FAQS = [
  {
    _id: "faq-1",
    question: "How do I request an official Transcript of Records (TOR)?",
    answer: "Visit the Registrar's Office (Admin Bldg Room 102) or submit a clearance request online. Ensure you have cleared all financial accountabilities at the Finance Office. Processing standardly takes 3 to 5 business days.",
    category: "Academic & Records",
    keywords: ["TOR", "transcript", "grades", "records", "clearance"],
    relatedOfficeId: "off-1",
    isPublished: true,
  },
  {
    _id: "faq-2",
    question: "What are the accredited payment channels for tuition fees?",
    answer: "Tuition payments can be made directly at the Cashier's Office (Cash/Check), or online via GCash, Landbank, or DBP bank deposits. Always upload or present your transaction reference receipt for verification.",
    category: "Finance & Payments",
    keywords: ["tuition", "payment", "cashier", "gcash", "bank"],
    relatedOfficeId: "off-2",
    isPublished: true,
  },
  {
    _id: "faq-3",
    question: "How can I obtain a Certificate of Good Moral Character?",
    answer: "Fill out the request slip at the Guidance & Counseling Office (Student Center 2nd Floor). Pay the processing fee at the Cashier, then present your official receipt to claim your certificate.",
    category: "Student Services",
    keywords: ["good moral", "guidance", "certificate", "clearance"],
    relatedOfficeId: "off-3",
    isPublished: true,
  },
  {
    _id: "faq-4",
    question: "How do I connect to the CM Student Wi-Fi network?",
    answer: "Connect to the 'CM_Student_WiFi' SSID on campus and log in using your Student ID number and portal password. For password resets, visit the IT Services office in Room 305.",
    category: "IT & Digital Services",
    keywords: ["wifi", "internet", "password", "portal", "login"],
    relatedOfficeId: "off-4",
    isPublished: true,
  }
];

const INITIAL_ANNOUNCEMENTS = [
  {
    _id: "ann-1",
    title: "Midterm Examinations Schedule & Clearance Deadline",
    content: "First Semester Midterm Examinations will take place from November 10 to 14, 2026. Students must settle outstanding balances at the Cashier's Office by November 7 to secure examination permits.",
    category: "Academic",
    publishDate: "2026-10-15",
    expiryDate: "2026-11-20",
    isPublished: true,
  },
  {
    _id: "ann-2",
    title: "Annual Campus Intramurals & Foundation Week 2026",
    content: "College of Maasin marks its Foundation Celebration with sports tournaments, cultural competitions, and academic quizzes! Regular classes will be adjusted accordingly.",
    category: "Campus Life",
    publishDate: "2026-10-12",
    expiryDate: "2026-11-30",
    isPublished: true,
  }
];

const INITIAL_EVENTS = [
  {
    _id: "evt-1",
    eventTitle: "CM Career Expo & Industry Partnership Fair 2026",
    description: "Connect with regional business partners, tech agencies, and healthcare institutions for internship and job opportunities.",
    eventDate: "2026-11-05",
    startTime: "09:00 AM",
    endTime: "04:00 PM",
    venue: "CM Auditorium & Multipurpose Hall",
    isPublished: true,
  },
  {
    _id: "evt-2",
    eventTitle: "Student Leadership & Youth Empowerment Summit",
    description: "Interactive workshop on team building, campus project management, and community leadership organized by the Supreme Student Council.",
    eventDate: "2026-11-18",
    startTime: "01:00 PM",
    endTime: "05:00 PM",
    venue: "AVR Building 2, Room 201",
    isPublished: true,
  }
];

const Icons = {
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Building: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9m4 0v10m-4-10v10"/></svg>,
  HelpCircle: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Bell: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  Send: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Lock: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
  Pin: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Mail: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
  Clock: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  ChevronDown: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>,
  CheckCircle: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>,
  Bot: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Database: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
};

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("cm_is_admin") === "true");
  const [adminPasscode, setAdminPasscode] = useState(() => localStorage.getItem("cm_admin_passcode") || "admin123");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // Data States
  const [offices, setOffices] = useState(INITIAL_OFFICES);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [concerns, setConcerns] = useState([]);

  // Modern Toast Notification State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Persist admin session
  useEffect(() => {
    localStorage.setItem("cm_is_admin", isAdmin ? "true" : "false");
    if (isAdmin) {
      localStorage.setItem("cm_admin_passcode", adminPasscode);
    }
  }, [isAdmin, adminPasscode]);

  const refreshAllData = async () => {
    try {
      const [offRes, faqRes, annRes, evtRes] = await Promise.all([
        fetch('/api/helphub/offices').then(r => r.ok ? r.json() : null),
        fetch('/api/helphub/faqs').then(r => r.ok ? r.json() : null),
        fetch('/api/helphub/announcements').then(r => r.ok ? r.json() : null),
        fetch('/api/helphub/events').then(r => r.ok ? r.json() : null)
      ]);

      if (offRes?.data?.length) setOffices(offRes.data);
      if (faqRes?.data?.length) setFaqs(faqRes.data);
      if (annRes?.data?.length) setAnnouncements(annRes.data);
      if (evtRes?.data?.length) setEvents(evtRes.data);

      if (isAdmin) {
        const conRes = await fetch('/api/helphub/admin/concerns', {
          headers: { 'x-admin-passcode': adminPasscode }
        }).then(r => r.ok ? r.json() : null);
        if (conRes?.data) setConcerns(conRes.data);
      }
    } catch (err) {
      console.log("Backend offline or connection pending, using fallback state.");
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [isAdmin]);

  const handleAdminUnlock = (e) => {
    e.preventDefault();
    if (passcodeInput === "admin123" || passcodeInput === "cm2026") {
      setAdminPasscode(passcodeInput);
      setIsAdmin(true);
      setShowAdminModal(false);
      setPasscodeInput("");
      setActiveTab("admin");
      showToast("Admin session unlocked successfully!", "success");
    } else {
      showToast("Invalid Admin Passcode! Default is admin123", "error");
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "offices", label: "Office Directory" },
    { id: "faqs", label: "Campus FAQs" },
    { id: "bulletin", label: "Notices & Events" },
    { id: "concern", label: "Concern Desk" },
    { id: "assistant", label: "AI Assistant", isSpecial: true }
  ];

  return (
    <div className="min-h-screen bg-[#F4F8F6] text-slate-800 flex flex-col font-sans selection:bg-[#3C8B5C] selection:text-white">
      {/* FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 bg-[#0A3520]/95 text-white border-[#3C8B5C]/80">
          <span className={`w-2.5 h-2.5 rounded-full ${toast.type === "error" ? "bg-rose-500" : "bg-emerald-400"} animate-ping`} />
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-[#3C8B5C] hover:text-white ml-2">
            <Icons.X />
          </button>
        </div>
      )}

      {/* MODERN NAVBAR WITH CUSTOM PALETTE */}
      <header className="bg-[#0A3520] backdrop-blur-xl text-white border-b border-[#0E4A2C] sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* BRAND LOGO REDUCED BY 50% */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => setActiveTab("home")}
            >
              <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md shadow-[#0A3520] group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden border border-[#3C8B5C]">
                <img 
                  src={cmLogo} 
                  alt="College of Maasin Seal" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white">
                    CM HelpHub
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#3C8B5C]/30 text-emerald-200 border border-[#3C8B5C]/50">
                    Portal
                  </span>
                </div>
                <div className="text-[11px] text-emerald-300/80 font-medium">College of Maasin</div>
              </div>
            </div>

            {/* DESKTOP NAVIGATION PILLS */}
            <nav className="hidden lg:flex items-center space-x-1.5 bg-[#0E4A2C] p-1.5 rounded-2xl border border-[#17663D]">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === item.id
                      ? item.isSpecial
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20"
                        : "bg-[#3C8B5C] text-white shadow-md shadow-[#17663D]/50"
                      : item.isSpecial
                      ? "text-amber-300 hover:bg-[#17663D]/70"
                      : "text-emerald-100 hover:text-white hover:bg-[#17663D]/60"
                  }`}
                >
                  {item.isSpecial && <Icons.Sparkles />}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* ADMIN STATUS / LOGIN BUTTON */}
            <div className="flex items-center space-x-3">
              {isAdmin ? (
                <div className="flex items-center gap-2 bg-[#0E4A2C] border border-[#3C8B5C] pl-3 pr-2 py-1.5 rounded-2xl text-emerald-200 text-xs shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold tracking-wide hidden sm:inline">Admin</span>
                  <button
                    onClick={() => setActiveTab("admin")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      activeTab === "admin" ? "bg-[#3C8B5C] text-white" : "bg-[#0A3520] hover:bg-[#17663D] text-white"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setIsAdmin(false);
                      localStorage.removeItem("cm_is_admin");
                      localStorage.removeItem("cm_admin_passcode");
                      if (activeTab === "admin") setActiveTab("home");
                      showToast("Logged out of Admin Mode", "success");
                    }}
                    className="text-emerald-300 hover:text-rose-300 px-1.5 py-1 transition font-semibold"
                    title="Exit Admin Mode"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="text-xs font-semibold bg-[#0E4A2C] hover:bg-[#17663D] border border-[#3C8B5C] text-emerald-100 px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
                >
                  <Icons.Lock />
                  <span>Staff Portal</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION BAR */}
        <div className="lg:hidden flex overflow-x-auto border-t border-[#0E4A2C] bg-[#0E4A2C] px-4 py-2.5 gap-2 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 ${
                activeTab === item.id
                  ? item.isSpecial
                    ? "bg-amber-400 text-slate-950 font-bold"
                    : "bg-[#3C8B5C] text-white"
                  : "text-emerald-200 bg-[#0A3520]"
              }`}
            >
              {item.isSpecial && <Icons.Sparkles />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* MAIN VIEW CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "home" && (
          <HomeView
            offices={offices}
            faqs={faqs}
            announcements={announcements}
            events={events}
            setActiveTab={setActiveTab}
            setGlobalSearch={setGlobalSearch}
          />
        )}
        {activeTab === "offices" && (
          <OfficesView
            offices={offices}
            globalSearch={globalSearch}
            setGlobalSearch={setGlobalSearch}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "faqs" && (
          <FaqsView
            faqs={faqs}
            offices={offices}
            globalSearch={globalSearch}
            setGlobalSearch={setGlobalSearch}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "bulletin" && (
          <BulletinView announcements={announcements} events={events} />
        )}
        {activeTab === "concern" && (
          <ConcernView concerns={concerns} setConcerns={setConcerns} showToast={showToast} />
        )}
        {activeTab === "assistant" && (
          <AssistantView
            offices={offices}
            faqs={faqs}
            announcements={announcements}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "admin" && (
          <AdminDashboardView
            offices={offices} setOffices={setOffices}
            faqs={faqs} setFaqs={setFaqs}
            announcements={announcements} setAnnouncements={setAnnouncements}
            events={events} setEvents={setEvents}
            concerns={concerns} setConcerns={setConcerns}
            adminPasscode={adminPasscode}
            refreshAllData={refreshAllData}
            showToast={showToast}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0A3520] text-emerald-200/80 border-t border-[#0E4A2C] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-[#3C8B5C]">
                  <img src={cmLogo} alt="CM Seal" className="w-6 h-6 object-contain" />
                </div>
                <span className="text-white font-bold text-base">CM HelpHub Portal</span>
              </div>
              <p className="text-xs text-emerald-300/80 max-w-md leading-relaxed">
                An AI-Integrated Web-Based Student Assistance and Campus Information System engineered for the students, faculty, and administration of the College of Maasin.
              </p>
              <div className="text-[11px] text-emerald-400/70 pt-1">
                📍 Tunga-Tunga, Maasin City, Southern Leyte, Philippines
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setActiveTab("offices")} className="hover:text-amber-300 transition">Campus Office Directory</button></li>
                <li><button onClick={() => setActiveTab("faqs")} className="hover:text-amber-300 transition">Verified Campus FAQs</button></li>
                <li><button onClick={() => setActiveTab("bulletin")} className="hover:text-amber-300 transition">Announcements & Events</button></li>
                <li><button onClick={() => setActiveTab("concern")} className="hover:text-amber-300 transition">Submit & Track Concern</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Group 2 Developers</h4>
              <ul className="space-y-1.5 text-xs text-emerald-300/80 font-medium">
                <li>• Layo, Megan</li>
                <li>• Calapre, Josh</li>
                <li>• Gozo, Erick</li>
                <li>• Bagumbaran, Jhehannifah</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#0E4A2C] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/70 gap-4">
            <div>© 2026 College of Maasin — CM HelpHub. All rights reserved.</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Powered by React, Express & MongoDB Atlas</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ADMIN PASSCODE MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 relative border border-slate-100">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
            >
              <Icons.X />
            </button>
            <div className="flex items-center space-x-3.5 mb-5">
              <div className="p-3.5 bg-emerald-50 text-[#17663D] rounded-2xl border border-emerald-100">
                <Icons.Shield />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Staff Authorization</h3>
                <p className="text-xs text-slate-500">Enter administrator passcode to manage records</p>
              </div>
            </div>
            <form onSubmit={handleAdminUnlock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Security Passcode</label>
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter passcode (default: admin123)"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3C8B5C] focus:border-transparent transition"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#17663D] hover:bg-[#0E4A2C] text-white rounded-xl text-xs font-bold shadow-md shadow-[#17663D]/20 transition"
                >
                  Unlock Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function HomeView({ offices, faqs, announcements, events, setActiveTab, setGlobalSearch }) {
  const [input, setInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setGlobalSearch(input);
      setActiveTab("faqs");
    }
  };

  const quickTags = ["Transcript of Records", "Tuition & GCash", "Good Moral", "Student Wi-Fi", "Registrar Hours"];

  return (
    <div className="space-y-10">
      {/* HERO SECTION WITH CUSTOM GRADIENT PALETTE */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A3520] via-[#0E4A2C] to-[#17663D] text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-[#3C8B5C]/30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#3C8B5C]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-emerald-200 text-xs font-semibold">
            <Icons.Sparkles />
            <span>College of Maasin Smart Campus Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]">
            Fast, verified answers for{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-orange-300 bg-clip-text text-transparent">
              every student need.
            </span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            Explore official campus office directories, academic requirements, real-time announcements, or ask our AI assistant grounded in verified school records.
          </p>

          {/* HERO SEARCH BAR */}
          <form onSubmit={handleSearch} className="pt-2">
            <div className="flex flex-col sm:flex-row gap-2.5 bg-white/10 p-2 rounded-2xl border border-white/15 backdrop-blur-md max-w-2xl">
              <div className="flex-1 flex items-center pl-3 text-emerald-200">
                <Icons.Search />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Search TOR, tuition fees, office hours, clearance..."
                  className="w-full bg-transparent px-3 py-2.5 text-white placeholder-emerald-200/60 text-sm focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold px-7 py-3 rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
              >
                Search Portal
              </button>
            </div>
          </form>

          {/* QUICK FILTER PILLS */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-emerald-200/80 font-medium mr-1">Popular:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setGlobalSearch(tag);
                  setActiveTab("faqs");
                }}
                className="text-xs bg-[#0A3520]/80 hover:bg-[#3C8B5C] text-emerald-100 px-3 py-1.5 rounded-xl border border-[#3C8B5C]/50 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BENTO FEATURE NAVIGATION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => setActiveTab("offices")}
          className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#3C8B5C] transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#0A3520]/5 text-[#17663D] flex items-center justify-center mb-4 group-hover:bg-[#17663D] group-hover:text-white transition-colors">
              <Icons.Building />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Office Directory</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Locations, operating hours, and direct contact channels.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#17663D]">
            <span>{offices.filter(o => o.isPublished !== false).length} Active Offices</span>
            <span className="group-hover:translate-x-1 transition-transform"><Icons.ArrowRight /></span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab("faqs")}
          className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#3C8B5C] transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#0A3520]/5 text-[#17663D] flex items-center justify-center mb-4 group-hover:bg-[#17663D] group-hover:text-white transition-colors">
              <Icons.HelpCircle />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Verified FAQs</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Step-by-step guides on TOR, enrollment, and payments.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#17663D]">
            <span>{faqs.filter(f => f.isPublished !== false).length} Solutions Ready</span>
            <span className="group-hover:translate-x-1 transition-transform"><Icons.ArrowRight /></span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab("concern")}
          className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#3C8B5C] transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#0A3520]/5 text-[#17663D] flex items-center justify-center mb-4 group-hover:bg-[#17663D] group-hover:text-white transition-colors">
              <Icons.Send />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Concern Desk</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Submit inquiries & track status with a reference code.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#17663D]">
            <span>Submit & Track</span>
            <span className="group-hover:translate-x-1 transition-transform"><Icons.ArrowRight /></span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab("assistant")}
          className="group bg-gradient-to-br from-[#0A3520] via-[#0E4A2C] to-[#17663D] text-white p-6 rounded-3xl border border-[#3C8B5C]/40 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icons.Sparkles />
            </div>
            <h3 className="font-extrabold text-white text-lg">CM AI Assistant</h3>
            <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
              Instant Q&A grounded strictly in verified campus data.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-[#3C8B5C]/40 flex items-center justify-between text-xs font-bold text-amber-300">
            <span>Ask AI Now</span>
            <span className="group-hover:translate-x-1 transition-transform"><Icons.ArrowRight /></span>
          </div>
        </div>
      </div>

      {/* LOWER SPLIT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#0A3520]/10 text-[#17663D]"><Icons.Bell /></div>
              <h2 className="text-xl font-extrabold text-slate-900">Latest Campus Bulletins</h2>
            </div>
            <button
              onClick={() => setActiveTab("bulletin")}
              className="text-xs font-bold text-[#17663D] hover:text-[#0A3520] flex items-center gap-1"
            >
              <span>View All</span>
              <Icons.ArrowRight />
            </button>
          </div>

          <div className="space-y-4">
            {announcements.filter(a => a.isPublished !== false).slice(0, 2).map((ann) => (
              <div
                key={ann._id || ann.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#0A3520]/10 text-[#0A3520] border border-[#3C8B5C]/30">
                    {ann.category || "Notice"}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{ann.publishDate}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1.5">{ann.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>

          {/* UPCOMING EVENTS BANNER */}
          <div className="bg-gradient-to-r from-[#0A3520] via-[#0E4A2C] to-[#17663D] text-white p-7 rounded-3xl shadow-lg border border-[#3C8B5C]/40">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5 text-amber-300 font-bold text-base">
                <Icons.Calendar />
                <span>Upcoming Campus Events</span>
              </div>
              <button onClick={() => setActiveTab("bulletin")} className="text-xs text-emerald-200 hover:text-white underline">
                Full Calendar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.filter(e => e.isPublished !== false).slice(0, 2).map((evt) => (
                <div
                  key={evt._id || evt.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="inline-block text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 rounded-lg mb-2">
                      {evt.eventDate}
                    </span>
                    <h4 className="font-bold text-white text-sm leading-snug">{evt.eventTitle}</h4>
                  </div>
                  <div className="text-xs text-emerald-200 flex items-center gap-1.5 pt-2 border-t border-white/10">
                    <Icons.Pin />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
              <span className="text-[#17663D]"><Icons.HelpCircle /></span>
              <span>Frequently Asked</span>
            </h3>
            <div className="space-y-2.5">
              {faqs.filter(f => f.isPublished !== false).slice(0, 4).map((f) => (
                <div
                  key={f._id || f.id}
                  onClick={() => {
                    setGlobalSearch(f.question);
                    setActiveTab("faqs");
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-[#0A3520]/5 border border-slate-100 hover:border-[#3C8B5C]/40 cursor-pointer transition group"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#17663D] mb-1">
                    {f.category}
                  </div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-[#0A3520] line-clamp-2">
                    {f.question}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
              <span className="text-[#17663D]"><Icons.Building /></span>
              <span>Key Hotlines</span>
            </h3>
            <div className="space-y-3">
              {offices.filter(o => o.isPublished !== false).slice(0, 3).map((o) => (
                <div key={o._id || o.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="font-bold text-slate-900">{o.officeName}</div>
                  <div className="text-slate-500 mt-0.5 truncate">{o.location}</div>
                  <div className="text-[#17663D] font-semibold mt-1">{o.contactEmail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OfficesView({ offices, globalSearch, setGlobalSearch, setActiveTab }) {
  const filtered = offices.filter(o =>
    o.isPublished !== false &&
    (!globalSearch ||
      o.officeName?.toLowerCase().includes(globalSearch.toLowerCase()) ||
      o.description?.toLowerCase().includes(globalSearch.toLowerCase()) ||
      (Array.isArray(o.services) && o.services.some(s => s.toLowerCase().includes(globalSearch.toLowerCase()))))
  );

  return (
    <div className="space-y-8">
      <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#17663D]">Campus Directory</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">Administrative & Academic Offices</h1>
          <p className="text-slate-500 text-sm mt-1">Find official building locations, operating schedules, and direct emails.</p>
        </div>
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Icons.Search />
          </span>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search office or service..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3C8B5C] transition"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <Icons.X />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white p-14 text-center rounded-3xl border border-slate-200/80 space-y-3">
          <p className="font-bold text-lg text-slate-800">No matching offices found</p>
          <p className="text-xs text-slate-500">Try clearing your search filter or log in as Admin to seed sample offices.</p>
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch("")}
              className="mt-2 px-4 py-2 bg-[#0A3520]/10 text-[#0A3520] font-bold text-xs rounded-xl"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((o) => {
            const serviceList = Array.isArray(o.services)
              ? o.services
              : typeof o.services === "string" && o.services
              ? o.services.split(",").map(s => s.trim())
              : [];

            return (
              <div
                key={o._id || o.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-[#0A3520]/10 text-[#17663D] border border-[#3C8B5C]/20">
                        <Icons.Building />
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900">{o.officeName}</h2>
                    </div>
                    <span className="bg-emerald-50 text-[#17663D] border border-[#3C8B5C]/30 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      Verified
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">{o.description}</p>

                  <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <span className="text-[#17663D]"><Icons.Pin /></span>
                      <span className="font-bold text-slate-900">Location:</span>
                      <span>{o.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <span className="text-[#17663D]"><Icons.Mail /></span>
                      <span className="font-bold text-slate-900">Email:</span>
                      <a href={`mailto:${o.contactEmail}`} className="text-[#17663D] font-semibold hover:underline">
                        {o.contactEmail}
                      </a>
                    </div>
                    {o.contactNumber && (
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <span className="text-[#17663D]"><Icons.Phone /></span>
                        <span className="font-bold text-slate-900">Phone:</span>
                        <span>{o.contactNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <span className="text-[#17663D]"><Icons.Clock /></span>
                      <span className="font-bold text-slate-900">Hours:</span>
                      <span>{o.officeHours || "Mon - Fri: 8:00 AM - 5:00 PM"}</span>
                    </div>
                  </div>

                  {serviceList.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Offered Services
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {serviceList.map((srv, idx) => (
                          <span
                            key={idx}
                            className="bg-[#0A3520]/5 text-[#17663D] border border-[#3C8B5C]/20 text-xs font-semibold px-3 py-1 rounded-xl"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setActiveTab("concern")}
                    className="text-xs bg-[#0A3520] hover:bg-[#17663D] text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
                  >
                    <span>Submit Inquiry</span>
                    <Icons.ArrowRight />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FaqsView({ faqs, offices, globalSearch, setGlobalSearch, setActiveTab }) {
  const [selectedCat, setSelectedCat] = useState("All");
  const [openId, setOpenId] = useState(null);

  const categories = ["All", "Academic & Records", "Finance & Payments", "IT & Digital Services", "Student Services"];

  const filtered = faqs.filter((f) => {
    if (f.isPublished === false) return false;
    const matchCat = selectedCat === "All" || f.category === selectedCat;
    const matchSearch =
      !globalSearch ||
      f.question?.toLowerCase().includes(globalSearch.toLowerCase()) ||
      f.answer?.toLowerCase().includes(globalSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#17663D]">Knowledge Base</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">Frequently Asked Questions</h1>
            <p className="text-slate-500 text-sm mt-1">Verified answers regarding campus policies, requirements, and procedures.</p>
          </div>

          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Icons.Search />
            </span>
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3C8B5C]"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <Icons.X />
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCat === cat
                  ? "bg-[#17663D] text-white shadow-md shadow-[#17663D]/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ACCORDION LIST */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 space-y-3">
            <p className="font-bold text-base text-slate-800">No FAQs matched your search.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab("assistant")}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow"
              >
                Ask CM AI Assistant
              </button>
              <button
                onClick={() => { setGlobalSearch(""); setSelectedCat("All"); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          filtered.map((f) => {
            const id = f._id || f.id;
            const isOpen = openId === id;

            return (
              <div
                key={id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-[#3C8B5C] shadow-md" : "border-slate-200/80 shadow-sm hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                >
                  <div className="space-y-1.5">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#17663D] bg-[#0A3520]/5 border border-[#3C8B5C]/30 px-2.5 py-0.5 rounded-full">
                      {f.category || "General"}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{f.question}</h3>
                  </div>
                  <div className={`p-2 rounded-xl bg-slate-100 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180 bg-[#0A3520]/10 text-[#17663D]" : ""}`}>
                    <Icons.ChevronDown />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3">
                    <p className="text-slate-700 text-sm leading-relaxed">{f.answer}</p>
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Verified Campus Policy Record</span>
                      <button
                        onClick={() => setActiveTab("offices")}
                        className="text-[#17663D] font-bold hover:underline"
                      >
                        View Office Directory →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function BulletinView({ announcements, events }) {
  const [subTab, setSubTab] = useState("announcements");

  const pubAnn = announcements.filter(a => a.isPublished !== false);
  const pubEvt = events.filter(e => e.isPublished !== false);

  return (
    <div className="space-y-8">
      <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#17663D]">Campus Updates</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">Bulletins & Events Schedule</h1>
          <p className="text-slate-500 text-sm mt-1">Official school announcements, examination dates, and student activities.</p>
        </div>

        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 self-start sm:self-auto">
          <button
            onClick={() => setSubTab("announcements")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              subTab === "announcements" ? "bg-white text-[#0A3520] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Announcements ({pubAnn.length})
          </button>
          <button
            onClick={() => setSubTab("events")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              subTab === "events" ? "bg-white text-[#0A3520] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Upcoming Events ({pubEvt.length})
          </button>
        </div>
      </div>

      {subTab === "announcements" ? (
        <div className="space-y-4">
          {pubAnn.map((a) => (
            <div
              key={a._id || a.id}
              className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0A3520]/10 text-[#0A3520] border border-[#3C8B5C]/30">
                  {a.category || "Official Notice"}
                </span>
                <span className="text-xs text-slate-400 font-medium">Published: {a.publishDate}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">{a.title}</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{a.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pubEvt.map((ev) => (
            <div
              key={ev._id || ev.id}
              className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#0A3520]/10 text-[#17663D] border border-[#3C8B5C]/30 text-xs font-extrabold px-3.5 py-1 rounded-full">
                    📅 {ev.eventDate}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {ev.startTime || "08:00 AM"} - {ev.endTime || "05:00 PM"}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{ev.eventTitle}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{ev.description}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-[#17663D]"><Icons.Pin /></span>
                <span>Venue: {ev.venue}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConcernView({ concerns, setConcerns, showToast }) {
  const [mode, setMode] = useState("submit");
  const [category, setCategory] = useState("Registrar & Academic");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [refNum, setRefNum] = useState(null);

  // Tracking states
  const [trackInput, setTrackInput] = useState("");
  const [trackedResult, setTrackedResult] = useState(null);
  const [trackError, setTrackError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/helphub/concerns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, subject, message, contactEmail })
      });
      const data = await res.json();
      if (data.success) {
        setRefNum(data.referenceNumber);
        setConcerns([data.data, ...concerns]);
        showToast("Concern registered in database!", "success");
      } else {
        const generated = `CM-CON-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setRefNum(generated);
      }
    } catch {
      const generated = `CM-CON-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackItem = {
        _id: `con-${Date.now()}`,
        referenceNumber: generated,
        category,
        subject,
        message,
        contactEmail: contactEmail || "N/A",
        status: "Pending",
        submittedAt: new Date().toLocaleString(),
        adminNotes: ""
      };
      setConcerns([fallbackItem, ...concerns]);
      setRefNum(generated);
      showToast("Concern submitted!", "success");
    }
    setSubject("");
    setMessage("");
    setContactEmail("");
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackError("");
    setTrackedResult(null);
    const code = trackInput.trim().toUpperCase();
    if (!code) return;

    try {
      const res = await fetch(`/api/helphub/concerns/track/${code}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setTrackedResult(data.data);
          return;
        }
      }
    } catch {
      // Fallback to local state check
    }

    const localMatch = concerns.find(c => c.referenceNumber?.toUpperCase() === code);
    if (localMatch) {
      setTrackedResult(localMatch);
    } else {
      setTrackError(`No record found matching reference number "${code}".`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#17663D]">Student Support</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Student Concern & Help Desk</h1>
          <p className="text-slate-500 text-xs mt-1">Submit an official inquiry or track your ticket resolution status.</p>
        </div>

        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 self-start sm:self-auto">
          <button
            onClick={() => setMode("submit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              mode === "submit" ? "bg-white text-[#0A3520] shadow-sm" : "text-slate-600"
            }`}
          >
            Submit Concern
          </button>
          <button
            onClick={() => setMode("track")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              mode === "track" ? "bg-white text-[#0A3520] shadow-sm" : "text-slate-600"
            }`}
          >
            Track Reference #
          </button>
        </div>
      </div>

      {mode === "submit" ? (
        refNum ? (
          <div className="bg-white border-2 border-[#3C8B5C] p-8 rounded-3xl text-center space-y-5 shadow-lg">
            <div className="w-16 h-16 bg-[#0A3520]/10 text-[#17663D] rounded-2xl flex items-center justify-center mx-auto border border-[#3C8B5C]/30">
              <Icons.CheckCircle />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Concern Registered!</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Save your unique tracking reference number below to check updates from school staff.
              </p>
            </div>
            <div className="bg-slate-50 border-2 border-dashed border-[#3C8B5C] p-5 rounded-2xl max-w-sm mx-auto">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reference Code</div>
              <div className="text-2xl font-mono font-black text-[#17663D] mt-1 select-all">{refNum}</div>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setTrackInput(refNum);
                  setMode("track");
                  setRefNum(null);
                }}
                className="px-5 py-2.5 bg-[#17663D] hover:bg-[#0A3520] text-white rounded-xl text-xs font-bold transition"
              >
                Track Status Now
              </button>
              <button
                onClick={() => setRefNum(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Submit Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Department *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3C8B5C]"
                >
                  <option value="Registrar & Academic">Registrar & Academic</option>
                  <option value="Cashier & Finance">Cashier & Finance</option>
                  <option value="Guidance & Counseling">Guidance & Counseling</option>
                  <option value="IT & Student Portal">IT & Student Portal</option>
                  <option value="General Inquiry">General Campus Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Student Email (Optional)</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="student@collegeofmaasin.edu.ph"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3C8B5C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject / Title *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Follow-up on TOR request or GCash payment verification"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3C8B5C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Concern Message *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                placeholder="Include relevant details such as your Student ID, transaction date, or specific question..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3C8B5C]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#17663D] hover:bg-[#0A3520] text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-[#17663D]/20 transition flex items-center justify-center gap-2"
            >
              <Icons.Send />
              <span>Submit Concern & Generate Reference Code</span>
            </button>
          </form>
        )
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <form onSubmit={handleTrack} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Enter Your Reference Number</label>
            <div className="flex gap-2.5">
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="e.g. CM-CON-2026-4821"
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-mono text-sm uppercase bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3C8B5C]"
                required
              />
              <button
                type="submit"
                className="bg-[#17663D] hover:bg-[#0A3520] text-white font-bold px-6 py-3 rounded-xl text-sm transition"
              >
                Track Status
              </button>
            </div>
          </form>

          {trackError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
              {trackError}
            </div>
          )}

          {trackedResult && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Reference Number</div>
                  <div className="text-lg font-mono font-black text-[#17663D]">{trackedResult.referenceNumber}</div>
                </div>
                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-bold ${
                    trackedResult.status === "Resolved"
                      ? "bg-emerald-100 text-emerald-800"
                      : trackedResult.status === "In Progress"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-200 text-slate-800"
                  }`}
                >
                  {trackedResult.status}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div><strong className="text-slate-700">Department:</strong> {trackedResult.category}</div>
                <div><strong className="text-slate-700">Subject:</strong> {trackedResult.subject}</div>
                <div><strong className="text-slate-700">Submitted:</strong> {trackedResult.submittedAt}</div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-600 mt-2">
                  {trackedResult.message}
                </div>
              </div>
              {trackedResult.adminNotes && (
                <div className="p-4 rounded-xl bg-[#0A3520]/5 border border-[#3C8B5C]/30 text-xs space-y-1">
                  <div className="font-extrabold text-[#0A3520]">Official Staff Resolution Note:</div>
                  <p className="text-slate-700">{trackedResult.adminNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AssistantView({ offices, faqs, announcements, setActiveTab }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am the CM HelpHub AI Assistant. I answer questions strictly using verified College of Maasin records. How can I assist you today?",
      source: null
    }
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async (promptText) => {
    const q = (promptText || query).trim();
    if (!q) return;

    setMessages((prev) => [...prev, { sender: "user", text: q }]);
    if (!promptText) setQuery("");
    setLoading(true);

    try {
      const res = await fetch('/api/helphub/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.answer,
            source: data.source ? `${data.source.type}: ${data.source.title}` : null
          }
        ]);
        setLoading(false);
        return;
      }
    } catch {
      // Fallback to local memory grounding if server is unreachable
    }

    const lower = q.toLowerCase();
    const faqMatch = faqs.find(
      (f) => f.question?.toLowerCase().includes(lower) || f.answer?.toLowerCase().includes(lower)
    );
    const offMatch = offices.find(
      (o) => o.officeName?.toLowerCase().includes(lower) || o.description?.toLowerCase().includes(lower)
    );

    setTimeout(() => {
      if (faqMatch) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: faqMatch.answer, source: `FAQ Record: ${faqMatch.question}` }
        ]);
      } else if (offMatch) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `${offMatch.officeName} is located at ${offMatch.location}. Hours: ${offMatch.officeHours}. Email: ${offMatch.contactEmail}.`,
            source: `Office Directory: ${offMatch.officeName}`
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `I could not locate verified campus records matching "${q}". Please check the Office Directory or submit an official student concern.`,
            source: null
          }
        ]);
      }
      setLoading(false);
    }, 350);
  };

  const samplePrompts = [
    "How do I request a TOR?",
    "Where is the Registrar's Office?",
    "Tuition payment channels?",
    "How to connect to campus Wi-Fi?"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="bg-gradient-to-r from-[#0A3520] via-[#0E4A2C] to-[#17663D] text-white p-7 rounded-3xl shadow-lg border border-[#3C8B5C]/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Icons.Sparkles />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">CM AI Grounded Assistant</h1>
            <p className="text-xs text-emerald-200 mt-0.5">Responses strictly verified against official College of Maasin database records</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col h-[520px]">
        {/* CHAT HISTORY */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#17663D] text-white rounded-br-none shadow-sm"
                    : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/80"
                }`}
              >
                {m.sender === "ai" && (
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#17663D] mb-1">
                    <Icons.Bot />
                    <span>CM Grounded AI</span>
                  </div>
                )}
                <p>{m.text}</p>
                {m.source && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-[11px] font-bold text-[#17663D] flex items-center gap-1">
                    <span>✓ Verified Source:</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{m.source}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-xs text-slate-400 italic pl-2">Searching verified campus records...</div>
          )}
        </div>

        {/* SUGGESTED PILLS */}
        <div className="flex overflow-x-auto gap-2 py-3 border-t border-slate-100 mt-3 no-scrollbar">
          {samplePrompts.map((p) => (
            <button
              key={p}
              onClick={() => askQuestion(p)}
              className="text-xs bg-slate-100 hover:bg-[#0A3520]/10 hover:text-[#17663D] text-slate-700 font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* INPUT BAR */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            askQuestion();
          }}
          className="flex gap-2.5 pt-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about TOR, tuition, office locations, or school policies..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3C8B5C]"
            required
          />
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-sm transition flex items-center gap-1.5 shadow-md shadow-amber-500/15"
          >
            <span>Ask</span>
            <Icons.Send />
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboardView({
  offices, setOffices,
  faqs, setFaqs,
  announcements, setAnnouncements,
  events, setEvents,
  concerns, setConcerns,
  adminPasscode,
  refreshAllData,
  showToast
}) {
  const [adminSection, setAdminSection] = useState("offices");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const isValidMongoId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

  const triggerSeedDatabase = () => {
    setConfirmDialog({
      title: "Seed & Sync MongoDB Database?",
      message: "This will populate your MongoDB Atlas database with official College of Maasin starter records for Offices, FAQs, Announcements, and Events.",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const res = await fetch('/api/helphub/admin/seed', {
            method: 'POST',
            headers: { 'x-admin-passcode': adminPasscode }
          });
          const data = await res.json();
          if (res.ok) {
            showToast(data.message || "Database seeded successfully!", "success");
            await refreshAllData();
          } else {
            showToast(data.message || "Unauthorized seed request", "error");
          }
        } catch {
          showToast("Backend server unreachable on port 5000", "error");
        }
      }
    });
  };

  const [officeForm, setOfficeForm] = useState({ officeName: "", description: "", location: "", contactEmail: "", contactNumber: "", officeHours: "Mon - Fri: 8:00 AM - 5:00 PM", services: "" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "Academic & Records", keywords: "" });
  const [annForm, setAnnForm] = useState({ title: "", content: "", category: "Academic", publishDate: new Date().toISOString().split('T')[0] });
  const [eventForm, setEventForm] = useState({ eventTitle: "", description: "", eventDate: new Date().toISOString().split('T')[0], startTime: "08:00 AM", endTime: "05:00 PM", venue: "" });

  const openAddModal = () => {
    setEditingItem(null);
    setOfficeForm({ officeName: "", description: "", location: "", contactEmail: "", contactNumber: "", officeHours: "Mon - Fri: 8:00 AM - 5:00 PM", services: "" });
    setFaqForm({ question: "", answer: "", category: "Academic & Records", keywords: "" });
    setAnnForm({ title: "", content: "", category: "Academic", publishDate: new Date().toISOString().split('T')[0] });
    setEventForm({ eventTitle: "", description: "", eventDate: new Date().toISOString().split('T')[0], startTime: "08:00 AM", endTime: "05:00 PM", venue: "" });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    if (adminSection === "offices") {
      setOfficeForm({ ...item, services: Array.isArray(item.services) ? item.services.join(", ") : item.services || "" });
    } else if (adminSection === "faqs") {
      setFaqForm({ ...item, keywords: Array.isArray(item.keywords) ? item.keywords.join(", ") : item.keywords || "" });
    } else if (adminSection === "announcements") {
      setAnnForm({ ...item });
    } else if (adminSection === "events") {
      setEventForm({ ...item });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const headers = { 'Content-Type': 'application/json', 'x-admin-passcode': adminPasscode };
    const targetId = editingItem ? (editingItem._id || editingItem.id) : null;
    const isExistingMongoRecord = targetId && isValidMongoId(targetId);

    try {
      if (adminSection === "offices") {
        const payload = { ...officeForm, services: typeof officeForm.services === 'string' ? officeForm.services.split(',').map(s => s.trim()).filter(Boolean) : officeForm.services };
        const url = isExistingMongoRecord ? `/api/helphub/admin/offices/${targetId}` : '/api/helphub/admin/offices';
        const method = isExistingMongoRecord ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Failed to save office");
      } else if (adminSection === "faqs") {
        const payload = { ...faqForm, keywords: typeof faqForm.keywords === 'string' ? faqForm.keywords.split(',').map(k => k.trim()).filter(Boolean) : faqForm.keywords };
        const url = isExistingMongoRecord ? `/api/helphub/admin/faqs/${targetId}` : '/api/helphub/admin/faqs';
        const method = isExistingMongoRecord ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Failed to save FAQ");
      } else if (adminSection === "announcements") {
        const url = isExistingMongoRecord ? `/api/helphub/admin/announcements/${targetId}` : '/api/helphub/admin/announcements';
        const method = isExistingMongoRecord ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers, body: JSON.stringify(annForm) });
        if (!res.ok) throw new Error("Failed to save announcement");
      } else if (adminSection === "events") {
        const url = isExistingMongoRecord ? `/api/helphub/admin/events/${targetId}` : '/api/helphub/admin/events';
        const method = isExistingMongoRecord ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers, body: JSON.stringify(eventForm) });
        if (!res.ok) throw new Error("Failed to save event");
      }

      setShowModal(false);
      showToast("Record saved to MongoDB Atlas!", "success");
      await refreshAllData();
    } catch (error) {
      showToast(error.message || "Error saving record", "error");
    }
  };

  const confirmDelete = (item) => {
    const id = item._id || item.id;
    const label = item.officeName || item.question || item.title || item.eventTitle || "this record";
    setConfirmDialog({
      title: "Confirm Deletion",
      message: `Are you sure you want to permanently remove "${label}"?`,
      onConfirm: async () => {
        setConfirmDialog(null);
        if (!isValidMongoId(id)) {
          if (adminSection === "offices") setOffices(offices.filter(o => (o._id || o.id) !== id));
          if (adminSection === "faqs") setFaqs(faqs.filter(f => (f._id || f.id) !== id));
          if (adminSection === "announcements") setAnnouncements(announcements.filter(a => (a._id || a.id) !== id));
          if (adminSection === "events") setEvents(events.filter(ev => (ev._id || ev.id) !== id));
          showToast("Preview record removed from view", "success");
          return;
        }
        try {
          const res = await fetch(`/api/helphub/admin/${adminSection}/${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-passcode': adminPasscode }
          });
          if (!res.ok) throw new Error("Delete failed");
          showToast("Record deleted from MongoDB!", "success");
          await refreshAllData();
        } catch (err) {
          showToast(err.message, "error");
        }
      }
    });
  };

  const handleUpdateConcern = async (id, status, adminNotes) => {
    setConcerns(concerns.map(c => (c._id === id || c.id === id) ? { ...c, status, adminNotes } : c));
    try {
      await fetch(`/api/helphub/admin/concerns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': adminPasscode },
        body: JSON.stringify({ status, adminNotes })
      });
    } catch {
      // silent fallback
    }
  };

  return (
    <div className="space-y-8">
      {/* TOP ADMIN BANNER */}
      <div className="bg-[#0A3520] text-white p-8 rounded-3xl shadow-xl border border-[#0E4A2C] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-2">
            <Icons.Database />
            <span>MongoDB Atlas Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Admin Management Dashboard</h1>
          <p className="text-emerald-200/80 text-xs mt-1">Create, update, and manage verified College of Maasin records.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={triggerSeedDatabase}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs transition shadow-md"
          >
            🌱 Seed & Sync MongoDB
          </button>
          {adminSection !== "concerns" && (
            <button
              onClick={openAddModal}
              className="bg-[#17663D] hover:bg-[#3C8B5C] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-md border border-[#3C8B5C]"
            >
              <Icons.Plus />
              <span>Add New {adminSection.slice(0, -1)}</span>
            </button>
          )}
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Offices", count: offices.length, sec: "offices" },
          { label: "Verified FAQs", count: faqs.length, sec: "faqs" },
          { label: "Bulletins", count: announcements.length, sec: "announcements" },
          { label: "Campus Events", count: events.length, sec: "events" },
          { label: "Student Concerns", count: concerns.length, sec: "concerns", highlight: true }
        ].map((stat) => (
          <div
            key={stat.sec}
            onClick={() => setAdminSection(stat.sec)}
            className={`p-5 rounded-2xl border cursor-pointer transition ${
              adminSection === stat.sec
                ? "bg-[#0A3520]/10 border-[#3C8B5C] shadow-sm"
                : "bg-white border-slate-200/80 hover:border-slate-300"
            }`}
          >
            <div className="text-xs font-bold text-slate-500">{stat.label}</div>
            <div className={`text-3xl font-black mt-1 ${stat.highlight ? "text-amber-600" : "text-slate-900"}`}>
              {stat.count}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-3">
        {["offices", "faqs", "announcements", "events", "concerns"].map((sec) => (
          <button
            key={sec}
            onClick={() => setAdminSection(sec)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
              adminSection === sec ? "bg-[#0A3520] text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* DATA TABLES */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {adminSection === "offices" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Office Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offices.map((o) => {
                  const id = o._id || o.id;
                  const isDB = isValidMongoId(id);
                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-bold text-slate-900">{o.officeName}</td>
                      <td className="p-4 text-slate-600">{o.location}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isDB ? "bg-emerald-50 text-[#17663D] border border-[#3C8B5C]/30" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                          {isDB ? "MongoDB" : "Demo Preview"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-3">
                        <button onClick={() => openEditModal(o)} className="text-[#17663D] font-bold hover:underline">Edit</button>
                        <button onClick={() => confirmDelete(o)} className="text-rose-600 font-bold hover:underline">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {adminSection === "faqs" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Question</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faqs.map((f) => {
                  const id = f._id || f.id;
                  const isDB = isValidMongoId(id);
                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-bold text-slate-900">{f.question}</td>
                      <td className="p-4 text-slate-600">{f.category}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isDB ? "bg-emerald-50 text-[#17663D] border border-[#3C8B5C]/30" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                          {isDB ? "MongoDB" : "Demo Preview"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-3">
                        <button onClick={() => openEditModal(f)} className="text-[#17663D] font-bold hover:underline">Edit</button>
                        <button onClick={() => confirmDelete(f)} className="text-rose-600 font-bold hover:underline">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {adminSection === "announcements" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Publish Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {announcements.map((a) => (
                  <tr key={a._id || a.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900">{a.title}</td>
                    <td className="p-4 text-slate-600">{a.publishDate}</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => openEditModal(a)} className="text-[#17663D] font-bold hover:underline">Edit</button>
                      <button onClick={() => confirmDelete(a)} className="text-rose-600 font-bold hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {adminSection === "events" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Event Title</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev._id || ev.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900">{ev.eventTitle}</td>
                    <td className="p-4 text-slate-600">{ev.eventDate}</td>
                    <td className="p-4 text-slate-600">{ev.venue}</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => openEditModal(ev)} className="text-[#17663D] font-bold hover:underline">Edit</button>
                      <button onClick={() => confirmDelete(ev)} className="text-rose-600 font-bold hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {adminSection === "concerns" && (
          <div className="p-6 space-y-4">
            {concerns.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No student concerns submitted yet.</p>
            ) : (
              concerns.map((c) => (
                <div key={c._id || c.id} className="border border-slate-200 p-5 rounded-2xl bg-slate-50/60 text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-black text-sm text-[#17663D]">{c.referenceNumber}</span>
                    <select
                      value={c.status}
                      onChange={(e) => handleUpdateConcern(c._id || c.id, e.target.value, c.adminNotes)}
                      className="border border-slate-300 px-3 py-1.5 rounded-xl font-bold bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div><strong>Subject:</strong> {c.subject}</div>
                  <div><strong>Message:</strong> {c.message}</div>
                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold mb-1">Official Staff Resolution Note:</label>
                    <input
                      type="text"
                      value={c.adminNotes || ""}
                      onChange={(e) => handleUpdateConcern(c._id || c.id, c.status, e.target.value)}
                      placeholder="Write resolution update visible to student..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 space-y-5 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <Icons.X />
            </button>
            <h3 className="font-extrabold text-lg text-slate-900 capitalize">
              {editingItem ? "Edit" : "Create New"} {adminSection.slice(0, -1)}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              {adminSection === "offices" && (
                <>
                  <input type="text" value={officeForm.officeName} onChange={e => setOfficeForm({ ...officeForm, officeName: e.target.value })} placeholder="Office Name *" className="w-full p-3 border rounded-xl" required />
                  <textarea value={officeForm.description} onChange={e => setOfficeForm({ ...officeForm, description: e.target.value })} placeholder="Description *" className="w-full p-3 border rounded-xl" rows="2" required />
                  <input type="text" value={officeForm.location} onChange={e => setOfficeForm({ ...officeForm, location: e.target.value })} placeholder="Building & Room Location *" className="w-full p-3 border rounded-xl" required />
                  <input type="email" value={officeForm.contactEmail} onChange={e => setOfficeForm({ ...officeForm, contactEmail: e.target.value })} placeholder="Official Email *" className="w-full p-3 border rounded-xl" required />
                  <input type="text" value={officeForm.contactNumber} onChange={e => setOfficeForm({ ...officeForm, contactNumber: e.target.value })} placeholder="Phone / Hotline" className="w-full p-3 border rounded-xl" />
                  <input type="text" value={officeForm.services} onChange={e => setOfficeForm({ ...officeForm, services: e.target.value })} placeholder="Services (comma separated)" className="w-full p-3 border rounded-xl" />
                </>
              )}

              {adminSection === "faqs" && (
                <>
                  <input type="text" value={faqForm.question} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} placeholder="Question *" className="w-full p-3 border rounded-xl" required />
                  <textarea value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} placeholder="Verified Answer *" className="w-full p-3 border rounded-xl" rows="3" required />
                  <input type="text" value={faqForm.category} onChange={e => setFaqForm({ ...faqForm, category: e.target.value })} placeholder="Category (e.g. Academic & Records)" className="w-full p-3 border rounded-xl" />
                </>
              )}

              {adminSection === "announcements" && (
                <>
                  <input type="text" value={annForm.title} onChange={e => setAnnForm({ ...annForm, title: e.target.value })} placeholder="Announcement Title *" className="w-full p-3 border rounded-xl" required />
                  <textarea value={annForm.content} onChange={e => setAnnForm({ ...annForm, content: e.target.value })} placeholder="Bulletin Content *" className="w-full p-3 border rounded-xl" rows="3" required />
                  <input type="date" value={annForm.publishDate} onChange={e => setAnnForm({ ...annForm, publishDate: e.target.value })} className="w-full p-3 border rounded-xl" />
                </>
              )}

              {adminSection === "events" && (
                <>
                  <input type="text" value={eventForm.eventTitle} onChange={e => setEventForm({ ...eventForm, eventTitle: e.target.value })} placeholder="Event Title *" className="w-full p-3 border rounded-xl" required />
                  <textarea value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Event Description *" className="w-full p-3 border rounded-xl" rows="2" required />
                  <input type="date" value={eventForm.eventDate} onChange={e => setEventForm({ ...eventForm, eventDate: e.target.value })} className="w-full p-3 border rounded-xl" required />
                  <input type="text" value={eventForm.venue} onChange={e => setEventForm({ ...eventForm, venue: e.target.value })} placeholder="Venue *" className="w-full p-3 border rounded-xl" required />
                </>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 border rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-[#17663D] hover:bg-[#0A3520] text-white rounded-xl font-bold">Save to MongoDB</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION DIALOG */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">{confirmDialog.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-[#17663D] hover:bg-[#0A3520] text-white rounded-xl text-xs font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}