/**
 * Import js modules in fractal
 * Similar to app.js, but without the Drupalness
 */
import initSiteDefaults from './modules/init.js';


function fractalGetTitleFontSizes() {
  const els = document.querySelectorAll('.fractal-type-size');

  els.forEach.call(el => {
    var parent = el.parentNode;
    var text = parent.previousElementSibling;
    el.getElementsByTagName('span')[0].innerHTML = window
      .getComputedStyle(text, null)
      .getPropertyValue('font-size');
  });
}

(() => {
  fractalGetTitleFontSizes();

  window.addEventListener('resize', () => {
    fractalGetTitleFontSizes();
  });

  // Run imports here
  initSiteDefaults();
})();
