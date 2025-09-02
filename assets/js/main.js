// 外部 JS：main.js
// 將原本 HTML 內嵌的腳本移到這裡，並在 DOMContentLoaded 後執行以確保元素已存在
document.addEventListener('DOMContentLoaded', function () {
  // 年份
  const yEl = document.getElementById('y');
  if (yEl) yEl.textContent = new Date().getFullYear();

  // 複製 IP
  function bindCopy(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const inp = document.getElementById(inputId);
    if (!btn || !inp) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(inp.value);
        btn.innerHTML = '<i class="bi bi-check2-circle"></i> 已複製';
        setTimeout(() => btn.innerHTML = '<i class="bi bi-clipboard"></i> 複製 IP', 1600);
      } catch (e) {
        // 備援：舊版瀏覽器
        try { inp.select(); document.execCommand('copy'); } catch (err) { /* ignore */ }
      }
    });
  }
  bindCopy('copyBtn', 'ipField');
  bindCopy('copyBtn2', 'ipField2');

  // 攔截所有 .menu 裡的超連結，改為平滑滾動且不留下 #hash
  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // 阻止瀏覽器預設行為

      const href = this.getAttribute('href') || '';
      const targetId = href.startsWith('#') ? href.substring(1) : href;
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        // 移除網址中的 #xxx，但保留 path 與 query
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (err) { /* ignore */ }
      }
    });
  });

  // --- 動態背景支援 --------------------------------------------------
  // 將 .site-background class 套用到 <body>，並提供 setBackgroundImage(url)
  document.body.classList.add('site-background');

  /**
   * 嘗試載入背景圖，成功則把 --bg-image 設為圖片 URL，並加上 has-bg-image
   * url 支援：完整外部 URL 或 相對路徑 (相對於 index.html)
   */
  async function setBackgroundImage(url) {
    if (!url) return removeBackgroundImage();
    // 建立 Image 物件預載
    return new Promise((resolve) => {
      const img = new Image();
      // 避免 taint canvas 的 CORS 問題，僅用於 CSS 背景，不操作像素
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        // 設定 CSS 變數為 url('...') 格式
        document.documentElement.style.setProperty('--bg-image', `url('${url}')`);
        document.body.classList.add('has-bg-image');
        resolve(true);
      };
      img.onerror = function () {
        // 若圖檔無法載入，回報失敗並保留預設動畫背景
        console.warn('Background image failed to load:', url);
        removeBackgroundImage();
        resolve(false);
      };
      // 觸發載入
      img.src = url;
    });
  }

  function removeBackgroundImage() {
    document.documentElement.style.setProperty('--bg-image', 'none');
    document.body.classList.remove('has-bg-image');
  }

  // 範例：若未來有實際圖檔，可呼叫 setBackgroundImage('assets/images/bg.jpg')
  // 當前先不設定任何圖，維持預設動態漸層。若想測試請在瀏覽器 console 呼叫：
  // setBackgroundImage('https://example.com/your-image.jpg')

  // 如果 body 上有 data-bg 屬性，頁面載入時自動嘗試載入
  try {
    const auto = document.body.dataset && document.body.dataset.bg;
    if (auto) setBackgroundImage(auto);
  } catch (e) { /* ignore */ }

});
