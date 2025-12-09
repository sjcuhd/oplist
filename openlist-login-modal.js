// --- START OF FILE openlist-login-modal-secure.js ---

(() => {
    // --- 1. SVG 图标 (保持原样，无需修改) ---
    const icons = {
        user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        lock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        manage: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        login: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>`
    };

    // --- 2. 样式定义 (毛玻璃 + 高端动效) ---
    const modalCSS = `
        .ol-auth-wrapper {
            font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif; /* 优先使用中文安全字体 */
        }

        /* 遮罩层：高斯模糊 */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.35); 
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            justify-content: center; align-items: center; 
            z-index: 99999;
            opacity: 0; visibility: hidden;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .modal-overlay.active { opacity: 1; visibility: visible; }

        /* 弹窗卡片：磨砂玻璃质感 */
        .modal-content {
            background: rgba(255, 255, 255, 0.88);
            border: 1px solid rgba(255, 255, 255, 0.6);
            padding: 40px 35px; 
            border-radius: 24px;
            width: 85%; max-width: 360px; 
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); 
            color: #333;
            transform: scale(0.92) translateY(15px);
            transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .modal-overlay.active .modal-content { transform: scale(1) translateY(0); }
        
        /* 错误震动动画 */
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        /* 关闭按钮 */
        .modal-close-btn {
            position: absolute; top: 18px; right: 18px; 
            width: 32px; height: 32px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%;
            cursor: pointer; color: #a0a0a0;
            transition: all 0.2s;
        }
        .modal-close-btn:hover { background: rgba(0,0,0,0.06); color: #333; transform: rotate(90deg); }
        .modal-close-btn svg { width: 20px; height: 20px; }

        /* 标题样式 */
        .modal-content h3 { 
            margin: 5px 0 30px; 
            text-align: center; 
            font-size: 24px; 
            font-weight: 600; 
            letter-spacing: 2px;
            color: #2c3e50;
            background: linear-gradient(120deg, #409EFF, #6c5ce7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* 表单元素 */
        .form-group { position: relative; margin-bottom: 22px; }
        
        .form-icon {
            position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
            color: #b0b0b0; transition: color 0.3s;
            width: 18px; height: 18px; pointer-events: none;
        }
        .form-icon svg { width: 100%; height: 100%; }

        .form-group input { 
            width: 100%; padding: 14px 15px 14px 48px; 
            border: 2px solid transparent; 
            border-radius: 14px; 
            background: #f0f2f5;
            font-size: 15px; outline: none;
            transition: all 0.3s ease;
            box-sizing: border-box; color: #333;
        }
        .form-group input::placeholder { color: #bbb; }
        .form-group input:focus {
            background: #fff;
            border-color: #409EFF;
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
        }
        .form-group input:focus + .form-icon { color: #409EFF; }

        /* 登录按钮 */
        .login-submit-btn {
            width: 100%; padding: 15px; border: none; border-radius: 14px;
            background: linear-gradient(135deg, #409EFF 0%, #6c5ce7 100%);
            color: white; font-size: 16px; font-weight: 600; letter-spacing: 1px;
            cursor: pointer; margin-top: 12px;
            transition: all 0.2s;
            box-shadow: 0 8px 20px -6px rgba(108, 92, 231, 0.4);
        }
        .login-submit-btn:hover { 
            transform: translateY(-2px);
            box-shadow: 0 12px 25px -8px rgba(108, 92, 231, 0.5);
        }
        .login-submit-btn:active { transform: translateY(1px); }

        /* 消息提示区 */
        .login-message { 
            margin-top: 20px; text-align: center; font-size: 13px; 
            min-height: 20px; opacity: 0; transition: opacity 0.3s;
            font-weight: 500;
        }
        .login-message.show { opacity: 1; }
        .login-message.success { color: #00b894; }
        .login-message.error { color: #ff7675; }

        /* --- 触发按钮样式 --- */
        .nav-btn-styled {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 8px 20px; border-radius: 30px;
            font-size: 14px; font-weight: 500;
            text-decoration: none !important;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .nav-btn-login {
            background: white;
            color: #409EFF !important;
            border: 1px solid rgba(64, 158, 255, 0.2);
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .nav-btn-login:hover {
            border-color: #409EFF;
            background: rgba(64, 158, 255, 0.05);
            transform: translateY(-1px);
        }

        .nav-btn-manage {
            background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
            color: white !important;
            box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
            border: none;
        }
        .nav-btn-manage:hover {
            box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4);
            transform: translateY(-1px);
        }
        .nav-btn-styled svg { width: 16px; height: 16px; }
    `;

    // --- 3. HTML 结构 (修改为全中文) ---
    const modalHTML = `
        <div id="login-modal" class="modal-overlay ol-auth-wrapper">
            <div class="modal-content" id="modal-card">
                <div class="modal-close-btn" title="关闭">${icons.close}</div>
                <h3>欢迎登录</h3>
                <form id="login-form">
                    <div class="form-group">
                        <input type="text" id="username-input" placeholder="请输入用户名" autocomplete="username" required>
                        <div class="form-icon">${icons.user}</div>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password-input" placeholder="请输入密码" autocomplete="current-password" required>
                        <div class="form-icon">${icons.lock}</div>
                    </div>
                    <button type="submit" class="login-submit-btn">立即登录</button>
                    <p id="login-message" class="login-message"></p>
                </form>
            </div>
        </div>
    `;

    // --- 4. 注入样式和HTML ---
    const styleElement = document.createElement('style');
    styleElement.innerHTML = modalCSS;
    document.head.appendChild(styleElement);

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // --- 5. 交互逻辑 ---
    function setupAuthUI() {
        let authLinkContainer = document.getElementById('auth-link-container');
        
        // 自动寻找挂载点 (保底方案)
        if (!authLinkContainer) {
            const possibleParents = [
                document.querySelector('.header-right'),
                document.querySelector('.right'),
                document.querySelector('.nav-right'),
                document.body
            ];
            const parent = possibleParents.find(p => p !== null);
            
            authLinkContainer = document.createElement('div');
            authLinkContainer.id = 'auth-link-container';
            // 如果是挂载在 body 上，给一个右下角悬浮定位
            if (parent === document.body) {
                authLinkContainer.style.cssText = "position: fixed; bottom: 25px; right: 25px; z-index: 1000;";
            }
            parent.appendChild(authLinkContainer);
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
                setTimeout(() => document.getElementById('username-input').focus(), 100);
            };

            const closeModal = () => {
                modal.classList.remove('active');
                messageEl.className = 'login-message'; 
                messageEl.textContent = '';
                submitBtn.textContent = '立即登录';
                submitBtn.style.opacity = '1';
            };

            if(showBtn) showBtn.onclick = openModal;
            closeBtn.onclick = closeModal;
            modal.onclick = (event) => { if (event.target === modal) closeModal(); };

            loginForm.onsubmit = (e) => {
                e.preventDefault();
                const username = document.getElementById('username-input').value;
                const password = document.getElementById('password-input').value;
                
                // Loading 状态
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
                        // ❌ 安全处理：统一抛出模糊错误，不透传后端具体的 "User not found"
                        throw new Error('用户名或密码错误');
                    }
                })
                .catch(error => {
                    console.error('Login Error:', error); // 控制台保留真实错误以便调试
                    
                    // 界面上只显示通用错误，或网络错误
                    const displayMsg = error.message === '用户名或密码错误' ? error.message : '网络请求失败';
                    
                    messageEl.textContent = displayMsg;
                    messageEl.classList.add('show', 'error');
                    submitBtn.textContent = '重试';
                    submitBtn.style.opacity = '1';
                    
                    // 触发抖动动画
                    modalCard.classList.remove('shake');
                    void modalCard.offsetWidth; 
                    modalCard.classList.add('shake');
                });
            };
        }
    }

    // --- 6. 启动器 ---
    const init = () => {
        let attempts = 0;
        const interval = setInterval(() => {
            // 尝试检测常见的容器
            const container = document.getElementById('auth-link-container') || document.body;
            if (container) {
                clearInterval(interval);
                setupAuthUI();
            } else {
                attempts++;
                if (attempts > 15) { 
                    clearInterval(interval);
                    setupAuthUI(); // 强制加载
                }
            }
        }, 200);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
