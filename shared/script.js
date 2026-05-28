document.addEventListener('DOMContentLoaded', function () {
  initTabs();
  initSkillChips();
  initFormValidation();
  initCandidateDrawer();
  initActionDropdowns();
});

function initTabs() {
  var tabBtns = document.querySelectorAll('.tab-btn');
  if (!tabBtns.length) return;
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.dataset.tab;
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
}

function initSkillChips() {
  var wrapper = document.getElementById('chip-input-wrapper');
  var list    = document.getElementById('chip-list');
  var input   = document.getElementById('skill-input');
  if (!wrapper || !list || !input) return;

  wrapper.addEventListener('click', function () { input.focus(); });

  input.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
      e.preventDefault();
      addChip(input.value.trim());
      input.value = '';
    }
    if (e.key === 'Backspace' && !input.value) {
      var chips = list.querySelectorAll('.chip-removable');
      if (chips.length) chips[chips.length - 1].remove();
    }
  });

  document.querySelectorAll('.chip-suggest').forEach(function (btn) {
    btn.addEventListener('click', function () { addChip(btn.dataset.skill); });
  });

  function addChip(skill) {
    if (!skill) return;
    var existing = Array.from(list.querySelectorAll('.chip-removable')).map(function (c) { return c.dataset.skill; });
    if (existing.includes(skill)) return;
    var chip = document.createElement('span');
    chip.className = 'chip-removable';
    chip.dataset.skill = skill;
    chip.innerHTML = skill + '<button type="button" class="chip-remove-btn" aria-label="' + skill + ' entfernen">\xd7</button>';
    chip.querySelector('.chip-remove-btn').addEventListener('click', function () { chip.remove(); });
    list.appendChild(chip);
  }
}

function initFormValidation() {
  var form      = document.getElementById('opportunity-form');
  var submitBtn = document.getElementById('submit-btn');
  if (!form || !submitBtn) return;

  var requiredFields = Array.from(form.querySelectorAll('[required]'));

  function checkValidity() {
    submitBtn.disabled = !requiredFields.every(function (f) { return f.value.trim() !== ''; });
  }
  requiredFields.forEach(function (f) { f.addEventListener('input', checkValidity); });

  requiredFields.forEach(function (f) {
    f.addEventListener('blur', function () {
      var err = document.getElementById(f.id + '-error');
      if (!err) return;
      if (!f.value.trim()) { err.textContent = 'Dieses Feld ist erforderlich.'; f.classList.add('error'); }
      else                 { err.textContent = ''; f.classList.remove('error'); }
    });
    f.addEventListener('input', function () {
      var err = document.getElementById(f.id + '-error');
      if (err && f.value.trim()) { err.textContent = ''; f.classList.remove('error'); }
    });
  });

  var startDate = document.getElementById('start-date');
  var endDate   = document.getElementById('end-date');
  var endError  = document.getElementById('end-date-error');
  if (startDate && endDate && endError) {
    function validateDates() {
      if (endDate.value && startDate.value && endDate.value < startDate.value) {
        endError.textContent = 'Enddatum muss nach dem Startdatum liegen.';
        endDate.classList.add('error');
      } else {
        endError.textContent = '';
        endDate.classList.remove('error');
      }
    }
    startDate.addEventListener('change', validateDates);
    endDate.addEventListener('change', validateDates);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.location.href = 'detail-matches.html';
  });
}

var CANDIDATES = {
  mm: { name: 'Max Mustermann', role: 'Senior Consultant', initials: 'MM', color: '#1976D2', manager: 'Anna Schmidt', managerInitials: 'AS', score: 91, status: 'approved', required: ['Java','AWS','Docker','PostgreSQL','Terraform'], has: ['Java','AWS','Docker','Spring Boot','Kubernetes'], exports: [{ name: 'Kurzprofil_MaxMustermann_AWS_2026.pdf', date: '15.05.2026' }] },
  sk: { name: 'Sandra Koch', role: 'Consultant', initials: 'SK', color: '#388E3C', manager: 'Anna Schmidt', managerInitials: 'AS', score: 84, status: 'review', required: ['Java','AWS','Docker','PostgreSQL','Terraform'], has: ['Java','Spring','Kafka','SQL','Maven'], exports: [{ name: 'Kurzprofil_SandraKoch_v1.pdf', date: '12.05.2026' }] },
  fw: { name: 'Felix Weber', role: 'Consultant', initials: 'FW', color: '#F57C00', manager: 'Anna Schmidt', managerInitials: 'AS', score: 69, status: 'open', required: ['Java','AWS','Docker','PostgreSQL','Terraform'], has: ['AWS','Lambda','Docker','Python','Serverless'], exports: [] },
  tb: { name: 'Thomas Berger', role: 'Senior Consultant', initials: 'TB', color: '#7B1FA2', manager: 'Klaus Bauer', managerInitials: 'KB', score: 78, status: 'review', required: ['Java','AWS','Docker','PostgreSQL','Terraform'], has: ['AWS','Terraform','CI/CD','Azure','Linux'], exports: [] },
  jr: { name: 'Jana Richter', role: 'Consultant', initials: 'JR', color: '#E53935', manager: 'Klaus Bauer', managerInitials: 'KB', score: 61, status: 'open', required: ['Java','AWS','Docker','PostgreSQL','Terraform'], has: ['Java','SQL','Spring','JUnit'], exports: [] },
  lm: { name: 'Lisa Müller', role: 'Principal Consultant', initials: 'LM', color: '#0097A7', manager: 'Marco Lehmann', managerInitials: 'ML', score: 74, status: 'open', required: ['Java','AWS','Docker','PostgreSQL','Terraform'], has: ['Java','SQL','Maven','JPA','Microservices'], exports: [] },
};

function initCandidateDrawer() {
  var overlay = document.getElementById('drawer-overlay');
  var drawer  = document.getElementById('candidate-drawer');
  if (!overlay || !drawer) return;

  document.querySelectorAll('.data-table tbody tr').forEach(function (row) {
    var avatarEl = row.querySelector('.avatar');
    if (!avatarEl) return;
    var key = avatarEl.textContent.trim().toLowerCase();
    if (!CANDIDATES[key]) return;
    row.style.cursor = 'pointer';
    row.addEventListener('click', function (e) {
      if (e.target.type === 'checkbox' || e.target.tagName === 'BUTTON') return;
      openDrawer(key);
    });
  });

  overlay.addEventListener('click', closeDrawer);
  var closeBtn = document.getElementById('drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  var closeBtnBottom = document.getElementById('drawer-close-btn');
  if (closeBtnBottom) closeBtnBottom.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', function (e) {
    var label = e.target.closest('.status-radio-label');
    if (label) {
      drawer.querySelectorAll('.status-radio-label').forEach(function (l) { l.classList.remove('selected'); });
      label.classList.add('selected');
      var radio = label.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    }
  });

  var saveBtn = document.getElementById('d-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      var name = document.getElementById('d-name') ? document.getElementById('d-name').textContent : 'Kandidat';
      showSnackbar('Bewertung für ' + name + ' wurde gespeichert.');
      closeDrawer();
    });
  }
}

function openDrawer(key) {
  var c       = CANDIDATES[key];
  var drawer  = document.getElementById('candidate-drawer');
  var overlay = document.getElementById('drawer-overlay');
  if (!c || !drawer) return;

  var avatarEl = document.getElementById('d-avatar');
  avatarEl.textContent = c.initials;
  avatarEl.style.background = c.color;
  document.getElementById('d-name').textContent            = c.name;
  document.getElementById('d-role').textContent            = c.role;
  document.getElementById('d-score').textContent           = c.score;
  document.getElementById('d-manager-initial').textContent = c.managerInitials;
  document.getElementById('d-manager-name').textContent    = c.manager;

  var matched = c.required.filter(function (s) { return c.has.includes(s); });
  var missing = c.required.filter(function (s) { return !c.has.includes(s); });
  var extra   = c.has.filter(function (s) { return !c.required.includes(s); });

  document.getElementById('d-skill-summary').innerHTML =
    '<span class="skill-summary-item"><span class="skill-dot" style="background:#0F6E56"></span>' + matched.length + ' von ' + c.required.length + ' Pflichtskills vorhanden</span>' +
    '<span class="skill-summary-item"><span class="skill-dot" style="background:#791F1F"></span>' + missing.length + ' fehlend</span>' +
    '<span class="skill-summary-item"><span class="skill-dot" style="background:#757575"></span>' + extra.length + ' weitere</span>';

  document.getElementById('d-skills-matched').innerHTML = matched.length
    ? matched.map(function (s) { return '<span class="chip chip-matched">' + s + '</span>'; }).join('')
    : '<span style="font-size:12px;color:var(--c-text-muted)">Keine übereinstimmenden Skills</span>';

  document.getElementById('d-skills-missing').innerHTML = missing.length
    ? missing.map(function (s) { return '<span class="chip chip-missing">' + s + '</span>'; }).join('')
    : '<span style="font-size:12px;color:var(--pill-approved-text)">Alle Pflichtskills vorhanden ✓</span>';

  document.getElementById('d-skills-extra').innerHTML = extra.length
    ? extra.map(function (s) { return '<span class="chip">' + s + '</span>'; }).join('')
    : '<span style="font-size:12px;color:var(--c-text-muted)">—</span>';

  drawer.querySelectorAll('.status-radio-label').forEach(function (label) {
    label.classList.remove('selected');
    var radio = label.querySelector('input');
    if (radio.value === c.status) { label.classList.add('selected'); radio.checked = true; }
  });

  var commentEl = document.getElementById('d-comment');
  if (commentEl) commentEl.value = '';

  var exportsEl   = document.getElementById('d-exports');
  var noExportsEl = document.getElementById('d-no-exports');
  if (exportsEl && noExportsEl) {
    if (c.exports.length) {
      noExportsEl.style.display = 'none';
      exportsEl.innerHTML = c.exports.map(function (exp, i) {
        return '<label class="export-item"><input type="radio" name="drawer-export" value="' + i + '" /><span class="export-item-icon">📄</span><span class="export-item-name">' + exp.name + '</span><span class="export-item-date">' + exp.date + '</span></label>';
      }).join('');
    } else {
      exportsEl.innerHTML = '';
      noExportsEl.style.display = 'block';
    }
  }

  overlay.classList.add('open');
  drawer.classList.add('open');
}

function closeDrawer() {
  var drawer  = document.getElementById('candidate-drawer');
  var overlay = document.getElementById('drawer-overlay');
  if (drawer)  drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function initActionDropdowns() {
  var STATUS_MAP = {
    'approve-item': { pill: 'pill-approved', text: 'Genehmigt' },
    'review-item':  { pill: 'pill-review',   text: 'In Prüfung' },
    'reject-item':  { pill: 'pill-rejected', text: 'Abgelehnt' },
  };

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.action-dropdown-btn');
    if (btn) {
      e.stopPropagation();
      var menu   = btn.nextElementSibling;
      var isOpen = menu.classList.contains('open');
      document.querySelectorAll('.action-dropdown-menu.open').forEach(function (m) { m.classList.remove('open'); });
      if (!isOpen) menu.classList.add('open');
      return;
    }

    var item = e.target.closest('.action-dropdown-item');
    if (item) {
      var menu = item.closest('.action-dropdown-menu');
      var row  = item.closest('tr');
      if (row) {
        var statusCell = row.querySelector('td:nth-child(5)');
        if (statusCell) {
          var found = Object.entries(STATUS_MAP).find(function (entry) { return item.classList.contains(entry[0]); });
          if (found) statusCell.innerHTML = '<span class="pill ' + found[1].pill + '">' + found[1].text + '</span>';
        }
      }
      menu.classList.remove('open');
      return;
    }

    document.querySelectorAll('.action-dropdown-menu.open').forEach(function (m) { m.classList.remove('open'); });
  });
}

function showSnackbar(msg) {
  var el = document.getElementById('app-snackbar');
  if (!el) {
    el = document.createElement('div');
    el.id = 'app-snackbar';
    el.className = 'snackbar';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(function () { el.classList.remove('show'); }, 3500);
}
