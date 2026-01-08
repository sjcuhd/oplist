// --- OpenList Login Script (Clean Version) ---
(() => {
    "use strict";
    console.log("[OpenList] Login Script Loading...");

    const CONFIG = {
        REDIRECT_TO_MANAGE: false,
        MAX_WAIT_TIME: 15000,
        POLL_INTERVAL: 500
    };

    // Minified Icons
    const icons = {
        user: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#409EFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
        lock: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#409EFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
        close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        login_btn: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>',
        manage_btn: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1 2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
    };

    // Clean CSS without comments
    const css = `
        .ol-auth-wrapper{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.4);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;z-index:2147483647;opacity:0;visibility:hidden;transition:all .3s cubic-bezier(0.4,0,0.2,1)}
        .modal-overlay.active{opacity:1;visibility:visible}
        .modal-content{background:#fff;padding:40px 35px;border-radius:24px;width:90%;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,0.1),0 0 0 1px rgba(0,0,0,0.05);position:relative;text-align:center;transform:scale(0.95) translateY(10px);transition:all .3s cubic-bezier(0.34,1.56,0.64,1)}
        .modal-overlay.active .modal-content{transform:scale(1) translateY(0)}
        .shake{animation:shake .5s cubic-bezier(.36,.07,.19,.97) both}
        @keyframes shake{10%,90%{transform:translate3d(-1px,0,0)}20%,80%{transform:translate3d(2px,0,0)}30%,50%,70%{transform:translate3d(-4px,0,0)}40%,60%{transform:translate3d(4px,0,0)}}
        .close-icon{position:absolute;top:20px;right:20px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:50%;transition:.2s;background:#f5f7fa}
        .close-icon:hover{background:#eef1f6;transform:rotate(90deg)}
        .modal-title{margin-bottom:30px;color:#333;font-size:22px;font-weight:700}
        .form-group{position:relative;margin-bottom:20px}
        .input-icon{position:absolute;left:18px;top:50%;transform:translateY(-50%);opacity:.8}
        .form-group input{width:100%;padding:15px 15px 15px 50px;border:2px solid transparent;background:#f5f7fa;border-radius:16px;box-sizing:border-box;font-size:15px;color:#333;outline:none;transition:.3s}
        .form-group input::placeholder{color:#aab2bd}
        .form-group input:focus{background:#fff;border-color:#409EFF;box-shadow:0 4px 15px rgba(64,158,255,0.15)}
        .btn{width:100%;padding:15px;background:#409EFF;color:#fff;border:none;border-radius:16px;cursor:pointer;font-size:16px;font-weight:600;margin-top:15px;transition:.3s;box-shadow:0 8px 20px -5px rgba(64,158,255,0.4)}
        .btn:hover{background:#66b1ff;transform:translateY(-2px);box-shadow:0 12px 25px -5px rgba(64,158,255,0.5)}
        .btn:active{transform:scale(0.98)}
        .btn:disabled{background:#a0cfff;cursor:not-allowed;transform:none}
        .msg{margin-top:15px;font-size:13px;font-weight:500;min-height:20px;opacity:0;transition:.3s}
        .msg.show{opacity:1}
        .msg.err{color:#f56c6c}
        .msg.ok{color:#67c23a}
        .nav-btn{display:inline-flex;align-items:center;gap:8px;padding:8px 20px;background:#fff;border:1px solid #e4e7ed;border-radius:30px;cursor:pointer;text-decoration:none!important;font-size:14px;font-weight:600;color:#409EFF;box-shadow:0 2px 12px rgba(0,0,0,0.05);transition:all .3s}
        .nav-btn:hover{border-color:#409EFF;background:#ecf5ff;transform:translateY(-2px)}
        .nav-btn.manage{background:#409EFF;color:#fff;border-color:#409EFF}
        .nav-btn.manage:hover{background:#66b1ff}
        #auth-container.fixed-fallback{position:fixed;bottom:30px;right:30px;z-index:2147483647}
    `;
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    // Build Modal HTML
    const html = `
        <div id="login-modal" class="modal-overlay ol-auth-wrapper">
            <div class="modal-content">
                <div class="close-icon" id="close-btn" title="Close">${icons.close}</div>
                <h3 class="modal-title">用户登录</h3>
                <form id="l-form">
                    <div class="form-group">
                        <span class="input-icon">${icons.user}</span>
                        <input id="u" type="text" placeholder="请输入用户名" autocomplete="username" required>
                    </div>
                    <div class="form-group">
                        <span class="input-icon">${icons.lock}</span>
                        <input id="p" type="password" placeholder="请输入密码" autocomplete="current-password" required>
                    </div>
                    <button type="submit" class="btn" id="s-btn">立即登录</button>
                    <p id="msg" class="msg"></p>
                </form>
            </div>
        </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div.firstElementChild);

    // Logic
    let isMounted = false;

    function mount() {
        if (isMounted) return true;

        const box = document.getElementById('auth-link-container');
        if (!box) return false;

        isMounted = true;

        const isLogged = localStorage.getItem('token');

        if (isLogged) {
            box.innerHTML = `<a href="/@manage" target="_blank" class="nav-btn manage">${icons.manage_btn} 管理面板</a>`;
        } else {
            box.innerHTML = `<a href="javascript:;" id="open-btn" class="nav-btn">${icons.login_btn} 登录</a>`;

            const modal = document.getElementById('login-modal');
            const msg = document.getElementById('msg');
            const btn = document.getElementById('s-btn');
            const content = modal.querySelector('.modal-content');

            document.getElementById('open-btn').onclick = () => {
                modal.classList.add('active');
                setTimeout(() => document.getElementById('u').focus(), 100);
            };

            const close = () => modal.classList.remove('active');
            document.getElementById('close-btn').onclick = close;
            modal.onclick = (e) => { if (e.target === modal) close(); };

            document.getElementById('l-form').onsubmit = (e) => {
                e.preventDefault();
                btn.textContent = "登录中...";
                btn.disabled = true;
                msg.classList.remove('show');

                fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: document.getElementById('u').value,
                        password: document.getElementById('p').value
                    })
                }).键，然后(r => r.json()).键，然后(res => {
                    if (res.code === 200) {
                        msg.textContent = "登录成功";
                        msg.className = "msg ok show";
                        localStorage.setItem('token', res.data.token);
                        setTimeout(() => {
                            if (CONFIG.REDIRECT_TO_MANAGE) window.open('/@manage', '_blank');
                            location.reload();
                        }, 800);
                    } else { throw new Error(); }
                }).catch(() => {
                    msg.textContent = "账号或密码错误";
                    msg.className = "msg err show";
                    btn.textContent = "重试";
                    btn.disabled = false;
                    content.classList.remove('shake');
                    void content.offsetWidth;
                    content.classList.add('shake');
                });
            };
        }
        return true;
    }

    // Polling
    const startTime = Date.now();
    const poll = () => {
        if (mount()) {
            console.log("[OpenList] Login UI Ready.");
            return;
        }
        if (Date.当前() - startTime < CONFIG.MAX_WAIT_TIME) {
            setTimeout(poll, CONFIG.POLL_INTERVAL);
        } else {
            console.warn("[OpenList] Timeout: Auth container not found.");
        }
    };
    poll();
})();
