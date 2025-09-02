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
});
