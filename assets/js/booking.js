/* =========================================================
   DuckWorth's Shine Co. — Booking / Quote Builder
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* PRICING MODEL — edit numbers here AND on packages.html */
  const VEHICLES = {
    sedan: {
      label: 'Sedan / Coupe',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 80  },
        full:     { label: 'Full Detail (interior + exterior)',base: 180 },
        interior: { label: 'Interior Only',                    base: 130 },
        exterior: { label: 'Exterior Only',                    base: 100 },
        rims:     { label: 'Rim & Tire Only',                  base: 60  }
      },
      addons: { petHair: 15, odor: 25, engineBay: 30, wax: 25, undercarriage: 15 }
    },
    midsuv: {
      label: 'Mid-size SUV / Crossover',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 100 },
        full:     { label: 'Full Detail (interior + exterior)',base: 220 },
        interior: { label: 'Interior Only',                    base: 160 },
        exterior: { label: 'Exterior Only',                    base: 120 },
        rims:     { label: 'Rim & Tire Only',                  base: 70  }
      },
      addons: { petHair: 20, odor: 30, engineBay: 35, wax: 30, undercarriage: 15 }
    },
    fullsuv: {
      label: 'Full-size SUV / Minivan',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 130 },
        full:     { label: 'Full Detail (interior + exterior)',base: 280 },
        interior: { label: 'Interior Only',                    base: 200 },
        exterior: { label: 'Exterior Only',                    base: 150 },
        rims:     { label: 'Rim & Tire Only',                  base: 80  }
      },
      addons: { petHair: 25, odor: 35, engineBay: 40, wax: 35, undercarriage: 20 }
    },
    truck: {
      label: 'Pickup Truck',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 120 },
        full:     { label: 'Full Detail (interior + exterior)',base: 250 },
        interior: { label: 'Interior Only',                    base: 175 },
        exterior: { label: 'Exterior Only',                    base: 140 },
        rims:     { label: 'Rim & Tire Only',                  base: 75  }
      },
      addons: { petHair: 20, odor: 30, engineBay: 35, wax: 30, undercarriage: 20 }
    },
    hd: {
      label: 'Heavy Duty / Lifted Truck',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 160 },
        full:     { label: 'Full Detail (interior + exterior)',base: 340 },
        interior: { label: 'Interior Only',                    base: 220 },
        exterior: { label: 'Exterior Only',                    base: 180 },
        rims:     { label: 'Rim & Tire Only',                  base: 90  }
      },
      addons: { petHair: 25, odor: 40, engineBay: 45, wax: 40, undercarriage: 25 }
    },
    fleet: {
      label: 'Work Truck / Fleet',
      services: {
        express:  { label: 'Express (wash + vacuum)',          base: 140 },
        full:     { label: 'Full Detail (interior + exterior)',base: 300 },
        interior: { label: 'Interior Only',                    base: 200 },
        exterior: { label: 'Exterior Only',                    base: 180 },
        rims:     { label: 'Rim & Tire Only',                  base: 80  }
      },
      addons: { petHair: 20, odor: 35, engineBay: 45, wax: 35, undercarriage: 25 }
    }
  };

  const CONDITIONS = {
    good:    { label: 'Well-kept',                mult: 1.0  },
    average: { label: 'Daily driver, some dirt',  mult: 1.15 },
    rough:   { label: 'Rough — pet hair, stains', mult: 1.4  },
    severe:  { label: 'Heavy / neglected',        mult: 1.7  }
  };

  const ADDON_LABELS = {
    petHair:       'Pet hair removal',
    odor:          'Odor treatment',
    engineBay:     'Engine bay cleaning',
    wax:           'Hand wax / sealant',
    undercarriage: 'Undercarriage rinse'
  };

  const state = {
    vehicle: 'sedan',
    service: 'full',
    condition: 'average',
    addons: new Set()
  };

  function renderServices() {
    const container = $('#qbServices');
    if (!container) return;

    const services = VEHICLES[state.vehicle].services;
    container.innerHTML = '';

    Object.entries(services).forEach(([key, svc]) => {
      const label = document.createElement('label');
      label.className = 'qb-option';
      label.innerHTML =
        '<input type="radio" name="qb-service" value="' + key + '"' + (state.service === key ? ' checked' : '') + '>' +
        '<span class="qb-option-text">' +
          '<span>' + svc.label + '</span>' +
          '<span class="qb-option-price">from $' + svc.base + '</span>' +
        '</span>';
      label.querySelector('input').addEventListener('change', () => {
        state.service = key;
        renderSummary();
      });
      container.appendChild(label);
    });
  }

  function renderAddons() {
    const container = $('#qbAddons');
    if (!container) return;

    const addons = VEHICLES[state.vehicle].addons;
    container.innerHTML = '';

    Object.entries(addons).forEach(([key, price]) => {
      const label = document.createElement('label');
      label.className = 'qb-option';
      label.innerHTML =
        '<input type="checkbox" name="qb-addon" value="' + key + '"' + (state.addons.has(key) ? ' checked' : '') + '>' +
        '<span class="qb-option-text">' +
          '<span>' + ADDON_LABELS[key] + '</span>' +
          '<span class="qb-option-price">+$' + price + '</span>' +
        '</span>';
      label.querySelector('input').addEventListener('change', (e) => {
        if (e.target.checked) state.addons.add(key);
        else state.addons.delete(key);
        renderSummary();
      });
      container.appendChild(label);
    });
  }

  function renderSummary() {
    const totalEl  = $('#qbTotal');
    const listEl   = $('#qbList');
    const hiddenEl = $('#qbSummaryText');
    if (!totalEl || !listEl) return;

    const vehicle   = VEHICLES[state.vehicle];
    const service   = vehicle.services[state.service];
    const condition = CONDITIONS[state.condition];

    const base      = service.base;
    const conditionAdjusted = Math.round(base * condition.mult);
    const addonsTotal = Array.from(state.addons)
      .reduce((sum, key) => sum + (vehicle.addons[key] || 0), 0);

    const subtotal = conditionAdjusted + addonsTotal;
    const low      = Math.round(subtotal / 5) * 5;
    const high     = Math.round((subtotal * 1.25) / 5) * 5;

    totalEl.innerHTML = '$' + low + '<small>– $' + high + '</small>';

    listEl.innerHTML = '';

    const lines = [
      ['Vehicle',           vehicle.label],
      ['Service',           service.label],
      ['Condition',         condition.label],
      ['Base price',        '$' + conditionAdjusted]
    ];

    if (state.addons.size) {
      Array.from(state.addons).forEach((key) => {
        lines.push([ADDON_LABELS[key], '+$' + vehicle.addons[key]]);
      });
    }

    lines.forEach(([label, value]) => {
      const li = document.createElement('li');
      li.innerHTML = '<span>' + label + '</span><span>' + value + '</span>';
      listEl.appendChild(li);
    });

    if (hiddenEl) {
      const addonText = state.addons.size
        ? ' | Add-ons: ' + Array.from(state.addons).map((k) => ADDON_LABELS[k]).join(', ')
        : '';
      hiddenEl.value =
        'Vehicle: ' + vehicle.label + ' | ' +
        'Service: ' + service.label + ' | ' +
        'Condition: ' + condition.label + ' | ' +
        'Estimate: $' + low + '–$' + high +
        addonText;
    }
  }

  function init() {
    const builder = $('[data-quote-builder]');
    if (!builder) return;

    $$('input[name="qb-vehicle"]', builder).forEach((input) => {
      input.addEventListener('change', (e) => {
        state.vehicle = e.target.value;
        state.addons.clear();
        renderServices();
        renderAddons();
        renderSummary();
      });
    });

    $$('input[name="qb-condition"]', builder).forEach((input) => {
      input.addEventListener('change', (e) => {
        state.condition = e.target.value;
        renderSummary();
      });
    });

    renderServices();
    renderAddons();
    renderSummary();

    if (!$('#qbSummaryText')) {
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.id = 'qbSummaryText';
      hidden.name = 'quote_estimate';
      hidden.value = '';
      builder.appendChild(hidden);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();