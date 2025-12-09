// --- START OF FILE openlist-login-modal-pro.js ---

(() => {
    // --- 1. SVG 图标定义 (内嵌以保证无需外部字体库也能显示) ---
    const icons = {
        user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        lock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        manage: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        login: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>`
    };

    // --- 2. 现代简约 CSS ---
    const modalCSS = `
        /* 引入字体 (可选，这里使用系统字体栈以保持极速) */
        .ol-auth-wrapper {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        /* 遮罩层：磨砂玻璃背景 */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.4); 
            backdrop-filter: blur(8px); /* 核心：背景模糊 */
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            justify-content: center; align-items: center; 
            z-index: 99999;
            opacity: 0; visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* 显示状态 */
        .modal-overlay.active {
            opacity: 1; visibility: visible;
        }

        /* 弹窗主体：白透玻璃质感 */
        .modal-content {
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.5);
            padding: 40px 35px; 
            border-radius: 20px;
            width: 90%; max-width: 380px; 
            position: relative;
            box-shadow: 0 20px 50px rgba(0,0,0,0.15); 
            color: #333;
            transform: scale(0.95) translateY(10px);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        /* 弹窗激活时的动画 */
        .modal-overlay.active .modal-content {
            transform: scale(1) translateY(0);
        }
        
        /* 错误时的抖动动画 */
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        /* 关闭按钮 */
        .modal-close-btn {
            position: absolute; top: 15px; right: 15px; 
            width: 30px; height: 30px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%;
            cursor: pointer; color: #999;
            transition: all 0.2s ease;
        }
        .modal-close-btn:hover { background: rgba(0,0,0,0.05); color: #333; }
        .modal-close-btn svg { width: 20px; height: 20px; }

        /* 标题 */
        .modal-content h3 { 
            margin: 0 0 30px; 
            text-align: center; 
            font-size: 24px; 
            font-weight: 600; 
            letter-spacing: 1px;
            background: linear-gradient(135deg, #409EFF 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* 输入框容器 */
        .form-group { position: relative; margin-bottom: 20px; }
        
        /* 输入框图标 */
        .form-icon {
            position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
            color: #aaa; transition: color 0.3s;
            width: 18px; height: 18px;
        }
        .form-icon svg { width: 100%; height: 100%; }

        /* 输入框本体 */
        .form-group input { 
            width: 100%; padding: 14px 15px 14px 45px; 
            border: 2px solid transparent; 
            border-radius: 12px; 
            background: #f3f5f7;
            font-size: 15px; outline: none;
            transition: all 0.3s ease;
            box-sizing: border-box;
            color: #333;
        }
        .form-group input:focus {
            background: #fff;
            border-color: #409EFF;
            box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.1);
        }
        .form-group input:focus + .form-icon { color: #409EFF; }

        /* 登录按钮 */
        .login-submit-btn {
            width: 100%; padding: 14px; border: none; border-radius: 12px;
            background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
            color: white; font-size: 16px; font-weight: 600;
            cursor: pointer; margin-top: 10px;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
        }
        .login-submit-btn:hover { 
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
        }
        .login-submit-btn:active { transform: translateY(0); }

        /* 消息提示 */
        .login-message { 
            margin-top: 20px; text-align: center; font-size: 13px; 
            min-height: 18px; opacity: 0; transition: opacity 0.3s;
        }
        .login-message.show { opacity: 1; }
        .login-message.success { color: #2ecc71; }
        .login-message.error { color: #e74c3c; }

        /* --- 导航栏按钮美化 --- */
        .nav-btn-styled {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 6px 16px; border-radius: 20px;
            font-size: 14px; font-weight: 500;
            text-decoration: none !important;
            transition: all 0.3s ease;
            border: 1px solid transparent;
        }
        
        .nav-btn-login {
            background: rgba(64, 158, 255, 0.1);
            color: #409EFF !important;
        }
        .nav-btn-login:hover {
            background: rgba(64, 158, 255, 0.2);
            transform: translateY(-1px);
        }

        .nav-btn-manage {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            box-shadow: 0 2px 8px rgba(118, 75, 162, 0.3);
        }
        .nav-btn-manage:hover {
            box-shadow: 0 4px 12px rgba(118, 75, 162, 0.5);
            transform: translateY(-1px);
        }
        .nav-btn-styled svg { width: 16px; height: 16px; }
    `;

    // --- 3. HTML 结构 ---
    const modalHTML = `
        <div id="login-modal" class="modal-overlay ol-auth-wrapper">
            <div class="modal-content" id="modal-card">
                <div class="modal-close-btn">${icons.close}</div>
                <h3>Welcome Back</h3>
                <form id="login-form">
                    <div class="form-group">
                        <input type="text" id="username-input" placeholder="用户名" autocomplete="username" required>
                        <div class="form-icon">${icons.user}</div>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password-input" placeholder="密码" autocomplete="current-password" required>
                        <div class="form-icon">${icons.lock}</div>
                    </div>
                    <button type="submit" class="login-submit-btn">立即登录</button>
                    <p id="login-message" class="login-message"></p>
                </form>
            </div>
        </div>
    `;

    // --- 4. 注入 CSS 和 HTML ---
    const styleElement = document.createElement('style');
    styleElement.innerHTML = modalCSS;
    document.head.appendChild(styleElement);

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);


    // --- 5. 核心逻辑 ---
    function setupAuthUI() {
        // 目标容器：这里假设你的模板里有一个 id="auth-link-container" 的容器
        // 如果没有，会自动寻找 footer 或者 header 插入
        let authLinkContainer = document.getElementById('auth-link-container');
        
        // 容错处理：如果找不到容器，尝试找一个合适的地方插入
        if (!authLinkContainer) {
            const rightNav = document.querySelector('.header-right') || document.querySelector('.right') || document.body;
            authLinkContainer = document.createElement('div');
            authLinkContainer.id = 'auth-link-container';
            authLinkContainer.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 1000;"; // 默认悬浮在右下角作为保底
            rightNav.appendChild(authLinkContainer);
        }

        const isLoggedIn = localStorage.getItem('token');
        let linkHTML = '';

        if (isLoggedIn) {
            linkHTML = `
                <a class="nav-btn-styled nav-btn-manage" href="/@manage" target="_blank">
                    ${icons.manage} 管理面板
                </a>`;
        } else {
            linkHTML = `
                <a class="nav-btn-styled nav-btn-login" href="javascript:void(0);" id="show-login-modal-btn">
                    ${icons.login} 登录
                </a>`;
        }
        authLinkContainer.innerHTML = linkHTML;

        // 绑定事件
        if (!isLoggedIn) {
            const modal = document.getElementById('login-modal');
            const modalCard = document.getElementById('modal-card');
            const showBtn = document.getElementById('show-login-modal-btn');
            const closeBtn = document.querySelector('.modal-close-btn');
            const loginForm = document.getElementById('login-form');
            const messageEl = document.getElementById('login-message');
            const submitBtn = document.querySelector('.login-submit-btn');

            const openModal = () => {
                modal.classList.add('active');
                document.getElementById('username-input').focus();
            };

            const closeModal = () => {
                modal.classList.remove('active');
                messageEl.className = 'login-message'; // 重置消息
                messageEl.textContent = '';
            };

            showBtn.onclick = openModal;
            closeBtn.onclick = closeModal;
            
            // 点击遮罩层关闭
            modal.onclick = (event) => { if (event.target === modal) closeModal(); };

            loginForm.onsubmit = (e) => {
                e.preventDefault();
                const username = document.getElementById('username-input').value;
                const password = document.getElementById('password-input').value;
                
                // UI Loading State
                submitBtn.textContent = '验证中...';
                submitBtn.style.opacity = '0.7';
                messageEl.className = 'login-message';
                messageEl.textContent = '';

                fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username, password: password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200 && data.data.token) {
                        messageEl.textContent = '登录成功，正在跳转...';
                        messageEl.classList.add('show', 'success');
                        localStorage.setItem('token', data.data.token);
                        setTimeout(() => { location.reload(); }, 1000);
                    } else {
                        throw new Error(data.message || '账号或密码错误');
                    }
                })
                .catch(error => {
                    console.error('Login Error:', error);
                    messageEl.textContent = error.message || '登录失败，请重试';
                    messageEl.classList.add('show', 'error');
                    submitBtn.textContent = '立即登录';
                    submitBtn.style.opacity = '1';
                    
                    // 触发错误抖动动画
                    modalCard.classList.remove('shake');
                    void modalCard.offsetWidth; // 强制重绘
                    modalCard.classList.add('shake');
                });
            };
        }
    }

    // --- 6. 智能加载检测 ---
    const init = () => {
        // 尝试寻找挂载点，最多尝试 10 次，每次间隔 300ms
        let attempts = 0;
        const interval = setInterval(() => {
            const container = document.getElementById('auth-link-container') || document.querySelector(".footer") || document.body;
            if (container) {
                clearInterval(interval);
                setupAuthUI();
            } else {
                attempts++;
                if (attempts > 10) { // 超时强制加载
                    clearInterval(interval);
                    setupAuthUI(); 
                }
            }
        }, 300);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
