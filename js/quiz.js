/* ---------- Quiz ---------- */
const stage = document.getElementById('stage');
let idx = 0, score = 0;

function showQuestion(){
  const d = QUESTIONS[idx];
  window.dispatchEvent(new Event('qchange'));
  const card = document.createElement('section');
  card.className = 'card a'+(idx%2);
  card.innerHTML = `<div class="meta">Question ${idx+1} sur ${QUESTIONS.length}</div>
    <div class="bar"><i style="width:${(idx/QUESTIONS.length)*100}%"></i></div>
    <h1>${d.q}</h1>` + d.o.map((t,i)=>`<button class="opt" data-k="${'ABCD'[i]}"><b>${'ABCD'[i]}</b><span>${t}</span></button>`).join('');
  stage.replaceChildren(card);
  card.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>answer(card,b.dataset.k)));
  requestAnimationFrame(()=>card.querySelector('.bar i').style.width=((idx+1)/QUESTIONS.length*100)+'%');
}

function answer(card,k){
  if(card.classList.contains('out')) return;
  score += PTS[k];
  window.dispatchEvent(new CustomEvent('qanswer',{detail:{pts:PTS[k]}}));
  card.classList.add('out');
  setTimeout(()=>{ idx++; idx < QUESTIONS.length ? showQuestion() : showResult(); }, 500);
}

function showResult(){
  const t = TYPES.find(t=>score>=t.min && score<=t.max);
  const card = document.createElement('section');
  card.className = 'card big res a1';
  card.innerHTML = DRAW[t.key] +
    `<div class="score">Ton score : ${score} / 25</div>
     <h2>${t.name} type</h2>
     <div class="ranks">${TYPES.map(x=>`<span class="${x===t?'on':''}">${x.min}-${x.max} ${x.name}</span>`).join('')}</div>
     <p>${t.text}</p>
     <div class="row"><button class="btn" id="tips">Mes conseils ✨</button><button class="btn ghost" id="again">Refaire le quiz</button></div>`;
  stage.replaceChildren(card);
  document.getElementById('again').onclick = restart;
  document.getElementById('tips').onclick = ()=>showSlides(t,0);
}
function restart(){ idx=0; score=0; window.dispatchEvent(new Event('qreset')); showQuestion(); }

function showSlides(t,i){
  const a = ADVICE[t.key];
  const slides = [
    {tag:"Ton profil", emoji:a.emoji, title:t.name+" type", html:`<div class="note">${a.intro}</div>`},
    ...a.tips.map((x,n)=>({tag:`Conseil ${n+1} sur ${a.tips.length}`, emoji:x[0], title:x[1], html:`<p class="txt">${x[2]}</p>`})),
    {tag:"Terminé", emoji:"🎊", title:"Bravo, c'est tout !", html:`<p class="txt">Tu connais maintenant ton profil ${t.name} et comment en tirer le meilleur.</p>`, last:true}
  ];
  const d = slides[i];
  const card = document.createElement('section');
  card.className = 'card big slide';
  card.innerHTML = `<div class="dots">${slides.map((_,n)=>`<i class="${n===i?'on':''}"></i>`).join('')}</div>
    <span class="tag">${d.tag}</span>
    <div class="blob"><span>${d.emoji}</span></div>
    <h2>${d.title}</h2>${d.html}
    <div class="row">
      <button class="btn ghost" id="prev">← ${i===0?'Résultat':'Retour'}</button>
      ${d.last?'<button class="btn" id="restart">Refaire le quiz</button>':'<button class="btn" id="next">Suivant →</button>'}
    </div>`;
  stage.replaceChildren(card);
  card.querySelector('#prev').onclick = ()=> i===0 ? showResult() : showSlides(t,i-1);
  const n = card.querySelector('#next'); if(n) n.onclick = ()=>showSlides(t,i+1);
  const r = card.querySelector('#restart'); if(r) r.onclick = restart;
  window.onkeydown = e=>{ if(e.key==='ArrowRight' && !d.last) showSlides(t,i+1); if(e.key==='ArrowLeft') (i===0?showResult():showSlides(t,i-1)); };
}
