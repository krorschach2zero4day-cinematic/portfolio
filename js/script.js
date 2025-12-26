/* =========================
   Intro curtain（スキップ対応）
   ========================= */
const params    = new URLSearchParams(location.search);
const skipIntro = params.get('skipIntro') === '1';

const typingEl  = document.getElementById('typing-screen');
const mainEl    = document.getElementById('main-content');
const profileEl = document.getElementById('profile');            // ← 実体に合わせる
const creditEl  = document.querySelector('.credit-section');

// skip指定のときは即表示
if (skipIntro) {
  if (typingEl) typingEl.style.display = 'none';
  if (mainEl)    mainEl.style.display = 'block';
  if (profileEl) profileEl.style.display = 'block';
  if (creditEl)  creditEl.style.display = 'block';
}

// タイピング演出（通常アクセスのみ）
const message  = 'THE FEATURE PRESENTATION';
let i          = 0;
let textSpan   = null;
if (typingEl) {
  textSpan = document.createElement('span');
  typingEl.appendChild(textSpan);
}

function typeText() {
  if (!typingEl || !textSpan) return;
  if (i < message.length) {
    textSpan.textContent += message.charAt(i++);
    setTimeout(typeText, 100);
  } else {
    setTimeout(() => {
      if (!typingEl) return;
      typingEl.classList.add('fade-out');
      typingEl.addEventListener('animationend', () => {
        typingEl.style.display = 'none';
        if (mainEl)    mainEl.style.display = 'block';
        if (profileEl) profileEl.style.display = 'block';
        if (creditEl)  creditEl.style.display = 'block';
      }, { once: true });
    }, 1500);
  }
}

if (!skipIntro && typingEl) {
  setTimeout(() => {
    typingEl.classList.add('curtain-open');
    setTimeout(typeText, 1200);
  }, 500);
} else {
  // 念のため即表示を保証
  if (mainEl)    mainEl.style.display = 'block';
  if (profileEl) profileEl.style.display = 'block';
  if (creditEl)  creditEl.style.display = 'block';
}


/* =========================
   Work タグによるフィルタリング
   ========================= */
const tags  = document.querySelectorAll('.tag');
const cards = document.querySelectorAll('.work-card');

tags.forEach(tag => {
  tag.addEventListener('click', () => {
    document.querySelector('.tag.active')?.classList.remove('active');
    tag.classList.add('active');

    const filter = tag.getAttribute('data-filter');

    // 一旦すべて非表示
    cards.forEach(card => { card.style.display = 'none'; });

    if (filter === 'all') {
      // 各カテゴリ1件ずつ表示
      const categories = ['lp', 'banner', 'flyer', 'dvd', 'other'];
      categories.forEach(category => {
        const categoryCards = document.querySelectorAll(`.work-card[data-category="${category}"]`);
        if (categoryCards.length > 0) {
          categoryCards[0].style.display = 'block';
        }
      });
    } else {
      // 特定カテゴリは最大3件
      const filtered = Array.from(document.querySelectorAll(`.work-card[data-category="${filter}"]`));
      filtered.forEach((card, idx) => { if (idx < 3) card.style.display = 'block'; });
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.tag[data-filter="all"]')?.click();
});


/* =========================
   カード全体クリックで新規タブ
   ========================= */
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('click', () => {
    const link = card.querySelector('a');
    if (link) window.open(link.href, '_blank');
  });
});


/* =========================
   初期表示アニメ（任意）
   ========================= */
window.addEventListener('DOMContentLoaded', () => {
  cards.forEach(card => card.classList.add('visible'));
});


/* =========================
   映画ポスター風スライダー
   ========================= */
const slides  = document.querySelectorAll('.poster-slide');
const prevBtn = document.querySelector('.poster-prev');
const nextBtn = document.querySelector('.poster-next');
let currentIndex = 0;

function showSlide(index) {
  if (!slides.length) return;
  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'prev', 'next');
    if (i === index) {
      slide.classList.add('active');
    } else if (i === (index - 1 + slides.length) % slides.length) {
      slide.classList.add('prev');
    } else if (i === (index + 1) % slides.length) {
      slide.classList.add('next');
    }
  });
}

if (prevBtn && nextBtn && slides.length) {
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  });

  // 初期表示
  showSlide(currentIndex);
}


/* =========================
   キャッチコピー フェードイン
   ========================= */
document.addEventListener('DOMContentLoaded', function () {
  const target = document.querySelector('.review.catchcopy');
  if (!target) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        target.classList.add('fadein-active');
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(target);
});




document.addEventListener('DOMContentLoaded', () => {
  const profile    = document.getElementById('profile');
  const photo      = document.getElementById('toggleImage');           // プロフィール写真
  const fullBlocks = profile.querySelectorAll('.profile-full-image');  // フル画像コンテナ（2つ）

  let currentIndex = 0;

  // --- 最初にヒントを軽く表示（cast-photo 側） ---
  profile.classList.add('hint-on-photo');
  setTimeout(() => {
    profile.classList.remove('hint-on-photo');
  }, 4000);

  function clearHints() {
    profile.classList.remove('hint-on-photo', 'hint-on-full');
  }

  // 指定インデックスのフル画像を表示
  function showFull(index) {
    if (!fullBlocks.length) return;

    // インデックスを範囲内に丸める（0〜length-1）
    currentIndex = (index + fullBlocks.length) % fullBlocks.length;

    // 1枚目かどうかでクラス付け替え
if (currentIndex === 0) {
  profile.classList.add('full-first');
} else {
  profile.classList.remove('full-first');
}

    // フル画像モードに入る
    profile.classList.add('show-image');

    // どの箱を表示するか切り替え
    fullBlocks.forEach((block, i) => {
      block.classList.toggle('is-active', i === currentIndex);
    });

    // フル画像側のヒントを一瞬出す
    profile.classList.add('hint-on-full');
    setTimeout(() => {
      profile.classList.remove('hint-on-full');
    }, 3000);
  }

  // プロフィールに戻す
  function backToProfile() {
    clearHints();
    profile.classList.remove('show-image');
    fullBlocks.forEach(block => block.classList.remove('is-active'));
  }

  // ▼ プロフィール → 最初のフル画像
  if (photo) {
    photo.addEventListener('click', () => {
      clearHints();
      showFull(0); // 1枚目表示（prf_full.png）
    });
  }

// ▼ 画像クリックで「次へ」→「最後ならプロフィールに戻る」
fullBlocks.forEach(block => {
  block.addEventListener('click', () => {
    // フル画像モードじゃなければ何もしない
    if (!profile.classList.contains('show-image')) return;

    const lastIndex = fullBlocks.length - 1;

    if (currentIndex < lastIndex) {
      // まだ最後じゃない → 次の画像へ
      showFull(currentIndex + 1);
    } else {
      // 最後の画像をクリックした → プロフィールに戻る
      backToProfile();
    }
  });
});



  // ▼ スワイプ検知（おまけ）
  let startX = 0;
  profile.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  profile.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) > 50) {
      // プロフィール表示中 → フル画像モードに入る（1枚目）
      if (!profile.classList.contains('show-image')) {
        showFull(0);
      } else {
        // フル画像表示中 → 左右スワイプで前後の画像に切り替え
        if (diff < 0) {
          // 左へスワイプ（次へ）
          showFull(currentIndex + 1);
        } else {
          // 右へスワイプ（前へ）
          showFull(currentIndex - 1);
        }
      }
    }
  });
});


// 閉幕メッセージを“見えたら一度だけ”フェード表示
document.addEventListener('DOMContentLoaded', () => {
  const closing = document.getElementById('closing-message');
  if (!closing) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        closing.classList.add('is-show');   // 一度だけフェード表示
        io.disconnect();
      }
    });
  }, { threshold: 0.25 }); // 25%見えたら発火

  io.observe(closing);
});


