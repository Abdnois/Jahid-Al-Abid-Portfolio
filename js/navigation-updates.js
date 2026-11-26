/* ------------------------------------------------------------------ *
 * Navigation updates
 *  - header: remove "Testimonials", keep Services / Projects / Contact
 *  - general project-view CTAs link to the Projects section (#projects)
 *  - individual "View Casestudy" cards open the Red Bull project
 *
 * The Framer runtime re-renders the header and section content, so these
 * changes are re-applied whenever the original markup comes back.
 * ------------------------------------------------------------------ */
(function () {
    'use strict';

    var PROJECT_ID = 'projects';
    var CASE_STUDY_URL = 'https://abdnois.github.io/Redbull/';
    var PROJECT_VIEW = /^(view\s+(my\s+)?(work|project)|see\s+my\s+work|my\s+projects?)$/i;
    var CASE_STUDY_VIEW = /^view\s+(my\s+)?case\s?study$/i;

    function label(el) {
        return (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
    }

    function ensureProjectsId() {
        var section = document.querySelector('section[data-framer-name="Projects"]');
        if (section && !section.id) section.id = PROJECT_ID;
    }

    function removeTemplateCta() {
        [].slice.call(document.querySelectorAll('a[href*="framer.link/Z1h7gsj"]')).forEach(function (link) {
            if ((link.innerText || '').trim() !== 'Get Template') return;
            var wrapper = link.parentElement;
            var node = wrapper && wrapper.children.length === 1 && wrapper.parentElement ? wrapper : link;
            if (node.parentNode) node.parentNode.removeChild(node);
        });
    }

    function updateHeader() {
        var nav = document.querySelector('header nav');
        if (!nav) return;

        // Remove the Testimonials link together with its wrapper so no empty
        // flex item (and therefore no stray gap) is left behind.
        [].slice.call(nav.querySelectorAll('a')).forEach(function (a) {
            if (label(a).toLowerCase() === 'testimonials') {
                var wrap = a.parentElement && a.parentElement.parentElement === nav ? a.parentElement : a;
                if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
            }
        });

        // Keep the ordered set of header links intact; only point Projects at
        // the correct section anchor.
        [].slice.call(nav.querySelectorAll('a')).forEach(function (a) {
            var text = label(a);
            if (text === 'Projects' && a.getAttribute('href') !== '#' + PROJECT_ID) {
                a.setAttribute('href', '#' + PROJECT_ID);
            }
            if (text === 'Contact' && a.getAttribute('href') !== '#contact') {
                a.setAttribute('href', '#contact');
            }
        });
    }

    function updateProjectLinks() {
        [].slice.call(document.querySelectorAll('a[href]')).forEach(function (a) {
            var text = label(a);

            // Individual project cards: real external case study, new tab.
            // VERDÉ cards have their own destination and must never be rewritten.
            if (a.getAttribute('data-project') === 'verde') return;
            if (CASE_STUDY_VIEW.test(text)) {
                if (a.getAttribute('href') !== CASE_STUDY_URL) {
                    a.setAttribute('href', CASE_STUDY_URL);
                }
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener noreferrer');
                return;
            }

            // General section navigation stays on this page.
            if (!PROJECT_VIEW.test(text)) return;
            if (a.getAttribute('href') !== '#' + PROJECT_ID) {
                a.setAttribute('href', '#' + PROJECT_ID);
            }
            a.removeAttribute('target');
        });
    }

    // Framer's router handles clicks from its own component data, so simply
    // changing the DOM href is not enough: it can still use the old target.
    // Intercept in the capture phase on window (before Framer's document
    // listener) and perform the anchor navigation ourselves.
    window.addEventListener('click', function (event) {
        var target = event.target;
        var anchor = target && target.closest ? target.closest('a[href="#' + PROJECT_ID + '"]') : null;
        if (!anchor) return;

        event.preventDefault();
        event.stopPropagation();

        var section = document.getElementById(PROJECT_ID);
        if (location.hash !== '#' + PROJECT_ID) {
            history.pushState(null, '', '#' + PROJECT_ID);
        }
        if (section) section.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, true);

    function apply() {
        removeTemplateCta();
        ensureProjectsId();
        updateHeader();
        updateProjectLinks();
    }

    function start() {
        apply();
        var observer = new MutationObserver(function () { apply(); });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href', 'id'] });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
