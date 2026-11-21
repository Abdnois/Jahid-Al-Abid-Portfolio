/* Keep the deployed document metadata stable when the Framer runtime
   re-applies template title/canonical values after hydration. Enforces the
   real production canonical/og:url and absolute social images. */
(function () {
    'use strict';

    var TITLE = 'Jahid Al Abid | Independent Web Developer';
    var DESCRIPTION = 'Modern, responsive websites for small businesses. Explore my projects, services and web development work.';
    var SITE = 'https://jahidalabid.vercel.app/';
    var IMAGE = SITE + 'assets/images/95dUNcvR4MKvuWP9eFVbpV8No0.png';

    function setAttr(node, name, value) {
        if (node && node.getAttribute(name) !== value) {
            node.setAttribute(name, value);
        }
    }

    function setMeta(selector, value) {
        setAttr(document.querySelector(selector), 'content', value);
    }

    // Keep exactly one element for a selector; remove extras the Framer
    // runtime may inject so crawlers never see duplicate canonical/OG tags.
    function enforceSingle(selector) {
        var nodes = [].slice.call(document.querySelectorAll(selector));
        if (!nodes.length) return null;
        nodes.slice(1).forEach(function (node) {
            if (node.parentNode) node.parentNode.removeChild(node);
        });
        return nodes[0];
    }

    function apply() {
        if (document.title !== TITLE) document.title = TITLE;
        setMeta('meta[name="description"]', DESCRIPTION);
        setMeta('meta[property="og:title"]', TITLE);
        setMeta('meta[property="og:description"]', DESCRIPTION);
        setMeta('meta[name="twitter:title"]', TITLE);
        setMeta('meta[name="twitter:description"]', DESCRIPTION);
        setMeta('meta[property="og:image"]', IMAGE);
        setMeta('meta[name="twitter:image"]', IMAGE);

        setAttr(enforceSingle('link[rel="canonical"]'), 'href', SITE);
        enforceSingle('meta[property="og:url"]');
        setMeta('meta[property="og:url"]', SITE);

        if (!document.querySelector('meta[property="og:url"]')) {
            var ogUrl = document.createElement('meta');
            ogUrl.setAttribute('property', 'og:url');
            ogUrl.setAttribute('content', SITE);
            document.head.appendChild(ogUrl);
        }
        if (!document.querySelector('link[rel="canonical"]')) {
            var canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            canonical.setAttribute('href', SITE);
            document.head.appendChild(canonical);
        }

        // This portfolio has a single language: no hreflang tags.
        [].slice.call(document.querySelectorAll('link[hreflang]')).forEach(function (node) {
            if (node.parentNode) node.parentNode.removeChild(node);
        });
    }

    function start() {
        apply();
        var observer = new MutationObserver(function () { apply(); });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['content', 'href', 'rel', 'hreflang']
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
