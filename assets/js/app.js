/* =========================
   Gypsum Jeddah - App JS
   - Mobile nav
   - Reveal animations
   - Floating buttons bindings
   - WhatsApp form
   - Projects gallery with Load More + tabs
   ========================= */

const PHONE = "0598445692";
const WA_NUMBER_INTL = "966598445692"; // لو رقمك سعودي بصيغة دولية (بدون +). عدّل لو لازم.

function qs(sel, root = document){ return root.querySelector(sel); }
function qsa(sel, root = document){ return [...root.querySelectorAll(sel)]; }

function bindContactLinks(){
  qsa("[data-phone]").forEach(a=>{
    a.href = `tel:${PHONE}`;
  });
  qsa("[data-wa]").forEach(a=>{
    // لو واتساب على نفس الرقم:
    a.href = `https://wa.me/${WA_NUMBER_INTL}`;
  });
}

function mobileNav(){
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.querySelector(".m-drawer");
  const overlay = document.querySelector(".m-overlay");
  const closers = document.querySelectorAll("[data-close]");

  if(!toggle || !drawer || !overlay) return;

  function openMenu(){
    document.body.classList.add("menu-open");
    overlay.hidden = false;
    drawer.hidden = false;
    drawer.setAttribute("aria-hidden","false");
    toggle.setAttribute("aria-expanded","true");
    document.body.classList.add("no-scroll");
  }

  function closeMenu(){
    document.body.classList.remove("menu-open");
    drawer.setAttribute("aria-hidden","true");
    toggle.setAttribute("aria-expanded","false");
    document.body.classList.remove("no-scroll");

    // استنى الأنيميشن ثم اخفي
    setTimeout(()=>{
      overlay.hidden = true;
      drawer.hidden = true;
    }, 260);
  }

  toggle.addEventListener("click", ()=>{
    if(document.body.classList.contains("menu-open")) closeMenu();
    else openMenu();
  });

  closers.forEach(el => el.addEventListener("click", closeMenu));

  // قفل بالـ ESC
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && document.body.classList.contains("menu-open")){
      closeMenu();
    }
  });

  // قفل عند الضغط على لينك
  drawer.querySelectorAll("a").forEach(a=>{
    a.addEventListener("click", closeMenu);
  });
}


function revealOnScroll(){
  const els = qsa(".reveal");
  if(!els.length) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el=> io.observe(el));
}

function tiltCards(){
  // subtle tilt on hover for elements with .tilt (desktop only)
  const items = qsa(".tilt");
  if(!items.length) return;

  items.forEach(card=>{
    card.addEventListener("mousemove",(e)=>{
      if(window.matchMedia("(max-width: 900px)").matches) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--rx", `${(-y*6).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${(x*8).toFixed(2)}deg`);
    });
    card.addEventListener("mouseleave", ()=>{
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

function setYear(){
  const y = qs("#year");
  if(y) y.textContent = new Date().getFullYear();
}

/* WhatsApp Form */
function waForm(){
  const form = qs("#waForm");
  if(!form) return;

  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("name")||"").toString().trim();
    const city = (fd.get("city")||"").toString().trim();
    const service = (fd.get("service")||"").toString().trim();
    const msg = (fd.get("msg")||"").toString().trim();

    const text =
`مرحباً، أنا ${name || "عميل"}.
المدينة: ${city || "جدة"}
الخدمة: ${service || "-"}
التفاصيل: ${msg || "-"}

أبغى معاينة/تقدير مبدئي.`;

    const url = `https://wa.me/${WA_NUMBER_INTL}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  });
}

/* Projects Gallery */
function projectsGallery(){
  const root = qs("#gallery");
  const btn = qs("#loadMore");
  if(!root || !btn) return;

  // 30 photos, 20 videos (اسماء ثابتة: p01..p30 / v01..v20)
  const items = [];
  for(let i=1;i<=31;i++){
    const n = String(i).padStart(2,"0");
    items.push({ type:"photo", src:`assets/img/p${n}.jpg`, label:`صورة ${i}` });
  }
  for(let i=1;i<=20;i++){
    const n = String(i).padStart(2,"0");
    items.push({ type:"video", src:`assets/vid/v${n}.mp4`, label:`فيديو ${i}` });
  }

  // بين كل 5 عناصر نضيف سكشن كلام (زي ما طلبت)
  // (ده بيتبني تلقائيًا أثناء الرندر)
  let filter = "all";
  let shown = 0;
  const STEP = 12;

  function createTextBlock(index){
    const div = document.createElement("div");
    div.className = "text-block reveal";
    div.innerHTML = `
      <h3>تفاصيل صغيرة… بتطلع فرق كبير</h3>
      <p>
        في كل مشروع بنركز على الاستقامة، التنعيم، أماكن الإضاءة، والتوازن بين الارتفاعات
        عشان النتيجة تبقى فخمة ومرتاحة للعين — وده اللي بيخلي عميلنا يلاحظ الفرق من أول نظرة.
      </p>
      <div class="row">
        <a class="btn btn-soft" href="contact.html">اطلب معاينة</a>
        <a class="btn btn-ghost" href="about.html">اعرف طريقتنا</a>
      </div>
    `;
    return div;
  }

  function cardFor(it){
    const wrap = document.createElement("article");
    wrap.className = "media-item reveal";
    wrap.dataset.type = it.type;

    if(it.type === "photo"){
      wrap.innerHTML = `
        <div class="media-thumb">
          <img loading="lazy" src="${it.src}" alt="${it.label}">
        </div>
      `;
    }else{
      wrap.innerHTML = `
        <div class="media-thumb">
          <video preload="metadata" controls playsinline>
            <source src="${it.src}" type="video/mp4">
          </video>
        </div>
      `;
    }
    return wrap;
  }

  function getFiltered(){
    if(filter === "all") return items;
    if(filter === "photos") return items.filter(x=>x.type==="photo");
    if(filter === "videos") return items.filter(x=>x.type==="video");
    return items;
  }

  function renderMore(){
    const list = getFiltered();
    const next = Math.min(shown + STEP, list.length);

    for(let i=shown;i<next;i++){
      // كل 5 عناصر أضف بلوك كلام (لكن مش قبل أول عنصر)
      if(i !== 0 && i % 5 === 0){
        root.appendChild(createTextBlock(i));
      }
      root.appendChild(cardFor(list[i]));
    }

    shown = next;
    if(shown >= list.length){
      btn.disabled = true;
      btn.classList.add("disabled");
      btn.textContent = "شاهد المزيد في الانستجرام  ";
    }

    // re-run reveal observer on new nodes
    revealOnScroll();
  }

  btn.addEventListener("click", renderMore);

  // tabs
  qsa("[data-tab]").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      qsa("[data-tab]").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      filter = chip.dataset.tab;

      // reset
      root.innerHTML = "";
      shown = 0;
      btn.disabled = false;
      btn.classList.remove("disabled");
      btn.innerHTML = `<img class="ic" src="assets/icons/arrow.png" alt=""> المزيد`;
      renderMore();
    });
  });

  renderMore();
}

document.addEventListener("DOMContentLoaded", ()=>{
  bindContactLinks();
  mobileNav();
  revealOnScroll();
  tiltCards();
  waForm();
  projectsGallery();
  setYear();
});
