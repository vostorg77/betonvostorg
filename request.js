// === Инициализация слушателей (вызывать после загрузки DOM) ===
function initButtons() {
  document.getElementById('cb-submit')?.addEventListener('click', submitCallback);
  document.getElementById('calc-submit')?.addEventListener('click', submitCalc);
}

// Запускаем, когда DOM готов
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initButtons);
} else {
  initButtons();
}

// === Валидация телефона ===
function validatePhone(inputId) {
  const input = document.getElementById(inputId);
  const phone = input.value.trim();

  // Пустое поле
  if (!phone) {
    input.style.borderColor = 'rgba(200,50,50,0.6)';
    input.focus();
    setTimeout(() => (input.style.borderColor = ''), 2000);
    return undefined;
  }

  // Простая проверка: минимум 10 цифр (для РФ)
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) {
    input.style.borderColor = 'rgba(200,50,50,0.6)';
    input.focus();
    setTimeout(() => (input.style.borderColor = ''), 2000);
    return undefined;
  }

  return `+${digits}`;
}

// === Отправка в ваш Worker ===
async function sendMessage({ phone, name }) {
  const url = 'https://max-proxy-sites.vostorg-77.workers.dev';
  const company = 'vostorg';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company, phone }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();
    console.log('Worker response:', result);
    return true;
  } catch (err) {
    console.error('Send error:', err);
    return false;
  }
}

async function submitCallback() {
  const phone = validatePhone('cb-phone');
  const name = document.getElementById('cb-name').value.trim();

  if (!phone) {
    showToast('invalid');
    return;
  }

  const btn = document.getElementById('cb-submit');
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'Отправка...';

  try {
    const success = await sendMessage({ name, phone });
    showToast(success);

    if (success) {
      ['cb-name', 'cb-phone', 'cb-time', 'cb-comment'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

async function submitCalc() {
  const phone = validatePhone('calc-phone');

  if (!phone) {
    showToast('invalid');
    return;
  }

  const btn = document.getElementById('calc-submit');
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'Отправка...';

  try {
    const success = await sendMessage({ phone });
    showToast(success);

    if (success) {
      document.getElementById('calc-phone').value = '';
    }
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

function showToast(success) {
  const html = success
    ? `<div class="toast-icon success">✓</div>
        <span>Заявка принята! Перезвоним в&nbsp;течение 5&nbsp;минут</span>`
    : `<div class="toast-icon error">X</div>
        <span>Произошла ошибка</span>`;

  const t = document.getElementById('toast');
  t.innerHTML = html;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function showToast(status) {
  // status: true | 'empty' | 'invalid'

  let html;
  if (status === true) {
    html = `<div class="toast-icon success">✓</div>
            <span>Заявка принята! Перезвоним в течение 5 минут</span>`;
  } else if (status === 'invalid') {
    html = `<div class="toast-icon error">✕</div>
            <span>Неверный формат телефона</span>`;
  } else {
    html = `<div class="toast-icon error">✕</div>
            <span>Произошла ошибка, попробуйте ещё раз</span>`;
  }

  const t = document.getElementById('toast');
  if (!t) return;

  t.innerHTML = html;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
