/**
 * KORKYT ATA KYZYLORDA UNIVERSITY - CYBERSECURITY
 * Interactive Scripts & Visualizations
 */

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initTerminal();
  initEntropyMeter();
  initUntCalculator();
  initTabs();
  initMobileMenu();
  initFormHandler();
  initLangSwitch();
});

/* ==========================================================================
   1. CYBER NETWORK CANVAS BACKGROUND
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.floor((width * height) / 22000);
  const nodes = [];
  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1.5,
      color: Math.random() > 0.3 ? '#00f0ff' : '#00ff88',
      pulse: Math.random() * Math.PI,
    });
  }

  // Data packets travelling between nodes
  const packets = [];
  function spawnPacket() {
    if (nodes.length < 2) return;
    const n1 = nodes[Math.floor(Math.random() * nodes.length)];
    const n2 = nodes[Math.floor(Math.random() * nodes.length)];
    if (n1 !== n2) {
      packets.push({
        x: n1.x,
        y: n1.y,
        targetX: n2.x,
        targetY: n2.y,
        progress: 0,
        speed: 0.015 + Math.random() * 0.02,
      });
    }
  }
  setInterval(spawnPacket, 800);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw and update nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      // Mouse interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          n.x -= (dx / dist) * force * 3;
          n.y -= (dy / dist) * force * 3;
        }
      }

      n.pulse += 0.03;
      const alpha = 0.4 + Math.sin(n.pulse) * 0.3;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.color === '#00f0ff' 
        ? `rgba(0, 240, 255, ${alpha})` 
        : `rgba(0, 255, 136, ${alpha})`;
      ctx.fill();

      // Connect near nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n.x - n2.x;
        const dy = n.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Animate data packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.progress += p.speed;
      if (p.progress >= 1) {
        packets.splice(i, 1);
        continue;
      }
      const curX = p.x + (p.targetX - p.x) * p.progress;
      const curY = p.y + (p.targetY - p.y) * p.progress;

      ctx.beginPath();
      ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff88';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00ff88';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. INTERACTIVE STUDENT CYBER TERMINAL
   ========================================================================== */
function initTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  if (!terminalBody || !terminalInput) return;

  const commandResponses = {
    help: `[+] Доступные команды терминала:
  • help       - показать эту справку
  • about      - информация об университете и образовательной программе
  • skills     - ключевые навыки выпускника
  • curriculum - структура дисциплин по курсам
  • seoultech  - программа совместного обучения с Сеульским университетом
  • ctf        - студенческий клуб кибербезопасности и состязания
  • grant      - условия поступления на грант
  • clear      - очистить окно терминала
  • apply      - перейти к подаче заявки на обучение`,

    about: `[KORKYT ATA CYBERSECURITY v2.6]
Образовательные программы:
  - 6B06303 «Кибербезопасность» (Институт искусственного интеллекта)
  - 6B06352 «Системы информационной безопасности»
Особенности:
  - Совместно с SeoulTech (Южная Корея)
  - Участник европейской программы Erasmus+ Cyber4CA
  - Современные CyberLabs & SOC-центр в кампусе Кызылорды`,

    skills: `[+] ПРАКТИЧЕСКИЙ СТЕК И НАВЫКИ:
  • Red Teaming: Тестирование на проникновение, эксплуатация уязвимостей (OWASP Top 10)
  • Blue Teaming: Мониторинг инцидентов (SOC), анализ логов, SIEM (Splunk/ELK)
  • Cryptography: Симметричное/асимметричное шифрование, PKI, цифровая подпись
  • Network Security: Анализ трафика (Wireshark), настройка IDS/IPS (Snort, Suricata)
  • DevSecOps & Cloud: Безопасность CI/CD, Docker hardening, Linux kernel security`,

    curriculum: `[+] УЧЕБНЫЙ ПЛАН:
  • 1 КУРС: Основы алгоритмизации, Компьютерные сети, Архитектура ЭВМ, Python/C++
  • 2 КУРС: Операционные системы (Linux), Базы данных, Криптографические протоколы
  • 3 КУРС: Этичный хакинг, Аудит безопасности, Анализ вредоносного ПО (Reverse Engineering)
  • 4 КУРС: Безопасность облачных технологий и ИИ, Дипломный проект, Практика в SOC-центрах`,

    seoultech: `[SEOULTECH COLLABORATION]
  • Партнер: Seoul National University of Science and Technology (Южная Корея)
  • Институт искусственного интеллекта на базе Кызылординского университета Коркыт Ата
  • Возможность получения двойного диплома (2+2) и стажировок в Сеуле`,

    ctf: `[KORKYT CYBER CLUB & CTF]
  • Регулярные внутренние и республиканские соревнования Capture The Flag
  • Направления: Web Security, Reverse Engineering, Cryptography, Forensics, PWN
  • Подготовка к KazHackStan, CyberBridge и международным турнирам!`,

    grant: `[ПОСТУПЛЕНИЕ НА ГОСУДАРСТВЕННЫЙ ГРАНТ]
  • Профильные предметы ЕНТ: Математика + Информатика
  • Проходной балл на грант (прошлый год): от 95+ баллов
  • Квоты: сельская квота, победители олимпиад по информатике и робототехнике`,

    apply: `[+] Переход к форме заявки... Заполните ваши контактные данные ниже на странице!`
  };

  function appendTerminal(text, type = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.innerHTML = text.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = terminalInput.value.trim().toLowerCase();
      if (!rawCmd) return;

      appendTerminal(`<span class="prompt-symbol">korkyt-student@cyber-sec:~$</span> ${escapeHtml(rawCmd)}`);
      terminalInput.value = '';

      if (rawCmd === 'clear') {
        terminalBody.innerHTML = '';
        return;
      }

      if (rawCmd === 'apply') {
        appendTerminal(commandResponses.apply, 'info');
        const section = document.getElementById('apply');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (commandResponses[rawCmd]) {
        appendTerminal(commandResponses[rawCmd], 'info');
      } else {
        appendTerminal(`Команда '${escapeHtml(rawCmd)}' не распознана. Введите <span class="sys">help</span> для списка доступных команд.`, 'warn');
      }
    }
  });

  // Handle quick command buttons
  document.querySelectorAll('.quick-cmd-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      terminalInput.value = cmd;
      terminalInput.focus();
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      terminalInput.dispatchEvent(event);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[m]));
}

/* ==========================================================================
   3. PASSWORD ENTROPY & HASH ANALYZER MINI-LAB
   ========================================================================== */
function initEntropyMeter() {
  const input = document.getElementById('entropy-input');
  const bar = document.getElementById('entropy-bar');
  const bitsText = document.getElementById('entropy-bits');
  const timeText = document.getElementById('entropy-time');
  const hashText = document.getElementById('entropy-hash');

  if (!input || !bar) return;

  input.addEventListener('input', () => {
    const val = input.value;
    if (!val) {
      bar.style.width = '0%';
      bar.style.backgroundColor = 'var(--neon-red)';
      bitsText.textContent = '0 бит';
      timeText.textContent = 'Мгновенно';
      hashText.textContent = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      return;
    }

    // Calculate pool size
    let pool = 0;
    if (/[a-z]/.test(val)) pool += 26;
    if (/[A-Z]/.test(val)) pool += 26;
    if (/[0-9]/.test(val)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(val)) pool += 33;

    // Shannon Entropy approximation: E = L * log2(pool)
    const entropy = Math.round(val.length * (Math.log2(pool || 1)));
    const percent = Math.min(100, Math.round((entropy / 80) * 100));

    bar.style.width = `${percent}%`;

    // Colors & Crack times
    if (entropy < 35) {
      bar.style.backgroundColor = 'var(--neon-red)';
      timeText.textContent = 'Несколько секунд (Brute-force)';
      timeText.style.color = 'var(--neon-red)';
    } else if (entropy < 60) {
      bar.style.backgroundColor = 'var(--neon-amber)';
      timeText.textContent = 'Несколько дней / недель';
      timeText.style.color = 'var(--neon-amber)';
    } else {
      bar.style.backgroundColor = 'var(--neon-green)';
      timeText.textContent = 'Тысячи лет (Криптостойкий!)';
      timeText.style.color = 'var(--neon-green)';
    }

    bitsText.textContent = `${entropy} бит энтропии`;

    // Fast simulated SHA-256 style hash
    hashText.textContent = simplePseudoHash(val);
  });
}

function simplePseudoHash(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57, h3 = 0x811c9dc5, h4 = 0x9e3779b9;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489909);
  }
  const hex = (n) => ('00000000' + (n >>> 0).toString(16)).slice(-8);
  return `${hex(h1)}${hex(h2)}${hex(h3)}${hex(h4)}${hex(h2 ^ h3)}${hex(h1 ^ h4)}${hex(h3 + h1)}${hex(h4 + h2)}`;
}

/* ==========================================================================
   4. UNT (ЕНТ) ADMISSION CALCULATOR
   ========================================================================== */
function initUntCalculator() {
  const calcBtn = document.getElementById('calc-btn');
  const totalScoreInput = document.getElementById('unt-total');
  const mathScoreInput = document.getElementById('unt-math');
  const csScoreInput = document.getElementById('unt-cs');
  const resultBox = document.getElementById('calc-result');
  const resultScore = document.getElementById('calc-result-score');
  const resultDesc = document.getElementById('calc-result-desc');

  if (!calcBtn) return;

  calcBtn.addEventListener('click', () => {
    const total = parseInt(totalScoreInput.value, 10);
    const math = parseInt(mathScoreInput.value, 10);
    const cs = parseInt(csScoreInput.value, 10);

    if (isNaN(total) || total < 50 || total > 140) {
      alert('Пожалуйста, введите корректный общий балл ЕНТ (от 50 до 140).');
      return;
    }

    resultBox.classList.add('show');

    if (total >= 105) {
      resultScore.textContent = `Шанс на грант: ВЫСОКИЙ (95%+)`;
      resultScore.style.color = 'var(--neon-green)';
      resultDesc.innerHTML = `Отличный результат! С баллом <strong>${total}</strong> вы являетесь главным претендентом на государственный образовательный грант по программе <strong>6B06303 «Кибербезопасность»</strong> (Институт ИИ & SeoulTech) или 6B06352!`;
    } else if (total >= 85) {
      resultScore.textContent = `Шанс на грант: ХОРОШИЙ (70-85%)`;
      resultScore.style.color = 'var(--neon-cyan)';
      resultDesc.innerHTML = `У вас высокие шансы получить государственный образовательный грант, а также право на университетские гранты и скидки ректора Кызылординского университета Коркыт Ата.`;
    } else if (total >= 65) {
      resultScore.textContent = `Шанс на грант: СРЕДНИЙ / ПЛАТНОЕ ОБУЧЕНИЕ`;
      resultScore.style.color = 'var(--neon-amber)';
      resultDesc.innerHTML = `Вы проходите минимальный порог на специальность «Кибербезопасность». При наличии сельской квоты шансы на грант возрастают, либо доступно платное отделение с рассрочкой.`;
    } else {
      resultScore.textContent = `ПОРОГОВЫЙ БАЛЛ ПРОЙДЕН`;
      resultScore.style.color = 'var(--neon-red)';
      resultDesc.innerHTML = `Вы преодолели порог для поступления в национальные и региональные вузы. Рекомендуем рассмотреть платную форму обучения или колледж-мост.`;
    }
  });
}

/* ==========================================================================
   5. CURRICULUM TABS
   ========================================================================== */
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.curriculum-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      contents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    toggle.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
  });

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

/* ==========================================================================
   7. APPLICATION FORM HANDLER & TOAST
   ========================================================================== */
function initFormHandler() {
  const form = document.getElementById('apply-form');
  const toast = document.getElementById('toast-msg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();

    if (!name || !phone) {
      alert('Пожалуйста, заполните имя и номер телефона.');
      return;
    }

    // Show simulated toast
    if (toast) {
      toast.innerHTML = `<span>🛡️</span> Заявка абитуриента <strong>${name}</strong> успешно зарегистрирована! Приемная комиссия свяжется с вами.`;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 5000);
    }

    form.reset();
  });
}

/* ==========================================================================
   8. LANGUAGE SWITCHER (RU / KZ)
   ========================================================================== */
const i18n = {
  ru: {
    brand_sub: "Институт искусственного интеллекта & IT",
    nav_about: "О программе",
    nav_curriculum: "Дисциплины",
    nav_seoultech: "SeoulTech & CyberLabs",
    nav_careers: "Карьера",
    nav_apply: "Поступление",
    hero_badge: "Приемная кампания 2026",
    hero_title_1: "Защищай цифровой мир с",
    hero_title_2: "Кибербезопасность",
    hero_title_3: "в Коркыт Ата",
    hero_desc: "Стань элитным специалистом по защите информации, этичному хакингу и расследованию киберугроз. Обучение совместно с SeoulTech (Южная Корея) и проектом ЕС Erasmus+ Cyber4CA.",
    hero_btn_apply: "Подать заявку онлайн",
    hero_btn_terminal: "Открыть Cyber Terminal",
    stat_code: "КОД ПРОГРАММЫ",
    stat_partner: "ПАРТНЕР ПРОГРАММЫ",
    stat_career: "ТРУДОУСТРОЙСТВО"
  },
  kz: {
    brand_sub: "Жасанды интеллект & IT институты",
    nav_about: "Бағдарлама жайлы",
    nav_curriculum: "Пәндер",
    nav_seoultech: "SeoulTech & CyberLabs",
    nav_careers: "Мансап",
    nav_apply: "Оқуға түсу",
    hero_badge: "Қабылдау науқаны 2026",
    hero_title_1: "Сандық әлемді қорғаңыз:",
    hero_title_2: "Киберқауіпсіздік",
    hero_title_3: "Қорқыт Ата университетінде",
    hero_desc: "Ақпараттық қауіпсіздік, этикалық хакинг және киберқауіптерді жою бойынша білікті маман болыңыз. Оңтүстік Кореяның SeoulTech университетімен және Erasmus+ Cyber4CA жобасымен бірлескен оқу.",
    hero_btn_apply: "Өтініш беру",
    hero_btn_terminal: "Cyber Terminal ашу",
    stat_code: "БАҒДАРЛАМА КОДЫ",
    stat_partner: "СЕРІКТЕС УНИВЕРСИТЕТ",
    stat_career: "ЖҰМЫСПЕН ҚАМТУ"
  }
};

function initLangSwitch() {
  const btnRu = document.getElementById('lang-ru');
  const btnKz = document.getElementById('lang-kz');

  if (!btnRu || !btnKz) return;

  function setLanguage(lang) {
    if (lang === 'kz') {
      btnKz.classList.add('active');
      btnRu.classList.remove('active');
    } else {
      btnRu.classList.add('active');
      btnKz.classList.remove('active');
    }

    const dict = i18n[lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }

  btnRu.addEventListener('click', () => setLanguage('ru'));
  btnKz.addEventListener('click', () => setLanguage('kz'));
}
