// Blog article page JS
import './blog-article.css';

// Reading progress bar
function initReadingProgress() {
    const bar = document.querySelector('.reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        bar.style.width = pct + '%';
    }, { passive: true });
}

// Smooth reveal on scroll
function initScrollReveal() {
    const body = document.querySelector('.article-body');
    if (body) {
        body.querySelectorAll('p, h2, h3, ul, ol, blockquote, .law-ref, .article-cta').forEach((el) => {
            el.classList.add('reveal');
        });
    }

    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    initScrollReveal();
});
