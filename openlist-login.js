// --- START OF FILE openlist-login-modal-secure-v2.1.js ---

(() => {
    // ================= 配置区 =================
    const CONFIG = {
        // 🔴 请在此处填入你的 Cloudflare Turnstile Site Key
        CF_SITE_KEY: "0x4AAAAAACF_A19hKThLxuLh", 
        // 登录成功后是否强制跳转管理页？ true: 跳转 /@manage, false: 刷新当前页
        REDIRECT_TO_MANAGE: false 
    };

    // ================= 1. SVG 图标 =================
    const icons = {
        user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        lock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        // 修复：将末尾的中文逗号改为英文逗号
        manage: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`，
        login: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>`
    };

    // ================= 2. 动态加载 Turnstile SDK =================
    const loadTurnstile = () => {
        if (document.getElementById('cf-turnstile-script')) return;
        const script = document.createElement('script');
        script.id = 'cf-turnstile-script';
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script。defer = true;
        // 修复：将中文句号改为英文点号
        document.head.appendChild(script);
    };
    loadTurnstile(); // 预加载

    // ================= 3. 样式定义 =================
    const modalCSS = `
        .ol-auth-wrapper { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.4); 
            backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            display: flex; justify-content: center; align-items: center; 
            z-index: 99999; opacity: 0; visibility: hidden;
            transition: all 0.3s ease;
        }
        .modal-overlay.active { opacity: 1; visibility: visible; }
        .modal-content {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.8);
            padding: 30px; border-radius: 20px;
            width: 90%; max-width: 350px; position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
            transform: scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .modal-overlay.active .modal-content { transform: scale(1); }
        .shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 30%, 70% { transform: translate3d(-3px, 0, 0); } 50% { transform: translate3d(3px, 0, 0); } }
        .modal-close-btn {
            position: absolute; top: 15px; right: 15px; width: 30px; height: 30px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%; cursor: pointer; color: #999; transition: 0.2s;
        }
        .modal-close-btn:hover { background: #f0f0f0; color: #333; }
        .modal-content h3 { margin: 0 0 25px; text-align: center; color: #333; font-size: 22px; }
        .form-group { position: relative; margin-bottom: 20px; }
        .form-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa; width: 18px; height: 18px; }
        .form-group input { 
            width: 100%; padding: 12px 15px 12px 45px; 
            border: 2px solid #eee; border-radius: 10px; 
            font-size: 15px; outline: none; transition: 0.3s; box-sizing: border-box;
        }
        .form-group input:focus { border-color: #409EFF; background: #fff; }
        
        /* Turnstile 容器样式 */
        .cf-turnstile-container {
            margin-bottom: 15px; display: flex; justify-content: center; min-height: 65px;
        }

        .login-submit-btn {
            width: 100%; padding: 12px; border: none; border-radius: 10px;
            background: linear-gradient(135deg, #409EFF, #66b1ff);
            color: white; font-size: 16px; font-weight: 600; cursor: pointer;
            transition: 0.2s;
            box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
        }
        .login-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4); }
        .login-message { margin-top: 15px; text-align: center; font-size: 13px; min-height: 18px; }
        .login-message.error { color: #f56c6c; }
        .login-message.success { color: #67c23a; }
        
        /* 按钮样式 */
        .nav-btn-styled {
            display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px;
            border-radius: 20px; font-size: 14px; text-decoration: none !important; cursor: pointer;
        }
        .nav-btn-login { background: #fff; color: #409EFF; border: 1px solid #c6e2ff; }
        .nav-btn-manage { background: #6c5ce7; color: white; border: none; }
        .nav-btn-styled svg { width: 16px; height: 16px; }
    `;

    // ================= 4. 构建 HTML =================
    const styleElement = document.createElement('style');
    styleElement.innerHTML = modalCSS;
    document.head.appendChild(styleElement);

    const modalHTML = `
        <div id="login-modal" class="modal-overlay ol-auth-wrapper">
            <div class="modal-content" id="modal-card">
                <div class="modal-close-btn">${icons.close}</div>
                <h3>身份验证</h3>
                <form id="login-form">
                    <div class="form-group">
                        <input type="text" id="username-input" placeholder="用户名" required>
                        <div class="form-icon">${icons.user}</div>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password-input" placeholder="密码" required>
                        <div class="form-icon">${icons.lock}</div>
                    </div>
                    <!-- Turnstile 挂载点 -->
                    <div class="cf-turnstile-container" id="cf-turnstile-widget"></div>
                    
                    <button type="submit" class="login-submit-btn">登录</button>
                    <p id="login-message" class="login-message"></p>
                </form>
            </div>
        </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // ================= 5. 核心逻辑 =================
    let turnstileWidgetId = null;

    function setupAuthUI() {
        let authLinkContainer = document.getElementById('auth-link-container');
        if (!authLinkContainer) {
            // 尝试智能定位
            const parents = [
                document.querySelector('.header-right'),
                document.querySelector('.right'), 
                document.querySelector('.nav-right')
            ];
            const parent = parents.find(p => p !== null) || document.body;
            
            authLinkContainer = document.createElement('div');
            authLinkContainer.id = 'auth-link-container';
            if (parent === document.body) {
                authLinkContainer.style.cssText = "position: fixed; bottom: 25px; right: 25px; z-index: 1000;";
            }
            parent.appendChild(authLinkContainer);
        }

        const isLoggedIn = localStorage.getItem('token');

        if (isLoggedIn) {
            authLinkContainer.innerHTML = `
                <a class="nav-btn-styled nav-btn-manage" href="/@manage" target="_blank">
                    ${icons.manage} 管理
                </a>`;
        } else {
            authLinkContainer.innerHTML = `
                <a class="nav-btn-styled nav-btn-login" href="javascript:void(0);" id="show-login-modal-btn">
                    ${icons.login} 登录
                </a>`;
            
            // 绑定事件
            const modal = document.getElementById('login-modal');
            const showBtn = document.getElementById('show-login-modal-btn');
            const closeBtn = document.querySelector('.modal-close-btn');
            const loginForm = document.getElementById('login-form');
            const messageEl = document.getElementById('login-message');
            const submitBtn = document.querySelector('.login-submit-btn');

            // 渲染验证码
            const renderTurnstile = () => {
                if (window.turnstile && !turnstileWidgetId) {
                    try {
                        turnstileWidgetId = turnstile.render('#cf-turnstile-widget', {
                            sitekey: CONFIG.CF_SITE_KEY,
                            theme: 'light',
                            appearance: 'always', // 强制显示，防止无感验证导致的高度抖动
                            callback: function(token) {
                                messageEl.textContent = ""; // 清除错误提示
                            }
                        });
                    } catch (e) { console.log('Turnstile render error', e); }
                }
            };

            const openModal = () => {
                modal.classList.add('active');
                setTimeout(() => document.getElementById('username-input').focus(), 100);
                renderTurnstile(); // 打开时尝试渲染
            };

            const closeModal = () => {
                modal.classList.remove('active');
                messageEl.textContent = '';
                // 每次关闭重置验证码，防止 token 过期
                if (window.turnstile && turnstileWidgetId) {
                    turnstile.reset(turnstileWidgetId);
                }
            };

            showBtn.onclick = openModal;
            closeBtn.onclick = closeModal;
            modal.onclick = (e) => { if(e.target === modal) closeModal(); };

            loginForm.onsubmit = (e) => {
                e.preventDefault();
                
                const username = document.getElementById('username-input').value;
                const password = document.getElementById('password-input').value;
                
                // --- 校验验证码 ---
                let cfToken = "";
                if (window.turnstile) {
                    cfToken = turnstile.getResponse(turnstileWidgetId);
                    if (!cfToken) {
                        messageEl.textContent = "请完成人机验证";
                        messageEl.className = 'login-message error';
                        document.querySelector('.shake')?.classList.remove('shake');
                        setTimeout(()=> document.getElementById('modal-card').classList.add('shake'), 10);
                        return;
                    }
                }

                submitBtn.textContent = '验证中...';
                submitBtn.disabled = true;
                
                // 发送请求
                fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        // 将 Token 放在 Header 里传给可能的 Worker 中间件
                        'cf-turnstile-response': cfToken 
                    },
                    body: JSON.stringify({ username, password })
                })
                .then(r => r.json())
                .then(data => {
                    if (data.code === 200 && data.data.token) {
                        messageEl.textContent = '登录成功';
                        messageEl.className = 'login-message success';
                        localStorage.setItem('token', data.data.token);
                        setTimeout(() => { 
                            if(CONFIG.REDIRECT_TO_MANAGE) window.open('/@manage', '_blank');
                            location.reload(); 
                        }, 800);
                    } else {
                        throw new Error('用户名或密码错误');
                    }
                })
                .catch(err => {
                    messageEl.textContent = err.message || '登录失败';
                    messageEl.className = 'login-message error';
                    submitBtn.textContent = '登录';
                    submitBtn.disabled = false;
                    // 登录失败刷新验证码
                    if (window.turnstile) turnstile.reset(turnstileWidgetId);
                    
                    const card = document.getElementById('modal-card');
                    card.classList.remove('shake');
                    void card.offsetWidth; card.classList.add('shake');
                });
            };
        }
    }

    // ================= 6. 初始化 =================
    const init = () => {
        let attempts = 0;
        const timer = setInterval(() => {
            if (document.getElementById('auth-link-container') || document.body || attempts > 20) {
                clearInterval(timer);
                setupAuthUI();
            }
            attempts++;
        }, 100);
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
