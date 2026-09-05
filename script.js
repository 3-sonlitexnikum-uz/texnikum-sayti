// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Burger menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Load dynamic news from localStorage (Admin panel)
// Load dynamic news from Global API (MongoDB Backend)
const newsGrid = document.getElementById('newsGrid');
const API_URL = "/.netlify/functions/news"; // BIZ YASAGAN MONGODB BACKEND!

if (newsGrid) {
  fetch(API_URL)
    .then(res => res.json())
    .then(savedNews => {
      // Eng yangilari birinchi chiqishi uchun
      savedNews.sort((a, b) => b.id - a.id).forEach(news => {
        const card = document.createElement('div');
        card.className = 'news-card animate-card';
        card.innerHTML = `
          <div class="news-img">
            <img src="${news.imageUrl}" alt="Yangilik rasmi">
          </div>
          <div class="news-content">
            <div class="news-date">${news.date}</div>
            <div class="news-tag">${news.tag}</div>
            <h3>${news.title}</h3>
            <p>${news.content}</p>
            <a href="https://t.me/dangara_3son_texnikum" target="_blank" class="news-link">Batafsil →</a>
          </div>
        `;
        newsGrid.insertBefore(card, newsGrid.firstChild);
        // Observer yangi elementni ham animatsiya qilish uchun
        if (typeof observer !== 'undefined') observer.observe(card);
      });
    })
    .catch(err => {
      console.log("Yangiliklarni yuklashda xatolik yoki baza ulanmagan: ", err);
    });
}

// Scroll animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.animate-card').forEach(el => observer.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Active nav link
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

// Contact form
function handleSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const directionSelect = document.getElementById('direction');
  const direction = directionSelect.options[directionSelect.selectedIndex].text;
  const message = document.getElementById('message').value;

  const botToken = '8706849810:AAEwfQpbKxc1CbnLMsu2IVrswW50r9ob2Yk';
  const chatId = '-1004312532068';

  const text = `📬 Yangi murojaat!\n\n👤 Ism: ${name}\n📞 Telefon: ${phone}\n📚 Yo'nalish: ${direction === "Yo'nalishni tanlang" ? "Tanlanmadi" : direction}\n💬 Xabar: ${message || "Yo'q"}`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  const originalBtnContent = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML = '<span>Yuborilmoqda...</span>';

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  })
    .then(response => {
      if (response.ok) {
        btn.style.display = 'none';
        success.style.display = 'block';
        e.target.reset();

        setTimeout(() => {
          success.style.display = 'none';
          btn.style.display = 'flex';
          btn.disabled = false;
          btn.innerHTML = originalBtnContent;
        }, 5000);
      } else {
        response.json().then(data => {
          alert("Xatolik: " + (data.description || "Noma'lum xatolik"));
          btn.disabled = false;
          btn.innerHTML = originalBtnContent;
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Internetga ulanishda xatolik yoki bot API ishlamayapti.");
      btn.disabled = false;
      btn.innerHTML = originalBtnContent;
    });
}

// Typewriter effect (D disk loyihasidan)
document.addEventListener('DOMContentLoaded', () => {
  const text1 = "Dang'ara tuman ";
  const text2 = "3-son Politexnikum";
  const el1 = document.getElementById('typewriter-line1');
  const el2 = document.getElementById('typewriter-line2');
  const cursor = document.getElementById('cursor');
  let i = 0, j = 0;

  function typeText1() {
    if (i < text1.length) {
      el1.innerHTML += text1.charAt(i++);
      setTimeout(typeText1, 55);
    } else {
      setTimeout(typeText2, 200);
    }
  }

  function typeText2() {
    if (j === 0 && cursor && el2) el2.parentNode.appendChild(cursor);
    if (j < text2.length) {
      el2.innerHTML += text2.charAt(j++);
      setTimeout(typeText2, 55);
    }
  }

  if (el1 && el2) setTimeout(typeText1, 500);
});
