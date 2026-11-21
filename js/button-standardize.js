/* ------------------------------------------------------------------ *
 * Exact reproduction of the Framer "Contact Me" button component.
 *
 * The reference is a multi-layer component: a #3b3b3b outer container,
 * a black inner container, two blurred radial-gradient glow divs, the
 * text wrapper, plus three blurred white decorative divs. Its hover
 * state is driven by Framer's `.hover` class rules.
 *
 * Instead of approximating that with CSS, this clones the real component
 * wholesale for each target CTA, keeping each target's label, destination
 * and behaviour. Cloned nodes are re-applied if Framer re-renders them.
 * ------------------------------------------------------------------ */
(function () {
    'use strict';

    var MARK = 'data-framer-clone';

    var TARGETS = [
        { selector: '#projects p > a.framer-styles-preset-18ycce5', label: 'View My Project' },
        { selector: '#contact a.contact-whatsapp', label: 'Chat on WhatsApp', icon: true },
        { selector: '#contact button.contact-submit', label: 'Send Message', submit: true }
    ];

    function referenceButton() {
        var refs = [].slice.call(document.querySelectorAll('a.framer-caRRT')).filter(function (a) {
            return (a.innerText || '').trim() === 'Contact Me' && !a.hasAttribute(MARK);
        });
        return refs.filter(function (a) { return a.getBoundingClientRect().width > 0; })[0] || refs[0];
    }

    function standardize(config) {
        if (document.querySelector('[' + MARK + '="' + config.label + '"]')) return;

        var ref = referenceButton();
        var target = document.querySelector(config.selector);
        if (!ref || !target || ref === target) return;

        var clone;
        if (config.submit) {
            // A real submit button keeps the form working; the cloned Framer
            // markup provides the exact visual component inside it.
            clone = document.createElement('button');
            clone.type = 'submit';
            clone.className = ref.className;
            clone.innerHTML = ref.innerHTML;
            clone.style.cssText = ref.style.cssText;
        } else {
            clone = ref.cloneNode(true);
            var href = target.getAttribute('href');
            if (href) clone.setAttribute('href', href);
            ['target', 'rel'].forEach(function (attr) {
                var value = target.getAttribute(attr);
                if (value) clone.setAttribute(attr, value);
                else clone.removeAttribute(attr);
            });
        }

        clone.setAttribute(MARK, config.label);
        clone.setAttribute('aria-label', config.label);

        // The reference's hover rules target the framer-v-41w26u variant.
        clone.classList.add('framer-v-41w26u');

        var paragraph = clone.querySelector('.framer-text');
        if (paragraph) paragraph.textContent = config.label;

        // Preserve the WhatsApp icon inside the cloned rich-text layer.
        if (config.icon) {
            var svg = target.querySelector('svg');
            var rich = paragraph && paragraph.parentElement;
            if (svg && rich && paragraph) {
                svg.setAttribute('width', '16');
                svg.setAttribute('height', '16');
                svg.style.display = 'inline-block';
                svg.style.width = '16px';
                svg.style.height = '16px';
                svg.style.verticalAlign = '-3px';
                svg.style.marginRight = '7px';
                svg.style.fill = 'currentColor';
                paragraph.insertBefore(svg, paragraph.firstChild);
            }
        }

        // Framer swaps its `.hover` variant class on mouse enter/leave; clones
        // have no React handlers, so reproduce that toggle directly.
        clone.addEventListener('mouseenter', function () { clone.classList.add('hover'); });
        clone.addEventListener('mouseleave', function () { clone.classList.remove('hover'); });
        clone.addEventListener('focus', function () { clone.classList.add('hover'); });
        clone.addEventListener('blur', function () { clone.classList.remove('hover'); });

        target.parentNode.replaceChild(clone, target);
    }

    function apply() {
        TARGETS.forEach(standardize);
    }

    function start() {
        apply();
        var observer = new MutationObserver(function () { apply(); });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
