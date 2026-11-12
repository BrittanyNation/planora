// Planora home page — commented as study code
// Course pattern reused: data driven rendering, state in localStorage,
// derived state (counts and filtered views are computed, never stored twice).

// ---------- Feature tabs ----------
document.querySelectorAll('.tabbtn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tabbtn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    ['plan','track','share'].forEach(k=>{
      document.getElementById('panel-'+k).hidden = (k!==btn.dataset.tab);
    });
  });
});

// ---------- Board demo ----------
// State shape: [{id, title, col}] where col is todo | doing | done
const BOARD_KEY='planora_board_v1';
const DEFAULT_BOARD=[
  {id:1,title:'Write the launch headline',col:'todo'},
  {id:2,title:'Review the pricing page copy',col:'doing'},
  {id:3,title:'Share the board with the client',col:'done'}
];
function loadBoard(){
  try{ const raw=localStorage.getItem(BOARD_KEY); if(raw){ const parsed=JSON.parse(raw); if(Array.isArray(parsed)) return parsed; } }catch(e){}
  return [...DEFAULT_BOARD];
}
let board=loadBoard();
function saveBoard(){ localStorage.setItem(BOARD_KEY, JSON.stringify(board)); }
const COLS=['todo','doing','done'];
function renderBoard(){
  COLS.forEach(col=>{
    const host=document.getElementById('col-'+col); host.innerHTML='';
    board.filter(c=>c.col===col).forEach(c=>{
      const div=document.createElement('div'); div.className='carditem';
      const title=document.createElement('div'); title.textContent=c.title; div.appendChild(title);
      const idx=COLS.indexOf(col);
      if(idx>0){ const b=document.createElement('button'); b.textContent='Move back'; b.dataset.action='back'; b.dataset.id=c.id; div.appendChild(b); }
      if(idx<2){ const b=document.createElement('button'); b.textContent='Move forward'; b.dataset.action='forward'; b.dataset.id=c.id; div.appendChild(b); }
      const del=document.createElement('button'); del.textContent='Remove'; del.dataset.action='remove'; del.dataset.id=c.id; div.appendChild(del);
      host.appendChild(div);
    });
    if(!host.children.length){ host.innerHTML='<p style="font-family:Arial,sans-serif;color:#6E6577">No cards here yet.</p>'; }
  });
  document.getElementById('board-count').textContent=board.length;
}
document.querySelector('.board').addEventListener('click',e=>{
  const btn=e.target.closest('button'); if(!btn) return;
  const id=Number(btn.dataset.id); const card=board.find(c=>c.id===id); if(!card) return;
  const idx=COLS.indexOf(card.col);
  if(btn.dataset.action==='forward' && idx<2) card.col=COLS[idx+1];
  if(btn.dataset.action==='back' && idx>0) card.col=COLS[idx-1];
  if(btn.dataset.action==='remove') board=board.filter(c=>c.id!==id);
  saveBoard(); renderBoard();
});
document.getElementById('add-form').addEventListener('submit',e=>{
  e.preventDefault();
  const title=document.getElementById('card-title').value.trim();
  const err=document.getElementById('add-error');
  if(title.length<3){ err.textContent='Please write a card title of at least 3 characters.'; return; }
  err.textContent='';
  board.push({id:Date.now(),title:title,col:document.getElementById('card-col').value});
  saveBoard(); renderBoard(); e.target.reset();
});
document.getElementById('reset-board').addEventListener('click',()=>{ board=[...DEFAULT_BOARD]; saveBoard(); renderBoard(); });
renderBoard();

// ---------- Testimonial carousel ----------
const QUOTES=[
  {text:'“We stopped having status meetings. The board is the meeting now, and it takes four minutes to read.”',name:'Maya R., studio owner, team of six'},
  {text:'“Our clients finally see the same plan we see. Fewer check in emails, more trust, calmer launches.”',name:'Jordan T., project lead, remote team of nine'},
  {text:'“I opened it on a Monday morning and knew exactly where to start. That has never happened with a planning tool before.”',name:'Sam K., solo maker and writer'}
];
let qi=0;
function renderQuote(){ document.getElementById('quote-text').textContent=QUOTES[qi].text; document.getElementById('quote-name').textContent=QUOTES[qi].name; document.getElementById('quote-dots').textContent=' '+(qi+1)+' of '+QUOTES.length; }
document.getElementById('next-quote').addEventListener('click',()=>{ qi=(qi+1)%QUOTES.length; renderQuote(); });
document.getElementById('prev-quote').addEventListener('click',()=>{ qi=(qi-1+QUOTES.length)%QUOTES.length; renderQuote(); });
renderQuote();

// ---------- Newsletter with duplicate recognition ----------
const LETTER_KEY='planora_letter_v1';
document.getElementById('letter-form').addEventListener('submit',e=>{
  e.preventDefault();
  const email=document.getElementById('letter-email').value.trim().toLowerCase();
  const err=document.getElementById('letter-error'); const result=document.getElementById('letter-result');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ err.textContent='Please enter a valid email address.'; result.innerHTML=''; return; }
  err.textContent='';
  let list=[]; try{ list=JSON.parse(localStorage.getItem(LETTER_KEY)||'[]'); }catch(e2){}
  if(list.includes(email)){ result.innerHTML='<div class="success">You are already on the Planora Letter list. Welcome back.</div>'; return; }
  list.push(email); localStorage.setItem(LETTER_KEY, JSON.stringify(list));
  result.innerHTML='<div class="success">You are in. The next Planora Letter arrives on Friday.</div>'; e.target.reset();
});
