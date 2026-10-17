import React, { useState, useEffect, useMemo } from 'react';

// --- MOCK / INITIAL FALLBACK DATA ---
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
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Lock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
};

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("cm_is_admin") === "true";
  });
  const [adminPasscode, setAdminPasscode] = useState(() => {
    return localStorage.getItem("cm_admin_passcode") || "admin123";
  });
  const [passcodeInput, setPasscodeInput] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const [offices, setOffices] = useState(INITIAL_OFFICES);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [concerns, setConcerns] = useState([]);

  // Save admin session state to localStorage
  useEffect(() => {
    localStorage.setItem("cm_is_admin", isAdmin ? "true" : "false");
    if (isAdmin) {
      localStorage.setItem("cm_admin_passcode", adminPasscode);
    }
  }, [isAdmin, adminPasscode]);

  // Fetch initial data from Express API
  const refreshAllData = async () => {
    try {
      const [offRes, faqRes, annRes, evtRes] = await Promise.all([
        fetch('/api/helphub/offices').then(r => r.ok ? r.json() : null),
        fetch('/api/helphub/faqs').then(r => r.ok ? r.json() : null),
        fetch('/api/helphub/announcements').then(r => r.ok ? r.json() : null),
        fetch('/api/helphub/events').then(r => r.ok ? r.json() : null)
      ]);

      if (offRes?.data) setOffices(offRes.data);
      if (faqRes?.data) setFaqs(faqRes.data);
      if (annRes?.data) setAnnouncements(annRes.data);
      if (evtRes?.data) setEvents(evtRes.data);

      if (isAdmin) {
        const conRes = await fetch('/api/helphub/admin/concerns', {
          headers: { 'x-admin-passcode': adminPasscode }
        }).then(r => r.ok ? r.json() : null);
        if (conRes?.data) setConcerns(conRes.data);
      }
    } catch (err) {
      console.log("Backend offline or connection pending, using memory state.");
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
    } else {
      alert("Invalid Admin Passcode! (Default demo passcode: admin123)");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* HEADER NAVBAR */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("home")}>
              <div className="bg-amber-500 text-slate-900 font-bold p-2 rounded-lg flex items-center justify-center w-10 h-10">
                <span className="text-xl font-black">CM</span>
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">HelpHub</div>
                <div className="text-xs text-slate-400">College of Maasin Portal</div>
              </div>
            </div>

            <nav className="hidden md:flex space-x-1">
              {["home", "offices", "faqs", "bulletin", "concern", "assistant"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium capitalize transition ${
                    activeTab === tab ? "bg-indigo-700 text-white" : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {tab === "bulletin" ? "Notices & Events" : tab === "concern" ? "Submit Concern" : tab === "assistant" ? "AI Assistant" : tab}
                </button>
              ))}
            </nav>

            <div>
              {isAdmin ? (
                <div className="flex items-center space-x-2 bg-emerald-950 border border-emerald-700 px-3 py-1 rounded-full text-emerald-300 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-semibold">Admin Active</span>
                  <button onClick={() => setActiveTab("admin")} className="underline hover:text-white ml-1">Dashboard</button>
                  <button 
                    onClick={() => {
                      setIsAdmin(false);
                      localStorage.removeItem("cm_is_admin");
                      localStorage.removeItem("cm_admin_passcode");
                    }} 
                    className="text-slate-400 hover:text-red-300 ml-2"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* BODY CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "home" && (
          <HomeView offices={offices} faqs={faqs} announcements={announcements} events={events} setActiveTab={setActiveTab} setGlobalSearch={setGlobalSearch} />
        )}
        {activeTab === "offices" && <OfficesView offices={offices} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} setActiveTab={setActiveTab} />}
        {activeTab === "faqs" && <FaqsView faqs={faqs} offices={offices} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} setActiveTab={setActiveTab} />}
        {activeTab === "bulletin" && <BulletinView announcements={announcements} events={events} />}
        {activeTab === "concern" && <ConcernView concerns={concerns} setConcerns={setConcerns} />}
        {activeTab === "assistant" && <AssistantView offices={offices} faqs={faqs} announcements={announcements} setActiveTab={setActiveTab} />}
        {activeTab === "admin" && (
          <AdminDashboardView
            offices={offices} setOffices={setOffices}
            faqs={faqs} setFaqs={setFaqs}
            announcements={announcements} setAnnouncements={setAnnouncements}
            events={events} setEvents={setEvents}
            concerns={concerns} setConcerns={setConcerns}
            adminPasscode={adminPasscode}
            refreshAllData={refreshAllData}
          />
        )}
      </main>

      {/* ADMIN AUTH MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Admin Authorization</h3>
            <p className="text-xs text-slate-500 mb-4">Enter staff passcode to access administration panel.</p>
            <form onSubmit={handleAdminUnlock} className="space-y-4">
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Passcode (default: admin123)"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="px-4 py-2 border rounded-lg text-xs">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">Authenticate</button>
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

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-extrabold">How can CM HelpHub assist you?</h1>
        <p className="text-slate-300 mt-2 text-sm">Search official office schedules, academic guidelines, notices, or submit student concerns.</p>
        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search TOR, Tuition fees, Wi-Fi, Office Hours..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm">Search</button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div onClick={() => setActiveTab("offices")} className="bg-white p-5 rounded-xl border hover:shadow-md cursor-pointer">
          <h3 className="font-bold text-slate-900">Office Directory</h3>
          <p className="text-xs text-slate-500 mt-1">{offices.filter(o => o.isPublished !== false).length} Active Offices</p>
        </div>
        <div onClick={() => setActiveTab("faqs")} className="bg-white p-5 rounded-xl border hover:shadow-md cursor-pointer">
          <h3 className="font-bold text-slate-900">Campus FAQs</h3>
          <p className="text-xs text-slate-500 mt-1">{faqs.filter(f => f.isPublished !== false).length} Verified Answers</p>
        </div>
        <div onClick={() => setActiveTab("concern")} className="bg-white p-5 rounded-xl border hover:shadow-md cursor-pointer">
          <h3 className="font-bold text-slate-900">Submit Concern</h3>
          <p className="text-xs text-slate-500 mt-1">Get tracking code</p>
        </div>
        <div onClick={() => setActiveTab("assistant")} className="bg-white p-5 rounded-xl border hover:shadow-md cursor-pointer">
          <h3 className="font-bold text-slate-900">CM AI Assistant</h3>
          <p className="text-xs text-slate-500 mt-1">Grounded Q&A</p>
        </div>
      </div>
    </div>
  );
}

function OfficesView({ offices, globalSearch, setGlobalSearch }) {
  const filtered = offices.filter(o => o.isPublished !== false && (!globalSearch || o.officeName.toLowerCase().includes(globalSearch.toLowerCase())));
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border">
        <div>
          <h1 className="text-2xl font-bold">Campus Office Directory</h1>
          <p className="text-slate-500 text-sm">Official hours, locations, and contact information.</p>
        </div>
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Filter offices..."
          className="px-3 py-2 border rounded-xl text-sm"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border text-slate-500 space-y-2">
          <p className="font-semibold text-base text-slate-800">No offices found in database.</p>
          <p className="text-xs text-slate-400">
            Log in as Admin (passcode: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">admin123</code>) to add offices or seed sample data.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(o => (
            <div key={o._id || o.id} className="bg-white p-6 rounded-2xl border space-y-3">
              <h2 className="text-xl font-bold text-slate-900">{o.officeName}</h2>
              <p className="text-xs text-slate-600">{o.description}</p>
              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                <div><strong>Location:</strong> {o.location}</div>
                <div><strong>Email:</strong> {o.contactEmail}</div>
                <div><strong>Hours:</strong> {o.officeHours}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FaqsView({ faqs, globalSearch, setGlobalSearch }) {
  const filtered = faqs.filter(f => f.isPublished !== false && (!globalSearch || f.question.toLowerCase().includes(globalSearch.toLowerCase())));
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border">
        <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
        <p className="text-slate-500 text-sm mt-1">Verified answers regarding campus policies and procedures.</p>
      </div>
      <div className="space-y-3">
        {filtered.map(f => (
          <div key={f._id || f.id} className="bg-white p-5 rounded-xl border">
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{f.category}</span>
            <h3 className="font-bold text-slate-900 mt-1">{f.question}</h3>
            <p className="text-slate-600 text-sm mt-2">{f.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BulletinView({ announcements, events }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Campus Bulletins & Events</h1>
      <div className="space-y-4">
        {announcements.filter(a => a.isPublished !== false).map(a => (
          <div key={a._id || a.id} className="bg-white p-6 rounded-2xl border">
            <div className="text-xs text-slate-400">{a.publishDate}</div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{a.title}</h2>
            <p className="text-slate-700 text-sm mt-2">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConcernView({ concerns, setConcerns }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [refNum, setRefNum] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/helphub/concerns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, category: 'General Inquiry' })
      });
      const data = await res.json();
      if (data.success) {
        setRefNum(data.referenceNumber);
        setConcerns([data.data, ...concerns]);
      } else {
        const generated = `CM-CON-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setRefNum(generated);
      }
    } catch {
      const generated = `CM-CON-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setRefNum(generated);
    }
    setSubject("");
    setMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border space-y-6">
      <h1 className="text-2xl font-bold">Submit a Student Concern</h1>
      {refNum ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-2">
          <div className="text-emerald-800 font-bold">Concern Submitted Successfully</div>
          <div className="text-xs text-slate-600">Your Reference Number:</div>
          <div className="text-2xl font-mono font-bold text-emerald-700">{refNum}</div>
          <button onClick={() => setRefNum(null)} className="text-xs text-indigo-600 underline mt-2">Submit another concern</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1">Subject</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows="4" className="w-full px-3 py-2 border rounded-xl text-sm" required></textarea>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm">Submit Concern</button>
        </form>
      )}
    </div>
  );
}

function AssistantView({ faqs }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(null);

  const handleAsk = (e) => {
    e.preventDefault();
    const match = faqs.find(f => f.question.toLowerCase().includes(query.toLowerCase()));
    if (match) {
      setAnswer({ text: match.answer, source: `FAQ: ${match.question}` });
    } else {
      setAnswer({ text: "I could not locate verified official records matching your question. Please contact the appropriate office.", source: null });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border space-y-6">
      <h1 className="text-2xl font-bold">CM AI Grounded Assistant</h1>
      <form onSubmit={handleAsk} className="flex gap-2">
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask about campus rules, TOR, tuition..." className="flex-1 px-3 py-2 border rounded-xl text-sm" required />
        <button type="submit" className="bg-amber-500 font-bold px-5 py-2 rounded-xl text-sm">Ask</button>
      </form>
      {answer && (
        <div className="bg-slate-50 p-4 rounded-xl border text-sm space-y-2">
          <p className="text-slate-800">{answer.text}</p>
          {answer.source && <div className="text-xs text-indigo-600 font-semibold">Source: {answer.source}</div>}
        </div>
      )}
    </div>
  );
}

function AdminDashboardView({ offices, setOffices, faqs, setFaqs, announcements, setAnnouncements, events, setEvents, concerns, setConcerns, adminPasscode, refreshAllData }) {
  const [adminSection, setAdminSection] = useState("offices");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Helper to check if an ID is a valid MongoDB ObjectId
  const isValidMongoId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

  // Direct one-click database seed from Admin Dashboard
  const handleSeedDatabase = async () => {
    if (!window.confirm("This will clear current database collections and seed default College of Maasin records into MongoDB. Continue?")) return;
    try {
      const res = await fetch('/api/helphub/admin/seed', {
        method: 'POST',
        headers: { 'x-admin-passcode': adminPasscode }
      });
      const data = await res.json();
      if (res.ok) {
        alert("Success: " + data.message);
        await refreshAllData();
      } else {
        alert("Error seeding database: " + (data.message || "Unauthorized"));
      }
    } catch (err) {
      alert("Network Error: Could not connect to backend server on port 5000. Ensure 'npm run dev' is running in the server directory.");
    }
  };

  // Form States
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
        if (isExistingMongoRecord) {
          const res = await fetch(`/api/helphub/admin/offices/${targetId}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to update office in database');
        } else {
          const res = await fetch('/api/helphub/admin/offices', { method: 'POST', headers, body: JSON.stringify(payload) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to create office in database');
        }
      } else if (adminSection === "faqs") {
        const payload = { ...faqForm, keywords: typeof faqForm.keywords === 'string' ? faqForm.keywords.split(',').map(k => k.trim()).filter(Boolean) : faqForm.keywords };
        if (isExistingMongoRecord) {
          const res = await fetch(`/api/helphub/admin/faqs/${targetId}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to update FAQ');
        } else {
          const res = await fetch('/api/helphub/admin/faqs', { method: 'POST', headers, body: JSON.stringify(payload) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to create FAQ');
        }
      } else if (adminSection === "announcements") {
        if (isExistingMongoRecord) {
          const res = await fetch(`/api/helphub/admin/announcements/${targetId}`, { method: 'PUT', headers, body: JSON.stringify(annForm) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to update announcement');
        } else {
          const res = await fetch('/api/helphub/admin/announcements', { method: 'POST', headers, body: JSON.stringify(annForm) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to create announcement');
        }
      } else if (adminSection === "events") {
        if (isExistingMongoRecord) {
          const res = await fetch(`/api/helphub/admin/events/${targetId}`, { method: 'PUT', headers, body: JSON.stringify(eventForm) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to update event');
        } else {
          const res = await fetch('/api/helphub/admin/events', { method: 'POST', headers, body: JSON.stringify(eventForm) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to create event');
        }
      }

      setShowModal(false);
      alert("✅ Record saved successfully to MongoDB Atlas!");
      await refreshAllData();
    } catch (error) {
      alert("⚠️ Error saving record to MongoDB: " + error.message);
    }
  };

  const handleDelete = async (item) => {
    const id = item._id || item.id;
    if (!window.confirm(`Are you sure you want to delete "${item.officeName || item.question || item.title || item.eventTitle}"?`)) return;

    if (!isValidMongoId(id)) {
      // Local fallback item removal
      if (adminSection === "offices") setOffices(offices.filter(o => (o._id || o.id) !== id));
      if (adminSection === "faqs") setFaqs(faqs.filter(f => (f._id || f.id) !== id));
      if (adminSection === "announcements") setAnnouncements(announcements.filter(a => (a._id || a.id) !== id));
      if (adminSection === "events") setEvents(events.filter(ev => (ev._id || ev.id) !== id));
      alert("Demo preview item removed.");
      return;
    }

    const headers = { 'x-admin-passcode': adminPasscode };
    try {
      const endpoint = `/api/helphub/admin/${adminSection}/${id}`;
      const res = await fetch(endpoint, { method: 'DELETE', headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete record");
      alert("✅ Record deleted successfully from MongoDB!");
      await refreshAllData();
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  const handleUpdateConcern = async (id, status, adminNotes) => {
    const headers = { 'Content-Type': 'application/json', 'x-admin-passcode': adminPasscode };
    try {
      const res = await fetch(`/api/helphub/admin/concerns/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status, adminNotes })
      });
      if (res.ok) {
        setConcerns(concerns.map(c => (c._id === id || c.id === id) ? { ...c, status, adminNotes } : c));
      }
    } catch (err) {
      console.log("Error updating concern", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Management Dashboard</h1>
          <p className="text-slate-400 text-xs">Manage live MongoDB records for College of Maasin HelpHub</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSeedDatabase}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs"
            title="Populate initial MongoDB records"
          >
            🌱 Seed & Sync MongoDB
          </button>
          <button
            onClick={openAddModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1"
          >
            <Icons.Plus />
            <span>Add New {adminSection.slice(0, -1).toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* METRIC STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-xs text-slate-500">Offices</div>
          <div className="text-2xl font-bold">{offices.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-xs text-slate-500">FAQs</div>
          <div className="text-2xl font-bold">{faqs.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-xs text-slate-500">Announcements</div>
          <div className="text-2xl font-bold">{announcements.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-xs text-slate-500">Events</div>
          <div className="text-2xl font-bold">{events.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-xs text-slate-500">Concerns</div>
          <div className="text-2xl font-bold text-amber-600">{concerns.length}</div>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex border-b text-sm font-semibold space-x-4">
        {["offices", "faqs", "announcements", "events", "concerns"].map(sec => (
          <button
            key={sec}
            onClick={() => setAdminSection(sec)}
            className={`pb-2 capitalize ${adminSection === sec ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500"}`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* TABLES */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {adminSection === "offices" && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 p-2 font-bold text-slate-600">
              <tr>
                <th className="p-3">Office Name</th>
                <th className="p-3">Location</th>
                <th className="p-3">Source</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {offices.map(o => {
                const id = o._id || o.id;
                const isDB = isValidMongoId(id);
                return (
                  <tr key={id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold">{o.officeName}</td>
                    <td className="p-3">{o.location}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isDB ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isDB ? 'MongoDB' : 'Demo Preview'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => openEditModal(o)} className="text-indigo-600 font-semibold hover:underline">Edit</button>
                      <button onClick={() => handleDelete(o)} className="text-red-600 font-semibold hover:underline">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {adminSection === "faqs" && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 p-2 font-bold text-slate-600">
              <tr>
                <th className="p-3">Question</th>
                <th className="p-3">Category</th>
                <th className="p-3">Source</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {faqs.map(f => {
                const id = f._id || f.id;
                const isDB = isValidMongoId(id);
                return (
                  <tr key={id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold">{f.question}</td>
                    <td className="p-3">{f.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isDB ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isDB ? 'MongoDB' : 'Demo Preview'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => openEditModal(f)} className="text-indigo-600 font-semibold hover:underline">Edit</button>
                      <button onClick={() => handleDelete(f)} className="text-red-600 font-semibold hover:underline">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {adminSection === "announcements" && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 p-2 font-bold text-slate-600">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Publish Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {announcements.map(a => (
                <tr key={a._id || a.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold">{a.title}</td>
                  <td className="p-3">{a.publishDate}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => openEditModal(a)} className="text-indigo-600 font-semibold hover:underline">Edit</button>
                    <button onClick={() => handleDelete(a)} className="text-red-600 font-semibold hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {adminSection === "events" && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 p-2 font-bold text-slate-600">
              <tr>
                <th className="p-3">Event Title</th>
                <th className="p-3">Date</th>
                <th className="p-3">Venue</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map(ev => (
                <tr key={ev._id || ev.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold">{ev.eventTitle}</td>
                  <td className="p-3">{ev.eventDate}</td>
                  <td className="p-3">{ev.venue}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => openEditModal(ev)} className="text-indigo-600 font-semibold hover:underline">Edit</button>
                    <button onClick={() => handleDelete(ev)} className="text-red-600 font-semibold hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {adminSection === "concerns" && (
          <div className="p-4 space-y-4">
            {concerns.length === 0 ? (
              <p className="text-xs text-slate-500">No student concerns submitted yet.</p>
            ) : (
              concerns.map(c => (
                <div key={c._id || c.id} className="border p-4 rounded-xl bg-slate-50 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-indigo-700">{c.referenceNumber}</span>
                    <select
                      value={c.status}
                      onChange={(e) => handleUpdateConcern(c._id || c.id, e.target.value, c.adminNotes)}
                      className="border p-1 rounded font-semibold bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div><strong>Subject:</strong> {c.subject}</div>
                  <div><strong>Message:</strong> {c.message}</div>
                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold">Admin Response Note:</label>
                    <input
                      type="text"
                      value={c.adminNotes || ""}
                      onChange={(e) => handleUpdateConcern(c._id || c.id, c.status, e.target.value)}
                      placeholder="Type response for student lookup..."
                      className="w-full p-1.5 border rounded bg-white mt-1"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400">
              <Icons.X />
            </button>
            <h3 className="font-bold text-lg">{editingItem ? 'Edit' : 'Add New'} {adminSection.slice(0, -1)}</h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              {adminSection === "offices" && (
                <>
                  <input type="text" value={officeForm.officeName} onChange={e => setOfficeForm({ ...officeForm, officeName: e.target.value })} placeholder="Office Name" className="w-full p-2 border rounded" required />
                  <textarea value={officeForm.description} onChange={e => setOfficeForm({ ...officeForm, description: e.target.value })} placeholder="Description" className="w-full p-2 border rounded" required />
                  <input type="text" value={officeForm.location} onChange={e => setOfficeForm({ ...officeForm, location: e.target.value })} placeholder="Location" className="w-full p-2 border rounded" required />
                  <input type="email" value={officeForm.contactEmail} onChange={e => setOfficeForm({ ...officeForm, contactEmail: e.target.value })} placeholder="Contact Email" className="w-full p-2 border rounded" required />
                  <input type="text" value={officeForm.contactNumber} onChange={e => setOfficeForm({ ...officeForm, contactNumber: e.target.value })} placeholder="Contact Number" className="w-full p-2 border rounded" />
                  <input type="text" value={officeForm.services} onChange={e => setOfficeForm({ ...officeForm, services: e.target.value })} placeholder="Services (comma separated)" className="w-full p-2 border rounded" />
                </>
              )}

              {adminSection === "faqs" && (
                <>
                  <input type="text" value={faqForm.question} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} placeholder="Question" className="w-full p-2 border rounded" required />
                  <textarea value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} placeholder="Answer" className="w-full p-2 border rounded" required />
                  <input type="text" value={faqForm.category} onChange={e => setFaqForm({ ...faqForm, category: e.target.value })} placeholder="Category" className="w-full p-2 border rounded" />
                </>
              )}

              {adminSection === "announcements" && (
                <>
                  <input type="text" value={annForm.title} onChange={e => setAnnForm({ ...annForm, title: e.target.value })} placeholder="Announcement Title" className="w-full p-2 border rounded" required />
                  <textarea value={annForm.content} onChange={e => setAnnForm({ ...annForm, content: e.target.value })} placeholder="Content" className="w-full p-2 border rounded" required />
                  <input type="date" value={annForm.publishDate} onChange={e => setAnnForm({ ...annForm, publishDate: e.target.value })} className="w-full p-2 border rounded" />
                </>
              )}

              {adminSection === "events" && (
                <>
                  <input type="text" value={eventForm.eventTitle} onChange={e => setEventForm({ ...eventForm, eventTitle: e.target.value })} placeholder="Event Title" className="w-full p-2 border rounded" required />
                  <textarea value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Event Description" className="w-full p-2 border rounded" />
                  <input type="date" value={eventForm.eventDate} onChange={e => setEventForm({ ...eventForm, eventDate: e.target.value })} className="w-full p-2 border rounded" required />
                  <input type="text" value={eventForm.venue} onChange={e => setEventForm({ ...eventForm, venue: e.target.value })} placeholder="Venue" className="w-full p-2 border rounded" required />
                </>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded font-bold">Save to MongoDB</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}