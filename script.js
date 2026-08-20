(function () {
  'use strict';

  var cvData = null;
  var lang = localStorage.getItem('cv_lang') || 'ko';
  var theme = localStorage.getItem('cv_theme') || 'light';

  var UI_TEXT = {
    nav: {
      profile: { ko: '프로필', en: 'Profile' },
      intro: { ko: '소개', en: 'About' },
      education: { ko: '학력', en: 'Education' },
      experience: { ko: '경력', en: 'Experience' },
      projects: { ko: '프로젝트', en: 'Projects' },
      awards: { ko: '수상', en: 'Awards' },
      skills: { ko: '스킬', en: 'Skills' }
    },
    section: {
      intro: { ko: '소개', en: 'About' },
      education: { ko: '학력', en: 'Education' },
      experience: { ko: '경력', en: 'Experience' },
      projects: { ko: '프로젝트', en: 'Projects' },
      publications: { ko: '논문 및 특허', en: 'Publications & Patents' },
      awards: { ko: '수상', en: 'Awards' },
      skills: { ko: '스킬', en: 'Skills' }
    },
    profile: {
      birth: { ko: '생년월일', en: 'Birth' },
      contact: { ko: '연락처', en: 'Contact' },
      affiliation: { ko: '소속', en: 'Affiliation' },
      links: { ko: '링크', en: 'Links' }
    }
  };

  function t(field) {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.ko || field.en || '';
  }

  function el(tag, opts) {
    var node = document.createElement(tag);
    opts = opts || {};
    if (opts.className) node.className = opts.className;
    if (opts.text) node.textContent = opts.text;
    if (opts.html) node.innerHTML = opts.html;
    return node;
  }

  function isEmpty(v) {
    if (v == null) return true;
    if (typeof v === 'string') return v.trim() === '';
    if (Array.isArray(v)) return v.length === 0;
    return false;
  }

  /* ---------------- PROFILE PANEL ---------------- */
  function renderProfile() {
    var p = cvData.profile;
    var meta = cvData.meta;
    var root = document.getElementById('profile');
    root.innerHTML = '';

    var photo = el('div', { className: 'profile-photo' });
    var img = document.createElement('img');
    img.src = p.photo;
    img.alt = meta.nameKo;
    photo.appendChild(img);
    root.appendChild(photo);

    root.appendChild(el('div', { className: 'profile-name-ko', text: meta.nameKo }));
    root.appendChild(el('div', { className: 'profile-name-en', text: meta.nameEn }));

    if (!isEmpty(meta.roleBadges)) {
      var badges = el('div', { className: 'profile-badges' });
      meta.roleBadges.forEach(function (b) {
        badges.appendChild(el('span', { className: 'chip', text: t(b) }));
      });
      root.appendChild(badges);
    }

    var infoRows = [];
    if (!isEmpty(p.birthDate)) infoRows.push([t(UI_TEXT.profile.birth), p.birthDate]);
    if (!isEmpty(p.address)) infoRows.push([lang === 'ko' ? '주소' : 'Address', p.address]);
    if (!isEmpty(p.militaryStatus)) infoRows.push([lang === 'ko' ? '병역' : 'Military', p.militaryStatus]);
    if (infoRows.length) {
      var block = el('div', { className: 'profile-block' });
      infoRows.forEach(function (r) {
        var row = el('div', { className: 'profile-row' });
        row.appendChild(el('span', { className: 'k', text: r[0] }));
        row.appendChild(el('span', { className: 'v', text: r[1] }));
        block.appendChild(row);
      });
      root.appendChild(block);
    }

    var contactRows = [];
    if (p.contact && !isEmpty(p.contact.email)) contactRows.push([lang === 'ko' ? '이메일' : 'Email', p.contact.email]);
    if (p.contact && !isEmpty(p.contact.mobile)) contactRows.push([lang === 'ko' ? '모바일' : 'Mobile', p.contact.mobile]);
    if (contactRows.length) {
      var cBlock = el('div', { className: 'profile-block' });
      cBlock.appendChild(el('div', { className: 'profile-block-title', text: t(UI_TEXT.profile.contact) }));
      contactRows.forEach(function (r) {
        var row = el('div', { className: 'profile-row' });
        row.appendChild(el('span', { className: 'k', text: r[0] }));
        row.appendChild(el('span', { className: 'v', text: r[1] }));
        cBlock.appendChild(row);
      });
      root.appendChild(cBlock);
    }

    if (!isEmpty(p.affiliation)) {
      var aBlock = el('div', { className: 'profile-block' });
      aBlock.appendChild(el('div', { className: 'profile-block-title', text: t(UI_TEXT.profile.affiliation) }));
      aBlock.appendChild(el('div', { text: t(p.affiliation) }));
      root.appendChild(aBlock);
    }

    if (!isEmpty(p.social)) {
      var sBlock = el('div', { className: 'profile-block' });
      sBlock.appendChild(el('div', { className: 'profile-block-title', text: t(UI_TEXT.profile.links) }));
      var links = el('div', { className: 'social-links' });
      p.social.forEach(function (s) {
        var a = document.createElement('a');
        a.href = s.url; a.textContent = s.label; a.target = '_blank'; a.rel = 'noopener';
        links.appendChild(a);
      });
      sBlock.appendChild(links);
      root.appendChild(sBlock);
    }
  }

  /* ---------------- CONTENT SECTIONS ---------------- */
  function renderIntro() {
    var root = document.getElementById('intro');
    root.innerHTML = '';
    if (isEmpty(cvData.intro)) return;
    root.appendChild(el('h2', { className: 'section-title', text: t(UI_TEXT.section.intro) }));
    root.appendChild(el('p', { className: 'intro-text', text: t(cvData.intro) }));
  }

  function renderEducation() {
    var root = document.getElementById('education');
    root.innerHTML = '';
    if (isEmpty(cvData.education)) return;
    root.appendChild(el('h2', { className: 'section-title', text: t(UI_TEXT.section.education) }));
    cvData.education.forEach(function (edu) {
      var entry = el('div', { className: 'entry' });
      entry.appendChild(el('div', { className: 'entry-period', text: edu.period }));
      var right = el('div');
      right.appendChild(el('div', { className: 'entry-title', text: t(edu.school) }));
      var subParts = [t(edu.major), t(edu.degree)].filter(function (x) { return !isEmpty(x); });
      if (!isEmpty(edu.gpa)) subParts.push((lang === 'ko' ? '평점 ' : 'GPA ') + edu.gpa);
      right.appendChild(el('div', { className: 'entry-sub', text: subParts.join(' · ') }));
      entry.appendChild(right);
      root.appendChild(entry);
    });
  }

  function renderExperience() {
    var root = document.getElementById('experience');
    root.innerHTML = '';
    if (isEmpty(cvData.experience)) return;
    root.appendChild(el('h2', { className: 'section-title', text: t(UI_TEXT.section.experience) }));
    cvData.experience.forEach(function (exp) {
      var entry = el('div', { className: 'entry' });
      entry.appendChild(el('div', { className: 'entry-period', text: exp.period }));
      var right = el('div');
      right.appendChild(el('div', { className: 'entry-title', text: t(exp.org) }));
      right.appendChild(el('div', { className: 'entry-desc', text: t(exp.description) }));
      entry.appendChild(right);
      root.appendChild(entry);
    });
  }

  function renderProjects() {
    var root = document.getElementById('projects');
    root.innerHTML = '';
    if (isEmpty(cvData.projects)) return;
    root.appendChild(el('h2', { className: 'section-title', text: t(UI_TEXT.section.projects) }));
    cvData.projects.forEach(function (proj) {
      var entry = el('div', { className: 'entry' });
      entry.appendChild(el('div', { className: 'entry-period', text: proj.period || proj.year }));
      var right = el('div');
      if (!isEmpty(proj.category)) right.appendChild(el('span', { className: 'entry-tag', text: t(proj.category) }));
      right.appendChild(el('div', { className: 'entry-title', text: t(proj.name) }));
      right.appendChild(el('div', { className: 'entry-sub', text: t(proj.role) }));
      if (!isEmpty(proj.description)) right.appendChild(el('div', { className: 'entry-desc', text: t(proj.description) }));
      if (!isEmpty(proj.links)) right.appendChild(renderLinkButtons(proj.links));
      entry.appendChild(right);
      root.appendChild(entry);
    });
  }

  function renderLinkButtons(links) {
    var wrap = el('div', { className: 'entry-links' });
    links.forEach(function (link) {
      var a = document.createElement('a');
      a.href = link.url;
      a.textContent = '🔗 ' + link.label;
      a.target = '_blank';
      a.rel = 'noopener';
      wrap.appendChild(a);
    });
    return wrap;
  }

  function renderPublications() {
    var root = document.getElementById('publications');
    root.innerHTML = '';
    if (isEmpty(cvData.publications)) return;
    root.appendChild(el('h2', { className: 'section-title', text: t(UI_TEXT.section.publications) }));
    cvData.publications.forEach(function (pub) {
      var entry = el('div', { className: 'entry' });
      entry.appendChild(el('div', { className: 'entry-period', text: pub.year || '' }));
      var right = el('div');
      right.appendChild(el('div', { className: 'entry-title', text: t(pub.title) }));
      if (!isEmpty(pub.description)) right.appendChild(el('div', { className: 'entry-desc', text: t(pub.description) }));
      if (!isEmpty(pub.url)) right.appendChild(renderLinkButtons([{ label: lang === 'ko' ? '원문 보기' : 'View', url: pub.url }]));
      entry.appendChild(right);
      root.appendChild(entry);
    });
  }

  function renderAwards() {
    var root = document.getElementById('awards');
    root.innerHTML = '';
    if (isEmpty(cvData.awards)) return;
    root.appendChild(el('h2', { className: 'section-title', text: t(UI_TEXT.section.awards) }));
    cvData.awards.forEach(function (aw) {
      var entry = el('div', { className: 'entry' });
      entry.appendChild(el('div', { className: 'entry-period', text: aw.year }));
      entry.appendChild(el('div', { className: 'entry-title', text: t(aw.name) }));
      root.appendChild(entry);
    });
  }

  function renderSkills() {
    var root = document.getElementById('skills');
    root.innerHTML = '';
    if (isEmpty(cvData.skills)) return;
    root.appendChild(el('h2', { className: 'section-title', text: t(UI_TEXT.section.skills) }));
    var grid = el('div', { className: 'skills-grid' });
    cvData.skills.forEach(function (group) {
      var col = el('div');
      col.appendChild(el('div', { className: 'skill-group-title', text: t(group.category) }));
      var tags = el('div', { className: 'skill-tags' });
      group.items.forEach(function (item) {
        tags.appendChild(el('span', { text: t(item) }));
      });
      col.appendChild(tags);
      grid.appendChild(col);
    });
    root.appendChild(grid);
  }

  function renderAll() {
    document.documentElement.lang = lang;
    document.getElementById('navTitle').textContent = lang === 'ko' ? cvData.meta.nameKo : cvData.meta.nameEn;
    document.title = lang === 'ko' ? (cvData.meta.nameKo + ' CV') : (cvData.meta.nameEn + ' CV');
    document.querySelectorAll('[data-i18n-key]').forEach(function (node) {
      var key = node.getAttribute('data-i18n-key').split('.');
      var val = UI_TEXT[key[0]] && UI_TEXT[key[0]][key[1]];
      if (val) node.textContent = t(val);
    });
    document.getElementById('langToggle').textContent = lang === 'ko' ? 'EN' : 'KO';

    renderProfile();
    renderIntro();
    renderEducation();
    renderExperience();
    renderProjects();
    renderPublications();
    renderAwards();
    renderSkills();
  }

  /* ---------------- THEME / LANG / NAV CONTROLS ---------------- */
  function applyTheme() {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.getElementById('themeIconMoon').style.display = 'none';
      document.getElementById('themeIconSun').style.display = 'block';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.getElementById('themeIconMoon').style.display = 'block';
      document.getElementById('themeIconSun').style.display = 'none';
    }
  }

  document.getElementById('themeToggle').addEventListener('click', function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('cv_theme', theme);
    applyTheme();
  });

  document.getElementById('langToggle').addEventListener('click', function () {
    lang = lang === 'ko' ? 'en' : 'ko';
    localStorage.setItem('cv_lang', lang);
    if (cvData) renderAll();
  });

  document.getElementById('printBtn').addEventListener('click', function () {
    window.print();
  });

  document.getElementById('hamburgerBtn').addEventListener('click', function () {
    document.getElementById('navLinks').classList.toggle('open');
  });

  document.getElementById('navLinks').addEventListener('click', function (e) {
    if (e.target.tagName === 'A') document.getElementById('navLinks').classList.remove('open');
  });

  document.addEventListener('click', function (e) {
    var navLinks = document.getElementById('navLinks');
    var hamburger = document.getElementById('hamburgerBtn');
    if (!navLinks.classList.contains('open')) return;
    if (navLinks.contains(e.target) || hamburger.contains(e.target)) return;
    navLinks.classList.remove('open');
  });

  /* ---------------- INIT ---------------- */
  applyTheme();

  fetch('data.json')
    .then(function (res) { return res.json(); })
    .then(function (json) {
      cvData = json;
      renderAll();
    })
    .catch(function (err) {
      console.error('Failed to load data.json', err);
      document.getElementById('content').textContent = 'CV 데이터를 불러오지 못했습니다.';
    });
})();
