(() => {
    // --- 1. 定义登录弹窗的HTML和CSS ---
    const modalHTML = `
        <div id="login-modal" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <span class="modal-close-btn">&times;</span>
                <h3>登录</h3>
                <form id="login-form">
                    <div class="form-group">
                        <label for="username-input">用户名</label>
                        <input type="text" id="username-input" required>
                    </div>
                    <div class="form-group">
                        <label for="password-input">密码</label>
                        <input type="password" id="password-input" required>
                    </div>
                    <button type="submit" class="login-submit-btn">登录</button>
                    <p id="login-message" class="login-message"></p>
                </form>
            </div>
        </div>
    `;

    const modalCSS = `
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.6); display: flex;
            justify-content: center; align-items: center; z-index: 9999;
        }
        .modal-content {
            background-color: #fff; padding: 25px 30px; border-radius: 8px;
            width: 90%; max-width: 350px; position: relative;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3); color: #333;
        }
        .modal-close-btn {
            position: absolute; top: 10px; right: 15px; font-size: 24px;
            font-weight: bold; cursor: pointer; color: #888;
        }
        .modal-content h3 { margin-top: 0; margin-bottom: 20px; text-align: center; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-size: 14px; color: #555; }
        .form-group input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .login-submit-btn {
            width: 100%; padding: 10px; border: none; border-radius: 4px;
            background-color: #409EFF; color: white; font-size: 16px;
            cursor: pointer; margin-top: 10px;
        }
        .login-submit-btn:hover { background-color: #337ecc; }
        .login-message { margin-top: 15px; text-align: center; font-size: 14px; }
        .login-message.success { color: green; }
        .login-message.error { color: red; }
    `;

    // --- 2. 将HTML和CSS注入到页面中 ---
    // 注入CSS
    const styleElement = document.createElement('style');
    styleElement.innerHTML = modalCSS;
    document.head.appendChild(styleElement);
    // 注入HTML
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);


    // --- 3. 核心功能逻辑 ---
    function setupAuthUI() {
        const authLinkContainer = document.getElementById('auth-link-container');
        if (!authLinkContainer) return; // 如果容器不存在则退出

        const isLoggedIn = localStorage.getItem('token');
        let linkHTML = '';

        if (isLoggedIn) {
            linkHTML = `<a class="nav-link" href="/@manage" target="_blank"><i class="fa-solid fa-folder-gear" style="color:#409EFF;"></i> 管理</a>`;
        } else {
            linkHTML = `<a class="nav-link" href="javascript:void(0);" id="show-login-modal-btn"><i class="fa-solid fa-right-to-bracket" style="color:#409EFF;"></i> 登录</a>`;
        }
        authLinkContainer.innerHTML = linkHTML;

        // 如果未登录，则为弹窗绑定事件
        if (!isLoggedIn) {
            const modal = document.getElementById('login-modal');
            const showBtn = document.getElementById('show-login-modal-btn');
            const closeBtn = document.querySelector('.modal-close-btn');
            const loginForm = document.getElementById('login-form');
            const messageEl = document.getElementById('login-message');

            showBtn.onclick = () => { modal.style.display = 'flex'; };
            closeBtn.onclick = () => { modal.style.display = 'none'; };
            modal.onclick = (event) => { if (event.target === modal) { modal.style.display = 'none'; } };

            loginForm.onsubmit = (e) => {
                e.preventDefault();
                const username = document.getElementById('username-input').value;
                const password = document.getElementById('password-input').value;
                
                messageEl.textContent = '登录中...';
                messageEl.className = 'login-message';

                fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username, password: password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200 && data.data.token) {
                        messageEl.textContent = '登录成功！页面即将刷新...';
                        messageEl.classList.add('success');
                        localStorage.setItem('token', data.data.token);
                        setTimeout(() => { location.reload(); }, 1500);
                    } else {
                        messageEl.textContent = data.message || '用户名或密码错误！';
                        messageEl.classList.add('error');
                    }
                })
                .catch(error => {
                    console.error('Login Error:', error);
                    messageEl.textContent = '登录请求失败，请检查网络。';
                    messageEl.classList.add('error');
                });
            };
        }
    }

    // --- 4. 等待页面加载完毕后执行 ---
    let interval = setInterval(() => {
        if (document.querySelector(".footer") && document.getElementById('auth-link-container')) {
            clearInterval(interval);
            setupAuthUI();
        }
    }, 200);

})();
