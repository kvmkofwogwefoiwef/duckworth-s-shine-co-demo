/* =========================================================
   DuckWorth's Shine Co. — Staff Dashboard Logic
   ========================================================= */
(function () {
  'use strict';

  const STAFF_EMAIL = 'detail@duckworthsshine.com';
  let allJobs = [];
  let selectedJobId = null;
  let isCreatingNew = false;

  const jobsListEl  = document.getElementById('jobsList');
  const editEmptyEl = document.getElementById('editEmpty');
  const editFormEl  = document.getElementById('editForm');
  const newJobBtn   = document.getElementById('newJobBtn');
  const logoutBtn   = document.getElementById('logoutBtn');
  const toastEl     = document.getElementById('toast');

  /* ---------- Auth Check ---------- */
  async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session || !session.user || session.user.email !== STAFF_EMAIL) {
      window.location.href = 'staff-login.html';
      return false;
    }
    return true;
  }

  /* ---------- Logout ---------- */
  logoutBtn.addEventListener('click', async () => {
    try {
      await supabaseClient.auth.signOut({ scope: 'local' });
    } catch (err) {
      console.warn('Sign out failed, forcing local clear:', err);
    }

    // Force-clear any lingering Supabase keys
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith('sb-') || k.includes('supabase'))
        .forEach(k => localStorage.removeItem(k));
    } catch (err) {}

    window.location.href = 'staff-login.html?loggedout=1';
  });

  /* ---------- Toast ---------- */
  function toast(msg, isError) {
    toastEl.textContent = msg;
    toastEl.className = 'toast is-visible' + (isError ? ' is-error' : '');
    setTimeout(() => toastEl.classList.remove('is-visible'), 2600);
  }

  /* ---------- Default steps ---------- */
  const DEFAULT_STEPS = [
    'Vehicle received',
    'Exterior hand wash',
    'Interior deep clean',
    'Extraction & shampoo',
    'Leather conditioned',
    'Hand-applied sealant',
    'Final inspection',
    'Ready for pickup'
  ];

  /* ---------- Load Jobs ---------- */
  async function loadJobs() {
    const { data, error } = await supabaseClient
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast('Could not load jobs', true);
      return;
    }

    allJobs = data || [];
    renderJobsList();
  }

  /* ---------- Render Jobs List ---------- */
  function renderJobsList() {
    if (!allJobs.length) {
      jobsListEl.innerHTML =
        '<div class="panel-empty"><div class="empty-icon">📋</div><p>No jobs yet. Click "+ New Job" to add one.</p></div>';
      return;
    }

    jobsListEl.innerHTML = allJobs.map(job => {
      const steps = job.steps || [];
      const doneCount = steps.filter(s => s.done).length;
      const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;
      const isSelected = job.id === selectedJobId;

      return `
        <div class="job-card ${isSelected ? 'is-selected' : ''}" data-job-id="${job.id}">
          <div class="job-card-top">
            <div class="job-card-name">${escapeHtml(job.customer_name)}</div>
            <div class="job-card-status ${job.active ? 'is-active' : 'is-done'}">
              ${job.active ? 'Active' : 'Complete'}
            </div>
          </div>
          <div class="job-card-meta">
            ${escapeHtml(job.vehicle)} · ${escapeHtml(job.service)}<br>
            ${job.location ? escapeHtml(job.location) + ' · ' : ''}${job.pickup ? 'Pickup ' + escapeHtml(job.pickup) : ''}
          </div>
          <div class="job-card-progress">
            <div class="job-card-progress-bar" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');

    jobsListEl.querySelectorAll('.job-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedJobId = card.dataset.jobId;
        isCreatingNew = false;
        renderJobsList();
        renderEditForm();
      });
    });
  }

  /* ---------- Render Edit Form ---------- */
  function renderEditForm() {
    if (isCreatingNew) {
      renderNewJobForm();
      return;
    }

    const job = allJobs.find(j => j.id === selectedJobId);
    if (!job) {
      editEmptyEl.style.display = '';
      editFormEl.style.display = 'none';
      return;
    }

    editEmptyEl.style.display = 'none';
    editFormEl.style.display = '';

    const steps = job.steps || [];

    editFormEl.innerHTML = `
      <h2>${escapeHtml(job.customer_name)}</h2>

      <div class="form-group">
        <label>Vehicle</label>
        <input type="text" id="editVehicle" value="${escapeAttr(job.vehicle)}">
      </div>

      <div class="form-group">
        <label>Service</label>
        <input type="text" id="editService" value="${escapeAttr(job.service)}">
      </div>

      <div class="form-group">
        <label>Location</label>
        <input type="text" id="editLocation" value="${escapeAttr(job.location || '')}">
      </div>

      <div class="form-row two">
        <div class="form-group">
          <label>Drop-off</label>
          <input type="text" id="editDropoff" value="${escapeAttr(job.dropoff || '')}">
        </div>
        <div class="form-group">
          <label>Expected Pickup</label>
          <input type="text" id="editPickup" value="${escapeAttr(job.pickup || '')}">
        </div>
      </div>

      <div class="form-group">
        <label>Notes for Customer</label>
        <textarea id="editNotes" rows="3">${escapeHtml(job.notes || '')}</textarea>
      </div>

      <div class="form-group">
        <label>Progress Steps</label>
        <div class="steps-editor" id="stepsEditor">
          ${steps.map((s, i) => `
            <div class="step-row" data-step-index="${i}">
              <input type="checkbox" ${s.done ? 'checked' : ''}>
              <input type="text" value="${escapeAttr(s.label)}">
              <button class="step-remove" type="button" data-remove="${i}">×</button>
            </div>
          `).join('')}
        </div>
        <button class="add-step-btn" type="button" id="addStepBtn">+ Add Step</button>
      </div>

      <div class="panel-actions">
        <button class="btn btn-primary" type="button" id="saveJobBtn">Save Changes</button>
        <button class="btn btn-outline" type="button" id="toggleActiveBtn">
          ${job.active ? 'Mark Complete' : 'Reactivate'}
        </button>
        <button class="btn btn-outline" type="button" id="deleteJobBtn" style="border-color:#f0745f;color:#f0745f">Delete</button>
      </div>
    `;

    document.getElementById('saveJobBtn').addEventListener('click', saveJob);
    document.getElementById('toggleActiveBtn').addEventListener('click', toggleActive);
    document.getElementById('deleteJobBtn').addEventListener('click', deleteJob);
    document.getElementById('addStepBtn').addEventListener('click', () => {
      const editor = document.getElementById('stepsEditor');
      const row = document.createElement('div');
      row.className = 'step-row';
      row.innerHTML = `
        <input type="checkbox">
        <input type="text" value="New step">
        <button class="step-remove" type="button">×</button>
      `;
      editor.appendChild(row);
      bindStepRows();
    });

    bindStepRows();
  }

  function bindStepRows() {
    document.querySelectorAll('.step-remove').forEach(btn => {
      // Avoid double-binding
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = btn.closest('.step-row');
        if (row) row.remove();
      });
    });
  }

  /* ---------- Save Job ---------- */
  async function saveJob() {
    const job = allJobs.find(j => j.id === selectedJobId);
    if (!job) return;

    const steps = [];
    document.querySelectorAll('#stepsEditor .step-row').forEach(row => {
      const checkbox = row.querySelector('input[type="checkbox"]');
      const textInput = row.querySelector('input[type="text"]');
      steps.push({
        label: textInput.value.trim() || 'Step',
        done: checkbox.checked
      });
    });

    const updates = {
      vehicle: document.getElementById('editVehicle').value.trim(),
      service: document.getElementById('editService').value.trim(),
      location: document.getElementById('editLocation').value.trim(),
      dropoff: document.getElementById('editDropoff').value.trim(),
      pickup: document.getElementById('editPickup').value.trim(),
      notes: document.getElementById('editNotes').value.trim(),
      steps: steps,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabaseClient
      .from('jobs')
      .update(updates)
      .eq('id', selectedJobId);

    if (error) {
      toast('Save failed: ' + error.message, true);
      return;
    }

    toast('Job updated');
    await loadJobs();
    renderEditForm();
  }

  /* ---------- Toggle Active ---------- */
  async function toggleActive() {
    const job = allJobs.find(j => j.id === selectedJobId);
    if (!job) return;

    const { error } = await supabaseClient
      .from('jobs')
      .update({ active: !job.active, updated_at: new Date().toISOString() })
      .eq('id', selectedJobId);

    if (error) {
      toast('Could not update: ' + error.message, true);
      return;
    }

    toast(job.active ? 'Job marked complete' : 'Job reactivated');
    await loadJobs();
    renderEditForm();
  }

  /* ---------- Delete Job ---------- */
  async function deleteJob() {
    if (!confirm('Delete this job permanently? This cannot be undone.')) return;

    const { error } = await supabaseClient
      .from('jobs')
      .delete()
      .eq('id', selectedJobId);

    if (error) {
      toast('Delete failed: ' + error.message, true);
      return;
    }

    toast('Job deleted');
    selectedJobId = null;
    await loadJobs();
    renderEditForm();
  }

  /* ---------- New Job Form ---------- */
  function renderNewJobForm() {
    editEmptyEl.style.display = 'none';
    editFormEl.style.display = '';

    editFormEl.innerHTML = `
      <h2>New Job</h2>

      <div class="form-row two">
        <div class="form-group">
          <label>Customer Name</label>
          <input type="text" id="newName" placeholder="Jane Doe">
        </div>
        <div class="form-group">
          <label>Customer Email</label>
          <input type="email" id="newEmail" placeholder="jane@example.com">
        </div>
      </div>

      <div class="form-row two">
        <div class="form-group">
          <label>Phone</label>
          <input type="tel" id="newPhone" placeholder="517-555-0142">
        </div>
        <div class="form-group">
          <label>4-Digit PIN</label>
          <input type="text" id="newPin" maxlength="4" placeholder="0000" inputmode="numeric">
        </div>
      </div>

      <div class="form-group">
        <label>Vehicle</label>
        <input type="text" id="newVehicle" placeholder="2020 Honda CR-V">
      </div>

      <div class="form-row two">
        <div class="form-group">
          <label>Service</label>
          <select id="newService">
            <option>Full Detail</option>
            <option>Interior Only</option>
            <option>Exterior Only</option>
            <option>Boat Detail</option>
            <option>Work Truck / Fleet</option>
          </select>
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" id="newLocation" placeholder="Shop or Mobile">
        </div>
      </div>

      <div class="form-row two">
        <div class="form-group">
          <label>Drop-off</label>
          <input type="text" id="newDropoff" placeholder="Oct 14, 9:00 AM">
        </div>
        <div class="form-group">
          <label>Expected Pickup</label>
          <input type="text" id="newPickup" placeholder="Oct 14, 4:00 PM">
        </div>
      </div>

      <div class="form-group">
        <label>Notes</label>
        <textarea id="newNotes" rows="2"></textarea>
      </div>

      <div class="panel-actions">
        <button class="btn btn-primary" type="button" id="createJobBtn">Create Job</button>
        <button class="btn btn-outline" type="button" id="cancelNewBtn">Cancel</button>
      </div>
    `;

    document.getElementById('createJobBtn').addEventListener('click', createJob);
    document.getElementById('cancelNewBtn').addEventListener('click', () => {
      isCreatingNew = false;
      renderEditForm();
    });
  }

  /* ---------- Create Job ---------- */
  async function createJob() {
    const name = document.getElementById('newName').value.trim();
    const email = document.getElementById('newEmail').value.trim().toLowerCase();
    const phone = document.getElementById('newPhone').value.trim();
    const pin = document.getElementById('newPin').value.trim();
    const vehicle = document.getElementById('newVehicle').value.trim();
    const service = document.getElementById('newService').value;
    const location = document.getElementById('newLocation').value.trim();
    const dropoff = document.getElementById('newDropoff').value.trim();
    const pickup = document.getElementById('newPickup').value.trim();
    const notes = document.getElementById('newNotes').value.trim();

    if (!name || !email || !pin || !vehicle) {
      toast('Name, email, PIN, and vehicle are required', true);
      return;
    }

    const steps = DEFAULT_STEPS.map(label => ({ label, done: false }));

    const { error } = await supabaseClient
      .from('jobs')
      .insert({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        pin: pin,
        vehicle: vehicle,
        service: service,
        location: location,
        dropoff: dropoff,
        pickup: pickup,
        notes: notes,
        steps: steps,
        active: true
      });

    if (error) {
      toast('Could not create job: ' + error.message, true);
      return;
    }

    toast('Job created');
    isCreatingNew = false;
    await loadJobs();
    renderEditForm();
  }

  /* ---------- Helpers ---------- */
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, '&quot;');
  }

  /* ---------- Init ---------- */
  newJobBtn.addEventListener('click', () => {
    isCreatingNew = true;
    selectedJobId = null;
    renderJobsList();
    renderEditForm();
  });

  (async () => {
    if (!(await checkAuth())) return;
    await loadJobs();
  })();
})();