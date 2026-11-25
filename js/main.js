/* ============================================================
   모바일 청첩장 - 메인 스크립트
   config.js 의 CONFIG 값을 읽어 화면을 그립니다.
   ============================================================ */
(function () {
  'use strict';

  var C = window.CONFIG;
  var $ = function (id) { return document.getElementById(id); };
  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  /* ---------- 날짜 유틸 ---------- */
  var DOW_KO = ['일', '월', '화', '수', '목', '금', '토'];
  var DOW_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  var MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  var dParts = (C.wedding.date || '2026-01-01').split('-').map(Number);
  var tParts = (C.wedding.time || '12:00').split(':').map(Number);
  var WD = new Date(dParts[0], dParts[1] - 1, dParts[2], tParts[0], tParts[1], 0);

  function ampmKo(h, m) {
    var ap = h < 12 ? '오전' : '오후';
    var hh = h % 12; if (hh === 0) hh = 12;
    return ap + ' ' + hh + '시' + (m ? ' ' + m + '분' : '');
  }
  var DATE_KO = WD.getFullYear() + '년 ' + (WD.getMonth() + 1) + '월 ' + WD.getDate() + '일';
  var DOW_FULL = DOW_KO[WD.getDay()] + '요일';
  var TIME_KO = ampmKo(WD.getHours(), WD.getMinutes());
  var DATE_DOT = WD.getFullYear() + '.' + String(WD.getMonth() + 1).padStart(2, '0') + '.' + String(WD.getDate()).padStart(2, '0');
  var PLACE = C.wedding.venue + (C.wedding.hall ? ' ' + C.wedding.hall : '');

  /* ---------- 토스트 ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 1800);
  }

  function copyText(text, msg) {
    var done = function () { toast(msg || '복사되었습니다'); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { legacy(); });
    } else { legacy(); }
    function legacy() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { toast('복사에 실패했습니다'); }
      document.body.removeChild(ta);
    }
  }
  window.__copyText = copyText;
  window.__toast = toast;

  /* ---------- 이미지 로드 실패 처리 ---------- */
  function setImg(img, src) {
    img.addEventListener('error', function () { img.classList.add('is-missing'); });
    img.addEventListener('load', function () { img.classList.remove('is-missing'); });
    img.src = src;
  }

  /* ============================================================
     1. 인트로 / 메타
     ============================================================ */
  function renderHead() {
    var title = C.groom.name + ' ♥ ' + C.bride.name + ' 결혼합니다';
    document.title = title;
    $('ogTitle').content = title;
    var desc = DATE_KO + ' ' + DOW_FULL + ' ' + TIME_KO + ' · ' + PLACE;
    $('ogDesc').content = desc;
    document.querySelector('meta[name="description"]').content = desc;
    if (C.kakao.shareImage) $('ogImage').content = C.kakao.shareImage;

    $('introScript').textContent = C.greeting.eyebrow || 'Invite you';
    $('introSub').textContent = C.greeting.subtitle || '';
  }

  /* ============================================================
     2. 메인 사진
     ============================================================ */
  function renderHero() {
    setImg($('mainPhoto'), C.photos.main);
    $('heroNames').innerHTML = esc(C.groom.name) + ' &nbsp;·&nbsp; ' + esc(C.bride.name);
    $('heroWhen').innerHTML = DATE_DOT + ' ' + DOW_EN[WD.getDay()] + '<br>' + TIME_KO;
    $('heroWhere').textContent = PLACE;
  }

  /* ============================================================
     3. 인사말 + 혼주
     ============================================================ */
  function renderGreeting() {
    var body = $('greetingBody');
    var lines = C.greeting.body || [];

    if (C.greeting.acrostic) {
      /* 삼행시 — 각 줄 첫 글자를 강조하고 왼쪽으로 정렬합니다 */
      body.classList.add('is-acrostic');
      body.innerHTML = lines.filter(function (l) { return l !== ''; }).map(function (line) {
        return '<span class="gl"><b class="ac">' + esc(line.charAt(0)) + '</b>' +
          '<span class="gt">' + esc(line.slice(1)) + '</span></span>';
      }).join('');
    } else {
      body.innerHTML = lines.map(function (line) {
        return line === '' ? '<span class="sp"></span>' : esc(line);
      }).join('<br>').replace(/<br><span class="sp"><\/span><br>/g, '<span class="sp"></span>');
    }

    var wrap = $('family');
    [C.groom, C.bride].forEach(function (p) {
      var pa = [];
      if (p.father && p.father.name) pa.push((p.father.late ? '故 ' : '') + p.father.name);
      if (p.mother && p.mother.name) pa.push((p.mother.late ? '故 ' : '') + p.mother.name);
      var row = el('div', 'family__row');
      var left = pa.length
        ? esc(pa.join(' · ')) + '<span class="family__rel">의 ' + esc(p.relation || '') + '</span>'
        : '';
      row.innerHTML =
        '<span class="family__parents">' + left + '</span>' +
        '<span class="family__name">' + esc(p.name) + '</span>';
      wrap.appendChild(row);
    });
  }

  /* ============================================================
     3-1. 연락처 모달
     ============================================================ */
  function renderContact() {
    var wrap = $('contactList');
    [['신랑측', C.groom], ['신부측', C.bride]].forEach(function (pair) {
      var label = pair[0], p = pair[1];
      var people = [
        { who: label === '신랑측' ? '신랑' : '신부', name: p.name, phone: p.phone },
        { who: '아버지', name: p.father && p.father.name, phone: p.father && p.father.phone },
        { who: '어머니', name: p.mother && p.mother.name, phone: p.mother && p.mother.phone }
      ].filter(function (x) { return x.phone; });
      if (!people.length) return;

      var g = el('div', 'contact__grp');
      g.appendChild(el('p', 'contact__ttl', esc(label)));
      people.forEach(function (x) {
        var row = el('div', 'contact__row');
        row.innerHTML =
          '<span class="contact__who"><em>' + esc(x.who) + '</em>' + esc(x.name || '') + '</span>' +
          '<span class="contact__acts">' +
            '<a href="tel:' + esc(x.phone) + '" aria-label="전화">📞</a>' +
            '<a href="sms:' + esc(x.phone) + '" aria-label="문자">✉️</a>' +
          '</span>';
        g.appendChild(row);
      });
      wrap.appendChild(g);
    });
  }

  /* ============================================================
     4. 날짜 · 캘린더 · 디데이
     ============================================================ */
  function renderDate() {
    $('dateLine1').textContent = DATE_KO + ' ' + DOW_FULL;
    $('dateLine2').textContent = TIME_KO + ' · ' + PLACE;

    /* 캘린더 */
    var y = WD.getFullYear(), m = WD.getMonth(), day = WD.getDate();
    var first = new Date(y, m, 1).getDay();
    var last = new Date(y, m + 1, 0).getDate();

    var cal = $('calendar');
    cal.appendChild(el('p', 'cal__month', MONTH_EN[m] + ' ' + y));

    var grid = el('div', 'cal__grid');
    DOW_KO.forEach(function (d, i) {
      grid.appendChild(el('div', 'cal__dow' + (i === 0 ? ' sun' : ''), d));
    });
    for (var i = 0; i < first; i++) grid.appendChild(el('div', 'cal__day', ''));
    for (var d = 1; d <= last; d++) {
      var dow = (first + d - 1) % 7;
      var cls = 'cal__day' + (dow === 0 ? ' sun' : '') + (d === day ? ' is-wed' : '');
      grid.appendChild(el('div', cls, '<span>' + d + '</span>'));
    }
    cal.appendChild(grid);

    /* 디데이 */
    $('ddayNames').innerHTML = esc(C.groom.name) + '<span class="heart">♥</span>' + esc(C.bride.name);

    function tick() {
      var now = new Date();
      var diff = WD - now;
      var future = diff > 0;
      var ms = Math.abs(diff);
      var dd = Math.floor(ms / 86400000);
      var hh = Math.floor(ms / 3600000) % 24;
      var mm = Math.floor(ms / 60000) % 60;
      var ss = Math.floor(ms / 1000) % 60;

      var today = new Date(); today.setHours(0, 0, 0, 0);
      var wdDay = new Date(WD); wdDay.setHours(0, 0, 0, 0);
      var dayGap = Math.round((wdDay - today) / 86400000);

      $('ddayLabel').textContent = dayGap === 0 ? 'Wedding Day'
        : (dayGap > 0 ? 'D-' + dayGap : 'Since Wedding Day');

      $('ddayCount').innerHTML =
        '<b>' + dd + '</b>일 <b>' + String(hh).padStart(2, '0') + '</b>시간 ' +
        '<b>' + String(mm).padStart(2, '0') + '</b>분 <b>' + String(ss).padStart(2, '0') + '</b>초' +
        (future ? ' 남았습니다' : ' 지났습니다');
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ============================================================
     5. 갤러리 + 라이트박스
     ============================================================ */
  var galSrcs = [];
  var lbIdx = 0;

  function renderGallery() {
    var n = C.photos.galleryCount || 0;
    var wrap = $('gallery');
    var VISIBLE = 9;
    for (var i = 1; i <= n; i++) {
      var src = C.photos.galleryPath + i + C.photos.galleryExt;
      galSrcs.push(src);
      var cell = el('button', 'gal__cell' + (i > VISIBLE ? ' is-hidden' : ''));
      cell.type = 'button';
      cell.setAttribute('aria-label', '사진 ' + i + ' 크게 보기');
      cell.setAttribute('data-n', i);
      var img = new Image();
      img.alt = '웨딩 사진 ' + i;
      img.loading = 'lazy';
      setImg(img, src);
      cell.appendChild(img);
      (function (idx) {
        cell.addEventListener('click', function () { openLb(idx); });
      })(i - 1);
      wrap.appendChild(cell);
    }

    var btn = $('galToggle');
    if (n <= VISIBLE) { btn.hidden = true; return; }
    var open = false;
    btn.addEventListener('click', function () {
      open = !open;
      wrap.querySelectorAll('.gal__cell').forEach(function (c, i) {
        if (i >= VISIBLE) c.classList.toggle('is-hidden', !open);
      });
      btn.textContent = open ? '접기' : '사진 더보기';
      if (!open) document.querySelector('.sec--gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function openLb(i) {
    lbIdx = i;
    var lb = $('lightbox');
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    paintLb();
  }
  function closeLb() {
    $('lightbox').hidden = true;
    document.body.style.overflow = '';
  }
  function paintLb() {
    $('lbImg').src = galSrcs[lbIdx];
    $('lbCount').textContent = (lbIdx + 1) + ' / ' + galSrcs.length;
  }
  function moveLb(step) {
    lbIdx = (lbIdx + step + galSrcs.length) % galSrcs.length;
    paintLb();
  }

  function bindLightbox() {
    $('lbPrev').addEventListener('click', function () { moveLb(-1); });
    $('lbNext').addEventListener('click', function () { moveLb(1); });
    document.addEventListener('keydown', function (e) {
      if ($('lightbox').hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') moveLb(-1);
      if (e.key === 'ArrowRight') moveLb(1);
    });
    var sx = 0;
    var stage = document.querySelector('.lb__stage');
    stage.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) moveLb(dx < 0 ? 1 : -1);
    }, { passive: true });
    $('lightbox').addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close') || e.target.classList.contains('lb__stage')) closeLb();
    });
  }

  /* ============================================================
     6. 오시는 길
     ============================================================ */
  function renderLocation() {
    var w = C.wedding;
    $('locVenue').textContent = w.venue;
    $('locHall').textContent = w.hall;
    $('locWhen').textContent = DATE_KO + ' ' + DOW_FULL + ' ' + TIME_KO;

    $('addrRoad').textContent = w.addressRoad || '';
    if (w.addressJibun) $('addrJibun').textContent = w.addressJibun;
    else $('jibunRow').hidden = true;

    if (w.tel) {
      var a = $('venueTel');
      a.textContent = w.tel;
      a.href = 'tel:' + w.tel;
    } else { $('telRow').hidden = true; }

    $('mapPhText').innerHTML = esc(w.venue) + '<br>' + esc(w.addressRoad || '');

    /* 지도 앱 버튼 — 세 곳 모두 searchName 으로 검색합니다 */
    var q = encodeURIComponent(w.searchName || w.venue || '');
    var btns = [
      { t: '카카오맵',   u: 'https://map.kakao.com/link/search/' + q },
      { t: '네이버지도', u: 'https://map.naver.com/p/search/' + q },
      { t: '티맵',       u: 'tmap://search?name=' + q }
    ];
    var bw = $('mapBtns');
    btns.forEach(function (b) {
      var a = el('a', 'chip', esc(b.t));
      a.href = b.u;
      a.target = '_blank';
      a.rel = 'noopener';
      a.style.textDecoration = 'none';
      bw.appendChild(a);
    });

    /* 교통편 */
    var tw = $('transport');
    (w.transport || []).forEach(function (t) {
      var item = el('div', 'transport__item');
      item.innerHTML =
        '<p class="transport__head"><span class="ico">' + esc(t.icon || '') + '</span>' + esc(t.title) + '</p>' +
        '<ul class="transport__list">' +
        (t.lines || []).map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') +
        '</ul>';
      tw.appendChild(item);
    });

    /* 카카오맵 (키가 있을 때만) */
    if (C.kakao.mapKey && w.lat && w.lng) loadKakaoMap();
  }

  function loadKakaoMap() {
    var s = document.createElement('script');
    s.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=' + C.kakao.mapKey + '&autoload=false';
    s.onload = function () {
      window.kakao.maps.load(function () {
        var pos = new kakao.maps.LatLng(C.wedding.lat, C.wedding.lng);
        $('mapPh').remove();
        var map = new kakao.maps.Map($('map'), { center: pos, level: 4 });
        new kakao.maps.Marker({ map: map, position: pos });
        map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
      });
    };
    document.head.appendChild(s);
  }

  /* ============================================================
     7. 마음 전하실 곳
     ============================================================ */
  function renderAccounts() {
    var wrap = $('accounts');

    /* 계좌도 화환 링크도 없으면 섹션 자체를 숨깁니다 */
    var hasAccount = [C.groom, C.bride].some(function (p) {
      return (p.accounts || []).some(function (a) { return a.number; });
    });
    var hasWreath = !!(C.groom.wreathUrl || C.bride.wreathUrl);
    if (!hasAccount && !hasWreath) {
      $('secAcc').hidden = true;
      return;
    }
    if (!hasAccount) {
      document.querySelector('.acc__desc').hidden = true;
      document.querySelector('#secAcc .title').textContent = '축하 화환 보내기';
    }
    [['신랑측', C.groom], ['신부측', C.bride]].forEach(function (pair) {
      var label = pair[0], p = pair[1];
      var list = (p.accounts || []).filter(function (a) { return a.number; });
      if (!list.length) return;

      var g = el('div', 'acc__group');
      var btn = el('button', 'acc__btn',
        '<span>' + esc(label) + ' 마음 전하실 곳</span><span class="arw">▼</span>');
      btn.type = 'button';

      var body = el('div', 'acc__body');
      var inner = el('div', 'acc__inner');
      list.forEach(function (a) {
        var item = el('div', 'acc__item');
        var full = a.bank + ' ' + a.number;   /* 화면 표시용 — 복사는 번호만 */
        item.innerHTML =
          '<p class="acc__role">' + esc(a.label || '') + '</p>' +
          '<p class="acc__num"><span class="txt">' + esc(full) + '</span>' +
          '<button class="copy" type="button">복사</button></p>' +
          '<p class="acc__role" style="margin-top:4px">예금주 ' + esc(a.holder || '') + '</p>' +
          (a.kakaopay ? '<a class="acc__kakao" href="' + esc(a.kakaopay) + '" target="_blank" rel="noopener">카카오페이로 송금</a>' : '');
        item.querySelector('.copy').addEventListener('click', function () {
          copyText(a.number, '계좌번호가 복사되었습니다');
        });
        inner.appendChild(item);
      });
      body.appendChild(inner);

      btn.addEventListener('click', function () { g.classList.toggle('open'); });
      g.appendChild(btn);
      g.appendChild(body);
      wrap.appendChild(g);
    });

    /* 화환 */
    var ww = $('wreath');
    [['신랑측 화환 보내기', C.groom.wreathUrl], ['신부측 화환 보내기', C.bride.wreathUrl]]
      .filter(function (x) { return x[1]; })
      .forEach(function (x) {
        var a = el('a', 'chip', esc(x[0]));
        a.href = x[1]; a.target = '_blank'; a.rel = 'noopener';
        a.style.textDecoration = 'none';
        ww.appendChild(a);
      });
  }

  /* ============================================================
     9. 푸터 · 공유
     ============================================================ */
  function renderFooter() {
    $('footNames').textContent = (C.bride.nameEn || C.bride.name) + ' & ' + (C.groom.nameEn || C.groom.name);
    $('footWhere').textContent = PLACE;
    $('footWhen').textContent = DATE_DOT + ' ' + DOW_EN[WD.getDay()] + ' ' +
      String(WD.getHours()).padStart(2, '0') + ':' + String(WD.getMinutes()).padStart(2, '0');
  }

  function shareText() {
    return C.groom.name + ' ♥ ' + C.bride.name + ' 결혼합니다\n' +
      DATE_KO + ' ' + DOW_FULL + ' ' + TIME_KO + '\n' + PLACE;
  }

  function bindShare() {
    $('shareLink').addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: document.title, text: shareText(), url: location.href })
          .catch(function () { copyText(location.href, '링크가 복사되었습니다'); });
      } else {
        copyText(location.href, '링크가 복사되었습니다');
      }
    });

    var kBtn = $('shareKakao');
    if (!C.kakao.jsKey) {
      kBtn.hidden = true;
      return;
    }
    var s = document.createElement('script');
    s.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    s.integrity = 'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4';
    s.crossOrigin = 'anonymous';
    s.onload = function () {
      if (!window.Kakao.isInitialized()) window.Kakao.init(C.kakao.jsKey);
    };
    document.head.appendChild(s);

    kBtn.addEventListener('click', function () {
      if (!window.Kakao || !window.Kakao.isInitialized()) {
        copyText(location.href, '링크가 복사되었습니다');
        return;
      }
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: C.groom.name + ' ♥ ' + C.bride.name + ' 결혼합니다',
          description: DATE_KO + ' ' + DOW_FULL + ' ' + TIME_KO + '\n' + PLACE,
          imageUrl: C.kakao.shareImage || (location.origin + location.pathname.replace(/\/$/, '') + '/' + C.photos.main),
          link: { mobileWebUrl: location.href, webUrl: location.href }
        },
        buttons: [{ title: '청첩장 보기', link: { mobileWebUrl: location.href, webUrl: location.href } }]
      });
    });
  }

  /* ============================================================
     공통 바인딩
     ============================================================ */
  function bindModals() {
    function open(id) { $(id).hidden = false; document.body.style.overflow = 'hidden'; }
    function close(m) { m.hidden = true; document.body.style.overflow = ''; }
    window.__openModal = open;
    window.__closeModal = function (id) { close($(id)); };

    document.querySelectorAll('.modal').forEach(function (m) {
      m.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-close')) close(m);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.modal:not([hidden])').forEach(close);
    });

    $('btnContact').addEventListener('click', function () { open('mContact'); });
  }

  function bindCopyButtons() {
    document.querySelectorAll('[data-copy-target]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = $(b.getAttribute('data-copy-target'));
        copyText(t.textContent.trim(), '주소가 복사되었습니다');
      });
    });
  }

  function bindReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (i) { i.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (i) { io.observe(i); });
  }

  /* ---------- 시작 ---------- */
  renderHead();
  renderHero();
  renderGreeting();
  renderContact();
  renderDate();
  renderGallery();
  bindLightbox();
  renderLocation();
  renderAccounts();
  renderFooter();
  bindModals();
  bindCopyButtons();
  bindShare();
  bindReveal();
})();
