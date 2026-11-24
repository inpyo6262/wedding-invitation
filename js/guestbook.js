/* ============================================================
   방명록 (Firebase Firestore)
   config.js 의 CONFIG.firebase 값이 비어 있으면 안내 문구만 보입니다.
   ============================================================ */

const C = window.CONFIG;
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const listEl = $('gbList');
const pagerEl = $('gbPager');
const writeBtn = $('gbWrite');

/* ---------- Firebase 설정이 없을 때 ---------- */
if (!C.firebase || !C.firebase.apiKey || !C.firebase.projectId) {
  writeBtn.disabled = true;
  writeBtn.style.opacity = '.45';
  writeBtn.style.cursor = 'default';
  listEl.innerHTML =
    '<p class="gb__note">방명록을 준비하고 있습니다.<br>' +
    '<span style="font-size:11.5px;opacity:.75">' +
    '(js/config.js 의 firebase 항목을 채우면 바로 사용할 수 있어요)</span></p>';
} else {
  start();
}

async function start() {
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
  const {
    getFirestore, collection, addDoc, getDocs, deleteDoc, doc,
    query, orderBy, serverTimestamp
  } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

  const app = initializeApp(C.firebase);
  const db = getFirestore(app);
  const COL = C.guestbook.collection || 'guestbook';
  const PAGE = C.guestbook.pageSize || 5;

  let rows = [];
  let page = 0;
  let pendingDeleteId = null;

  /* ---------- 비밀번호 해시 ---------- */
  async function hash(pw) {
    const salt = 'wedding-guestbook::';
    if (window.crypto && window.crypto.subtle && window.isSecureContext) {
      const buf = new TextEncoder().encode(salt + pw);
      const d = await window.crypto.subtle.digest('SHA-256', buf);
      return Array.from(new Uint8Array(d)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // 보안 컨텍스트가 아닐 때(로컬 file://) 임시 폴백
    let h = 0, s = salt + pw;
    for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
    return 'fb' + (h >>> 0).toString(16);
  }

  /* ---------- 상대 시간 ---------- */
  function ago(d) {
    if (!d) return '';
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return '방금 전';
    if (diff < 3600) return Math.floor(diff / 60) + '분 전';
    if (diff < 86400) return Math.floor(diff / 3600) + '시간 전';
    if (diff < 2592000) return Math.floor(diff / 86400) + '일 전';
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  /* ---------- 불러오기 ---------- */
  async function load() {
    listEl.innerHTML = '<p class="gb__note">불러오는 중…</p>';
    try {
      const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')));
      rows = snap.docs.map(d => {
        const v = d.data();
        return {
          id: d.id,
          name: v.name || '',
          msg: v.msg || '',
          pw: v.pw || '',
          at: v.createdAt && v.createdAt.toDate ? v.createdAt.toDate() : null
        };
      });
      render();
    } catch (e) {
      console.error(e);
      listEl.innerHTML = '<p class="gb__note">방명록을 불러오지 못했습니다.<br>잠시 후 다시 시도해 주세요.</p>';
      pagerEl.innerHTML = '';
    }
  }

  /* ---------- 그리기 ---------- */
  function render() {
    if (!rows.length) {
      listEl.innerHTML = '<p class="gb__empty">아직 축하글이 없습니다.<br>첫 번째 축하의 말을 남겨주세요 🤍</p>';
      pagerEl.innerHTML = '';
      return;
    }
    const total = Math.ceil(rows.length / PAGE);
    if (page >= total) page = total - 1;

    listEl.innerHTML = rows.slice(page * PAGE, page * PAGE + PAGE).map(r => `
      <article class="gb__card">
        <p class="gb__msg">${esc(r.msg)}</p>
        <div class="gb__foot">
          <span class="gb__from">FROM. ${esc(r.name)} · ${esc(ago(r.at))}</span>
          <button class="gb__del" type="button" data-id="${esc(r.id)}">삭제</button>
        </div>
      </article>`).join('');

    listEl.querySelectorAll('.gb__del').forEach(b => {
      b.addEventListener('click', () => {
        pendingDeleteId = b.dataset.id;
        $('delErr').hidden = true;
        $('delForm').reset();
        window.__openModal('mDel');
      });
    });

    pagerEl.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = i + 1;
      if (i === page) b.className = 'on';
      b.addEventListener('click', () => { page = i; render(); });
      pagerEl.appendChild(b);
    }
  }

  /* ---------- 쓰기 ---------- */
  writeBtn.addEventListener('click', () => {
    $('gbErr').hidden = true;
    $('gbForm').reset();
    window.__openModal('mGb');
  });

  $('gbForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const name = f.name.value.trim();
    const pw = f.pw.value.trim();
    const msg = f.msg.value.trim();
    const err = $('gbErr');

    if (pw.length < 4) { err.textContent = '비밀번호는 4자 이상 입력해 주세요.'; err.hidden = false; return; }
    if (!name || !msg) { err.textContent = '이름과 메시지를 모두 입력해 주세요.'; err.hidden = false; return; }

    const btn = f.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = '남기는 중…';
    try {
      await addDoc(collection(db, COL), {
        name, msg, pw: await hash(pw), createdAt: serverTimestamp()
      });
      window.__closeModal('mGb');
      window.__toast('축하글이 등록되었습니다 💐');
      page = 0;
      await load();
    } catch (e2) {
      console.error(e2);
      err.textContent = '등록에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      err.hidden = false;
    } finally {
      btn.disabled = false; btn.textContent = '남기기';
    }
  });

  /* ---------- 삭제 ---------- */
  $('delForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = e.target.pw.value.trim();
    const err = $('delErr');
    const row = rows.find(r => r.id === pendingDeleteId);
    if (!row) { window.__closeModal('mDel'); return; }

    const admin = C.guestbook.adminPassword;
    const ok = (admin && pw === admin) || (await hash(pw)) === row.pw;
    if (!ok) { err.textContent = '비밀번호가 일치하지 않습니다.'; err.hidden = false; return; }

    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = '삭제 중…';
    try {
      await deleteDoc(doc(db, COL, pendingDeleteId));
      window.__closeModal('mDel');
      window.__toast('삭제되었습니다');
      await load();
    } catch (e2) {
      console.error(e2);
      err.textContent = '삭제에 실패했습니다.';
      err.hidden = false;
    } finally {
      btn.disabled = false; btn.textContent = '삭제';
    }
  });

  load();
}
