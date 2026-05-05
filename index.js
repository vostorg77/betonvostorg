// Tabs
function switchTab(tab, el) {
  ['beton', 'rastvor', 'nerud'].forEach((t) => {
    document.getElementById('tab-' + t).style.display = t === tab ? '' : 'none';
  });
  document.querySelectorAll('.mat-tab').forEach((b) => b.classList.remove('active'));
  el.classList.add('active');
}

// FAQ
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach((i) => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// Calculator — тарифы доставки по зонам
function calcPrice() {
  const grade = parseInt(document.getElementById('calc-grade').value) || 4100;
  const vol = parseFloat(document.getElementById('calc-volume').value) || 0;
  const km = parseFloat(document.getElementById('calc-km').value) || 0;

  // Стоимость материала
  const matCost = grade * vol;

  // Доставка: зависит только от расстояния
  let deliveryPerM3, deliveryMin, zone;
  if (km <= 10) {
    deliveryPerM3 = 900;
    deliveryMin = 6000;
    zone = 'до 10 км';
  } else if (km <= 30) {
    deliveryPerM3 = 1500;
    deliveryMin = 10000;
    zone = 'до 30 км';
  } else {
    deliveryPerM3 = 2000;
    deliveryMin = 15000;
    zone = 'до 50 км';
  }
  const deliveryRaw = km > 0 ? deliveryPerM3 * vol : 0;
  const delivery = km > 0 ? Math.max(deliveryRaw, deliveryMin) : 0;
  const total = matCost + delivery;

  document.getElementById('calc-output').textContent = formatNum(Math.round(total)) + ' ₽';

  let breakdown = vol + ' м³ × ' + formatNum(grade) + ' ₽ (материал)';
  if (km > 0) {
    const minNote = delivery > deliveryRaw ? ', мин. ' + formatNum(deliveryMin) + ' ₽' : '';
    breakdown += ' + доставка ' + zone + ': ' + formatNum(delivery) + ' ₽' + minNote;
  }
  document.getElementById('calc-breakdown').textContent = breakdown;
}

function formatNum(n) {
  return n.toLocaleString('ru-RU');
}

function scrollToCalc() {
  const el = document.getElementById('calculator');
  const top = el.getBoundingClientRect().top + window.pageYOffset - 76;
  window.scrollTo({ top, behavior: 'smooth' });
  setTimeout(() => document.getElementById('calc-phone').focus(), 600);
}

function openCallback() {
  const el = document.getElementById('callback');
  const top = el.getBoundingClientRect().top + window.pageYOffset - 76;
  window.scrollTo({ top, behavior: 'smooth' });
  setTimeout(() => document.getElementById('cb-name').focus(), 600);
}

calcPrice();
lucide.createIcons();
