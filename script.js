/* ============================================
   AR EVENTS - JavaScript
   Navigation, Filters, Lightbox, Form, etc.
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---------- Mobile Navigation Toggle ----------
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // ---------- Sticky Header on Scroll ----------
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        updateActiveNav();
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }

    // ---------- Portfolio Filter ----------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Add transition styles to portfolio items
    portfolioItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    // ---------- Photo Gallery Lightbox ----------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src');
            lightboxImg.src = src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ---------- Enquiry Form Handling (WhatsApp) ----------
    const enquiryForm = document.getElementById('enquiry-form');
    const formSuccess = document.getElementById('form-success');
    const WHATSAPP_NUMBER = '919112416118'; // Akshay Satpute - primary enquiry number

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const eventDate = document.getElementById('event-date').value;
            const guests = document.getElementById('guests').value.trim();
            const venue = document.getElementById('venue').value.trim();
            const requirements = document.getElementById('requirements').value.trim();

            const eventTypes = Array.from(
                enquiryForm.querySelectorAll('input[name="event-type"]:checked')
            ).map(el => el.value);

            if (!name || !phone) {
                alert('Please fill in your name and phone number.');
                return;
            }
            if (eventTypes.length === 0) {
                alert('Please select at least one Event Type.');
                return;
            }

            // Build WhatsApp message
            let message = '*New Event Enquiry - AR EVENTS*%0A%0A';
            message += `*Name:* ${encodeURIComponent(name)}%0A`;
            message += `*Phone:* ${encodeURIComponent(phone)}%0A`;
            if (email) message += `*Email:* ${encodeURIComponent(email)}%0A`;
            message += `*Event Type(s):* ${encodeURIComponent(eventTypes.join(', '))}%0A`;
            if (eventDate) message += `*Event Date:* ${encodeURIComponent(eventDate)}%0A`;
            if (guests) message += `*Guests:* ${encodeURIComponent(guests)}%0A`;
            if (venue) message += `*Venue/Location:* ${encodeURIComponent(venue)}%0A`;
            if (requirements) message += `*Requirements:* ${encodeURIComponent(requirements)}%0A`;

            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
            window.open(whatsappUrl, '_blank');

            // Show success message
            enquiryForm.style.display = 'none';
            formSuccess.classList.add('active');

            // Optional: Log form data (for demonstration)
            const formData = {
                name, phone, email, eventTypes, eventDate, guests, venue, requirements
            };
            console.log('Enquiry submitted via WhatsApp:', formData);
        });
    }

    // ---------- Smooth scroll for all anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
