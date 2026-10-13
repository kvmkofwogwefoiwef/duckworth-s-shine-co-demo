/* =========================================================
   DuckWorth's Shine Co. — Pricing
   Edit prices here. Everything updates automatically.
   ========================================================= */

const PRICING = {

  locations: {
    shop:   { label: "At the shop (1350 E Columbia Ave)" },
    mobile: { label: "Mobile — we come to you" }
  },

  vehicles: {
    sedan: {
      label: "Sedan / Coupe",
      services: {
        full:     { label: "Full Detail (interior + exterior)", price: 140 },
        interior: { label: "Interior Only",                     price: 100 },
        exterior: { label: "Exterior Only",                     price: 60  }
      }
    },
    suv: {
      label: "SUV / Crossover",
      services: {
        full:     { label: "Full Detail (interior + exterior)", price: 200 },
        interior: { label: "Interior Only",                     price: 150 },
        exterior: { label: "Exterior Only",                     price: 70  }
      }
    },
    truckvan: {
      label: "Truck / Mini Van",
      services: {
        full:     { label: "Full Detail (interior + exterior)", price: 250 },
        interior: { label: "Interior Only",                     price: 175 },
        exterior: { label: "Exterior Only",                     price: 90  }
      }
    },
    threeRow: {
      label: "3-Row SUV / Van",
      services: {
        full:     { label: "Full Detail (interior + exterior)", price: 300 },
        interior: { label: "Interior Only",                     price: 205 },
        exterior: { label: "Exterior Only",                     price: 110 }
      }
    }
  },

  boats: {
    boatUnder18: {
      label: "Boat — Under 18 ft",
      services: {
        full:     { label: "Full Boat Detail",  price: 250 },
        interior: { label: "Interior / Cabin",  price: 175 },
        exterior: { label: "Hull Only",         price: 150 }
      }
    },
    boat1824: {
      label: "Boat — 18 to 24 ft",
      services: {
        full:     { label: "Full Boat Detail",  price: 320 },
        interior: { label: "Interior / Cabin",  price: 225 },
        exterior: { label: "Hull Only",         price: 190 }
      }
    },
    boat2530: {
      label: "Boat — 25 to 30 ft",
      services: {
        full:     { label: "Full Boat Detail",  price: 400 },
        interior: { label: "Interior / Cabin",  price: 280 },
        exterior: { label: "Hull Only",         price: 240 }
      }
    },
    boat31: {
      label: "Boat — 31 ft and up",
      services: {
        full:     { label: "Full Boat Detail",  price: 520 },
        interior: { label: "Interior / Cabin",  price: 360 },
        exterior: { label: "Hull Only",         price: 310 }
      }
    }
  },

  conditions: {
    good:    { label: "Well-kept",                multiplier: 1.0  },
    average: { label: "Daily driver, some dirt",  multiplier: 1.15 },
    rough:   { label: "Rough — pet hair, stains", multiplier: 1.2  },
    severe:  { label: "Heavy / neglected",        multiplier: 1.4  }
  },

  rangeUpperMultiplier: 1.25,

  conditionNote: "Rough condition (pet hair, heavy stains, odor) typically adds 15–70% depending on severity. We'll always confirm the final price before starting work."
};