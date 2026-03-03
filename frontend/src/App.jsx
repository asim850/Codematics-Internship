import React, { useState, useEffect } from 'react';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });

    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [view, setView] = useState('books');
    const [search, setSearch] = useState("");
    const [darkMode, setDarkMode] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [bookForm, setBookForm] = useState({ title: '', author: '', category: '', quantity: 1 });
    const [memberForm, setMemberForm] = useState({ name: '', department: '', contact: '' });

    useEffect(() => {
        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const fetchData = async () => {
        try {
            const b = await fetch('http://localhost:5000/api/books').then(res => res.json());
            const m = await fetch('http://localhost:5000/api/members').then(res => res.json());
            setBooks(b || []);
            setMembers(m || []);
        } catch (err) { console.error("Fetch error:", err); }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert("Invalid Credentials!");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setLoginForm({ username: '', password: '' });
    };

    const handleIssue = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/issue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId: selectedBook.id, memberId: selectedMemberId })
        });
        if (res.ok) { setShowIssueModal(false); fetchData(); }
    };

    const handleReturn = async (bookId, memberId) => {
        const res = await fetch('http://localhost:5000/api/return', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId, memberId })
        });
        if (res.ok) fetchData();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const body = view === 'books' ? bookForm : memberForm;
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `http://localhost:5000/api/${view}/${editId}` : `http://localhost:5000/api/${view}`;

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        setShowModal(false);
        setIsEditMode(false);
        setBookForm({ title: '', author: '', category: '', quantity: 1 });
        setMemberForm({ name: '', department: '', contact: '' });
        fetchData();
    };

    const openEditModal = (item) => {
        setIsEditMode(true);
        setEditId(item.id);
        view === 'books' ? setBookForm(item) : setMemberForm(item);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this entry?")) {
            await fetch(`http://localhost:5000/api/${view}/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    const filtered = (view === 'books' ? books : members).filter(item => {
        const term = search.toLowerCase();
        return (item.title || item.name).toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
    });

    const StatsCard = ({ title, value, icon, color }) => (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-xl`}>{icon}</div>
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );

    if (!isAuthenticated) {
        return (
            <div className={darkMode ? "dark" : ""}>
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-3xl text-white italic mx-auto mb-4">L</div>
                            <h1 className="text-2xl font-bold tracking-tight">Admin Login</h1>
                            <p className="text-slate-500 text-sm mt-2">Enter your credentials to access LMS</p>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input label="Username" value={loginForm.username} onChange={v => setLoginForm({ ...loginForm, username: v })} />
                            <Input label="Password" type="password" value={loginForm.password} onChange={v => setLoginForm({ ...loginForm, password: v })} />
                            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-95">
                                Sign In
                            </button>
                        </form>
                        <button onClick={() => setDarkMode(!darkMode)} className="mt-6 w-full text-sm text-slate-500 hover:text-indigo-600 transition">
                            Switch to {darkMode ? 'Light' : 'Dark'} Mode
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${darkMode ? "dark" : ""} font-sans antialiased`}>
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
                <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white italic">L</div>
                            <h1 className="font-bold text-lg tracking-tight">LMS<span className="text-indigo-600">.</span></h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                                <button onClick={() => setView('books')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${view === 'books' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-500'}`}>Books</button>
                                <button onClick={() => setView('members')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${view === 'members' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-500'}`}>Members</button>
                            </div>
                            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                            <button onClick={handleLogout} className="p-2 rounded-xl bg-rose-500/10 text-rose-600 font-bold text-xs uppercase tracking-widest hover:bg-rose-500/20 transition">
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatsCard title="Total Books" value={books.length} icon="📚" color="text-blue-500" />
                        <StatsCard title="Active Members" value={members.length} icon="👥" color="text-emerald-500" />
                        <StatsCard title="Books Issued" value={members.reduce((acc, m) => acc + (m.issuedBooks?.length || 0), 0)} icon="📤" color="text-amber-500" />
                        <StatsCard title="Categories" value={[...new Set(books.map(b => b.category))].length} icon="🏷️" color="text-purple-500" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-end">
                        <div className="w-full md:max-w-md">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Quick Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={`Search ${view}...`}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 ring-indigo-500 outline-none transition"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <span className="absolute left-4 top-3.5 opacity-30">🔍</span>
                            </div>
                        </div>
                        <button
                            onClick={() => { setIsEditMode(false); setShowModal(true); }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                        >
                            + Add New {view === 'books' ? 'Book' : 'Member'}
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Information</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Classification</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filtered.map(item => (
                                    <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">
                                                    {view === 'books' ? '📖' : '👤'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-slate-100">{item.title || item.name}</p>
                                                    <p className="text-xs text-slate-500 font-mono uppercase">{item.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium">{item.category || item.department}</p>
                                            <p className="text-xs text-slate-500">{item.author || item.contact}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${item.quantity > 0 || view === 'members' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                                {view === 'books' ? (item.quantity > 0 ? `${item.quantity} IN STOCK` : 'OUT OF STOCK') : 'ACTIVE'}
                                            </div>
                                            {view === 'members' && item.issuedBooks?.map(b => (
                                                <div key={b.bookId} className="mt-2 flex items-center justify-between text-[10px] bg-slate-100 dark:bg-slate-800 p-1.5 rounded-md border border-slate-200 dark:border-slate-700">
                                                    <span className="truncate max-w-[100px]">{b.title}</span>
                                                    <button onClick={() => handleReturn(b.bookId, item.id)} className="text-indigo-600 font-bold hover:underline">Return</button>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center gap-2">
                                                {view === 'books' && item.quantity > 0 && (
                                                    <button onClick={() => { setSelectedBook(item); setShowIssueModal(true); }} className="p-2 text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition">Issue</button>
                                                )}
                                                <button onClick={() => openEditModal(item)} className="p-2 text-amber-600 hover:bg-amber-500/10 rounded-lg transition">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-rose-600 hover:bg-rose-500/10 rounded-lg transition">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
                            <h2 className="text-2xl font-bold mb-6 tracking-tight">{isEditMode ? 'Edit' : 'Create'} {view === 'books' ? 'Book' : 'Member'}</h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                {view === 'books' ? (
                                    <>
                                        <Input label="Book Title" value={bookForm.title} onChange={v => setBookForm({ ...bookForm, title: v })} />
                                        <Input label="Author" value={bookForm.author} onChange={v => setBookForm({ ...bookForm, author: v })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Category" value={bookForm.category} onChange={v => setBookForm({ ...bookForm, category: v })} />
                                            <Input label="Qty" type="number" value={bookForm.quantity} onChange={v => setBookForm({ ...bookForm, quantity: v })} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Input label="Full Name" value={memberForm.name} onChange={v => setMemberForm({ ...memberForm, name: v })} />
                                        <Input label="Department" value={memberForm.department} onChange={v => setMemberForm({ ...memberForm, department: v })} />
                                        <Input label="Contact" value={memberForm.contact} onChange={v => setMemberForm({ ...memberForm, contact: v })} />
                                    </>
                                )}
                                <div className="flex gap-3 pt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-slate-500">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 font-bold bg-indigo-600 text-white rounded-2xl shadow-lg">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showIssueModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl">
                            <h2 className="text-xl font-bold mb-6">Issue {selectedBook?.title}</h2>
                            <form onSubmit={handleIssue} className="space-y-4">
                                <select className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none" onChange={(e) => setSelectedMemberId(e.target.value)} required>
                                    <option value="">Choose a member...</option>
                                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setShowIssueModal(false)} className="flex-1 py-3 font-bold text-slate-500">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 font-bold bg-emerald-600 text-white rounded-2xl shadow-lg">Issue Now</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Input = ({ label, value, onChange, type = "text" }) => (
    <div>
        <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1 block tracking-widest">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500 outline-none transition"
        />
    </div>
);

export default App;