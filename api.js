/* Lifters SACCO - API client
   Wraps fetch() with JWT auth. Configure API_BASE to your backend URL.
   Token is kept in localStorage so it survives page reloads. */
function apiBase(){ return (window.LIFTERS_API_BASE || 'https://lifters-backend.onrender.com'); }

const Api = {
  get token() { return localStorage.getItem('lifters_token') || ''; },
  set token(v) { v ? localStorage.setItem('lifters_token', v) : localStorage.removeItem('lifters_token'); },
  get role() { return localStorage.getItem('lifters_role') || ''; },
  get memberId() { return localStorage.getItem('lifters_member_id') || ''; },

  async _req(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
    const res = await fetch(apiBase() + path, {
      method, headers, body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) { this.logout(); throw new Error('Session expired - please sign in again'); }
    let data = null;
    try { data = await res.json(); } catch { /* no body */ }
    if (!res.ok) throw new Error((data && data.error) || ('Request failed: ' + res.status));
    return data;
  },
  get(p)        { return this._req('GET', p); },
  post(p, b)    { return this._req('POST', p, b); },
  put(p, b)     { return this._req('PUT', p, b); },

  async login(login_id, password) {
    const d = await this._req('POST', '/auth/login', { login_id, password });
    this.token = d.token;
    localStorage.setItem('lifters_role', d.role || '');
    localStorage.setItem('lifters_member_id', d.member_id || '');
    return d;
  },
  logout() {
    this.token = '';
    localStorage.removeItem('lifters_role');
    localStorage.removeItem('lifters_member_id');
  },
  health() { return this.get('/health'); },

  // --- module helpers (mirror the backend routes) ---
  members:       () => Api.get('/members'),
  member:        (id) => Api.get('/members/' + id),
  createMember:  (m) => Api.post('/members', m),
  updateMember:  (id, m) => Api.put('/members/' + id, m),

  savingsBalances: () => Api.get('/savings/balances'),
  savingsHistory:  (id) => Api.get('/savings/member/' + id),
  recordContribution: (c) => Api.post('/savings', c),

  welfareBalances: () => Api.get('/welfare/balance'),
  recordWelfare:   (w) => Api.post('/welfare', w),

  loans:        () => Api.get('/loans'),
  memberLoans:  (id) => Api.get('/loans/member/' + id),
  applyLoan:    (l) => Api.post('/loans', l),
  loanStatus:   (id, status) => Api.post('/loans/' + id + '/status', { status }),
  defaulters:   () => Api.get('/loans/defaulters'),
  recordRepayment: (r) => Api.post('/repayments', r),

  investments:    () => Api.get('/investments'),
  addInvestment:  (i) => Api.post('/investments', i),
  updateInvestment: (id, i) => Api.put('/investments/' + id, i),

  expenses:    () => Api.get('/expenses'),
  addExpense:  (e) => Api.post('/expenses', e),

  distributeProfit: (d) => Api.post('/profit', d),
  memberDividends:  (id) => Api.get('/profit/member/' + id),

  bankPosition: () => Api.get('/reports/bank-position'),
  dashboard:    () => Api.get('/reports/dashboard'),

  sendNotification:  (n) => Api.post('/notifications', n),
  broadcast:         (n) => Api.post('/notifications/broadcast', n),
  memberNotifications: (id) => Api.get('/notifications/member/' + id),

  auditLogs: (q='') => Api.get('/audit' + (q ? ('?' + q) : '')),
};
window.Api = Api;
