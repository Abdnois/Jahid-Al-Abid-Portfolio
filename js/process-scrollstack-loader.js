/* ------------------------------------------------------------------ *
 * Process Scroll Stack loader.
 *
 * The site is a static Framer export. This dependency-free script mounts the
 * React Bits Scroll Stack over the three existing Process cards. The React
 * bundle is imported on demand. The original cards stay in the DOM (Framer may
 * still update them on resize) and are only hidden while the stack is live.
 * ------------------------------------------------------------------ */
(function () {
    'use strict';

    var SECTION = '#process';
    var STEPS = '[data-framer-name="Steps"]';
    var CARD = '.framer-nWYvp';

    var script = document.currentScript;
    if (!script || !script.src) {
        var scripts = document.querySelectorAll('script[src]');
        for (var i = scripts.length - 1; i >= 0; i--) {
            if (/process-scrollstack-loader\.js/.test(scripts[i].src)) {
                script = scripts[i];
                break;
            }
        }
    }
    var base = script && script.src ? new URL('.', script.src).href : 'js/';

    var mod = null;
    var modulePromise = null;
    var host = null;
    var busy = false;
    var scheduled = false;
    var resizeTimer = 0;
    var suppressMutations = false;

    function ensureStyle() {
        if (document.querySelector('link[data-ja-scrollstack-style]')) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = base + 'scrollstack/scrollstack.css';
        link.setAttribute('data-ja-scrollstack-style', '');
        document.head.appendChild(link);
    }

    function loadModule() {
        if (mod) return Promise.resolve(mod);
        if (modulePromise) return modulePromise;
        ensureStyle();
        modulePromise = import(base + 'scrollstack/scrollstack.js')
            .then(function (loaded) {
                mod = loaded;
                return loaded;
            })
            .catch(function (error) {
                modulePromise = null;
                // Framer cards stay visible if the module cannot load.
                console.warn('[process] Scroll Stack module failed to load.', error);
                throw error;
            });
        return modulePromise;
    }

    function findSteps() {
        var section = document.querySelector(SECTION);
        return section ? section.querySelector(STEPS) : null;
    }

    function originalCards(steps) {
        if (!steps) return [];
        return Array.prototype.filter.call(steps.children, function (child) {
            return !child.hasAttribute('data-ja-scrollstack') && !!child.querySelector(CARD);
        });
    }

    function markCards(nodes) {
        nodes.forEach(function (node) {
            node.setAttribute('data-ja-original-card', '');
        });
    }

    function cloneCards(nodes) {
        return nodes.map(function (node) {
            var clone = node.cloneNode(true);
            clone.removeAttribute('data-ja-original-card');
            var card = clone.querySelector(CARD);
            if (card) {
                var dim = document.createElement('span');
                dim.className = 'ja-scrollstack-dim';
                dim.setAttribute('aria-hidden', 'true');
                card.appendChild(dim);
            }

            // Framer's appear animation writes intermediate inline opacity /
            // transform values. A clone would freeze that half-faded state, so
            // settle those elements at their final values. Designed opacity
            // (the card dividers, for example) is not marked with appear-id.
            var appearing = clone.querySelectorAll('[data-framer-appear-id]');
            for (var j = 0; j < appearing.length; j++) {
                if (appearing[j].style.opacity) appearing[j].style.opacity = '1';
                if (appearing[j].style.transform) appearing[j].style.transform = 'none';
            }
            return clone;
        });
    }

    function destroy() {
        if (!host) return;
        suppressMutations = true;
        window.setTimeout(function () {
            suppressMutations = false;
        }, 0);
        var el = host;
        host = null;
        try {
            if (mod) mod.unmount(el);
        } catch (error) {
            console.warn('[process] Scroll Stack teardown failed.', error);
        }
        var steps = el.parentNode;
        if (steps) {
            steps.classList.remove('ja-scrollstack-mode');
            var marked = steps.querySelectorAll('[data-ja-original-card]');
            for (var j = 0; j < marked.length; j++) marked[j].removeAttribute('data-ja-original-card');
        }
        if (el.parentNode) el.parentNode.removeChild(el);
        document.documentElement.classList.remove('ja-scrollstack-active');
    }

    function enable() {
        if (busy) return;
        var steps = findSteps();
        var cards = originalCards(steps);
        if (cards.length !== 3) {
            destroy();
            return;
        }
        if (host && (!host.isConnected || host.parentNode !== steps)) destroy();
        if (!host) {
            markCards(cards);
            host = document.createElement('div');
            host.className = 'ja-scrollstack-host';
            host.setAttribute('data-ja-scrollstack', '');
            steps.appendChild(host);
            steps.classList.add('ja-scrollstack-mode');
            document.documentElement.classList.add('ja-scrollstack-active');
        }

        busy = true;
        loadModule()
            .then(function (loaded) {
                if (!host || !host.isConnected) {
                    busy = false;
                    schedule();
                    return;
                }
                if (!host.__jaScrollRoot) {
                    var live = originalCards(host.parentNode);
                    loaded.mount(host, cloneCards(live));
                }
                busy = false;
            })
            .catch(function () {
                busy = false;
                destroy();
            });
    }

    function sync() {
        enable();
    }

    function schedule() {
        if (scheduled) return;
        scheduled = true;
        (window.requestAnimationFrame || window.setTimeout)(function () {
            scheduled = false;
            sync();
        });
    }

    // Framer swaps card variants on breakpoint changes. Re-clone the live cards
    // so the stack always shows the current variant.
    window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
            if (!host || !host.isConnected) {
                schedule();
                return;
            }
            var live = originalCards(host.parentNode);
            if (live.length === 3 && mod && host.__jaScrollRoot) {
                markCards(live);
                mod.update(host, cloneCards(live));
            }
        }, 280);
    });

    var observer = new MutationObserver(function () {
        if (!suppressMutations && (!host || !host.isConnected)) schedule();
    });

    function boot() {
        if (!document.body) return;
        observer.observe(document.body, { childList: true, subtree: true });
        sync();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();
