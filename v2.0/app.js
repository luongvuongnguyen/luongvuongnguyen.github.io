
const state = { publications: [], filtered: [] };
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

function fillSelect(selector, values) {
  const select = $(selector);
  values.filter(Boolean).forEach(value => {
    const option = document.createElement('option');
    option.value = value; option.textContent = value; select.appendChild(option);
  });
}

function render() {
  const list = $('#publicationList');
  const items = state.filtered;
  $('#resultCount').textContent = `${items.length} publication${items.length === 1 ? '' : 's'}`;
  if (!items.length) { list.innerHTML = '<p class="empty">No publications match the selected filters.</p>'; return; }
  list.innerHTML = items.map(pub => `
    <article class="pub-card">
      <div class="pub-year">${escapeHtml(pub.year || '—')}</div>
      <div>
        <h3 class="pub-title">${escapeHtml(pub.title)}</h3>
        <p class="pub-authors">${escapeHtml(pub.authors)}</p>
        <p class="pub-venue">${escapeHtml(pub.venue)}</p>
        <p class="pub-meta"><span class="tag">${escapeHtml(pub.status)}</span> · ${escapeHtml(pub.type)}${pub.publication_info ? ` · ${escapeHtml(pub.publication_info)}` : ''}</p>
      </div>
      ${pub.url ? `<a class="doi" href="${escapeHtml(pub.url)}" target="_blank" rel="noreferrer">DOI ↗</a>` : ''}
    </article>`).join('');
}

function applyFilters() {
  const query = $('#searchInput').value.trim().toLowerCase();
  const status = $('#statusFilter').value;
  const year = $('#yearFilter').value;
  const type = $('#typeFilter').value;
  state.filtered = state.publications.filter(pub => {
    const haystack = [pub.title,pub.authors,pub.venue,pub.doi,pub.publication_info].join(' ').toLowerCase();
    return (!query || haystack.includes(query)) && (!status || pub.status === status) && (!year || pub.year === year) && (!type || pub.type === type);
  });
  render();
}

Papa.parse('publications.csv', {
  download: true, header: true, skipEmptyLines: true,
  complete: ({data}) => {
    state.publications = data;
    state.filtered = data;
    fillSelect('#statusFilter', [...new Set(data.map(x => x.status))]);
    fillSelect('#yearFilter', [...new Set(data.map(x => x.year))].filter(Boolean).sort((a,b) => b-a));
    fillSelect('#typeFilter', [...new Set(data.map(x => x.type))].sort());
    render();
  },
  error: () => { $('#publicationList').innerHTML = '<p class="empty">Could not load publications.csv. Open this site through a local web server rather than directly as a file.</p>'; }
});
['#searchInput','#statusFilter','#yearFilter','#typeFilter'].forEach(id => $(id).addEventListener('input', applyFilters));
$('#currentYear').textContent = new Date().getFullYear();
