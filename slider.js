// ========== CINEMATIC EXPERIENCE SLIDER (Ken Burns) ==========
const sliders = {};

// Ken Burns animation names — cycles through each slide
const KB_ANIMATIONS = ['kenburns-1', 'kenburns-2', 'kenburns-3', 'kenburns-4'];

function initSliders() {
    document.querySelectorAll('.experience-slider').forEach(sliderEl => {
        const id       = sliderEl.getAttribute('data-slider');
        const duration = parseInt(sliderEl.getAttribute('data-duration') || '5000');
        const slides   = Array.from(sliderEl.querySelectorAll('.slider-item'));
        const dotsWrap = document.getElementById(`dots-${id}`);
        const counter  = document.getElementById(`counter-${id}`);

        sliders[id] = {
            id, duration, slides, dotsWrap, counter,
            current: 0,
            total: slides.length,
            timer: null
        };

        // Build dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.style.setProperty('--dot-duration', `${duration}ms`);
            dot.addEventListener('click', () => goToSlide(id, i));
            dotsWrap.appendChild(dot);
        });

        // Activate first slide
        activateSlide(id, 0);
        startAutoPlay(id);

        // Pause on hover
        sliderEl.addEventListener('mouseenter', () => stopAutoPlay(id));
        sliderEl.addEventListener('mouseleave', () => startAutoPlay(id));
    });
}

function activateSlide(id, index) {
    const s = sliders[id];

    s.slides.forEach((slide, i) => {
        const img = slide.querySelector('img');

        if (i === index) {
            slide.classList.add('active');
            // Re-trigger Ken Burns by cloning the img node
            const clone = img.cloneNode(true);
            // Assign animation based on slide index (cycles)
            clone.style.animationName = KB_ANIMATIONS[i % KB_ANIMATIONS.length];
            clone.style.animationDuration = `${s.duration + 1000}ms`; // slightly longer than interval
            clone.style.animationTimingFunction = 'ease-out';
            clone.style.animationFillMode = 'forwards';
            img.replaceWith(clone);
        } else {
            slide.classList.remove('active');
        }
    });

    // Update counter
    if (s.counter) {
        s.counter.textContent = `${index + 1} / ${s.total}`;
    }

    // Update dots
    const dots = s.dotsWrap.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        // Reset animation by replacing the element
        if (i === index) {
            const fresh = dot.cloneNode(true);
            fresh.style.setProperty('--dot-duration', `${s.duration}ms`);
            fresh.addEventListener('click', () => goToSlide(id, i));
            dot.replaceWith(fresh);
        }
    });
}

function goToSlide(id, index) {
    const s = sliders[id];
    s.current = index;
    activateSlide(id, index);
    // Restart autoplay timer from this point
    stopAutoPlay(id);
    startAutoPlay(id);
}

function moveSlide(id, dir) {
    const s = sliders[id];
    const next = (s.current + dir + s.total) % s.total;
    goToSlide(id, next);
}

function startAutoPlay(id) {
    const s = sliders[id];
    stopAutoPlay(id);
    s.timer = setInterval(() => {
        const next = (s.current + 1) % s.total;
        s.current = next;
        activateSlide(id, next);
    }, s.duration);
}

function stopAutoPlay(id) {
    const s = sliders[id];
    if (s.timer) {
        clearInterval(s.timer);
        s.timer = null;
    }
}

document.addEventListener('DOMContentLoaded', initSliders);
