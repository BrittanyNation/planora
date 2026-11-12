// Planora demo form — commented as study code
// Prefill: a plan chosen on the pricing page is stored in localStorage
// and applied here, so the visitor does not have to choose twice.
(function(){
  const saved=localStorage.getItem('planora_plan');
  if(saved){ const sel=document.getElementById('f-plan'); [...sel.options].forEach(o=>{ if(o.text===saved) sel.value=o.value||o.text; }); sel.value=saved; }
})();

function setErr(id,msg){ document.getElementById(id).textContent=msg||''; return !msg; }
document.getElementById('demo-form').addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('f-name').value.trim();
  const email=document.getElementById('f-email').value.trim();
  const company=document.getElementById('f-company').value.trim();
  const size=document.getElementById('f-size').value;
  const dateVal=document.getElementById('f-date').value;
  let ok=true;
  ok=setErr('e-name', name.length>=2?'':'Please enter your name.') && ok;
  ok=setErr('e-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?'':'Please enter a valid work email.') && ok;
  ok=setErr('e-company', company.length>=2?'':'Please enter your company or studio name.') && ok;
  ok=setErr('e-size', size?'':'Please choose your team size.') && ok;
  let dateMsg='';
  if(!dateVal) dateMsg='Please choose a demo date.';
  else { const today=new Date(); today.setHours(0,0,0,0); const chosen=new Date(dateVal+'T00:00:00'); if(chosen<today) dateMsg='Please choose a date that is not in the past.'; }
  ok=setErr('e-date', dateMsg) && ok;
  if(!ok) return;
  // Confirmation reference: PN plus six digits from the current time base
  const ref='PN-'+Math.floor(100000+Math.random()*900000);
  const record={ref,name,email,company,size,plan:document.getElementById('f-plan').value,date:dateVal,message:document.getElementById('f-msg').value.trim(),savedAt:new Date().toISOString()};
  let list=[]; try{ list=JSON.parse(localStorage.getItem('planora_demos')||'[]'); }catch(err){}
  list.push(record); localStorage.setItem('planora_demos', JSON.stringify(list));
  document.getElementById('demo-result').innerHTML='<div class="success"><b>Demo requested. Your reference is '+ref+'.</b><br>We will write to '+email+' to confirm a time for '+dateVal+'. This portfolio demo saves requests in this browser only.</div>';
  e.target.reset();
});
