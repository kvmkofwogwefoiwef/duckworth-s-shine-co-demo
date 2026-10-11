/* =========================================================
   DuckWorth's Shine Co. — Booking / Quote Builder
   ========================================================= */
(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var VEHICLES = {
    sedan: {
      label: 'Sedan / Coupe',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 80  },
        full:     { label: 'Full Detail (interior + exterior)',base: 180 },
        interior: { label: 'Interior Only',                    base: 130 },
        exterior: { label: 'Exterior Only',                    base: 100 }
      }
    },
    midsuv: {
      label: 'Mid-size SUV / Crossover',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 100 },
        full:     { label: 'Full Detail (interior + exterior)',base: 220 },
        interior: { label: 'Interior Only',                    base: 160 },
        exterior: { label: 'Exterior Only',                    base: 120 }
      }
    },
    fullsuv: {
      label: 'Full-size SUV / Minivan',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 130 },
        full:     { label: 'Full Detail (interior + exterior)',base: 280 },
        interior: { label: 'Interior Only',                    base: 200 },
        exterior: { label: 'Exterior Only',                    base: 150 }
      }
    },
    truck: {
      label: 'Pickup Truck',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 120 },
        full:     { label: 'Full Detail (interior + exterior)',base: 250 },
        interior: { label: 'Interior Only',                    base: 175 },
        exterior: { label: 'Exterior Only',                    base: 140 }
      }
    },
    hd: {
      label: 'Heavy Duty / Lifted Truck',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 160 },
        full:     { label: 'Full Detail (interior + exterior)',base: 340 },
        interior: { label: 'Interior Only',                    base: 220 },
        exterior: { label: 'Exterior Only',                    base: 180 }
      }
    },
    fleet: {
      label: 'Work Truck / Fleet',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 140 },
        full:     { label: 'Full Detail (interior + exterior)',base: 300 },
        interior: { label: 'Interior Only',                    base: 200 },
        exterior: { label: 'Exterior Only',                    base: 180 }
      }
    },
    boatUnder18: {
      label: 'Boat — Under 18 ft',
      services: {
        express:  { label: 'Express Hull Wash',                base: 120 },
        full:     { label: 'Full Boat Detail',                 base: 250 },
        interior: { label: 'Interior / Cabin Only',            base: 175 },
        exterior: { label: 'Hull Only',                        base: 150 }
      }
    },
    boat1824: {
      label: 'Boat — 18 to 24 ft',
      services: {
        express:  { label: 'Express Hull Wash',                base: 150 },
        full:     { label: 'Full Boat Detail',                 base: 320 },
        interior: { label: 'Interior / Cabin Only',            base: 225 },
        exterior: { label: 'Hull Only',                        base: 190 }
      }
    },
    boat2530: {
      label: 'Boat — 25 to 30 ft',
      services: {
        express:  { label: 'Express Hull Wash',                base: 190 },
        full:     { label: 'Full Boat Detail',                 base: 400 },
        interior: { label: 'Interior / Cabin Only',            base: 280 },
        exterior: { label: 'Hull Only',                        base: 240 }
      }
    },
    boat31: {
      label: 'Boat — 31 ft and up',
      services: {
        express:  { label: 'Express Hull Wash',                base: 250 },
        full:     { label: 'Full Boat Detail',                 base: 520 },
        interior: { label: 'Interior / Cabin Only',            base: 360 },
        exterior: { label: 'Hull Only',                        base: 310 }
      }
    }
  };

  var CONDITIONS = {
    good:    { label: 'Well-kept',                mult: 1.0  },
    average: { label: 'Daily driver, some dirt',  mult: 1.15 },
    rough:   { label: 'Rough — pet hair, stains', mult: 1.4  },
    severe:  { label: 'Heavy / neglected',        mult: 1.7  }
  };

  var state = {
    vehicle: 'sedan',
    service: 'full',
    condition: 'average'
  };

  function renderServices() {
    var container = $('#qbServices');
    if (!container) return;

    var services = VEHICLES[state.vehicle].services;
    container.innerHTML = '';

    Object.keys(services).forEach(function (key) {
      var svc = services[key];
      var label = document.createElement('label');
      label.className = 'qb-option';
      label.innerHTML =
        '<input type="radio" name="qb-service" value="' + key + '"' + (state.service === key ? ' checked' : '') + '>' +
        '<span class="qb-option-text">' +
          '<span>' + svc.label + '</span>' +
          '<span class="qb-option-price">from $' + svc.base + '</span>' +
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

    var vehicle = VEHICLES[state.vehicle];
    if (!vehicle) return;
    var service = vehicle.services[state.service];
    if (!service) return;
    var condition = CONDITIONS[state.condition] || CONDITIONS.average;

    var base = service.base;
    var conditionAdjusted = Math.round(base * condition.mult);

    var subtotal = conditionAdjusted;
    var low      = Math.round(subtotal / 5) * 5;
    var high     = Math.round((subtotal * 1.25) / 5) * 5;

    totalEl.innerHTML = '$' + low + '<small>– $' + high + '</small>';

    listEl.innerHTML = '';

    var lines = [
      ['Vehicle',    vehicle.label],
      ['Service',    service.label],
      ['Condition',  condition.label],
      ['Base price', '$' + conditionAdjusted]
    ];

    lines.forEach(function (row) {
      var li = document.createElement('li');
      li.innerHTML = '<span>' + row[0] + '</span><span>' + row[1] + '</span>';
      listEl.appendChild(li);
    });

    if (hiddenEl) {
      hiddenEl.value =
        'Vehicle: ' + vehicle.label + ' | ' +
        'Service: ' + service.label + ' | ' +
        'Condition: ' + condition.label + ' | ' +
        'Estimate: $' + low + '–$' + high;
    }
  }

  function init() {
    var builder = $('[data-quote-builder]');
    if (!builder) return;

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