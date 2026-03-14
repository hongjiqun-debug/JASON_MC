const API = '/api';

function fmt(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

function truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function loadHome() {
  try {
    const res = await fetch(`${API}/data`);
    const data = await res.json();

    document.getElementById('stat-projects').textContent =
      [...new Set(data.projects.map(r => r.project_name))].length;
    document.getElementById('stat-steps').textContent = data.projects.length;
    document.getElementById('stat-news').textContent = data.news.length;

    // Projects feed
    const pEl = document.getElementById('projects-feed');
    if (data.projects.length === 0) {
      pEl.innerHTML = '<div class="loading">还没有项目，去「记录」页面添加第一步吧</div>';
    } else {
      pEl.innerHTML = data.projects.slice(0, 3).map(r => `
        <div class="project-card">
          <div class="project-card-date">${fmt(r.date)}</div>
          <div class="project-card-name">${r.project_name}</div>
          <div class="project-card-step">${r.step_done || ''}</div>
          ${r.code_snippet ? `<div class="code-block">${escapeHtml(r.code_snippet)}</div>` : ''}
          ${r.lesson ? `<div class="project-card-lesson">${truncate(r.lesson, 80)}</div>` : ''}
        </div>
      `).join('');
    }

    // News feed
    const nEl = document.getElementById('news-feed');
    if (data.news.length === 0) {
      nEl.innerHTML = '<div class="loading">还没有资讯，去「记录」页面发布第一条</div>';
    } else {
      nEl.innerHTML = data.news.slice(0, 3).map(r => `
        <div class="news-card">
          <div class="news-card-date">${fmt(r.created_at)}</div>
          <div class="news-card-title">${r.title}</div>
          <div class="news-card-body">${truncate(r.content, 100)}</div>
          ${r.challenge ? `<div class="news-card-challenge">今日挑战：${r.challenge}</div>` : ''}
        </div>
      `).join('');
    }

    // Posts
    const postsEl = document.getElementById('posts-feed');
    if (data.posts.length === 0) {
      postsEl.innerHTML = '<div class="loading">还没有日记</div>';
    } else {
      const typeColor = { project:'tag-green', news:'tag-sky', diary:'tag-gray' };
      const typeLabel = { project:'项目', news:'MC', diary:'日记' };
      postsEl.innerHTML = data.posts.map(r => `
        <div class="post-card">
          <div class="post-card-meta">
            <span class="tag ${typeColor[r.type] || 'tag-gray'}">${typeLabel[r.type] || r.type}</span>
            <span style="font-family:var(--pixel);font-size:9px;color:var(--text3)">${fmt(r.created_at)}</span>
          </div>
          <div class="post-card-title">${r.title}</div>
          <div class="post-card-body">${truncate(r.content, 100)}</div>
        </div>
      `).join('');
    }
  } catch (e) {
    console.error(e);
  }
}

let allProjects = [];

async function loadProjects() {
  try {
    const res = await fetch(`${API}/data?type=projects`);
    allProjects = await res.json();

    const names = [...new Set(allProjects.map(r => r.project_name))];
    const pct = Math.min(Math.round((names.length / 3) * 100), 100);
    document.getElementById('progress-text').textContent = `${names.length} / 3 个项目`;
    document.getElementById('progress-fill').style.width = pct + '%';

    renderProjects(allProjects);
  } catch (e) { console.error(e); }
}

function filterProjects(name) {
  if (name === 'all') renderProjects(allProjects);
  else renderProjects(allProjects.filter(r => r.project_name === name));
}

function renderProjects(rows) {
  const el = document.getElementById('projects-list');
  if (rows.length === 0) {
    el.innerHTML = '<div class="loading">没有这个项目的记录</div>';
    return;
  }
  el.innerHTML = rows.map(r => `
    <div class="project-card">
      <div class="project-card-date">${fmt(r.date)}</div>
      <div class="project-card-name">${r.project_name}</div>
      <div class="project-card-step">${r.step_done || ''}</div>
      ${r.code_snippet ? `<div class="code-block">${escapeHtml(r.code_snippet)}</div>` : ''}
      ${r.lesson ? `<div class="project-card-lesson">${r.lesson}</div>` : ''}
    </div>
  `).join('');
}

async function loadNews() {
  try {
    const res = await fetch(`${API}/data?type=news`);
    const rows = await res.json();
    const el = document.getElementById('news-list');
    if (rows.length === 0) {
      el.innerHTML = '<div class="loading">还没有资讯，去「记录」页面发布第一条吧</div>';
      return;
    }
    el.innerHTML = rows.map(r => `
      <div class="news-card">
        <div class="news-card-date">${fmt(r.created_at)}</div>
        <div class="news-card-title">${r.title}</div>
        <div class="news-card-body">${r.content || ''}</div>
        ${r.challenge ? `<div class="news-card-challenge">今日挑战：${r.challenge}</div>` : ''}
      </div>
    `).join('');
  } catch (e) { console.error(e); }
}

async function saveEntry(table, data) {
  try {
    const res = await fetch(`${API}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, data })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}
