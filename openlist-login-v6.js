// --- START OF FILE (Turnstile + Base64 Safe Version) ---
(() => {
    "use strict";
    console.log("[OpenList] Turnstile Security Mode...");

    const CONFIG = {
        // 🔴 必须填入您的 Site Key
        CF_SITE_KEY: "0x4AAAAAACF_A19hKThLxuLh", 
        REDIRECT_TO_MANAGE: false 
    };

    // Base64 图标 (绝对无错)
    const icons = {
        user: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYWFhIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==',
        lock: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYWFhIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iMTEiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxMSIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PHBhdGggZD0iTTcgMTFWN2E1IDUgMCAwIDEgMTAgMHY0Ij48L3BhdGg+PC9zdmc+',
        close: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGxpbmUgeDE9LTE4IiB5MT0iNiIgeDI9IjYiIHkyPSIxOCI+PC9saW5lPjxsaW5lIHgxPSI2IiB5MT0iNiIgeDI9IjE4IiB5Mj0iMTgiPjwvbGluZT48L3N2Zz4=',
        manage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIj48L2NpcmNsZT48cGF0aCBkPSJNMTkuNCAxNWExLjY1IDEuNjUgMCAwIDAgLjMzIDEuODJsLjA2LjA2YTIgMiAwIDAgMSAwIDIuODMgMiAyIDAgMCAxLTIuODMgMGwtLjA2LS4wNmExLjY1IDEuNjUgMCAwIDAtMS44Mi0uMzMgMS42NSAxLjY1IDAgMCAwLTEgMS41MVYyMWEyIDIgMCAwIDEtMiAyIDIgMiAwIDAgMS0yLTJ2LS4wOWExLjY1IDEuNjUgMCAwIDAtMS44Mi4zM2wtLjA2LjA2YTIgMiAwIDAgMS0yLjgzIDAgMiAyIDAgMCAxIDAtMi44M2wuMDYtLjA2YTEuNjUgMS42NSAwIDAgMCAuMzMtMS44MiAxLjY1IDEuNjUgMCAwIDAtMS41MS0xSDNhMiAyIDAgMCAxLTItMiAyIDIgMCAwIDEgMi0yaC4wOWExLjY1IDEuNjUgMCAwIDAgMS44Mi0uMzNsLjA2LS4wNmEyIDIgMCAwIDEgMCAtMi44MyAyIDIgMCAwIDEgMi44MyAwbC4wNi4wNmExLjY1IDEuNjUgMCAwIDAgMS44Mi4zM0g5YTEuNjUgMS42NSAwIDAgMCAxLTEuNTFWM2EyIDIgMCAwIDEgMi0yIDIgMiAwIDAgMSAyIDJ2LjA5YTEuNjUgMS42NSAwIDAgMCAxIDEuNTEgMS42NSAxLjY1IDAgMCAwIDEuODItLjMzbC4wNi0uMDZhMiAyIDAgMCAxIDIuODMgMCAyIDIgMCAwIDEgMCAyLjgzbC0uMDYuMDZhMS42NSAxLjY1IDAgMCAwLS4zMyAxLjgyVjlhMS42NSAxLjY1IDAgMCAwIDEuNTEgMUgyMWEyIDIgMCAwIDEgMiAyIDIgMiAwIDAgMS0yIDJOLTA5YTEuNjUgMS42NSAwIDAgMC0xLjUxIDF6Ij48L3BhdGg+PC9zdmc+',
        login: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTUgM2g0YTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMmgtNCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjEwIDE3IDE1IDEyIDEwIDciPjwvcG9seWxpbmU+PGxpbmUgeDE9IjE1IiB5MT0iMTIiIHgyPSIzIiB5Mj0iMTIiPjwvbGluZT48L3N2Zz4='
    };

    // 动态加载 Turnstile SDK
    const loadTurnstile = () => {
        if (document.getElementById('cf-turnstile-script')) return;
        const s = document.createElement('script');
        s.id = 'cf-turnstile-script';
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true; s.defer = true;
        document.head.appendChild(s);
    };
    loadTurnstile();

    const css = `
        .ol-auth-wrapper { font-family: system-ui, -apple-system, sans-serif; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2147483647; opacity: 0; visibility: hidden; transition: 0.3s; }
        .modal-overlay.active { opacity: 1; visibility: visible; }
        .modal-content { background: white; padding: 30px; border-radius: 16px; width: 320px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); position: relative; text-align: center; transform: scale(0.9); transition: 0.3s; }
        .modal-overlay.active .modal-content { transform: scale(1); }
        .close-icon { position: absolute; top: 15px; right: 15px; width: 24px; cursor: pointer; opacity: 0.6; }
        .form-group { position: relative; margin-bottom: 15px; }
        .input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 18px; opacity: 0.5; }
        .form-group input { width: 100%; padding: 10px 10px 10px 40px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
        .btn { width: 100%; padding: 10px; background: #409EFF; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-top: 10px; opacity: 0.5; pointer-events: none; transition: 0.3s; }
        .btn.active { opacity: 1; pointer-events: auto; }
        .msg { margin-top: 10px; font-size: 12px; } .msg.err { color: red; } .msg.ok { color: green; }
        .nav-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 15px; background: white; border: 1px solid #ddd; border-radius: 20px; cursor: pointer; text-decoration: none; font-size: 14px; color: #333; }
        .nav-btn img { width: 14px; height: 14px; }
        #auth-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; }
        /* 验证码容器 */
        .cf-container { margin: 15px 0; display: flex; justify-content: center; min-height: 65px; }
    `;
    const st = document.createElement('style'); st.innerHTML = css; document.head.appendChild(st);

    const html = `
        <div id="login-modal" class="modal-overlay ol-auth-wrapper">
            <div class="modal-content">
                <img src="${icons.close}" class="close-icon" id="close-btn">
                <h3>验证身份</h3>
                <form id="l-form">
                    <div class="form-group"><img src="${icons.user}" class="input-icon"><input id="u" type="text" placeholder="用户名" required></div>
                    <div class="form-group"><img src="${icons.lock}" class="input-icon"><input id="p" type="password" placeholder="密码" required></div>
                    <div id="cf-widget" class="cf-container"></div>
                    <button type="submit" class="btn" id="s-btn">登录</button>
                    <p id="msg" class="msg"></p>
                </form>
            </div>
        </div>
    `;
    const d = document.createElement('div'); d.innerHTML = html; document.body.appendChild(d.firstElementChild);

    let tId = null;

    function mount() {
        const box = document.getElementById('auth-link-container');
        if (!box) return; // 如果找不到OpenList的挂载点，就不执行

        const isLogged = localStorage.getItem('token');
        box.innerHTML = isLogged ? 
            `<a href="/@manage" target="_blank" class="nav-btn"><img src="${icons.manage}"> 管理</a>` : 
            `<a href="javascript:;" id="open-btn" class="nav-btn"><img src="${icons.login}"> 登录</a>`;

        if (!isLogged) {
            const m = document.getElementById('login-modal');
            const msg = document.getElementById('msg');
            const btn = document.getElementById('s-btn');

            document.getElementById('open-btn').onclick = () => {
                m.classList.add('active');
                if (window.turnstile && !tId) { 
                    try { 
                        tId = turnstile.render('#cf-widget', { 
                            sitekey: CONFIG.CF_SITE_KEY, 
                            callback: () => { 
                                // 验证通过后，按钮才变亮
                                btn.classList.add('active');
                                msg.textContent = "";
                            },
                            'expired-callback': () => btn.classList.remove('active')
                        }); 
                    } catch(e){} 
                }
            };
            document.getElementById('close-btn').onclick = () => m.classList.remove('active');

            document.getElementById('l-form').onsubmit = (e) => {
                e.preventDefault();
                const uVal = document.getElementById('u').value;
                const pVal = document.getElementById('p').value;
                // 获取 Token
                const token = window.turnstile ? turnstile.getResponse(tId) : "";
                
                if (!token) { msg.textContent = "请点击验证码"; msg.className = "msg err"; return; }
                
                btn.textContent = "Loading...";
                
                // 发送请求时带上 cf-turnstile-response
                fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'cf-turnstile-response': token // 关键：发给 Worker 验证
                    },
                    body: JSON.stringify({username: uVal, password: pVal})
                }).then(r=>r.json()).then(res => {
                    if(res.code===200) { 
                        msg.textContent = "Success"; msg.className = "msg ok"; 
                        localStorage.setItem('token', res.data.token);
                        setTimeout(() => location.reload(), 500);
                    } else { throw new Error(); }
                }).catch(() => {
                    msg.textContent = "账号或密码错误"; msg.className = "msg err"; btn.textContent = "登录";
                    if(tId) turnstile.reset(tId);
                    btn.classList.remove('active');
                });
            };
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
