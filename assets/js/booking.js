/* =========================================================
   DuckWorth's Shine Co. — Booking / Quote Builder
   Pulls prices from config/pricing.js
   ========================================================= */
(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function getAllVehicles() {
    if (typeof PRICING === 'undefined') return {};
    var all = {};
    Object.keys(PRICING.vehicles || {}).forEach(function (k) { all[k] = PRICING.vehicles[k]; });
    Object.keys(PRICING.boats    || {}).forEach(function (k) { all[k] = PRICING.boats[k]; });
    return all;
  }

  var state = { vehicle: 'sedan', service: 'full', condition: 'average' };

  function renderServices() {
    var container = $('#qbServices');
    if (!container) return;

    var vehicles = getAllVehicles();
    var v = vehicles[state.vehicle];
    if (!v) return;

    var available = Object.keys(v.services);
    // If the current selected service isn't available for this vehicle, use the first one
    if (available.indexOf(state.service) === -1) {
      state.service = available[0];
    }

    container.innerHTML = '';

    available.forEach(function (key) {
      var svc = v.services[key];
      var label = document.createElement('label');
      label.className = 'qb-option';
      label.innerHTML =
        '<input type="radio" name="qb-service" value="' + key + '"' +
          (state.service === key ? ' checked' : '') + '>' +
        '<span class="qb-option-text">' +
          '<span>' + svc.label + '</span>' +
          '<span class="qb-option-price">$' + svc.price + '</span>' +
        '</span>';
      var input = label.querySelector('input');
      if (input) {
        input.addEventListener('change', function () {
          state.service = key;
          renderSummary();
        });
      }
      container.appendChild(label);
    });
  }

  function renderSummary() {
    var totalEl  = $('#qbTotal');
    var listEl   = $('#qbList');
    var hiddenEl = $('#qbSummaryText');
    if (!totalEl || !listEl) return;

    var vehicles = getAllVehicles();
    var v = vehicles[state.vehicle];
    if (!v) return;
    var svc = v.services[state.service];
    if (!svc) return;
    var cond = (PRICING.conditions && PRICING.conditions[state.condition]) || { label: 'Average', multiplier: 1 };

    var base = svc.price;
    var adjusted = Math.round(base * cond.multiplier);
    var low  = Math.round(adjusted / 5) * 5;
    var high = Math.round((adjusted * (PRICING.rangeUpperMultiplier || 1.25)) / 5) * 5;

    totalEl.innerHTML = '$' + low + '<small>– $' + high + '</small>';

    listEl.innerHTML = '';
    [
      ['Vehicle',    v.label],
      ['Service',    svc.label],
      ['Condition',  cond.label],
      ['Base price', '$' + adjusted]
    ].forEach(function (row) {
      var li = document.createElement('li');
      li.innerHTML = '<span>' + row[0] + '</span><span>' + row[1] + '</span>';
      listEl.appendChild(li);
    });

    if (hiddenEl) {
      hiddenEl.value =
        'Vehicle: ' + v.label + ' | ' +
        'Service: ' + svc.label + ' | ' +
        'Condition: ' + cond.label + ' | ' +
        'Estimate: $' + low + '–$' + high;
    }
  }

  function init() {
    var builder = $('[data-quote-builder]');
    if (!builder) return;

    var vehicles = getAllVehicles();
    if (!Object.keys(vehicles).length) return;

    $$('input[name="qb-vehicle"]', builder).forEach(function (input) {
      input.addEventListener('change', function (e) {
        state.vehicle = e.target.value;
        renderServices();
        renderSummary();
      });
    });

    $$('input[name="qb-condition"]', builder).forEach(function (input) {
      input.addEventListener('change', function (e) {
        state.condition = e.target.value;
        renderSummary();
      });
    });

    var checkedVehicle = $('input[name="qb-vehicle"]:checked', builder);
    if (checkedVehicle) state.vehicle = checkedVehicle.value;

    var checkedCondition = $('input[name="qb-condition"]:checked', builder);
    if (checkedCondition) state.condition = checkedCondition.value;

    renderServices();
    renderSummary();

    if (!$('#qbSummaryText')) {
      var hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.id = 'qbSummaryText';
      hidden.name = 'quote_estimate';
      hidden.value = '';
      builder.appendChild(hidden);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();