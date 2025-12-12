// --- START OF FILE auth.js ---
(() => {
    console.log("[OpenList Script] v3.0 启动...");

    const CONFIG = {
        // 🔴 请确认这是您的 Site Key
        CF_SITE_KEY: "0x4AAAAAACF_A19hKThLxuLh", 
        REDIRECT_TO_MANAGE: false 
    };

    // 图标数据 (已净化，无特殊符号)
    const icons = {
        user: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
        lock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
        close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        manage: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'，
        login: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>'
    };

    const loadTurnstile = () => {
        if (document.getElementById('cf-turnstile-script')) return;
        const script = document.createElement('script');
        script.id = 'cf-turnstile-script';
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    };
    loadTurnstile();

    const modalCSS = `
        .ol-auth-wrapper { font-family: system-ui, -apple-system, sans-serif; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.4); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 2147483647; opacity: 0; visibility: hidden; transition: all 0.3s; }
        .modal-overlay.active { opacity: 1; visibility: visible; }
        .modal-content { background: rgba(255,255,255,0.95); padding: 30px; border-radius: 20px; width: 90%; max-width: 350px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); transform: scale(0.95); transition: transform 0.3s; text-align: center; }
        .modal-overlay.active .modal-content { transform: scale(1); }
        .modal-close-btn { position: absolute; top: 15px; right: 15px; cursor: pointer; color: #999; }
        .form-group { position: relative; margin-bottom: 20px; }
        .form-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); width: 18px; color: #aaa; }
        .form-group input { width: 100%; padding: 12px 15px 12px 45px; border: 2px solid #eee; border-radius: 10px; box-sizing: border-box; }
        .login-submit-btn { width: 100%; padding: 12px; border: none; border-radius: 10px; background: #409EFF; color: white; cursor: pointer; font-weight: bold; }
        .nav-btn-styled { display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; border-radius: 20px; text-decoration: none !important; cursor: pointer; font-size: 14px; }
        .nav-btn-login { background: #fff; color: #409EFF; border: 1px solid #c6e2ff; }
        .nav-btn-manage { background: #6c5ce7; color: white; }
        .cf-turnstile-container { margin: 15px 0; display: flex; justify-content: center; }
        .login-message { margin-top: 10px; font-size: 13px; min-height: 18px; }
        .login-message.error { color: red; } .login-message.success { color: green; }
        
        #auth-link-container.fixed-fallback { position: fixed !important; bottom: 30px !important; right: 30px !important; z-index: 2147483647; background: white; padding: 8px; border-radius: 30px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); }
    `;

    const style = document.createElement('style'); style.innerHTML = modalCSS; document.head.appendChild(style);

    const modalHTML = `
        <div id="login-modal" class="modal-overlay ol-auth-wrapper">
            <div class="modal-content">
                <div class="modal-close-btn">${icons。close}</div>
                <h3 style="margin-bottom:20px;color:#333">身份验证</h3>
                <form id="login-form">
                    <div class="form-group"><input type="text" id="u-in" placeholder="用户名" required><div class="form-icon">${icons。user}</div></div>
                    <div class="form-group"><input type="password" id="p-in" placeholder="密码" required><div class="form-icon">${icons。lock}</div></div>
                    <div class="cf-turnstile-container" id="cf-widget"></div>
                    <button type="submit" class="login-submit-btn">登录</button>
                    <p id="msg-box" class="login-message"></p>
                </form>
            </div>
        </div>`;
    const div = document.createElement('div'); div.innerHTML = modalHTML; document.body.appendChild(div.firstElementChild);

    let tId = null;
    function setupAuthUI(mountPoint, isFallback) {
        let container = document.getElementById('auth-link-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'auth-link-container';
            if (isFallback) container.classList.add('fixed-fallback');
            mountPoint.appendChild(container);
        }
        
        const isLogged = localStorage.getItem('token');
        container.innerHTML = isLogged ? 
            `<a class="nav-btn-styled nav-btn-manage" href="/@manage" target="_blank">${icons.manage} 管理</a>` : 
            `<a class="nav-btn-styled nav-btn-login" href="javascript:void(0);" id="show-modal">${icons.login} 登录</a>`;

        if (!isLogged) {
            const modal = document.getElementById('login-modal');
            const showBtn = document.getElementById('show-modal');
            const closeBtn = document.querySelector('.modal-close-btn');
            const msg = document.getElementById('msg-box');
            
            showBtn.onclick = () => {
                modal.classList.add('active');
                if (window.turnstile && !tId) {
                    try { tId = turnstile.render('#cf-widget', { sitekey: CONFIG.CF_SITE_KEY, theme: 'light', callback: () => { msg.textContent = "" } }); } catch(e){}
                }
            };
            const close = () => { modal.classList.remove('active'); if(tId) turnstile.reset(tId); };
            closeBtn.onclick = close;
            modal.onclick = (e) => { if (e.target === modal) close(); };

            document.getElementById('login-form').onsubmit = (e) => {
                e.preventDefault();
                const u = document.getElementById('u-in').value;
                const p = document.getElementById('p-in').value;
                let token = "";
                if (window.turnstile) token = turnstile.getResponse(tId);
                if (!token) { msg.textContent = "请点击人机验证"; msg.className = "login-message error"; return; }
                
                document.querySelector('.login-submit-btn').textContent = "登录中...";
                fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'cf-turnstile-response': token},
                    body: JSON.stringify({username: u, password: p})
                }).then(r=>r.json()).then(d => {
                    if(d.code===200){ 
                        msg.textContent="成功"; msg.className="login-message success"; localStorage.setItem('token', d.data.token);
                        setTimeout(() => location.reload(), 500);
                    } else { throw new Error('错误'); }
                }).catch(() => {
                    msg.textContent = "账号或密码错误"; msg.className = "login-message error";
                    document.querySelector('.login-submit-btn').textContent = "登录";
                    if(tId) turnstile.reset(tId);
                });
            };
        }
    }

    const init = () => {
        let count = 0;
        const t = setInterval(() => {
            count++;
            const header = document.querySelector('.header-right') || document.querySelector('.right') || document.querySelector('.nav-right');
            if (header) { clearInterval(t); setupAuthUI(header, false); }
            else if (count > 20) { clearInterval(t); setupAuthUI(document.body, true); }
        }, 300);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
