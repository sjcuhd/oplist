// --- START OF FILE auth_v4.js ---
(() => {
    "use strict";
    console.log("[OpenList] Modern UI & Watchdog 启动...");

    const CONFIG = {
        CF_SITE_KEY: "0x4AAAAAACF_A19hKThLxuLh", 
        REDIRECT_TO_MANAGE: false 
    };

    // 1. 图标库
    const icons = {
        user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#409EFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        lock: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#409EFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        login_btn: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
        manage_btn: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1 2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
    };

    // 2. 动态加载 Turnstile SDK
    const loadTurnstile = () => {
        if (document.getElementById('cf-turnstile-script')) return;
        const s = document.createElement('script');
        s.id = 'cf-turnstile-script';
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true; s.defer = true;
        document.head.appendChild(s);
    };
    loadTurnstile();

    // 3. 样式
    const css = `
        .ol-auth-wrapper { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 2147483647; opacity: 0; visibility: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .modal-overlay.active { opacity: 1; visibility: visible; }
        .modal-content { background: #ffffff; padding: 40px 35px; border-radius: 24px; width: 90%; max-width: 380px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05); position: relative; text-align: center; transform: scale(0.95) translateY(10px); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .modal-overlay.active .modal-content { transform: scale(1) translateY(0); }
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        .close-icon { position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 50%; transition: 0.2s; background: #f5f7fa; }
        .close-icon:hover { background: #eef1f6; transform: rotate(90deg); }
        .modal-title { margin-bottom: 30px; color: #333; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
        .form-group { position: relative; margin-bottom: 20px; }
        .input-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); opacity: 0.8; }
        .form-group input { width: 100%; padding: 15px 15px 15px 50px; border: 2px solid transparent; background: #f5f7fa; border-radius: 16px; box-sizing: border-box; font-size: 15px; color: #333; outline: none; transition: 0.3s; }
        .form-group input::placeholder { color: #aab2bd; }
        .form-group input:focus { background: #fff; border-color: #409EFF; box-shadow: 0 4px 15px rgba(64,158,255,0.15); }
        .btn { width: 100%; padding: 15px; background: #409EFF; color: white; border: none; border-radius: 16px; cursor: pointer; font-size: 16px; font-weight: 600; letter-spacing: 1px; margin-top: 15px; transition: 0.3s; box-shadow: 0 8px 20px -5px rgba(64, 158, 255, 0.4); }
        .btn:hover { background: #66b1ff; transform: translateY(-2px); box-shadow: 0 12px 25px -5px rgba(64, 158, 255, 0.5); }
        .btn:active { transform: scale(0.98); }
        .btn:disabled { background: #a0cfff; cursor: not-allowed; transform: none; }
        .msg { margin-top: 15px; font-size: 13px; font-weight: 500; min-height: 20px; opacity: 0; transition: 0.3s; }
        .msg.show { opacity: 1; }
        .msg.err { color: #f56c6c; } .msg.ok { color: #67c23a; }
        .nav-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; background: white; border: 1px solid #e4e7ed; border-radius: 30px; cursor: pointer; text-decoration: none !important; font-size: 14px; font-weight: 600; color: #409EFF; box-shadow: 0 2px 12px rgba(0,0,0,0.05); transition: all 0.3s; }
        .nav-btn:hover { border-color: #409EFF; background: #ecf5ff; transform: translateY(-2px); }
        .nav-btn.manage { background: #409EFF; color: white; border-color: #409EFF; }
        .nav-btn.manage:hover { background: #66b1ff; }
        .cf-container { margin: 10px 0; display: flex; justify-content: center; min-height: 65px; }
        #auth-container.fixed-fallback { position: fixed; bottom: 30px; right: 30px; z-index: 2147483647; }
    `;
    const st = document.createElement('style'); st.innerHTML = css; document.head.appendChild(st);

    // 4. HTML
    const html = `
        <div id="login-modal" class="modal-overlay ol-auth-wrapper">
            <div class="modal-content">
                <div class="close-icon" id="close-btn" title="关闭">${icons.close}</div>
                <h3 class="modal-title">账号登录</h3>
                <form id="l-form">
                    <div class="form-group"><span class="input-icon">${icons.user}</span><input id="u" type="text" placeholder="请输入用户名" autocomplete="username" required></div>
                    <div class="form-group"><span class="input-icon">${icons.lock}</span><input id="p" type="password" placeholder="请输入密码" autocomplete="current-password" required></div>
                    <div id="cf-widget" class="cf-container"></div>
                    <button type="submit" class="btn" id="s-btn">立即登录</button>
                    <p id="msg" class="msg"></p>
                </form>
            </div>
        </div>
    `;
    const d = document.createElement('div'); d.innerHTML = html; document.body.appendChild(d.firstElementChild);

    // 5. 逻辑
    let tId = null;
    function mount() {
        const box = document.getElementById('auth-link-container');
        if (!box) return;

        const isLogged = localStorage.getItem('token');
        box.innerHTML = isLogged ? 
            `<a href="/@manage" target="_blank" class="nav-btn manage">${icons.manage_btn} 管理面板</a>` : 
            `<a href="javascript:;" id="open-btn" class="nav-btn">${icons.login_btn} 登录</a>`;

        if (!isLogged) {
            const m = document.getElementById('login-modal');
            const msg = document.getElementById('msg');
            const btn = document.getElementById('s-btn');
            const content = document.querySelector('.modal-content');

            document.getElementById('open-btn').onclick = () => {
                m.classList.add('active');
                setTimeout(() => document.getElementById('u').focus(), 100);
                if (window.turnstile && !tId) { 
                    try { tId = turnstile.render('#cf-widget', { sitekey: CONFIG.CF_SITE_KEY, theme: 'light', callback: () => { msg.textContent = ""; msg.classList.remove('show'); } }); } catch(e){} 
                }
            };
            const close = () => { m.classList.remove('active'); };
            document.getElementById('close-btn').onclick = close;
            m.onclick = (e) => { if (e.target === m) close(); };

            document.getElementById('l-form').onsubmit = (e) => {
                e.preventDefault();
                const token = window.turnstile ? turnstile.getResponse(tId) : "";
                if (!token) { 
                    msg.textContent = "请完成人机验证"; msg.className = "msg err show"; 
                    content.classList.remove('shake'); void content.offsetWidth; content.classList.add('shake');
                    return; 
                }
                btn.textContent = "验证中..."; btn.disabled = true; msg.classList.remove('show');

                fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'cf-turnstile-response': token},
                    body: JSON.stringify({username: document.getElementById('u').value, password: document.getElementById('p').value})
                }).then(r => r.json()).then(res => {
                    if(res.code === 200) { 
                        msg.textContent = "登录成功，正在跳转..."; msg.className = "msg ok show"; 
                        localStorage.setItem('token', res.data.token);
                        setTimeout(() => { if(CONFIG.REDIRECT_TO_MANAGE) window.open('/@manage', '_blank'); location.reload(); }, 800);
                    } else { throw new Error('鉴权失败'); }
                }).catch(() => {
                    msg.textContent = "用户名或密码错误"; msg.className = "msg err show"; 
                    btn.textContent = "重试"; btn.disabled = false;
                    if(tId) turnstile.reset(tId);
                    content.classList.remove('shake'); void content.offsetWidth; content.classList.add('shake');
                });
            };
        }
    }

    // ============================================================
    // 🛑 关键新增：路由看门狗 (Watchdog)
    // 作用：每 200ms 检查一次 URL，如果发现进入了原生登录页，强制踢回首页
    // ============================================================
    const startWatchdog = () => {
        setInterval(() => {
            // 如果 URL 路径以 /@login 开头 (包含带参数的)
            if (window.location.pathname.startsWith('/@login')) {
                console.warn("[Watchdog] 检测到原生登录页，强制跳转回首页...");
                // 强制替换当前历史记录并跳转，不留后退记录
                window.location.replace('/');
            }
        }, 200);
    };

    const init = () => {
        mount();
        startWatchdog(); // 启动看门狗
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();