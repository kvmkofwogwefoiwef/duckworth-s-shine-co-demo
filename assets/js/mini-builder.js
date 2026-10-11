/* =========================================================
   DuckWorth's Shine Co. — Mini Quote Builder (packages.html)
   ========================================================= */
(function () {
  'use strict';

  function getAllVehicles() {
    if (typeof PRICING === 'undefined') return {};
    var all = {};
    Object.keys(PRICING.vehicles || {}).forEach(function (k) { all[k] = PRICING.vehicles[k]; });
    Object.keys(PRICING.boats    || {}).forEach(function (k) { all[k] = PRICING.boats[k]; });
    return all;
  }

  function init() {
    var vSel = document.getElementById('mini-vehicle');
    var sSel = document.getElementById('mini-service');
    var res  = document.getElementById('miniResult');
    var rng  = document.getElementById('miniRange');
    if (!vSel || !sSel || !res || !rng) return;

    var vehicles = getAllVehicles();

    function updateServices() {
      var v = vehicles[vSel.value];
      sSel.innerHTML = '<option value="">Choose service…</option>';
      if (v) {
        Object.keys(v.services).forEach(function (key) {
          var opt = document.createElement('option');
          opt.value = key;
          opt.textContent = v.services[key].label;
          sSel.appendChild(opt);
        });
      }
      res.style.display = 'none';
    }

    function updateRange() {
      var v = vehicles[vSel.value];
      if (!v) { res.style.display = 'none'; return; }
      var s = v.services[sSel.value];
      if (!s) { res.style.display = 'none'; return; }
      var low  = Math.round(s.price / 5) * 5;
      var high = Math.round((s.price * (PRICING.rangeUpperMultiplier || 1.25)) / 5) * 5;
      rng.textContent = '$' + low + ' – $' + high;
      res.style.display = 'flex';
    }

    vSel.addEventListener('change', updateServices);
    sSel.addEventListener('change', updateRange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();