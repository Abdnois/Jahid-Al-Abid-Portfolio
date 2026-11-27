/* ------------------------------------------------------------------ *
 * FlexCarousel loader.
 *
 * The site is a static Framer export. This small dependency-free script
 * mounts the React Bits FlexCarousel only at <=1199.98px, matching Framer's
 * own 1200px desktop breakpoint. The React + OGL bundle is imported on demand,
 * so desktop never downloads or runs it. Resizing across the breakpoint mounts
 * or fully tears the component down.
 * ------------------------------------------------------------------ */
(function () {
    'use strict';

    var QUERY = '(max-width: 1199.98px)';
    var SECTION = 'section[data-framer-name="Projects"]';
    var mql = window.matchMedia(QUERY);

    var script = document.currentScript;
    if (!script || !script.src) {
        var scripts = document.querySelectorAll('script[src]');
        for (var i = scripts.length - 1; i >= 0; i--) {
            if (/projects-flexcarousel-loader\.js/.test(scripts[i].src)) {
                script = scripts[i];
                break;
            }
        }
    }
    var base = script && script.src ? new URL('.', script.src).href : 'js/';

    var modulePromise = null;
    var mod = null;
    var host = null;
    var busy = false;
    var scheduled = false;

    function ensureStyle() {
        if (document.querySelector('link[data-ja-flexcarousel-style]')) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = base + 'flexcarousel/flexcarousel.css';
        link.setAttribute('data-ja-flexcarousel-style', '');
        document.head.appendChild(link);
    }

    function loadModule() {
        if (mod) return Promise.resolve(mod);
        if (modulePromise) return modulePromise;
        ensureStyle();
        modulePromise = import(base + 'flexcarousel/flexcarousel.js')
            .then(function (loaded) {
                mod = loaded;
                return loaded;
            })
            .catch(function (error) {
                modulePromise = null;
                // Leave the original Framer grid visible as the last resort.
                console.warn('[projects] FlexCarousel module failed to load.', error);
                throw error;
            });
        return modulePromise;
    }

    function currentSection() {
        return document.querySelector(SECTION);
    }

    function createHost(wrapper) {
        var el = document.createElement('div');
        el.className = 'ja-flexcarousel';
        el.id = 'projects-flexcarousel';
        el.setAttribute('data-ja-flexcarousel', '');
        el.setAttribute('role', 'group');
        el.setAttribute('aria-label', 'Projects');
        var buttons = wrapper.querySelector('[data-framer-name="Buttons"]');
        if (buttons) wrapper.insertBefore(el, buttons);
        else wrapper.appendChild(el);
        return el;
    }

    function destroyHost() {
        if (!host) return;
        var el = host;
        host = null;
        try {
            if (mod) mod.unmount(el);
        } catch (error) {
            console.warn('[projects] FlexCarousel teardown failed.', error);
        }
        if (el.parentNode) el.parentNode.removeChild(el);
    }

    function enable() {
        if (!mql.matches || busy) return;
        var section = currentSection();
        if (!section) {
            destroyHost();
            return;
        }
        var wrapper = section.querySelector('[data-framer-name="Wrapper"]');
        if (!wrapper) return;
        // navigation-updates.js also sets this id; keep it self-contained.
        if (!section.id) section.id = 'projects';
        if (host && (!host.isConnected || host.parentNode !== wrapper)) destroyHost();
        if (!host) host = createHost(wrapper);

        busy = true;
        loadModule()
            .then(function (loaded) {
                if (!mql.matches) {
                    busy = false;
                    disable();
                    return;
                }
                var liveSection = currentSection();
                if (!liveSection || !host || !host.isConnected) {
                    busy = false;
                    schedule();
                    return;
                }
                if (!host.__jaFlexRoot) loaded.mount(host);
                liveSection.classList.add('ja-flexcarousel-mode');
                busy = false;
            })
            .catch(function () {
                busy = false;
                destroyHost();
            });
    }

    function disable() {
        var section = currentSection();
        if (section) section.classList.remove('ja-flexcarousel-mode');
        destroyHost();
        busy = false;
    }

    function sync() {
        if (mql.matches) enable();
        else disable();
    }

    function schedule() {
        if (scheduled) return;
        scheduled = true;
        (window.requestAnimationFrame || window.setTimeout)(function () {
            scheduled = false;
            sync();
        });
    }

    if (mql.addEventListener) mql.addEventListener('change', schedule);
    else if (mql.addListener) mql.addListener(schedule);

    var observer = new MutationObserver(function () {
        if (!mql.matches) return;
        var section = currentSection();
        if (!section) return;
        if (!host || !host.isConnected || !section.classList.contains('ja-flexcarousel-mode')) {
            schedule();
        }
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
