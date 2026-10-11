/* =========================================================
   DuckWorth's Shine Co. — Pricing
   =========================================================

   Edit prices here. Everything updates automatically:
   - The quote builder on the contact page
   - The mini quote builder on the packages page
   - The pricing tables on the packages page

   IMPORTANT: Only edit the numbers after "price:", not the
   structure. Prices are in USD. They're just numbers —
   no "$" needed (the site adds it).
   ========================================================= */

const PRICING = {

  /* ---------------------------------------------------------
     VEHICLES — Real prices from the shop
     --------------------------------------------------------- */
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

  /* ---------------------------------------------------------
     BOATS — Placeholder prices
     Update these once you have real boat pricing.
     --------------------------------------------------------- */
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

  /* ---------------------------------------------------------
     CONDITION MULTIPLIERS
     Applies to the base price based on vehicle condition.
     --------------------------------------------------------- */
  conditions: {
    good:    { label: "Well-kept",                multiplier: 1.0  },
    average: { label: "Daily driver, some dirt",  multiplier: 1.15 },
    rough:   { label: "Rough — pet hair, stains", multiplier: 1.4  },
    severe:  { label: "Heavy / neglected",        multiplier: 1.7  }
  },

  /* ---------------------------------------------------------
     QUOTE RANGE
     Range shown = base price × this multiplier (upper bound)
     --------------------------------------------------------- */
  rangeUpperMultiplier: 1.25,

  /* ---------------------------------------------------------
     MESSAGES
     --------------------------------------------------------- */
  conditionNote: "Rough condition (pet hair, heavy stains, odor) typically adds 15–70% depending on severity. We'll always confirm the final price before starting work.",

  boatNote: "Boats with heavy oxidation, barnacle buildup, or waterline stains may need extra labor; we'll confirm before starting.",

  fleetNote: "Fleet pricing is quoted per project based on fleet size and vehicle type. Message us for a custom quote."
};