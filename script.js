function navigateTo(viewId) {
    document.querySelectorAll('.view-section').forEach(view => view.classList.add('hidden'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active-tab'));
    const activeLink = document.getElementById(`nav-${viewId}`);
    if (activeLink) activeLink.classList.add('active-tab');

    if (viewId === 'games') renderWorlds();
    if (viewId === 'alerts') renderAlertNode();
    if (viewId === 'admin') verifySessionState();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    icon.className = isOpen ? 'fa-solid fa-bars text-xl' : 'fa-solid fa-xmark text-xl';
}

function renderWorlds(dataset = SITE_DATA.worlds) {
    const container = document.getElementById('worlds-target');
    if (!container) return;
    container.innerHTML = '';
    
    dataset.forEach(w => {
        const authorField = w.createdBy ? w.createdBy : "Crystal Studios";
        const playerMadeBadge = w.isPlayerMade ? `<span class="absolute top-3 left-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"><i class="fa-solid fa-user-gear mr-1"></i>Player Made</span>` : '';
        
        container.innerHTML += `
            <div class="bg-amethyst-900/10 border border-amethyst-900/40 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amethyst-500/50 transition-all duration-300 shadow-lg group">
                <div>
                    <div class="h-36 bg-gradient-to-br ${w.gradient || 'from-amethyst-800 to-slate-900'} relative flex items-center justify-center">
                        <i class="${w.icon || 'fa-solid fa-cubes'} text-4xl text-white/80 group-hover:scale-110 transition-transform duration-300"></i>
                        ${playerMadeBadge}
                        ${w.tag ? `<span class="absolute top-3 right-3 ${w.tagColor} text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">${w.tag}</span>` : ''}
                    </div>
                    <div class="p-5 space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${w.badgeColor || 'bg-amethyst-900 text-amethyst-300'}">${w.badge || w.category}</span>
                            <span class="text-xs text-slate-400"><i class="fa-regular fa-star text-yellow-500 mr-1"></i>${w.rating || '5.0'}/5</span>
                        </div>
                        <h3 class="font-display font-bold text-lg text-white flex items-center justify-between">
                            <span>${w.name}</span>
                        </h3>
                        <p class="text-slate-500 text-[11px] font-mono -mt-1">By: ${authorField}</p>
                        <p class="text-slate-400 text-xs line-clamp-2 leading-relaxed h-8">${w.desc}</p>
                    </div>
                </div>
                <div class="p-5 pt-0 space-y-3">
                    <button onclick="openWorldModal('${w.id}')" class="w-full py-1.5 bg-amethyst-900/40 border border-amethyst-800/60 hover:bg-amethyst-800/60 text-slate-300 text-xs rounded-xl font-medium transition-all flex items-center justify-center gap-1">
                        <i class="fa-solid fa-maximize text-[10px]"></i> Expand Profile Details
                    </button>
                    <div class="bg-amethyst-950 border border-amethyst-900/60 rounded-xl p-2 flex items-center justify-between">
                        <code class="text-xs font-mono text-amethyst-300 select-all">${w.joinCode}</code>
                        <button onclick="directClipboardCopy('${w.joinCode}')" class="px-2.5 py-1 bg-amethyst-900 hover:bg-amethyst-800 text-[10px] font-semibold rounded text-slate-300 transition-colors">Copy</button>
                    </div>
                </div>
            </div>`;
    });
}

function openWorldModal(worldId) {
    const w = SITE_DATA.worlds.find(item => item.id === worldId);
    if (!w) return;
    
    document.getElementById('modal-gradient-header').className = `h-32 bg-gradient-to-br ${w.gradient || 'from-amethyst-800 to-slate-900'} relative flex items-center justify-center`;
    document.getElementById('modal-icon').className = `${w.icon || 'fa-solid fa-cubes'} text-5xl text-white/90`;
    document.getElementById('modal-badge').textContent = w.badge || w.category;
    document.getElementById('modal-badge').className = `px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${w.badgeColor || 'bg-amethyst-900 text-amethyst-300'}`;
    document.getElementById('modal-rating').textContent = w.rating || '5.0';
    document.getElementById('modal-title').textContent = w.name;
    document.getElementById('modal-author').textContent = w.createdBy || "Crystal Studios Team";
    document.getElementById('modal-type-tag').textContent = w.isPlayerMade ? "Player Made Submission" : "Official Studio Submission";
    document.getElementById('modal-type-tag').className = w.isPlayerMade ? "text-emerald-400 font-bold" : "text-amethyst-400 font-bold";
    document.getElementById('modal-desc').textContent = w.desc;
    document.getElementById('modal-code').textContent = w.joinCode;
    
    document.getElementById('modal-copy-btn').onclick = () => directClipboardCopy(w.joinCode);
    document.getElementById('expanded-world-modal').classList.remove('hidden');
}

function closeWorldModal() {
    document.getElementById('expanded-world-modal').classList.add('hidden');
}

function executeFilter(cat, btn) {
    document.querySelectorAll('#filters button').forEach(b => b.className = 'px-3 py-1.5 text-xs font-bold rounded-lg bg-amethyst-900/40 text-slate-400 hover:text-white');
    btn.className = 'px-3 py-1.5 text-xs font-bold rounded-lg bg-amethyst-500 text-white shadow-md';
    renderWorlds(cat === 'all' ? SITE_DATA.worlds : SITE_DATA.worlds.filter(w => w.category === cat));
}

async function directClipboardCopy(text) {
    try {
        await navigator.clipboard.writeText(text);
        triggerToast(`Copied string payload: "${text}"`, 'success');
    } catch (err) {
        const el = document.createElement('input');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        triggerToast(`Copied backup string payload: "${text}"`, 'success');
    }
}

function triggerToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'px-4 py-3 bg-amethyst-900 border border-amethyst-500 rounded-xl shadow-xl flex items-center gap-3 text-xs text-slate-100 max-w-sm transition-all';
    el.innerHTML = `<i class="${type === 'success' ? 'fa-regular fa-circle-check text-green-400' : 'fa-solid fa-triangle-exclamation text-yellow-400'} text-base"></i><span>${msg}</span>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

function renderAlertNode() {
    const wrapper = document.getElementById('alerts-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = "";
    
    if (SITE_DATA.alerts && SITE_DATA.alerts.enabled && SITE_DATA.alerts.message.trim() !== "") {
        wrapper.innerHTML = `
            <div class="p-4 bg-amethyst-900/30 border border-amethyst-500/30 rounded-xl text-sm leading-relaxed text-slate-200 flex gap-3 items-start">
                <i class="fa-solid fa-circle-info text-amethyst-400 mt-0.5 text-base"></i>
                <div>
                    <span class="block text-[10px] font-bold text-amethyst-400 tracking-wider uppercase mb-0.5">Live Broadcast Notification</span>
                    <p>${SITE_DATA.alerts.message}</p>
                </div>
            </div>`;
    } else {
        wrapper.innerHTML = `<p class="text-xs text-slate-500 italic text-center py-4">No system broadcast bulletins are running at this time.</p>`;
    }
}

function submitAdminCredentials() {
    const secretInput = document.getElementById('admin-secret-pass').value.trim();
    if (secretInput !== "crystal2026") {
        return triggerToast("Incorrect Administrator password key!", "error");
    }
    sessionStorage.setItem("crystal_admin_authenticated", "true");
    verifySessionState();
    triggerToast("Administrative session initialized successfully.", "success");
}

function logoutAdminSession() {
    sessionStorage.removeItem("crystal_admin_authenticated");
    verifySessionState();
    triggerToast("Session destroyed.", "success");
}

function verifySessionState() {
    const isAuthenticated = sessionStorage.getItem("crystal_admin_authenticated") === "true";
    const gate = document.getElementById('admin-auth-gate');
    const workspace = document.getElementById('admin-workspace');

    if (!isAuthenticated) {
        gate.classList.remove('hidden');
        workspace.classList.add('hidden');
        return;
    }

    gate.classList.add('hidden');
    workspace.classList.remove('hidden');
    
    const alertMsgInput = document.getElementById('alert-message-input');
    const alertToggle = document.getElementById('alert-toggle');
    if (alertMsgInput && SITE_DATA.alerts) alertMsgInput.value = SITE_DATA.alerts.message || "";
    if (alertToggle && SITE_DATA.alerts) alertToggle.checked = !!SITE_DATA.alerts.enabled;
}

function generateWorldCodeBlock() {
    const id = document.getElementById('w-id').value.trim();
    const name = document.getElementById('w-name').value.trim();
    const cat = document.getElementById('w-cat').value;
    const customIcon = document.getElementById('w-icon').value;
    const ratingValue = document.getElementById('w-rating').value.trim() || "5.0";
    const jcode = document.getElementById('w-jcode').value.trim() || `/join ${id}`;
    const creator = document.getElementById('w-creator').value.trim() || "Crystal Studios";
    const isPlayerMade = document.getElementById('w-player-made').checked;
    const desc = document.getElementById('w-desc').value.trim();

    if (!id || !name || !desc) return triggerToast("Please complete required elements (ID, Name, and Description).", "error");

    const colors = {
        pvp: { grad: "from-amethyst-700 to-purple-950", badge: "bg-red-950/50 border-red-800/30 text-red-400", lbl: "PvP Arena" },
        parkour: { grad: "from-indigo-900 to-amethyst-900", badge: "bg-cyan-950/50 border-cyan-800/30 text-cyan-400", lbl: "Parkour" },
        adventure: { grad: "from-fuchsia-900 to-amethyst-950", badge: "bg-fuchsia-950/50 border-fuchsia-800/30 text-fuchsia-400", lbl: "Adventure" },
        survival: { grad: "from-emerald-900 to-teal-950", badge: "bg-emerald-950/50 border-emerald-800/30 text-emerald-400", lbl: "Survival" },
        other: { grad: "from-amber-900 to-orange-950", badge: "bg-amber-950/50 border-amber-800/30 text-amber-400", lbl: "Other" },
        minigames: { grad: "from-pink-900 to-rose-950", badge: "bg-pink-950/50 border-pink-800/30 text-pink-400", lbl: "Minigame" }
    }[cat];

    const obj = {
        id, name, category: cat, icon: customIcon, gradient: colors.grad, tag: "", tagColor: "",
        badge: colors.lbl, badgeColor: colors.badge, desc, rating: ratingValue, joinCode: jcode,
        createdBy: creator, isPlayerMade: isPlayerMade
    };

    const index = SITE_DATA.worlds.findIndex(w => w.id === id);
    if (index > -1) SITE_DATA.worlds[index] = obj;
    else SITE_DATA.worlds.push(obj);

    triggerToast("Lobby updated in memory! Click 'Generate data.json Code' to get your final file.", "success");
}

function generateDataFileCode() {
    const alertMsgInput = document.getElementById('alert-message-input');
    const alertToggle = document.getElementById('alert-toggle');
    if (alertMsgInput && SITE_DATA.alerts) SITE_DATA.alerts.message = alertMsgInput.value.trim();
    if (alertToggle && SITE_DATA.alerts) SITE_DATA.alerts.enabled = alertToggle.checked;

    const rawCode = `const SITE_DATA = ${JSON.stringify(SITE_DATA, null, 2)};


if (localStorage.getItem("cs_local_data")) {
    try {
        const localData = JSON.parse(localStorage.getItem("cs_local_data"));
        Object.assign(SITE_DATA, localData);
    } catch(e) { console.error("Error restoration local matrix", e); }
}`;

    const outputSection = document.getElementById('code-output-section');
    const outputTextarea = document.getElementById('generated-data-output');

    if (outputSection && outputTextarea) {
        outputSection.classList.remove('hidden');
        outputTextarea.value = rawCode;
        triggerToast("Code generated successfully!", "success");
    }
}

let carouselInterval;
let currentSlide = 0;

function initCarousel() {
    const carousel = document.getElementById('team-carousel');
    const dotsContainer = document.getElementById('carousel-dots');
    const cards = document.querySelectorAll('.team-card');
    
    if (!carousel || !dotsContainer || cards.length === 0) return;

    dotsContainer.innerHTML = '';
    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `h-2.5 rounded-full transition-all duration-300 ${index === 0 ? 'bg-amethyst-400 w-6' : 'bg-amethyst-900/60 hover:bg-amethyst-500 w-2.5'}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

    carousel.addEventListener('scroll', () => {
        let closestIndex = 0;
        let minDistance = Infinity;
        const carouselCenter = carousel.scrollLeft + (carousel.clientWidth / 2);

        cards.forEach((card, index) => {
            const cardCenter = card.offsetLeft - carousel.offsetLeft + (card.clientWidth / 2);
            const distance = Math.abs(carouselCenter - cardCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        if (currentSlide !== closestIndex) {
            updateDots(closestIndex);
        }
    });

    startCarousel();

    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
    carousel.addEventListener('touchstart', stopCarousel, {passive: true});
    carousel.addEventListener('touchend', startCarousel, {passive: true});
}

function goToSlide(index) {
    const carousel = document.getElementById('team-carousel');
    const cards = document.querySelectorAll('.team-card');
    if (!carousel || !cards[index]) return;
    
    const targetCard = cards[index];
    const scrollPos = targetCard.offsetLeft - carousel.offsetLeft - (carousel.clientWidth / 2) + (targetCard.clientWidth / 2);
    
    carousel.scrollTo({ left: scrollPos, behavior: 'smooth' });
    
    updateDots(index);
    stopCarousel();
    startCarousel(); 
}

function updateDots(activeIndex) {
    const dotsContainer = document.getElementById('carousel-dots');
    if (!dotsContainer) return;
    
    Array.from(dotsContainer.children).forEach((dot, index) => {
        if (index === activeIndex) {
            dot.className = 'h-2.5 rounded-full transition-all duration-300 bg-amethyst-400 w-6'; 
        } else {
            dot.className = 'h-2.5 rounded-full transition-all duration-300 bg-amethyst-900/60 hover:bg-amethyst-500 w-2.5'; 
        }
    });
    currentSlide = activeIndex;
}

function startCarousel() {
    stopCarousel(); 
    carouselInterval = setInterval(() => {
        const cards = document.querySelectorAll('.team-card');
        if (cards.length === 0) return;
        
        let nextSlide = currentSlide + 1;
        if (nextSlide >= cards.length) nextSlide = 0; 
        
        goToSlide(nextSlide);
    }, 4000); 
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

document.addEventListener("DOMContentLoaded", () => {
    initCarousel();
});
