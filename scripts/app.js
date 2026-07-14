  import {
    BRAILLE_MAP,
    isProfane,
    asciifyForBraille,
    tidyDisplayName,
    buildAltText,
    buildShareText,
    buildBreakdown,
    dataURLToBlob,
  } from './braille.js';

  const NAVY='#0A2342', TEAL='#1B9D8F', TEXT='#1A1A1A', MUTED='#555555', EMPTY='#D5D5D5';
  const NAME_FONT_STACK = "'Avenir Next','Avenir','Helvetica Neue','Segoe UI',system-ui,sans-serif";

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  const form=document.getElementById('form'), input=document.getElementById('name-input'),
    statusEl=document.getElementById('status'), result=document.getElementById('result'),
    canvas=document.getElementById('canvas'), ctx=canvas.getContext('2d'),
    resultImg=document.getElementById('result-img'), iosTip=document.getElementById('ios-tip'),
    downloadBtn=document.getElementById('download-btn'), copyImgBtn=document.getElementById('copy-img-btn'),
    altTextEl=document.getElementById('alt-text'), copyAltBtn=document.getElementById('copy-alt-btn'),
    shareTextEl=document.getElementById('share-text'), charCountEl=document.getElementById('char-count'),
    copyShareBtn=document.getElementById('copy-share-btn'),
    breakdownSum=document.getElementById('breakdown-summary'),
    breakdownList=document.getElementById('breakdown-list');

  let lastDisplayName = '';
  let lastBrailleName = '';
  // Pre-cached SYNCHRONOUSLY after render so click handlers can use them without await
  let cachedBlob = null;
  let cachedFile = null;

  function setStatus(msg, type) { statusEl.textContent = msg; statusEl.className = type || ''; }

  function updateCharCount() {
    const len = shareTextEl.value.length;
    let label = len + ' character' + (len === 1 ? '' : 's');
    let over = false;
    if (len > 280) { label += ' \u2014 over X\u2019s 280 limit; trim before posting to X.'; over = true; }
    charCountEl.textContent = label;
    charCountEl.classList.toggle('over-limit', over);
  }
  shareTextEl.addEventListener('input', updateCharCount);

  function drawCell(ctx, lx, cy, dots, dr, u) {
    const p = {1:[lx,cy-u],2:[lx,cy],3:[lx,cy+u],4:[lx+u,cy-u],5:[lx+u,cy],6:[lx+u,cy+u]};
    for (let n = 1; n <= 6; n++) {
      const [px,py] = p[n];
      ctx.beginPath();
      ctx.arc(px, py, dr, 0, Math.PI*2);
      if (dots.includes(n)) { ctx.fillStyle = NAVY; ctx.fill(); }
      else { ctx.strokeStyle = EMPTY; ctx.lineWidth = Math.max(1.5, dr*0.18); ctx.stroke(); }
    }
  }
  function drawBrailleRow(ctx, name, cx, cy, mw) {
    const N = name.length; if (N === 0) return;
    const units = (N-1)*3 + 1;
    let unit = Math.min(40, (mw - 40) / Math.max(units, 1));
    if (unit < 8) unit = 8;
    const dr = Math.max(3, unit * 0.32);
    const total = (N-1)*3*unit + unit;
    const sx = cx - total/2;
    for (let i = 0; i < N; i++) drawCell(ctx, sx + i*3*unit, cy, BRAILLE_MAP[name[i]] || [], dr, unit);
  }
  function chooseNameFontSize(name, mw, start) {
    let size = start;
    while (size > 28) {
      ctx.font = '700 ' + size + 'px ' + NAME_FONT_STACK;
      if (ctx.measureText(name).width <= mw) return size;
      size -= 4;
    }
    return size;
  }
  function render(displayName, brailleName) {
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = NAVY; ctx.fillRect(0, 0, W, 14);
    ctx.fillStyle = TEAL; ctx.fillRect(0, 14, W, 4);
    let logoBottom = 80;
    if (logoReady) {
      const logoW = 760;
      const aspect = logoImg.width / logoImg.height;
      const logoH = logoW / aspect;
      ctx.drawImage(logoImg, (W - logoW)/2, 80, logoW, logoH);
      logoBottom = 80 + logoH;
    }
    const nameY = logoBottom + 80;
    const nameSize = chooseNameFontSize(displayName, W - 160, 96);
    ctx.font = '700 ' + nameSize + 'px ' + NAME_FONT_STACK;
    ctx.fillStyle = NAVY; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(displayName, W/2, nameY);
    drawBrailleRow(ctx, brailleName, W/2, nameY + nameSize + 140, W - 100);

    // Explanatory text
    ctx.fillStyle = TEXT;
    ctx.font = '600 26px ' + NAME_FONT_STACK;
    const ey = H - 220;
    ctx.fillText('Braille is read by touch.', W/2, ey);
    ctx.fillStyle = MUTED;
    ctx.font = '400 22px ' + NAME_FONT_STACK;
    ctx.fillText('The filled dots shown here would be raised on the page,', W/2, ey + 44);
    ctx.fillText('allowing them to be felt with the fingertips.', W/2, ey + 74);

    // Charity URL — prominent in teal so it's easy to see and read
    ctx.fillStyle = TEAL;
    ctx.font = '700 32px ' + NAME_FONT_STACK;
    ctx.fillText('www.llbs.co.uk', W/2, H - 80);

    // Bottom accent
    ctx.fillStyle = TEAL; ctx.fillRect(0, H-18, W, 4);
    ctx.fillStyle = NAVY; ctx.fillRect(0, H-14, W, 14);
  }

  // Thin DOM wrapper around braille.js's pure buildBreakdown(): computes the
  // summary and per-cell text there, renders it into the page here.
  function renderBreakdown(brailleName) {
    const { summary, items } = buildBreakdown(brailleName);
    breakdownList.innerHTML = '';
    breakdownSum.textContent = summary;
    for (const text of items) {
      const li = document.createElement('li');
      li.textContent = text;
      breakdownList.appendChild(li);
    }
  }

  const logoImg = new Image();
  let logoReady = false;
  let pendingURLGenerate = false;
  logoImg.onload = () => {
    logoReady = true;
    if (pendingURLGenerate) { pendingURLGenerate = false; generate(); }
  };
  logoImg.onerror = () => setStatus('Logo failed to load. Generated images will appear without the logo.', 'error');
  logoImg.src = 'assets/llbs-logo.png';

  function generate() {
    const raw = input.value;
    if (!raw.trim()) { input.setAttribute('aria-invalid', 'true'); setStatus('Please enter a name.', 'error'); result.hidden = true; return; }
    if (isProfane(raw)) {
      input.setAttribute('aria-invalid', 'true');
      setStatus('That input contains language that is not appropriate for an LLBS-branded image. Please enter a person\u2019s name.', 'error');
      result.hidden = true; return;
    }
    const brailleName = asciifyForBraille(raw);
    if (!brailleName) {
      input.setAttribute('aria-invalid', 'true');
      setStatus('No usable letters found. Please enter a name with at least one letter.', 'error');
      result.hidden = true; return;
    }
    if (!logoReady) { setStatus('Logo is still loading \u2014 please try again in a moment.', 'error'); return; }

    input.removeAttribute('aria-invalid');
    const displayName = tidyDisplayName(raw);
    lastDisplayName = displayName;
    lastBrailleName = brailleName;

    render(displayName, brailleName);

    // Cache SYNCHRONOUSLY for iOS click handlers
    const dataURL = canvas.toDataURL('image/png');
    cachedBlob = dataURLToBlob(dataURL);
    const filename = 'llbs-braille-' + brailleName.replace(/\s+/g,'-') + '.png';
    cachedFile = new File([cachedBlob], filename, { type: 'image/png' });

    const altText = buildAltText(displayName);
    resultImg.src = dataURL;
    resultImg.alt = altText;
    altTextEl.value = altText;
    shareTextEl.value = buildShareText(displayName);
    updateCharCount();
    renderBreakdown(brailleName);
    iosTip.hidden = !isIOS();
    result.hidden = false;
    setStatus('Image generated for "' + displayName + '". Save with Download PNG, or use the Share section below.', 'success');

    // Update URL with the name (no reload)
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('name', displayName);
      history.replaceState({}, '', url.toString());
    } catch (_e) { /* ignore */ }

    downloadBtn.focus();
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); generate(); });

  downloadBtn.addEventListener('click', () => {
    if (!cachedBlob) return;
    const link = document.createElement('a');
    link.download = 'llbs-braille-' + lastBrailleName.replace(/\s+/g,'-') + '.png';
    link.href = URL.createObjectURL(cachedBlob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    setStatus('PNG download started.', 'success');
  });

  // SYNCHRONOUS clipboard write - critical for iOS Safari
  function copyImageToClipboardSync() {
    if (!cachedBlob) return Promise.reject(new Error('No image generated yet.'));
    if (!navigator.clipboard || !window.ClipboardItem) {
      return Promise.reject(new Error('Your browser doesn\u2019t support copying images. Use Download PNG.'));
    }
    return navigator.clipboard.write([new ClipboardItem({ 'image/png': cachedBlob })]);
  }

  copyImgBtn.addEventListener('click', () => {
    copyImageToClipboardSync()
      .then(() => setStatus('Image copied. Paste with Cmd+V or Ctrl+V (long-press \u2192 Paste on iOS).', 'success'))
      .catch(err => setStatus(err.message || 'Could not copy image. Try Download PNG.', 'error'));
  });
  copyAltBtn.addEventListener('click', () => {
    if (!altTextEl.value) return;
    navigator.clipboard.writeText(altTextEl.value)
      .then(() => setStatus('Alt text copied.', 'success'))
      .catch(() => { altTextEl.select(); setStatus('Press Cmd+C or Ctrl+C to copy.', 'info'); });
  });
  copyShareBtn.addEventListener('click', () => {
    if (!shareTextEl.value) return;
    navigator.clipboard.writeText(shareTextEl.value)
      .then(() => setStatus('Post text copied.', 'success'))
      .catch(() => { shareTextEl.select(); setStatus('Press Cmd+C or Ctrl+C to copy.', 'info'); });
  });

  document.getElementById('share-native-btn').addEventListener('click', () => {
    if (!cachedFile) { setStatus('Generate an image first.', 'error'); return; }
    const text = shareTextEl.value || buildShareText(lastDisplayName);
    const data = { text: text, files: [cachedFile] };

    if (navigator.canShare && navigator.canShare(data)) {
      navigator.share(data)
        .then(() => setStatus('Shared.', 'success'))
        .catch(err => {
          if (err.name !== 'AbortError') {
            setStatus('Share failed: ' + (err.message || err) + '. Save the image with Download PNG (or long-press it on iOS) and attach it manually in your app.', 'error');
          }
        });
    } else if (navigator.share) {
      navigator.share({ text: text })
        .then(() => setStatus('Shared text only \u2014 your browser cannot share files this way. Save the image and attach it manually.', 'info'))
        .catch(err => { if (err.name !== 'AbortError') setStatus('Share failed: ' + err.message, 'error'); });
    } else {
      setStatus('Your browser doesn\u2019t support the share sheet. Save the image with Download PNG (or long-press it on iOS) and attach manually in your app.', 'error');
    }
  });

  // URL parameter ?name=...
  function getNameFromURL() {
    try { return new URLSearchParams(window.location.search).get('name'); }
    catch (_e) { return null; }
  }
  window.addEventListener('load', () => {
    const urlName = getNameFromURL();
    if (urlName) {
      input.value = urlName.slice(0, 30);
      if (logoReady) generate();
      else pendingURLGenerate = true;
    } else {
      input.focus();
    }
  });
