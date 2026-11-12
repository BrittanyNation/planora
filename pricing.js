// Planora pricing — commented as study code
// Derived state: displayed prices are computed from the monthly base
// and the billing toggle, never typed twice, so they cannot disagree.
const toggle=document.getElementById('billing-toggle');
function money(n){ return n.toFixed(2); }
function renderPricing(){
  const yearly=toggle.checked;
  document.getElementById('billing-label').textContent = yearly ? 'Billing: yearly' : 'Billing: monthly';
  document.querySelectorAll('[data-monthly]').forEach(el=>{
    const monthly=Number(el.dataset.monthly);
    const shown = yearly ? monthly*0.8 : monthly;
    el.textContent = Number.isInteger(shown) ? String(shown) : money(shown);
    const card=el.closest('.pricecard');
    card.querySelector('.billed').textContent = yearly
      ? 'Billed yearly: $'+money(shown*12)+' per person'
      : 'Billed monthly: $'+money(monthly)+' per person';
  });
}
toggle.addEventListener('change', renderPricing);
renderPricing();

// Choosing a plan stores it so the demo form can prefill it honestly.
document.querySelectorAll('.choose').forEach(btn=>{
  btn.addEventListener('click',()=>{
    localStorage.setItem('planora_plan', btn.dataset.plan);
    document.getElementById('choose-result').textContent='You chose '+btn.dataset.plan+'. It will be filled in on the demo form.';
  });
});

// FAQ accordions: one open at a time
document.querySelectorAll('.faq button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.parentElement; const wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq').forEach(f=>f.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});
