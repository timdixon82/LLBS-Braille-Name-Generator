  const BRAILLE_MAP = {
    'a':[1],'b':[1,2],'c':[1,4],'d':[1,4,5],'e':[1,5],'f':[1,2,4],'g':[1,2,4,5],
    'h':[1,2,5],'i':[2,4],'j':[2,4,5],'k':[1,3],'l':[1,2,3],'m':[1,3,4],
    'n':[1,3,4,5],'o':[1,3,5],'p':[1,2,3,4],'q':[1,2,3,4,5],'r':[1,2,3,5],
    's':[2,3,4],'t':[2,3,4,5],'u':[1,3,6],'v':[1,2,3,6],'w':[2,4,5,6],
    'x':[1,3,4,6],'y':[1,3,4,5,6],'z':[1,3,5,6],' ':[]
  };
  const NAVY='#0A2342', TEAL='#1B9D8F', TEXT='#1A1A1A', MUTED='#555555', EMPTY='#D5D5D5';
  const NAME_FONT_STACK = "'Avenir Next','Avenir','Helvetica Neue','Segoe UI',system-ui,sans-serif";

  const _b = ['ZnVjaw==','ZmNraW5n','Y3VudA==','dHdhdA==','d2Fua2Vy','YmFzdGFyZA==',
    'Yml0Y2g=','c2hpdA==','YXNzaG9sZQ==','YXJzZWhvbGU=','cHJpY2s=','cGlzcw==',
    'c2x1dA==','d2hvcmU=','cmV0YXJk','dGFyZA==','c3Bhc3RpYw==','c3Bhego=','dHJhbm55',
    'ZmFnZ290','ZmFnb3Q=','ZHlrZQ==','bmlnZ2Vy','bmlnZ2E=','Y2hpbms=','Z29vaw==',
    'c3BpYw==','a2lrZQ==','d2V0YmFjaw==','d29w','cGFraQ==','cmFwZWQ=','cmFwaW5n',
    'am90','am90c28=','YWhvbGU='];
  const BLOCKED = Array.from(new Set(_b.map(s => atob(s))));

  function normaliseForFilter(t) {
    return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[1!|]/g,'i').replace(/3/g,'e').replace(/[4@]/g,'a')
      .replace(/0/g,'o').replace(/[5$]/g,'s').replace(/7/g,'t')
      .replace(/8/g,'b').replace(/[^a-z]/g,'');
  }
  function isProfane(text) {
    const variants = [];
    if (text.indexOf('*') === -1) variants.push(text);
    else {
      const vowels = ['a','e','i','o','u'];
      let stack = [text];
      while (stack.length) {
        const s = stack.pop();
        const idx = s.indexOf('*');
        if (idx === -1) { variants.push(s); continue; }
        for (const v of vowels) stack.push(s.slice(0, idx) + v + s.slice(idx + 1));
        if (stack.length > 200) break;
      }
    }
    return variants.some(v => {
      const n = normaliseForFilter(v);
      return n && BLOCKED.some(t => t && n.includes(t));
    });
  }

  const SPECIAL_CHAR_MAP = {'ß':'ss','ẞ':'ss','æ':'ae','Æ':'ae','œ':'oe','Œ':'oe',
    'ø':'o','Ø':'o','ð':'d','Ð':'d','þ':'th','Þ':'th','ł':'l','Ł':'l'};
  function asciifyForBraille(text) {
    let out = '';
    for (const ch of text) out += (SPECIAL_CHAR_MAP[ch] !== undefined) ? SPECIAL_CHAR_MAP[ch] : ch;
    return out.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLowerCase().replace(/[^a-z\s]/g,'').replace(/\s+/g,' ').trim();
  }
  function tidyDisplayName(text) {
    return text.replace(/\s+/g,' ').trim().split(' ').map(w => {
      if (!w) return '';
      return w.charAt(0).toLocaleUpperCase() + w.slice(1).toLocaleLowerCase();
    }).join(' ');
  }
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

  function dataURLToBlob(dataURL) {
    const [header, b64] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const bytes = atob(b64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

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

  function buildAltText(name) {
    return '"' + name + '" written in Grade 1 (uncontracted) braille below the Lincoln & Lindsey Blind Society logo. The dots shown would be raised on the page to be read by touch.';
  }
  function buildShareText(name) {
    return '"' + name + '" in Grade 1 braille. #LLBS\n\nImage: ' + buildAltText(name);
  }
  function buildBreakdown(brailleName) {
    breakdownList.innerHTML = '';
    const lc = brailleName.replace(/\s/g,'').length;
    breakdownSum.textContent = 'The braille spells "' + brailleName + '" with ' + lc +
      ' letter' + (lc === 1 ? '' : 's') + '. Each cell:';
    for (const ch of brailleName) {
      const li = document.createElement('li');
      if (ch === ' ') li.textContent = '(space) \u2014 empty cell';
      else {
        const dots = BRAILLE_MAP[ch] || [];
        li.textContent = ch.toUpperCase() + (dots.length === 0
          ? ' \u2014 no dots'
          : ' \u2014 dot' + (dots.length === 1 ? '' : 's') + ' ' + dots.join(', '));
      }
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
    buildBreakdown(brailleName);
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
