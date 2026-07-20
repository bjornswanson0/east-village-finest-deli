// East Village Finest Deli — open-now status, hours highlight, mobile nav

(function () {
  // ----- Current time in the deli's timezone -----
  function nyNow() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(new Date());

    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });

    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      day: days[map.weekday],
      minutes: (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10),
    };
  }

  // Hours: every day 6:00 AM – midnight; Fri & Sat until 1:00 AM (next day).
  function openStatus(now) {
    var lateNightDays = [6, 0]; // Sat & Sun mornings carry Fri & Sat late hours

    if (now.minutes >= 360) {
      var closesAt1am = now.day === 5 || now.day === 6;
      return { open: true, text: closesAt1am ? "Open now · closes at 1 AM" : "Open now · closes at midnight" };
    }
    if (now.minutes < 60 && lateNightDays.indexOf(now.day) !== -1) {
      return { open: true, text: "Open now · closes at 1 AM" };
    }
    return { open: false, text: "Closed · opens at 6 AM" };
  }

  function updateStatus() {
    var pill = document.getElementById("open-status");
    var text = document.getElementById("open-status-text");
    if (!pill || !text) return;

    var status = openStatus(nyNow());
    pill.classList.toggle("is-open", status.open);
    pill.classList.toggle("is-closed", !status.open);
    text.textContent = status.text;
  }

  updateStatus();
  setInterval(updateStatus, 60 * 1000);

  // ----- Highlight today's row in the hours table -----
  var today = nyNow().day;
  var row = document.querySelector('.hours-table tr[data-day="' + today + '"]');
  if (row) row.classList.add("today");

  // ----- Mobile nav -----
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    function closeNav() {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        closeNav();
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (links.classList.contains("open") && !links.contains(e.target) && !toggle.contains(e.target)) {
        closeNav();
      }
    });
  }
})();
