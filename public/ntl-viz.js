/* NTL "Visualize | Code" tabs (markup from src/plugins/remark-ntl-viz.mjs).
 *
 * The embed script is loaded lazily, the first time a block scrolls near the
 * viewport, so pages without NTL (and readers who never scroll to it) pay
 * nothing. Blocks render through NeuralSeekEmbed.render(); the embed queues
 * them itself.
 *
 * Dev override: ?ntlEmbed=http://localhost:8766/src/ntlEmbed.js (persisted in
 * localStorage.nsNtlEmbed; a bare ?ntlEmbed= clears it).
 */
(function () {
	var DEFAULT_EMBED = 'https://consoleapi.neuralseek.com/src/ntlEmbed.js';

	function embedUrl() {
		try {
			var q = new URLSearchParams(location.search);
			if (q.has('ntlEmbed')) {
				if (q.get('ntlEmbed')) localStorage.nsNtlEmbed = q.get('ntlEmbed');
				else localStorage.removeItem('nsNtlEmbed');
			}
			return localStorage.nsNtlEmbed || DEFAULT_EMBED;
		} catch (e) {
			return DEFAULT_EMBED;
		}
	}

	var embedPromise = null;
	function loadEmbed() {
		if (window.NeuralSeekEmbed) return Promise.resolve();
		if (!embedPromise) {
			embedPromise = new Promise(function (resolve, reject) {
				var s = document.createElement('script');
				s.src = embedUrl();
				s.onload = function () {
					window.NeuralSeekEmbed ? resolve() : reject(new Error('NeuralSeekEmbed missing'));
				};
				s.onerror = function () {
					reject(new Error('embed failed to load'));
				};
				document.head.appendChild(s);
			});
		}
		return embedPromise;
	}

	function select(block, which) {
		block.querySelectorAll('[data-ns-ntl-tab]').forEach(function (b) {
			b.setAttribute('aria-selected', String(b.getAttribute('data-ns-ntl-tab') === which));
		});
		block.querySelector('.ns-ntl__viz').hidden = which !== 'viz';
		block.querySelector('.ns-ntl__code').hidden = which !== 'code';
	}

	function fail(block, viz) {
		viz.innerHTML = '<span class="ns-ntl__status">Visualization unavailable.</span>';
		select(block, 'code');
	}

	function render(viz) {
		var block = viz.closest('[data-ns-ntl-block]');
		loadEmbed().then(
			function () {
				window.NeuralSeekEmbed.render(viz, viz.getAttribute('data-ns-ntl-src'));
			},
			function () {
				fail(block, viz);
			},
		);
	}

	function init() {
		var blocks = document.querySelectorAll('[data-ns-ntl-block]');
		if (!blocks.length) return;

		blocks.forEach(function (block) {
			block.addEventListener('click', function (e) {
				var tab = e.target.closest('[data-ns-ntl-tab]');
				if (tab) select(block, tab.getAttribute('data-ns-ntl-tab'));
			});
		});

		var vizs = Array.prototype.slice.call(document.querySelectorAll('.ns-ntl__viz'));
		if (!('IntersectionObserver' in window)) return vizs.forEach(render);
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (en) {
					if (!en.isIntersecting) return;
					io.unobserve(en.target);
					render(en.target);
				});
			},
			{ rootMargin: '300px' },
		);
		vizs.forEach(function (v) {
			io.observe(v);
		});
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
