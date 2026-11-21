/* ================================================================== *
 * WHATSAPP NUMBER — Bangladesh, international format, digits only.
 * Used by the CTA and by the contact form's generated message URL.
 * ================================================================== */
var WHATSAPP_NUMBER = '8801787320204';

/* ------------------------------------------------------------------ *
 * Contact section injector.
 *
 * This site is a Framer export: the page markup is hydrated/re-rendered
 * by the Framer runtime (js/framer/*.mjs). Inserting a section into the
 * static HTML would be undone by hydration, so it is mounted here after
 * the runtime has rendered the page, directly before the existing footer.
 * A MutationObserver re-applies the change if the runtime re-renders.
 * ------------------------------------------------------------------ */
(function () {
    'use strict';

    var SECTION_ID = 'contact';
    var WHATSAPP_URL = 'https://wa.me/' + WHATSAPP_NUMBER;

    var WHATSAPP_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15' +
        '-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39' +
        '-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298' +
        '-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669' +
        '-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52' +
        '.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198' +
        ' 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571' +
        '-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57' +
        '-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648' +
        '-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122' +
        ' 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413' +
        '-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588' +
        ' 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335' +
        ' 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>' +
        '</svg>';

    var MARKUP = `
        <div class="contact-inner">
            <div class="contact-grid">
                <div class="contact-intro">
                    <div class="contact-head">
                        <span class="contact-badge"><span class="contact-badge-dot" aria-hidden="true"></span>GET IN TOUCH</span>
                        <h2 class="contact-heading">Let's Build Something Together.</h2>
                        <p class="contact-description">Have a website project in mind? Tell me about your business and what you'd like to create. I'd love to hear your ideas.</p>
                    </div>

                    <div class="contact-card">
                        <p class="contact-card-label">Preferred contact</p>
                        <h3 class="contact-card-title">Let's talk on WhatsApp.</h3>
                        <p class="contact-card-text">WhatsApp is my preferred way to communicate. Send me a message and let's discuss your project.</p>
                        <a class="contact-submit contact-whatsapp" href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">
                            ${WHATSAPP_ICON}
                            <span>Chat on WhatsApp</span>
                        </a>
                        <p class="contact-availability"><span class="contact-badge-dot" aria-hidden="true"></span>Availability: Open to new projects.</p>
                    </div>
                </div>

                <div class="contact-form-wrap">
                    <form class="contact-form" novalidate>
                        <div class="contact-field">
                            <label class="contact-label" for="contact-name">Name</label>
                            <input class="contact-input" id="contact-name" name="name" type="text" placeholder="Your name" autocomplete="name" required>
                            <p class="contact-error" aria-live="polite"></p>
                        </div>

                        <div class="contact-field">
                            <label class="contact-label" for="contact-email">Email Address</label>
                            <input class="contact-input" id="contact-email" name="email" type="email" placeholder="you@company.com" autocomplete="email" required>
                            <p class="contact-error" aria-live="polite"></p>
                        </div>

                        <div class="contact-field">
                            <label class="contact-label" for="contact-type">Project Type</label>
                            <select class="contact-select" id="contact-type" name="project-type" required>
                                <option value="" selected disabled>Select a project type</option>
                                <option value="Business Website">Business Website</option>
                                <option value="Landing Page">Landing Page</option>
                                <option value="Website Redesign">Website Redesign</option>
                                <option value="Other">Other</option>
                            </select>
                            <p class="contact-error" aria-live="polite"></p>
                        </div>

                        <div class="contact-field">
                            <label class="contact-label" for="contact-details">Project Details</label>
                            <textarea class="contact-textarea" id="contact-details" name="details" placeholder="Tell me about your project, goals and timeline..." required></textarea>
                            <p class="contact-error" aria-live="polite"></p>
                        </div>

                        <button class="contact-submit" type="submit">Send Message</button>
                        <p class="contact-status" role="status" aria-live="polite"></p>
                    </form>
                </div>
            </div>
        </div>`;

    // Point the header nav link and the existing CTA buttons at this section.
    // The Framer runtime re-renders them, so this is re-applied by the observer.
    function setNavLink() {
        var links = document.querySelectorAll('header nav a');
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if ((link.textContent || '').trim() === 'Contact') {
                if (link.getAttribute('href') !== '#' + SECTION_ID) {
                    link.setAttribute('href', '#' + SECTION_ID);
                }
                // These links originally opened an external site in a new tab.
                // Internal anchors must navigate the current page instead.
                link.removeAttribute('target');
            }
        }

        var ctaLabels = ["Let's Work Together", 'Contact Me'];
        var anchors = document.querySelectorAll('a[href]');
        for (var j = 0; j < anchors.length; j++) {
            var anchor = anchors[j];
            if (ctaLabels.indexOf((anchor.innerText || '').trim()) !== -1) {
                if (anchor.getAttribute('href') !== '#' + SECTION_ID) {
                    anchor.setAttribute('href', '#' + SECTION_ID);
                }
                anchor.removeAttribute('target');
            }
        }
    }

    function wireForm(section) {
        var form = section.querySelector('.contact-form');
        if (!form) return;

        var status = section.querySelector('.contact-status');
        var rules = [
            {
                el: form.querySelector('#contact-name'),
                valid: function (v) { return v.trim().length > 0; },
                message: 'Please enter your name.'
            },
            {
                el: form.querySelector('#contact-email'),
                valid: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
                message: 'Please enter a valid email address.'
            },
            {
                el: form.querySelector('#contact-type'),
                valid: function (v) { return v !== ''; },
                message: 'Please select a project type.'
            },
            {
                el: form.querySelector('#contact-details'),
                valid: function (v) { return v.trim().length > 0; },
                message: 'Please tell me a little about your project.'
            }
        ];

        function errorFor(rule) {
            return rule.el.parentElement.querySelector('.contact-error');
        }

        function show(rule, message) {
            var node = errorFor(rule);
            if (node) node.textContent = message || '';
            rule.el.setAttribute('aria-invalid', message ? 'true' : 'false');
        }

        rules.forEach(function (rule) {
            ['input', 'change', 'blur'].forEach(function (eventName) {
                rule.el.addEventListener(eventName, function () {
                    if (rule.el.getAttribute('aria-invalid') === 'true') {
                        show(rule, rule.valid(rule.el.value) ? '' : rule.message);
                    }
                });
            });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var firstInvalid = null;

            rules.forEach(function (rule) {
                var ok = rule.valid(rule.el.value);
                show(rule, ok ? '' : rule.message);
                if (!ok && !firstInvalid) firstInvalid = rule.el;
            });

            if (firstInvalid) {
                if (status) status.textContent = '';
                firstInvalid.focus();
                return;
            }

            // Build a readable WhatsApp message from the validated fields.
            var name = form.querySelector('#contact-name').value.trim();
            var email = form.querySelector('#contact-email').value.trim();
            var type = form.querySelector('#contact-type').value;
            var details = form.querySelector('#contact-details').value.trim();

            var message = 'New website enquiry\n\n' +
                'Name: ' + name + '\n' +
                'Email: ' + email + '\n' +
                'Project type: ' + type + '\n\n' +
                'Project details:\n' + details;

            var whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

            try {
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            } catch (error) {
                // The fallback link below still lets the visitor continue.
            }

            // Never claim the message was delivered, and never clear the form:
            // the visitor must press Send in WhatsApp.
            if (status) {
                status.textContent = '';
                status.appendChild(document.createTextNode(
                    'Your message is ready in WhatsApp — please press Send there to deliver it. '
                ));
                var fallback = document.createElement('a');
                fallback.href = whatsappUrl;
                fallback.target = '_blank';
                fallback.rel = 'noopener noreferrer';
                fallback.textContent = 'If WhatsApp did not open, click here.';
                status.appendChild(fallback);
            }
        });
    }

    function commonAncestor(a, b) {
        var seen = new Set();
        var node = a;
        while (node) {
            seen.add(node);
            node = node.parentNode;
        }
        node = b;
        while (node) {
            if (seen.has(node)) return node;
            node = node.parentNode;
        }
        return null;
    }

    function place() {
        if (document.getElementById(SECTION_ID)) return;

        var faq = document.getElementById('faq');
        var footer = document.querySelector('footer');
        if (!faq || !footer || faq.contains(footer) || footer.contains(faq)) return;

        var ancestor = commonAncestor(faq, footer);
        if (!ancestor) return;

        var before = footer;
        while (before.parentNode && before.parentNode !== ancestor) {
            before = before.parentNode;
        }
        if (!before.parentNode || before === faq) return;

        var section = document.createElement('section');
        section.id = SECTION_ID;
        section.setAttribute('data-framer-name', 'Contact');
        section.className = 'contact-section';
        section.innerHTML = MARKUP;

        ancestor.insertBefore(section, before);
        wireForm(section);
    }

    function start() {
        setNavLink();
        place();

        var observer = new MutationObserver(function () {
            setNavLink();
            place();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href']
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
