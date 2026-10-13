/* =========================================================
   DuckWorth's Shine Co. — "What Does My Vehicle Need?" Quiz
   Add this file to services.html only.
   ========================================================= */
(function () {
  'use strict';

  var QUIZ = [
    {
      question: "What are you booking?",
      key: "type",
      options: [
        { label: "A car, truck, SUV, or van", value: "vehicle", icon: "🚗" },
        { label: "A boat",                    value: "boat",    icon: "🚤" },
        { label: "A work truck or fleet",     value: "fleet",   icon: "🚚" }
      ]
    },
    {
      question: "What's the main issue?",
      key: "issue",
      options: [
        { label: "Dull paint or water spots",     value: "exterior",    icon: "✨" },
        { label: "Dirty interior, stains, odor",  value: "interior",    icon: "🧽" },
        { label: "Both interior and exterior",    value: "full",        icon: "🎯" },
        { label: "Just needs a quick refresh",    value: "maintenance", icon: "⚡" }
      ]
    },
    {
      question: "How soon do you need it done?",
      key: "urgency",
      options: [
        { label: "This week",        value: "week",   icon: "📅" },
        { label: "Next week",        value: "next",   icon: "🗓" },
        { label: "Flexible on timing", value: "flex", icon: "🕐" }
      ]
    }
  ];

  // Maps quiz answers to a recommended service
  function recommend(answers) {
    var t = answers.type;
    var i = answers.issue;

    if (t === 'boat') {
      if (i === 'interior') return {
        title: "Interior / Cabin Detail",
        desc: "Cabin cleaning, upholstery, vinyl conditioning, and odor treatment for your boat.",
        link: "packages.html",
        cta: "See boat pricing"
      };
      if (i === 'maintenance') return {
        title: "Express Hull Wash",
        desc: "Quick hull wash and water spot removal — perfect between full details.",
        link: "packages.html",
        cta: "See boat pricing"
      };
      return {
        title: "Full Boat Detail",
        desc: "Hull wash, oxidation removal, gel coat sealant, and interior detail.",
        link: "services.html#boat",
        cta: "See boat services"
      };
    }

    if (t === 'fleet') {
      return {
        title: "Work Truck & Fleet Detailing",
        desc: "Heavy-duty cleaning for commercial vehicles. Recurring service and volume pricing available.",
        link: "services.html#fleet",
        cta: "Request fleet pricing"
      };
    }

    // Vehicle
    if (i === 'interior') return {
      title: "Interior Only Detail",
      desc: "Vacuum, extraction, leather conditioning, glass, and odor treatment.",
      link: "packages.html",
      cta: "See interior pricing"
    };
    if (i === 'exterior') return {
      title: "Exterior Only Detail",
      desc: "Hand wash, decontamination, clay bar, and hand-applied sealant.",
      link: "packages.html",
      cta: "See exterior pricing"
    };
    if (i === 'maintenance') return {
      title: "Exterior Detail & Hand Wash",
      desc: "A quick refresh that keeps your paint looking its best between full details.",
      link: "packages.html",
      cta: "See pricing"
    }
    return {
      title: "Full Detail",
      desc: "Complete interior and exterior care — our most popular service.",
      link: "packages.html",
      cta: "See full detail pricing"
    };
  }

  function init() {
    var host = document.getElementById('quiz');
    if (!host) return;

    var answers = {};
    var currentStep = 0;

    function render() {
      if (currentStep < QUIZ.length) {
        var step = QUIZ[currentStep];
        host.innerHTML =
          '<div class="quiz-progress">Step ' + (currentStep + 1) + ' of ' + QUIZ.length + '</div>' +
          '<h3 class="quiz-question">' + step.question + '</h3>' +
          '<div class="quiz-options">' +
            step.options.map(function (o, i) {
              return '<button type="button" class="quiz-option" data-value="' + o.value + '">' +
                '<span class="quiz-option-icon" aria-hidden="true">' + o.icon + '</span>' +
                '<span class="quiz-option-label">' + o.label + '</span>' +
              '</button>';
            }).join('') +
          '</div>' +
          (currentStep > 0
            ? '<button type="button" class="quiz-back" id="quizBack">← Back</button>'
            : '');

        host.querySelectorAll('.quiz-option').forEach(function (btn) {
          btn.addEventListener('click', function () {
            answers[step.key] = btn.dataset.value;
            currentStep++;
            render();
          });
        });

        var back = host.querySelector('#quizBack');
        if (back) back.addEventListener('click', function () {
          currentStep--;
          render();
        });
      } else {
        var rec = recommend(answers);
        host.innerHTML =
          '<div class="quiz-result">' +
            '<div class="quiz-result-label">Recommended for you</div>' +
            '<h3 class="quiz-result-title">' + rec.title + '</h3>' +
            '<p class="quiz-result-desc">' + rec.desc + '</p>' +
            '<div class="quiz-result-actions">' +
              '<a class="btn btn-primary" href="contact.html">Book This Service</a>' +
              '<a class="btn btn-outline" href="' + rec.link + '">' + rec.cta + '</a>' +
            '</div>' +
            '<button type="button" class="quiz-reset" id="quizReset">Start over</button>' +
          '</div>';

        host.querySelector('#quizReset').addEventListener('click', function () {
          answers = {};
          currentStep = 0;
          render();
        });
      }
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();