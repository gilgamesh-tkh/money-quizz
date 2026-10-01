/* ---------- Thème clair / sombre ---------- */
(function(){
  const root = document.documentElement, btn = document.getElementById('theme');
  let cur = null;
  try{ cur = localStorage.getItem('mq-theme'); }catch(e){}
  if(!cur) cur = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  function apply(m){ root.dataset.theme = m; btn.textContent = m==='dark' ? '☀️' : '🌙'; window.dispatchEvent(new Event('themechange')); try{ localStorage.setItem('mq-theme',m); }catch(e){} }
  btn.onclick = ()=>apply(root.dataset.theme==='dark' ? 'light' : 'dark');
  apply(cur);
})();
