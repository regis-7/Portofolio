// script.js — handles nav, modals, validation, skills animation, toast

document.addEventListener('DOMContentLoaded', ()=>{
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const navLinks = document.querySelectorAll('[data-offset]');
  const OFFSET = header.offsetHeight + 8; // used when scrolling to anchor

  // Mobile nav toggle
  navToggle.addEventListener('click', ()=>{
    const open = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Smooth scroll with offset for sticky nav
  navLinks.forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const target = document.querySelector(href);
      if(!target) return;
      const top = target.getBoundingClientRect().top + window.pageYOffset - OFFSET;
      window.scrollTo({top,behavior:'smooth'});
      // close mobile nav
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    });
  });

  // Skill bars fill when in view
  const skills = document.querySelectorAll('.skill');
  const skillObserver = new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const pct = el.getAttribute('data-percent') || 0;
        const fill = el.querySelector('.skill-fill');
        fill.style.width = pct + '%';
        obs.unobserve(el);
      }
    });
  },{threshold:0.3});
  skills.forEach(s=>skillObserver.observe(s));

  // Project modal
  const modal = document.getElementById('projModal');
  const modalClose = document.getElementById('modalClose');
  const modalBody = modal.querySelector('.modal-body');
  const detailBtns = document.querySelectorAll('.view-details');

  detailBtns.forEach(btn=>btn.addEventListener('click', ()=>{ 
    const data = JSON.parse(btn.getAttribute('data-project'));
    openProjectModal(data);
  }));

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  function openProjectModal(data){
    modalBody.innerHTML = `
      <h3>${escapeHTML(data.title)}</h3>
      <img src="${escapeHTML(data.img)}" alt="${escapeHTML(data.title)} screenshot">
      <p>${escapeHTML(data.desc)}</p>
      <p><strong>Tech:</strong> ${escapeHTML(data.tech)}</p>
      <p><a href="${escapeHTML(data.link)}" class="btn" target="_blank" rel="noopener noreferrer">Open Project</a></p>
    `;
    modal.setAttribute('aria-hidden','false');
    // trap focus briefly
    modal.querySelector('a, button, h3')?.focus();
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    modalBody.innerHTML = '';
  }

  // Contact form validation
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  const toast = document.getElementById('toast');

  // Name validation: letters and spaces only
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,80}$/;
  // Email regex (simple but effective)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  messageInput.addEventListener('input', ()=>{
    charCount.textContent = `${messageInput.value.length} / ${messageInput.getAttribute('maxlength')}`;
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let errors = [];
    if(!name) errors.push('Name is required');
    else if(!nameRegex.test(name)) errors.push('Name should contain letters and spaces only');

    if(!email) errors.push('Email is required');
    else if(!emailRegex.test(email)) errors.push('Invalid email format');

    if(!message) errors.push('Message is required');
    else if(message.length > 500) errors.push('Message is too long');

    if(errors.length){
      showToast(errors.join(' • '), true);
      return;
    }

    // Simulate send — in real site you'd submit to server
    form.reset();
    charCount.textContent = '0 / 500';
    showToast('Message sent — thanks!');
  });

  function showToast(text, isError){
    toast.textContent = text;
    if(isError) toast.style.background = 'linear-gradient(90deg, #f87171, #fb923c)';
    else toast.style.background = '';
    toast.classList.add('show');
    setTimeout(()=>{toast.classList.remove('show'); if(isError) toast.style.background = '';}, 3500);
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" }[m]));
  }

});
