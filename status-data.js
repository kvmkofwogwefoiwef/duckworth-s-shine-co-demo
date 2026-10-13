/* =========================================================
   DuckWorth's Shine Co. — Customer Status Data
   =========================================================

   HOW TO USE THIS FILE:

   1. When a customer books a job, add a new entry below.
   2. Give them their email + PIN when you confirm the booking.
   3. Update the "steps" as you work through the job.
   4. When the job is done, change "active" to false.
   5. Save the file. Refresh the status page.

   The customer goes to yoursite.com/status.html, enters
   their email and PIN, and sees their job's progress.

   IMPORTANT: Keep the quotes and commas. Case matters for
   emails — use lowercase.
   ========================================================= */

const JOBS = [

  /* ----- EXAMPLE ENTRY — replace with your real jobs ----- */
  {
    email:      "jane@example.com",   // Customer's email (lowercase)
    pin:        "2481",               // 4-digit code you give them
    active:     true,                 // true = show them, false = hide
    customer:   "Jane Doe",           // Their name (shows on welcome)
    vehicle:    "2022 Subaru Outback",
    service:    "Full Detail",
    location:   "Shop",
    dropoff:    "Oct 14, 2026 · 9:00 AM",
    pickup:     "Oct 14, 2026 · 4:00 PM",
    steps: [
      { label: "Vehicle received",       done: true  },
      { label: "Exterior hand wash",     done: true  },
      { label: "Interior deep clean",    done: true  },
      { label: "Extraction & shampoo",   done: false },
      { label: "Leather conditioned",    done: false },
      { label: "Hand-applied sealant",   done: false },
      { label: "Final inspection",       done: false },
      { label: "Ready for pickup",       done: false }
    ],
    notes: ""
  },

  /* ----- Add more jobs below, separated by commas ----- */

  /* EXAMPLE — another job, already completed
  {
    email:      "bob@example.com",
    pin:        "9310",
    active:     false,
    customer:   "Bob Smith",
    vehicle:    "2018 Ford F-150",
    service:    "Full Detail",
    location:   "Mobile — customer's home",
    dropoff:    "Oct 10, 2026 · 8:00 AM",
    pickup:     "Oct 10, 2026 · 2:00 PM",
    steps: [
      { label: "Vehicle received",       done: true  },
      { label: "Exterior hand wash",     done: true  },
      { label: "Interior deep clean",    done: true  },
      { label: "Extraction & shampoo",   done: true  },
      { label: "Leather conditioned",    done: true  },
      { label: "Hand-applied sealant",   done: true  },
      { label: "Final inspection",       done: true  },
      { label: "Ready for pickup",       done: true  }
    ],
    notes: "Thanks for your business!"
  }
  */

];