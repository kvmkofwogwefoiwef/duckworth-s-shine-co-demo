/* =========================================================
   DuckWorth's Shine Co. — Pricing
   Edit prices here. Everything updates automatically.
   ========================================================= */

const PRICING = {

  vehicles: {
    sedan: {
      label: "Sedan / Coupe",
      services: {
        express:  { label: "Express",         price: 80  },
        full:     { label: "Full Detail",     price: 180 },
        interior: { label: "Interior Only",   price: 130 },
        exterior: { label: "Exterior Only",   price: 100 }
      }
    },
    midsuv: {
      label: "Mid-size SUV",
      services: {
        express:  { label: "Express",         price: 100 },
        full:     { label: "Full Detail",     price: 220 },
        interior: { label: "Interior Only",   price: 160 },
        exterior: { label: "Exterior Only",   price: 120 }
      }
    },
    fullsuv: {
      label: "Full-size SUV / Van",
      services: {
        express:  { label: "Express",         price: 130 },
        full:     { label: "Full Detail",     price: 280 },
        interior: { label: "Interior Only",   price: 200 },
        exterior: { label: "Exterior Only",   price: 150 }
      }
    },
    truck: {
      label: "Pickup Truck",
      services: {
        express:  { label: "Express",         price: 120 },
        full:     { label: "Full Detail",     price: 250 },
        interior: { label: "Interior Only",   price: 175 },
        exterior: { label: "Exterior Only",   price: 140 }
      }
    },
    hd: {
      label: "Heavy Duty / Lifted",
      services: {
        express:  { label: "Express",         price: 160 },
        full:     { label: "Full Detail",     price: 340 },
        interior: { label: "Interior Only",   price: 220 },
        exterior: { label: "Exterior Only",   price: 180 }
      }
    },
    fleet: {
      label: "Work Truck / Fleet",
      services: {
        express:  { label: "Express",         price: 140 },
        full:     { label: "Full Detail",     price: 300 },
        interior: { label: "Interior Only",   price: 200 },
        exterior: { label: "Exterior Only",   price: 180 }
      }
    }
  },

  boats: {
    boatUnder18: {
      label: "Boat — Under 18 ft",
      services: {
        express:  { label: "Express Hull Wash", price: 120 },
        full:     { label: "Full Boat Detail",  price: 250 },
        interior: { label: "Interior / Cabin",  price: 175 },
        exterior: { label: "Hull Only",         price: 150 }
      }
    },
    boat1824: {
      label: "Boat — 18 to 24 ft",
      services: {
        express:  { label: "Express Hull Wash", price: 150 },
        full:     { label: "Full Boat Detail",  price: 320 },
        interior: { label: "Interior / Cabin",  price: 225 },
        exterior: { label: "Hull Only",         price: 190 }
      }
    },
    boat2530: {
      label: "Boat — 25 to 30 ft",
      services: {
        express:  { label: "Express Hull Wash", price: 190 },
        full:     { label: "Full Boat Detail",  price: 400 },
        interior: { label: "Interior / Cabin",  price: 280 },
        exterior: { label: "Hull Only",         price: 240 }
      }
    },
    boat31: {
      label: "Boat — 31 ft and up",
      services: {
        express:  { label: "Express Hull Wash", price: 250 },
        full:     { label: "Full Boat Detail",  price: 520 },
        interior: { label: "Interior / Cabin",  price: 360 },
        exterior: { label: "Hull Only",         price: 310 }
      }
    }
  },

  conditions: {
    good:    { label: "Well-kept",                multiplier: 1.0  },
    average: { label: "Daily driver, some dirt",  multiplier: 1.15 },
    rough:   { label: "Rough — pet hair, stains", multiplier: 1.4  },
    severe:  { label: "Heavy / neglected",        multiplier: 1.7  }
  },

  rangeUpperMultiplier: 1.25,

  conditionNote: "Rough condition (pet hair, heavy stains, odor) typically adds 15–70% depending on severity. We'll always confirm the final price before starting work."
};