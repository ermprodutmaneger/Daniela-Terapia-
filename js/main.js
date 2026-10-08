/* =========================================================================
   Daniela Lina Terapia Integrativa — scripts
   Estrutura e comportamento adaptados do projeto anterior
   ========================================================================= */
(function () {
  'use strict';

  var html = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var noAnim = false;

  var hasGSAP = typeof window.gsap !== 'undefined';
  var hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  var hasSTT = hasGSAP && typeof window.SplitText !== 'undefined';
  var hasLenis = typeof window.Lenis !== 'undefined';

  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (hasSTT) gsap.registerPlugin(SplitText);

  /* --- espera as fontes antes de dividir os textos --- */
  var fontsDone = false;
  var fontsQueue = [];

  function whenFonts(cb) {
    if (fontsDone) { cb(); return; }
    fontsQueue.push(cb);
  }
  function markFontsReady() {
    if (fontsDone) return;
    fontsDone = true;
    var q = fontsQueue.slice();
    fontsQueue.length = 0;
    q.forEach(function (fn) { try { fn(); } catch (e) {} });
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(markFontsReady);
    setTimeout(markFontsReady, 1500);
  } else {
    markFontsReady();
  }

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ------------------------------------------------------------------
     1. Scroll suave
     ------------------------------------------------------------------ */
  var lenis = null;

  function initScroll() {
    if (!hasLenis || reduced) return;

    lenis = new Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6
    });

    if (hasST) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(t) { lenis.raf(t); requestAnimationFrame(raf); });
    }
  }

  function stopScroll() { if (lenis) lenis.stop(); }
  function startScroll() { if (lenis) lenis.start(); }

  function scrollTo(target) {
    var el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.15 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
  }

  /* ------------------------------------------------------------------
     2. Abertura (~1s) — nunca bloqueia o conteúdo
     ------------------------------------------------------------------ */
  function initIntro() {
    var intro = $('#intro');
    if (!intro) { html.classList.remove('intro-on'); return; }

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      html.classList.remove('intro-on');
      intro.setAttribute('hidden', '');
      intro.style.display = 'none';
      window.__DLT_READY__ = true;
      try { sessionStorage.setItem('dlt-intro', 'done'); } catch (e) {}
      startScroll();
      if (hasST) ScrollTrigger.refresh();
      runHeroIn();
    }

    // Sem animação: some na hora e mostra o conteúdo
    if (!hasGSAP || reduced || noAnim || !html.classList.contains('intro-on')) {
      finish();
      return;
    }

    stopScroll();

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish });

    tl.fromTo('.intro__logo',
        { opacity: 0, scale: 0.92, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.46 })
      .fromTo('.intro__line',
        { width: 0 },
        { width: 86, duration: 0.34, ease: 'power2.out' }, 0.30)
      .to('.intro__inner',
        { opacity: 0, y: -8, duration: 0.26, ease: 'power2.in' }, 0.62)
      .to(intro,
        { opacity: 0, duration: 0.26, ease: 'power1.out' }, 0.68);

    // Rede de segurança: termina em ~1s de qualquer forma
    gsap.delayedCall(1.05, finish);
  }

  /* ------------------------------------------------------------------
     3. Entrada do início
     ------------------------------------------------------------------ */
  function runHeroIn() {
    if (!hasGSAP || reduced || noAnim) {
      $$('[data-hero-kicker], [data-hero-sub], [data-hero-actions], [data-hero-scroll], [data-hero-photo]')
        .forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
      $$('[data-split-lines]').forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    // as fontes precisam estar prontas para dividir as linhas corretamente
    whenFonts(heroSplitIn);
  }

  function heroSplitIn() {
    if (!hasGSAP || reduced || noAnim) return;

    // separa o título do início em linhas (feito aqui para casar com a abertura)
    var title = $('#hero-title');
    var lines = [];
    if (hasSTT && title && !title.dataset.split) {
      title.dataset.split = '1';
      var st = new SplitText(title, { type: 'lines', linesClass: 'line-inner' });
      st.lines.forEach(function (line) {
        var mask = document.createElement('span');
        mask.className = 'line-mask';
        line.parentNode.insertBefore(mask, line);
        mask.appendChild(line);
      });
      gsap.set(st.lines, { yPercent: 102 });
      lines = st.lines;
    }

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('[data-hero-kicker]', { opacity: 1, y: 0, duration: 0.5 }, 0)
      .to(lines.length ? lines : [], { yPercent: 0, duration: 0.86, stagger: 0.085 }, 0.06)
      .to('[data-hero-sub]', { opacity: 1, y: 0, duration: 0.62 }, 0.30)
      .to('[data-hero-actions]', { opacity: 1, y: 0, duration: 0.62 }, 0.40)
      .to('[data-hero-scroll]', { opacity: 1, y: 0, duration: 0.6 }, 0.52)
      .fromTo('[data-hero-photo]',
        { opacity: 0, yPercent: 7, scale: 1.04 },
        { opacity: 1, yPercent: 0, scale: 1, duration: 1.05, ease: 'expo.out' }, 0.10);
  }

  /* ------------------------------------------------------------------
     4. Navegação
     ------------------------------------------------------------------ */
  function initNav() {
    var nav = $('#nav');
    var burger = $('#burger');
    var menu = $('#menu');
    if (!nav) return;

    var last = 0;

    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      nav.classList.toggle('is-past', y > 40);
      if (menu && menu.classList.contains('is-open')) {
        nav.classList.remove('is-hidden');
      } else {
        // esconde ao descer, mostra ao subir
        if (y > 260 && y > last) nav.classList.add('is-hidden');
        else nav.classList.remove('is-hidden');
      }
      last = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Menu mobile
    if (burger && menu) {
      burger.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) { stopScroll(); } else { startScroll(); }
      });

      $$('a', menu).forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          startScroll();
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          startScroll();
          burger.focus();
        }
      });
    }

    // Links internos
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        scrollTo(el);
        history.replaceState(null, '', id);
      });
    });

    // Link ativo
    var links = $$('.nav__links a');
    if (links.length && 'IntersectionObserver' in window) {
      var map = {};
      links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove('is-active'); });
          var a = map[en.target.id];
          if (a) a.classList.add('is-active');
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

      Object.keys(map).forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec) io.observe(sec);
      });
    }
  }

  /* ------------------------------------------------------------------
     5. Títulos em linhas
     ------------------------------------------------------------------ */
  function initSplitLines() {
    var els = $$('[data-split-lines]');
    if (!els.length) return [];

    if (!hasSTT || reduced || noAnim) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return [];
    }

    var splits = [];

    els.forEach(function (el) {
      // o título do início é tratado em runHeroIn()
      if (el.id === 'hero-title') return;

      var st = new SplitText(el, { type: 'lines', linesClass: 'line-inner' });
      splits.push(st);

      st.lines.forEach(function (line) {
        var mask = document.createElement('span');
        mask.className = 'line-mask';
        line.parentNode.insertBefore(mask, line);
        mask.appendChild(line);
      });

      gsap.set(st.lines, { yPercent: 102 });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          el.classList.add('is-in');
          gsap.to(st.lines, {
            yPercent: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.075
          });
        }
      });

      // se já está visível no carregamento
      if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
        el.classList.add('is-in');
        gsap.to(st.lines, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.075 });
      }
    });

    return splits;
  }

  /* ------------------------------------------------------------------
     6. Revelações ao rolar
     ------------------------------------------------------------------ */
  function initReveals() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    if (!hasST || reduced || noAnim) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    items.forEach(function (el, i) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          gsap.to(el, {
            opacity: 1, y: 0,
            duration: 0.78,
            ease: 'power3.out',
            delay: (i % 4) * 0.06,
            onComplete: function () { el.classList.add('is-in'); }
          });
        }
      });
    });

    // recorte da foto da seção "Sobre"
    var clip = $('.reveal-clip');
    if (clip) {
      ScrollTrigger.create({
        trigger: clip,
        start: 'top 86%',
        once: true,
        onEnter: function () { clip.classList.add('is-in'); }
      });
    }
  }

  /* ------------------------------------------------------------------
     7. Galeria horizontal
     ------------------------------------------------------------------ */
  function initGallery() {
    var viewport = $('#gallery-viewport');
    var track = $('#gallery-track');
    var bar = $('#gallery-progress');
    if (!viewport || !track) return;

    function setProgress(p) {
      if (bar) bar.style.setProperty('--p', Math.max(0, Math.min(1, p)));
    }
    setProgress(0);

    // Mobile: rolagem nativa com encaixe
    var isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (isMobile || !hasST || reduced || noAnim) {
      viewport.addEventListener('scroll', function () {
        var max = viewport.scrollWidth - viewport.clientWidth;
        setProgress(max > 0 ? viewport.scrollLeft / max : 0);
      }, { passive: true });
      if (!hasST || reduced || noAnim) return;

      // entrada dos cartões no mobile
      gsap.set('.gcard', { opacity: 0, y: 26 });
      ScrollTrigger.create({
        trigger: viewport,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.to('.gcard', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 });
        }
      });
      return;
    }

    // Desktop: fixa a seção e rola na horizontal
    var mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', function () {
      function dist() { return Math.max(0, track.scrollWidth - viewport.clientWidth); }

      gsap.set('.gcard', { opacity: 0, y: 30 });
      gsap.to('.gcard', {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power3.out', stagger: 0.07,
        scrollTrigger: { trigger: viewport, start: 'top 92%', once: true }
      });

      var tween = gsap.to(track, {
        x: function () { return -dist(); },
        ease: 'none',
        scrollTrigger: {
          trigger: '.gallery',
          start: 'top top',
          end: function () { return '+=' + (dist() + 220); },
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) { setProgress(self.progress); }
        }
      });

      return function () {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(track, { clearProps: 'x' });
      };
    });
  }

  /* ------------------------------------------------------------------
     8. Foto principal acompanha o scroll
     ------------------------------------------------------------------ */
  function initHeroParallax() {
    if (!hasST || reduced || noAnim) return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    var img = $('[data-hero-photo] .frame img');
    if (!img) return;

    // dá sobra à imagem para ela deslizar sem nunca abrir um vão na moldura
    gsap.set(img, { scale: 1.18, transformOrigin: '50% 40%' });

    gsap.to(img, {
      yPercent: 5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ------------------------------------------------------------------
     9. Marquee
     ------------------------------------------------------------------ */
  function initMarquee() {
    var items = $$('[data-marquee]');
    if (!items.length) return;

    items.forEach(function (el) {
      var span = el.firstElementChild;
      if (!span) return;

      var need = Math.ceil(window.innerWidth / Math.max(120, span.offsetWidth)) + 1;
      for (var i = 1; i < Math.min(need, 8); i++) {
        var c = span.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        el.appendChild(c);
      }

      if (!hasGSAP || reduced || noAnim) return;

      var dir = parseFloat(el.getAttribute('data-dir')) || 1;
      var w = span.offsetWidth;

      gsap.set(el, { x: dir === 1 ? 0 : -w });
      gsap.to(el, {
        x: dir === 1 ? -w : 0,
        duration: Math.max(14, w / 58),
        ease: 'none',
        repeat: -1
      });
    });
  }

  /* ------------------------------------------------------------------
     10. Dúvidas frequentes (acordeão)
     ------------------------------------------------------------------ */
  function initFaq() {
    var items = $$('.faq__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var sum = $('summary', item);
      var body = $('.faq__a', item);
      if (!sum || !body) return;

      var animating = false;

      sum.addEventListener('click', function (e) {
        e.preventDefault();
        if (animating) return;

        var willOpen = !item.hasAttribute('open');

        // fecha as outras
        items.forEach(function (other) {
          if (other !== item && other.hasAttribute('open')) close(other);
        });

        if (willOpen) open(item); else close(item);
      });

      function open(it) {
        it.setAttribute('open', '');
        var b = $('.faq__a', it);
        if (!b) return;
        if (!hasGSAP || reduced || noAnim) { b.style.height = 'auto'; return; }
        animating = true;
        gsap.set(b, { height: 'auto' });
        var h = b.offsetHeight;
        gsap.fromTo(b, { height: 0, opacity: 0 }, {
          height: h, opacity: 1, duration: 0.5, ease: 'power3.out',
          onComplete: function () { b.style.height = 'auto'; animating = false; if (hasST) ScrollTrigger.refresh(); }
        });
      }

      function close(it) {
        var b = $('.faq__a', it);
        if (!b) { it.removeAttribute('open'); return; }
        if (!hasGSAP || reduced || noAnim) { it.removeAttribute('open'); return; }
        animating = true;
        gsap.to(b, {
          height: 0, opacity: 0, duration: 0.36, ease: 'power2.inOut',
          onComplete: function () {
            it.removeAttribute('open');
            b.style.height = '';
            animating = false;
            if (hasST) ScrollTrigger.refresh();
          }
        });
      }

      // teclado
      sum.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sum.click(); }
      });
    });
  }

  /* ------------------------------------------------------------------
     11. Cursor personalizado
     ------------------------------------------------------------------ */
  function initCursor() {
    var cur = $('#cursor');
    if (!cur) return;
    if (reduced || noAnim) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches) return;

    var ring = $('.cursor__ring', cur);
    var dot = $('.cursor__dot', cur);
    var label = $('.cursor__label', cur);
    if (!ring || !dot) return;

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    var active = false;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!active) { active = true; cur.classList.add('is-in'); html.classList.add('cursor-on'); }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      cur.classList.remove('is-in');
      html.classList.remove('cursor-on');
      active = false;
    });

    gsap.ticker.add(function () {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    });

    $$('[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        if (label) label.textContent = el.getAttribute('data-cursor') || '';
        cur.classList.add('is-on');
      });
      el.addEventListener('mouseleave', function () { cur.classList.remove('is-on'); });
    });
  }

  /* ------------------------------------------------------------------
     12. Botões magnéticos
     ------------------------------------------------------------------ */
  function initMagnets() {
    if (!hasGSAP || reduced || noAnim) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    $$('[data-magnet]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.3;
        gsap.to(el, { x: x, y: y, duration: 0.5, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ------------------------------------------------------------------
     13. WhatsApp flutuante
     ------------------------------------------------------------------ */
  function initFloat() {
    var el = $('#wafloat');
    if (!el) return;
    setTimeout(function () { el.classList.add('is-in'); }, 1200);
  }

  /* ------------------------------------------------------------------
     14. Formulário de contato
     ------------------------------------------------------------------ */
  function initForm() {
    var form = $('#preform');
    if (!form) return;

    var WA = 'https://wa.me/5511961147268';
    var fNome = $('#pf-nome');
    var fWhats = $('#pf-whats');
    var fDias = $('#pf-dias');
    var fMsg = $('#pf-msg');
    var fOk = $('#pf-ok');
    var review = $('#preform-review');
    var reviewTa = $('#pf-review');
    var send = $('#pf-send');
    var edit = $('#pf-edit');

    /* --- máscara de WhatsApp --- */
    if (fWhats) {
      fWhats.addEventListener('input', function () {
        var d = fWhats.value.replace(/\D/g, '').slice(0, 11);
        var out = '';
        if (d.length) out = '(' + d.slice(0, 2);
        if (d.length >= 2) out += ') ';
        if (d.length > 2) out += d.slice(2, 7);
        if (d.length > 7) out += '-' + d.slice(7, 11);
        fWhats.value = out;
      });
    }

    /* --- erros --- */
    function fieldOf(input) { return input.closest('.field'); }

    function setError(input, msgElId, msg) {
      var err = document.getElementById(msgElId);
      var wrap = fieldOf(input);
      if (err) {
        err.textContent = msg || '';
        err.classList.toggle('is-on', !!msg);
      }
      if (wrap) wrap.classList.toggle('is-bad', !!msg);
      if (msg) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }

    function clearGroup(name, msgElId, wrapEl) {
      var err = document.getElementById(msgElId);
      if (err) { err.textContent = ''; err.classList.remove('is-on'); }
      if (wrapEl) wrapEl.classList.remove('is-bad');
    }

    if (fNome) fNome.addEventListener('input', function () { if (fNome.value.trim().length >= 2) setError(fNome, 'err-nome', ''); });
    if (fWhats) fWhats.addEventListener('input', function () { if (fWhats.value.replace(/\D/g, '').length >= 10) setError(fWhats, 'err-whats', ''); });
    if (fDias) fDias.addEventListener('input', function () { if (fDias.value.trim().length >= 3) setError(fDias, 'err-dias', ''); });
    if (fOk) fOk.addEventListener('change', function () { if (fOk.checked) clearGroup('consentimento', 'err-ok', fieldOf(fOk)); });

    $$('input[name="formato"]', form).forEach(function (r) {
      r.addEventListener('change', function () { clearGroup('formato', 'err-formato', $('.field:has(.radios)') || r.closest('.field')); });
    });

    /* --- validação --- */
    function validate() {
      var ok = true;
      var firstBad = null;

      // nome
      var nome = (fNome && fNome.value.trim()) || '';
      if (nome.length < 2) {
        setError(fNome, 'err-nome', 'Escreva o seu nome (pelo menos 2 letras).');
        ok = false; firstBad = firstBad || fNome;
      } else setError(fNome, 'err-nome', '');

      // whatsapp
      var digits = (fWhats && fWhats.value.replace(/\D/g, '')) || '';
      if (digits.length < 10 || digits.length > 11) {
        setError(fWhats, 'err-whats', 'Informe um WhatsApp válido com DDD.');
        ok = false; firstBad = firstBad || fWhats;
      } else setError(fWhats, 'err-whats', '');

      // formato
      var formato = ($$('input[name="formato"]:checked', form)[0] || {}).value || '';
      var fmtWrap = $('.radios') ? $('.radios').closest('.field') : null;
      if (!formato) {
        var errF = document.getElementById('err-formato');
        if (errF) { errF.textContent = 'Escolha o formato de preferência.'; errF.classList.add('is-on'); }
        if (fmtWrap) fmtWrap.classList.add('is-bad');
        ok = false; firstBad = firstBad || ($$('input[name="formato"]', form)[0] || null);
      } else clearGroup('formato', 'err-formato', fmtWrap);

      // dias / horários
      var dias = (fDias && fDias.value.trim()) || '';
      if (dias.length < 3) {
        setError(fDias, 'err-dias', 'Conte quais dias ou horários funcionam melhor para você.');
        ok = false; firstBad = firstBad || fDias;
      } else setError(fDias, 'err-dias', '');

      // consentimento
      if (!fOk || !fOk.checked) {
        var errO = document.getElementById('err-ok');
        if (errO) { errO.textContent = 'É preciso autorizar o contato para continuarmos.'; errO.classList.add('is-on'); }
        if (fOk) { var w = fOk.closest('.field'); if (w) w.classList.add('is-bad'); }
        ok = false; firstBad = firstBad || fOk;
      } else clearGroup('consentimento', 'err-ok', fOk.closest('.field'));

      if (!ok && firstBad) {
        firstBad.focus({ preventScroll: true });
        var y = firstBad.getBoundingClientRect().top + window.pageYOffset - 120;
        if (lenis) lenis.scrollTo(y, { duration: 0.8 });
        else window.scrollTo({ top: y, behavior: 'smooth' });
      }

      return ok
        ? { nome: nome, whats: fWhats.value.trim(), formato: formato, dias: dias, msg: (fMsg && fMsg.value.trim()) || '' }
        : null;
    }

    /* --- monta a mensagem --- */
    function buildMessage(d) {
      function clean(s) {
        return String(s || '')
          .replace(/[<>]/g, '')
          .replace(/\r/g, '')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
      }
      var out = '';
      out += 'Olá, Daniela! Tudo bem?\n\n';
      out += 'Meu nome é ' + clean(d.nome) + '.\n\n';
      out += 'Gostaria de conhecer o atendimento ' + clean(d.formato).toLowerCase() + '.\n\n';
      out += '*Dias ou horários preferidos:*\n' + clean(d.dias) + '\n\n';
      out += '*Meu WhatsApp:* ' + clean(d.whats) + '\n';
      if (d.msg) out += '\n*Recado:*\n' + clean(d.msg) + '\n';
      out += '\nAutorizo o contato pelo WhatsApp.';
      return out;
    }

    /* --- envio --- */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = validate();
      if (!d) return;

      var text = buildMessage(d);

      if (review && reviewTa && send) {
        reviewTa.value = text;
        review.hidden = false;
        send.href = WA + '?text=' + encodeURIComponent(text);

        if (hasGSAP && !reduced && !noAnim) {
          gsap.fromTo(review,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out',
              onComplete: function () { if (hasST) ScrollTrigger.refresh(); } });
        }

        var y = review.getBoundingClientRect().top + window.pageYOffset - 110;
        if (lenis) lenis.scrollTo(y, { duration: 0.9 });
        else window.scrollTo({ top: y, behavior: 'smooth' });

        setTimeout(function () { reviewTa.focus({ preventScroll: true }); }, 380);
      } else {
        // sem bloco de revisão: abre direto
        var url = WA + '?text=' + encodeURIComponent(text);
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });

    // mantém o link sincronizado se a pessoa editar a mensagem
    if (reviewTa && send) {
      reviewTa.addEventListener('input', function () {
        var t = reviewTa.value;
        if (t.length > 2000) t = t.slice(0, 2000);
        send.href = WA + '?text=' + encodeURIComponent(t);
      });
    }

    if (edit && review) {
      edit.addEventListener('click', function () {
        review.hidden = true;
        if (fNome) fNome.focus({ preventScroll: true });
        var y = form.getBoundingClientRect().top + window.pageYOffset - 100;
        if (lenis) lenis.scrollTo(y, { duration: 0.8 });
        else window.scrollTo({ top: y, behavior: 'smooth' });
      });
    }
  }

  /* ------------------------------------------------------------------
     15. Ano no rodapé
     ------------------------------------------------------------------ */
  function initYear() {
    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------
     16. Início
     ------------------------------------------------------------------ */
  function boot() {
    if (html.classList.contains('no-anim')) noAnim = true;

    initYear();
    initScroll();
    initIntro();
    initNav();
    whenFonts(function () {
      initSplitLines();
      initReveals();
      if (hasST) ScrollTrigger.refresh();
    });
    initGallery();
    initHeroParallax();
    initMarquee();
    initFaq();
    initCursor();
    initMagnets();
    initFloat();
    initForm();

    // recalcula quando as fontes e as imagens terminam de carregar
    if (hasST) {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
      }
      var t = setTimeout(function () { ScrollTrigger.refresh(); clearTimeout(t); }, 900);
    }

    // navegação por teclado no carrossel
    var vp = $('#gallery-viewport');
    if (vp) {
      vp.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var card = $('.gcard', vp);
        if (!card) return;
        var step = card.offsetWidth + 22;
        vp.scrollBy({ left: e.key === 'ArrowRight' ? step : -step, behavior: 'smooth' });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
