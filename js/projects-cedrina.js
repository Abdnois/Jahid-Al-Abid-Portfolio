/* ------------------------------------------------------------------ *
 * Projects: add Cedrina Farm as a tenth desktop card.
 *
 * The Framer grid column has a fixed height and clips its overflow, so the
 * new card is cloned from an existing case-study card and the Projects
 * wrappers are given an auto height at desktop widths only. Existing VERDÉ
 * and Red Bull cards are never modified. The mobile/tablet carousel is fed
 * from src/flexcarousel/items.js and is untouched by this script.
 * ------------------------------------------------------------------ */
(function () {
    'use strict';

    var SITE = 'https://abdnois.github.io/cedrina-farm/';
    var REPO = 'https://github.com/Abdnois/cedrina-farm';
    var NAME = 'Cedrina Farm';
    var CATEGORY = 'Artisan Preserves';
    var DESCRIPTION = 'A small-batch preserves storefront with seasonal jars, product storytelling and a warm editorial shopping experience.';
    var TECH = 'TypeScript, React, Vite, Cloudflare Workers';
    var IMAGE = 'assets/images/cedrina-desktop.png';
    var ALT = 'Cedrina Farm storefront with small-batch preserves jars and seasonal product stories';
    var STYLE_ID = 'cedrina-project-style';
    var CARD_ATTR = 'data-cedrina-project';

    var desktop = window.matchMedia('(min-width: 1025px)');
    var scheduled = false;

    function column() {
        var section = document.getElementById('projects') || document.querySelector('section[data-framer-name="Projects"]');
        return section ? section.querySelector('.framer-1578o9l') : null;
    }

    function ensureStyle() {
        if (document.getElementById(STYLE_ID)) return;
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent =
            '@media (min-width: 1025px) {' +
            '#projects .framer-1578o9l{height:auto !important;overflow:visible !important}' +
            '#projects .framer-meheg9,#projects .framer-njcqnv,' +
            '#projects .framer-1ixc7yb,#projects .framer-bpslow,#projects{height:auto !important}' +
            '}';
        document.head.appendChild(style);
    }

    function removeStyle() {
        var style = document.getElementById(STYLE_ID);
        if (style) style.parentNode.removeChild(style);
    }

    function removeCard() {
        var card = document.querySelector('[' + CARD_ATTR + ']');
        if (card && card.parentNode) card.parentNode.removeChild(card);
    }

    function setAttr(el, name, value) {
        if (el && el.getAttribute(name) !== value) el.setAttribute(name, value);
    }

    function apply() {
        if (!desktop.matches) {
            removeCard();
            removeStyle();
            return;
        }

        var col = column();
        if (!col) return;
        ensureStyle();

        var card = col.querySelector('[' + CARD_ATTR + ']');
        if (!card) {
            var template = col.lastElementChild;
            if (!template || !template.querySelector('img') || !template.querySelector('a')) return;
            card = template.cloneNode(true);
            // Keep the Framer container class so the clone inherits the exact
            // card sizing and hover styles; the data marker makes the other
            // project scripts leave this card alone.
            card.className = template.className + ' cedrina-project-card';
            card.setAttribute(CARD_ATTR, '');
            col.appendChild(card);
        }

        var anchor = card.querySelector('a');
        var img = card.querySelector('img');
        var title = NAME + ' — ' + CATEGORY + ' — ' + DESCRIPTION + ' — ' + TECH;
        setAttr(anchor, 'href', SITE);
        setAttr(anchor, 'target', '_blank');
        setAttr(anchor, 'rel', 'noopener noreferrer');
        setAttr(anchor, 'title', title);
        setAttr(anchor, 'aria-label', 'View casestudy: ' + NAME + ', ' + CATEGORY);
        setAttr(anchor, 'data-project', 'cedrina');
        setAttr(anchor, 'data-repository', REPO);
        if (img) {
            if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
            if (img.hasAttribute('sizes')) img.removeAttribute('sizes');
            setAttr(img, 'src', IMAGE);
            setAttr(img, 'alt', ALT);
            if (img.style.objectPosition !== '50% 50%') {
                img.style.setProperty('object-position', '50% 50%', 'important');
            }
        }
    }

    function schedule() {
        if (scheduled) return;
        scheduled = true;
        (window.requestAnimationFrame || window.setTimeout)(function () {
            scheduled = false;
            apply();
        });
    }

    if (desktop.addEventListener) desktop.addEventListener('change', schedule);
    else if (desktop.addListener) desktop.addListener(schedule);

    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', schedule, { once: true });
    } else {
        schedule();
    }
})();
