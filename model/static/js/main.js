document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.language-btn');
  const codeSeg = document.getElementById('code_segment');
  const codeDisplay = document.getElementById('code_display');

  // 테마 버튼 로직 (명확히 wrapper 클래스만 변경)
  const themeButtons = document.querySelectorAll('.theme-btn');
  const codeWrapper = document.getElementById('code_wrapper');

  function applyTheme(theme) {
    // 모든 editor-theme-* 제거 후 하나만 추가
    ['light','solarized','dark','vscode'].forEach(t => codeWrapper.classList.remove(`editor-theme-${t}`));
    codeWrapper.classList.add(`editor-theme-${theme}`);
    // 선택 표시 토글
    themeButtons.forEach(b => b.classList.toggle('selected', b.dataset.theme === theme));
    localStorage.setItem('editor_theme', theme);
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.theme || 'dark';
      applyTheme(t);
    });
  });

  // 초기 테마 적용 (저장값 또는 기본 dark)
  const savedTheme = localStorage.getItem('editor_theme') || 'dark';
  applyTheme(savedTheme);

  // 선택 표시 초기화
  themeButtons.forEach(b => b.classList.toggle('selected', b.dataset.theme === savedTheme));

  // 초기: 버튼 비활성화 (manifest 로드될 때까지)
  buttons.forEach(b => b.disabled = true);

  let manifest = {};
  let manifestLoaded = false;
  let isLoading = false;

  // manifest 불러오기 및 정규화
  fetch('/static/language/manifest.json', { cache: 'no-store' })
    .then(r => {
      if (!r.ok) throw new Error('manifest.json을 찾을 수 없음');
      return r.json();
    })
    .then(j => {
      Object.keys(j || {}).forEach(lang => {
        const arr = Array.isArray(j[lang]) ? j[lang] : [];
        manifest[lang] = arr.map(it => (typeof it === 'string' ? it.trim() : '')).filter(Boolean);
      });
    })
    .catch(() => {
      manifest = {};
    })
    .finally(() => {
      manifestLoaded = true;
      buttons.forEach(b => b.disabled = false);
    });

  // 순차 선택: 언어별 인덱스를 localStorage에 저장
  function getNextEntry(lang) {
    const list = Array.isArray(manifest[lang]) ? manifest[lang] : [];
    if (list.length === 0) return null;
    const key = `idx_${lang}`;
    let idx = parseInt(localStorage.getItem(key) || '0', 10);
    if (Number.isNaN(idx) || idx < 0) idx = 0;
    const entry = list[idx % list.length];
    // 다음 인덱스 저장
    localStorage.setItem(key, String((idx + 1) % list.length));
    return entry;
  }

  // entry로부터 시도할 후보 경로 배열 생성
  function buildCandidatePaths(entry, lang) {
    if (!entry) return [];
    entry = entry.trim();
    if (/^https?:\/\//i.test(entry)) return [entry];
    if (entry.startsWith('/static/')) return [entry];
    if (entry.startsWith('/')) return [entry, '/static' + entry];
    if (entry.startsWith('../')) {
      const withoutDots = entry.replace(/^(\.\.\/)+/, '');
      return [`/static/${withoutDots}`, `/${withoutDots}`];
    }
    if (entry.startsWith('language/')) return [`/static/${entry}`, `/${entry}`];
    return [
      `/static/language/${lang}/${entry}`,
      `/static/${lang}/${entry.replace(/^\//, '')}`,
      `/static/${entry}`,
      `/${entry}`
    ];
  }

  // 후보 경로들을 순차 시도하여 첫 성공 결과를 반환
  async function tryFetchWithFallback(entry, lang) {
    const candidates = buildCandidatePaths(entry, lang);
    const tried = [];
    for (const p of candidates) {
      tried.push(p);
      try {
        const res = await fetch(p, { cache: 'no-store' });
        if (res && res.ok) {
          const text = await res.text();
          return { ok: true, text, path: p };
        }
      } catch (e) {
        // 다음 후보 시도
      }
    }
    return { ok: false, tried };
  }

  async function loadAndShowFile(entry, lang) {
    const result = await tryFetchWithFallback(entry, lang);
    if (!result.ok) {
      const triedList = (result.tried || []).join('\n');
      codeDisplay.textContent = `파일 로드 오류: 모든 후보 경로 실패\n시도한 경로:\n${triedList}`;
      codeDisplay.className = 'language-none';
      return;
    }
    codeDisplay.textContent = result.text;
    codeDisplay.className = `language-${lang}`;
    codeDisplay.classList.remove('animate__fadeIn');
    void codeDisplay.offsetWidth;
    codeDisplay.classList.add('animate__animated', 'animate__fadeIn');
    if (window.Prism && Prism.highlightElement) Prism.highlightElement(codeDisplay);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      if (!manifestLoaded) {
        codeDisplay.textContent = '문제 목록을 불러오는 중입니다...';
        codeDisplay.className = 'language-none';
        return;
      }
      if (isLoading) return; // 중복 요청 차단
      isLoading = true;
      // 모든 버튼 비활성화
      buttons.forEach(b => b.disabled = true);
      btn.classList.add('loading');

      // 즉시 이전 내용 지우고 로딩 메시지
      codeDisplay.textContent = '문제 로드 중...';
      codeDisplay.className = 'language-none';

      // 리플 이펙트
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height) * 0.8;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);

      // 선택 UI
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      const lang = btn.dataset.lang;
      codeSeg.classList.remove('lang-java', 'lang-c', 'lang-python');
      codeSeg.classList.add(`lang-${lang}`);

      const entry = getNextEntry(lang);
      if (!entry) {
        codeDisplay.textContent = `해당 언어의 문제 목록이 없습니다.\n/static/language/manifest.json을 생성하거나 갱신하세요.`;
        codeDisplay.className = 'language-none';
        isLoading = false;
        buttons.forEach(b => b.disabled = false);
        btn.classList.remove('loading');
        return;
      }

      await loadAndShowFile(entry, lang);

      // 복원
      isLoading = false;
      buttons.forEach(b => b.disabled = false);
      btn.classList.remove('loading');
    });
  });

  // 키보드 접근성
  document.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
      const arr = Array.from(buttons);
      const idx = arr.findIndex(b => b.classList.contains('selected'));
      let next = 0;
      if (idx === -1) next = 0;
      else next = (e.key === 'ArrowRight') ? (idx + 1) % arr.length : (idx - 1 + arr.length) % arr.length;
      arr[next].click();
    }
  });
});
