// --- START OF FILE auth_v4.js ---
(() => {
    "use strict";
    console.log("[OpenList] Modern Login UI 启动...");

    const CONFIG = {
        // 登录成功后是否新开窗口跳转管理页？(false = 刷新当前页)
        REDIRECT_TO_MANAGE: false
    };

    // ============================================================
    // 1. 图标库 (使用反引号包裹 SVG，清晰且不易报错)
    // ============================================================
    const icons = {
        user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#409EFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,

        lock: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#409EFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,

        close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,

        login_btn: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,

        manage_btn: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1 2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
    };

    // ============================================================
    // 2. 美化样式 (Modern Clean UI)
    // ============================================================
    const css = `
        /* 字体跟随系统或 OpenList 默认 */
        .ol-auth-wrapper { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        
        /* 遮罩层：高斯模糊 + 渐变 */
        .modal-overlay { 
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(255, 255, 255, 0.4); 
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            display: flex; align-items: center; justify-content: center; 
            z-index: 2147483647; 
            opacity: 0; visibility: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .modal-overlay.active { opacity: 1; visibility: visible; }

        /* 弹窗主体：白底、圆角、阴影 */
        .modal-content { 
            background: #ffffff; 
            padding: 40px 35px; 
            border-radius: 24px; 
            width: 90%; max-width: 380px; 
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05); 
            position: relative; text-align: center; 
            transform: scale(0.95) translateY(10px); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }
        .modal-overlay.active .modal-content { transform: scale(1) translateY(0); }

        /* 错误震动动画 */
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }

        /* 关闭按钮 */
        .close-icon { 
            position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; 
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; border-radius: 50%; transition: 0.2s; background: #f5f7fa; 
        }
        .close-icon:hover { background: #eef1f6; transform: rotate(90deg); }

        /* 标题 */
        .modal-title { margin-bottom: 30px; color: #333; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }

        /* 输入框容器 */
        .form-group { position: relative; margin-bottom: 20px; }
        .input-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); opacity: 0.8; }
        
        /* 输入框样式 */
        .form-group input { 
            width: 100%; padding: 15px 15px 15px 50px; 
            border: 2px solid transparent; 
            background: #f5f7fa; 
            border-radius: 16px; 
            box-sizing: border-box; 
            font-size: 15px; color: #333; outline: none; transition: 0.3s; 
        }
        .form-group input::placeholder { color: #aab2bd; }
        .form-group input:focus { background: #fff; border-color: #409EFF; box-shadow: 0 4px 15px rgba(64,158,255,0.15); }

        /* 登录按钮 */
        .btn { 
            width: 100%; padding: 15px; 
            background: #409EFF; /* Alist 蓝 */
            color: white; border: none; border-radius: 16px; 
            cursor: pointer; font-size: 16px; font-weight: 600; letter-spacing: 1px;
            margin-top: 15px; transition: 0.3s; 
            box-shadow: 0 8px 20px -5px rgba(64, 158, 255, 0.4); 
        }
        .btn:hover { background: #66b1ff; transform: translateY(-2px); box-shadow: 0 12px 25px -5px rgba(64, 158, 255, 0.5); }
        .btn:active { transform: scale(0.98); }
        .btn:disabled { background: #a0cfff; cursor: not-allowed; transform: none; }

        /* 消息提示 */
        .msg { margin-top: 15px; font-size: 13px; font-weight: 500; min-height: 20px; opacity: 0; transition: 0.3s; }
        .msg.show { opacity: 1; }
        .msg.err { color: #f56c6c; } .msg.ok { color: #67c23a; }

        /* 触发按钮 (右下角/导航栏) */
        .nav-btn { 
            display: inline-flex; align-items: center; gap: 8px; 
            padding: 8px 20px; 
            background: white; 
            border: 1px solid #e4e7ed; 
            border-radius: 30px; 
            cursor: pointer; 
            text-decoration: none !important; 
            font-size: 14px; font-weight: 600; color: #409EFF; 
            box-shadow: 0 2px 12px rgba(0,0,0,0.05); 
            transition: all 0.3s; 
        }
        .nav-btn:hover { border-color: #409EFF; background: #ecf5ff; transform: translateY(-2px); }
        .nav-btn.manage { background: #409EFF; color: white; border-color: #409EFF; }
        .nav-btn.manage:hover { background: #66b1ff; }
        
        /* 兜底悬浮样式 */
        #auth-container.fixed-fallback { position: fixed; bottom: 30px; right: 30px; z-index: 2147483647; }
    `;
    const st = document.createElement('style'); st.innerHTML = css; document.head.appendChild(st);

    // ============================================================
    // 3. 构建 HTML (已移除验证码区域)
    // ============================================================
    const html = `
        <div id="login-modal" class="modal-overlay ol-auth-wrapper">
            <div class="modal-content">
                <div class="close-icon" id="close-btn" title="关闭">${icons.close}</div>
                <h3 class="modal-title">账号登录</h3>
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
    const d = document.createElement('div'); d.innerHTML = html; document.body.appendChild(d.firstElementChild);

    // ============================================================
    // 4. 核心逻辑 (已移除 Turnstile 相关验证)
    // ============================================================

    function mount() {
        const box = document.getElementById('auth-link-container');
        if (!box) return; // 如果找不到自定义内容里的容器，就不执行

        const isLogged = localStorage.getItem('token');

        // 渲染触发按钮
        box.innerHTML = isLogged ?
            `<a href="/@manage" target="_blank" class="nav-btn manage">${icons.manage_btn} 管理面板</a>` :
            `<a href="javascript:;" id="open-btn" class="nav-btn">${icons.login_btn} 登录</a>`;

        if (!isLogged) {
            const m = document.getElementById('login-modal');
            const msg = document.getElementById('msg');
            const btn = document.getElementById('s-btn');
            const content = document.querySelector('.modal-content');

            // 打开弹窗
            document.getElementById('open-btn').onclick = () => {
                m.classList.add('active');
                setTimeout(() => document.getElementById('u').focus(), 100);
            };

            // 关闭弹窗
            const close = () => { m.classList.remove('active'); };
            document.getElementById('close-btn').onclick = close;
            m.onclick = (e) => { if (e.target === m) close(); };

            // 提交登录 (已移除验证码校验)
            document.getElementById('l-form').onsubmit = (e) => {
                e.preventDefault();

                // UI Loading
                btn.textContent = "登录中...";
                btn.disabled = true;
                msg.classList.remove('show');

                // 发起请求
                fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: document.getElementById('u').value,
                        password: document.getElementById('p').value
                    })
                }).键，然后(r => r.json()).键，然后(res => {
                    if (res.code === 200) {
                        msg.textContent = "登录成功，正在跳转...";
                        msg.className = "msg ok show";
                        localStorage.setItem('token', res.data.token);
                        setTimeout(() => {
                            if (CONFIG.REDIRECT_TO_MANAGE) window.open('/@manage', '_blank');
                            location.reload();
                        }, 800);
                    } else {
                        throw new 错误('鉴权失败');
                    }
                }).catch(() => {
                    msg.textContent = "用户名或密码错误";
                    msg.className = "msg err show";
                    btn.textContent = "重试";
                    btn.disabled = false;

                    // 错误抖动
                    content.classList.remove('shake');
                    void content.offsetWidth;
                    content.classList.add('shake');
                });
            };
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
