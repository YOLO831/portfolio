const pages = Array.from({ length: 28 }, (_, index) => ({
  number: index + 1,
  src: `./public/pages/${String(index + 1).padStart(2, '0')}.png`,
}));

const portfolio = document.querySelector('#portfolio');
const pageLinks = document.querySelector('#page-links');
const currentPage = document.querySelector('#current-page');
const progressBar = document.querySelector('#progress-bar');
const scrollHint = document.querySelector('.scroll-hint');
const menu = document.querySelector('.page-menu');
const menuToggle = document.querySelector('.menu-toggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const usePinnedReveal = false;
const particlePages = new Set([1, 2, 28]);

function createParticleZone(pageNumber) {
  if (!particlePages.has(pageNumber)) return '';
  return `<div class="particle-zone" data-particles="${pageNumber}"><canvas class="particle-canvas" aria-hidden="true"></canvas><span class="particle-tip">move through the light</span></div>`;
}

function createCursorParticleZone(pageNumber) {
  if (!particlePages.has(pageNumber)) return '';
  return `<div class="particle-zone cursor-particle-zone" data-particles="${pageNumber}" data-particle-role="cursor" aria-hidden="true"><canvas class="particle-canvas"></canvas></div>`;
}

function createFigmaNOVA() {
  const layers = [
    ['nova-bg', '2924-background@2x.png'], ['nova-corners', '2925-corners@2x.png'], ['nova-categories', '2929-categories@2x.png'],
    ['nova-number', '2946-number@2x.png'], ['nova-badge', '2951-badge@2x.png'],
    ['nova-built', '2954-built@2x.png'], ['nova-built-line', '2957-line@2x.png'], ['nova-note-head', '2958-note-head@2x.png'],
    ['nova-type', '2967-type@2x.png'], ['nova-date', '2968-date@2x.png'], ['nova-note-cn', '2969-cn-note@2x.png'], ['nova-note-en', '2970-en-note@2x.png'],
  ];
  return `<div class="figma-nova" aria-label="NOVA 项目封面">
    ${layers.map(([className, fileName]) => `<img class="nova-layer ${className}${className !== 'nova-bg' ? ' nova-scroll-layer' : ''}" src="./public/figma/page-03/layers/${fileName}" alt="" />`).join('')}
    <div class="nova-text nova-text-nova nova-scroll-layer" tabindex="0" aria-label="NOVA"><img src="./public/figma/page-03/text/nova-270-2948@2x-transparent.png" alt="" /></div>
    <div class="nova-text nova-text-cn nova-scroll-layer" tabindex="0" aria-label="多 Agent 协作空间交互系统设计"><img src="./public/figma/page-03/text/title-cn-270-2942@2x-transparent.png" alt="" /></div>
    <div class="nova-text nova-text-en nova-scroll-layer" tabindex="0" aria-label="MULTI-AGENT SPATIAL INTERACTION SYSTEM DESIGN"><img src="./public/figma/page-03/text/title-en-270-2944@2x-transparent.png" alt="" /></div>
    <div class="nova-rectangle nova-scroll-layer" tabindex="0" aria-label="NOVA 界面示意图"><img src="./public/figma/page-03/source/rectangle-raw-1.png" alt="" /></div>
  </div>`;
}

function createFigmaLumenCover() {
  const root = './public/figma/page-08/layers';
  const layers = [
    ['5007-fg@2x.png', 1598.42, 546.77, 95.30, 9.24, 1, 'lumen-meta'], ['5008-fg@2x.png', 1642.62, 566.72, 51.76, 7.42, 1, 'lumen-meta'],
    ['5009-fg@2x.png', 13.58, 13.58, 22.64, 22.64, 1, 'lumen-corners'], ['5010-fg@2x.png', 1670, 14, 22.64, 22.64, 1, 'lumen-corners'], ['5011-fg@2x.png', 13.58, 573.78, 22.64, 22.64, 1, 'lumen-corners'],
    ['5012-fg@2x.png', 1159, 37.99, 526.90, 17, 1, 'lumen-categories'], ['5022-fg-screenshot@2x.png', 54, 25.55, 457, 324.74, 2, 'lumen-main'],
    ['5036-fg@2x.png', 54.33, 365.99, 364.86, 19, 3, 'lumen-note-head'], ['5045-fg@2x.png', 54.60, 406.46, 751.65, 63.44, 3, 'lumen-note-cn'],
    ['5046-fg@2x.png', 54.06, 485.36, 751.29, 49.64, 3, 'lumen-note-en'], ['5047-fg@2x.png', 499, 220, 190.50, 64.52, 3, 'lumen-detail'],
  ];
  return `<section class="figma-project-cover figma-lumen" aria-label="流明项目封面">
    <img class="project-cover-background" src="${root}/5006-fg-native.png" alt="" />
    <div class="lumen-fridge-reveal lumen-scroll-layer lumen-stage-4"><img class="lumen-fridge-source-cut" src="${root}/lumen-fridge-source-cut.png" alt="" /></div>
    <button class="lumen-fridge-hotspot" type="button" aria-label="智能半导体冰箱"></button>
    ${layers.map(([file,x,y,w,h,stage,name]) => `<img class="project-cover-layer lumen-scroll-layer lumen-stage-${stage} ${name}" src="${root}/${file}" alt="" style="--x:${x};--y:${y};--w:${w};--h:${h}" />`).join('')}
  </section>`;
}

function createFigmaJinxiangCover() {
  const layer = (id, className, assets = window.PAGE_13_NATIVE_ASSETS) => {
    const asset = assets[id];
    if (!asset) return '';
    const { x, y, width, height } = asset.bounds;
    const stage = ['jinxiang-hand', 'jinxiang-interface'].includes(className) ? 4 : ['jinxiang-note', 'jinxiang-note-head'].includes(className) ? 3 : className === 'jinxiang-main' ? 2 : 1;
    const classes = `project-cover-layer jinxiang-layer jinxiang-scroll-layer jinxiang-stage-${stage} ${className}`;
    const style = `--x:${x};--y:${y};--w:${width};--h:${height}`;
    if (['jinxiang-interface', 'jinxiang-hand'].includes(className)) {
      const label = className === 'jinxiang-hand' ? '锦象手持手机界面' : '锦象手机界面';
      return `<div class="${classes} jinxiang-zoom-interaction" tabindex="0" role="img" aria-label="${label}" style="${style}"><img src="${asset.src}" alt="" /></div>`;
    }
    return `<img class="${classes}" src="${asset.src}" alt="" style="${style}" />`;
  };
  const visual = window.PAGE_13_NATIVE_VISUAL_ASSETS || {};
  const interfaces = window.PAGE_13_NATIVE_INTERFACE_ASSETS || {};
  const decoration = window.PAGE_13_NATIVE_DECORATION_ASSETS || {};
  return `<section class="figma-project-cover figma-jinxiang" aria-label="锦象项目封面">
    <img class="project-cover-background" src="./public/figma/page-13/node-270-8113.png" alt="" />
    <svg class="jinxiang-gradient" viewBox="0 0 1724 609" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="jinxiang-270-8114-gradient" gradientUnits="objectBoundingBox" gradientTransform="matrix(-0.9996662736 -0.0064628306 0.0064628352 -0.1251527071 0.9964348674 0.569039166)"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#0e3a7b" stop-opacity="1"/></linearGradient><filter id="jinxiang-270-8114-shadow" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="45.276894" stdDeviation="50.936504" flood-color="#0d3a7a" flood-opacity=".35"/></filter></defs><rect width="1724" height="609" fill="url(#jinxiang-270-8114-gradient)" filter="url(#jinxiang-270-8114-shadow)"/></svg>
    ${layer('270:8115', 'jinxiang-decoration', decoration)}
    ${layer('270:8121', 'jinxiang-hand', visual)}
    ${layer('270:8122', 'jinxiang-interface', interfaces)}
    ${layer('270:8236', 'jinxiang-interface', interfaces)}
    ${layer('270:8350', 'jinxiang-interface', interfaces)}
    ${layer('270:8464', 'jinxiang-interface', interfaces)}
    ${layer('270:8578', 'jinxiang-corner')}${layer('270:8579', 'jinxiang-corner')}${layer('270:8580', 'jinxiang-corner')}
    ${layer('270:8581', 'jinxiang-categories')}${layer('270:8591', 'jinxiang-main')}${layer('270:8602', 'jinxiang-note-head')}
    ${layer('270:8611', 'jinxiang-note')}${layer('270:8612', 'jinxiang-note')}${layer('270:8613', 'jinxiang-meta')}${layer('270:8614', 'jinxiang-meta')}
  </section>`;
}

function createFigmaTigerCover() {
  const small = window.PAGE_18_NATIVE_SMALL_ASSETS || {};
  const content = window.PAGE_18_NATIVE_CONTENT_ASSETS || {};
  const background = window.PAGE_18_NATIVE_BACKGROUND_ASSETS || {};
  const visual = window.PAGE_18_NATIVE_VISUAL_ASSETS || {};
  const foreground = window.PAGE_18_NATIVE_FOREGROUND_ASSETS || {};
  const layer = (id, className, assets) => {
    const asset = assets[id];
    if (!asset) return '';
    const { x, y, width, height } = asset.bounds;
    const stage = className === 'tiger-foreground' ? 4 : ['tiger-note', 'tiger-note-head'].includes(className) ? 3 : ['tiger-main', 'tiger-visual'].includes(className) ? 2 : 1;
    const classes = `project-cover-layer tiger-layer tiger-scroll-layer tiger-stage-${stage} ${className}`;
    const style = `--x:${x};--y:${y};--w:${width};--h:${height}`;
    if (className === 'tiger-foreground') {
      return `<div class="${classes} tiger-zoom-interaction" tabindex="0" role="img" aria-label="虎跃新生右侧视觉图" style="${style}"><img src="${asset.src}" alt="" /></div>`;
    }
    return `<img class="${classes}" src="${asset.src}" alt="" style="${style}" />`;
  };
  const bg = background['270:14480'];
  return `<section class="figma-project-cover figma-tiger" aria-label="虎跃新生项目封面">
    <div class="tiger-base" aria-hidden="true"></div>
    ${bg ? `<img class="project-cover-background tiger-background" src="${bg.src}" alt="" />` : ''}
    ${layer('270:14489', 'tiger-corners', small)}
    ${layer('270:14493', 'tiger-categories', small)}
    ${layer('270:14503', 'tiger-main', content)}
    ${layer('270:14525', 'tiger-line', small)}
    ${layer('270:14526', 'tiger-note-head', small)}
    ${layer('270:14535', 'tiger-note', content)}
    ${layer('270:14536', 'tiger-note', content)}
    ${layer('270:14483', 'tiger-visual', visual)}
    ${layer('270:14537', 'tiger-foreground', foreground)}
    ${layer('270:14543', 'tiger-meta', small)}
    ${layer('270:14544', 'tiger-meta', small)}
  </section>`;
}

function createFigmaOtherWorksCover() {
  const layers = [
    ['270-15362.png', 13.583034432738714, 13.583082256338038, 1679.0556640625, 582.8339967336872, 1, 'other-corners'],
    ['270-15366.png', 1094.0000266202387, 36.98943235306231, 563.8671875, 17, 1, 'other-categories'],
    ['270-15376.png', 53.667995370238714, 25.553786295718044, 594.7041015625, 324.7419738769531, 2, 'other-main'],
    ['270-15393.png', 488.6679953702387, 308.9271383463674, 183, 1, 3, 'other-line'],
    ['270-15394.png', 54.332057870238714, 364.9894247236674, 364.8603515625, 19, 3, 'other-note-head'],
    ['270-15403.png', 54.37795630753965, 405.5480184731992, 752.294921875, 63.355987548828125, 3, 'other-note'],
    ['270-15404.png', 54.580105745238714, 484.35999967483966, 751.369140625, 49.6400146484375, 3, 'other-note'],
    ['270-15405.png', 935.0000266202387, 54.00001432240573, 701, 555, 4, 'other-visual'],
  ];
  const rabbit = (name, file, x, y, width, height, label) => `<div class="project-cover-layer other-layer other-scroll-layer other-stage-4 other-rabbit ${name}" tabindex="0" role="img" aria-label="${label}" style="--x:${x};--y:${y};--w:${width};--h:${height}"><span class="other-rabbit-node"><img src="./public/figma/page-23/native/${file}" alt="" /></span></div>`;
  return `<section class="figma-project-cover figma-other-works" aria-label="其他作品项目封面">
    <div class="other-base" aria-hidden="true"></div>
    ${layers.map(([file, x, y, width, height, stage, name]) => {
      const classes = `project-cover-layer other-layer other-scroll-layer other-stage-${stage} ${name}`;
      const style = `--x:${x};--y:${y};--w:${width};--h:${height}`;
      if (name === 'other-visual') return `<div class="${classes} other-zoom-interaction" tabindex="0" role="img" aria-label="其他作品右侧露营灯视觉图" style="${style}"><img src="./public/figma/page-23/native/${file}" alt="" /></div>`;
      return `<img class="${classes}" src="./public/figma/page-23/native/${file}" alt="" style="${style}" />`;
    }).join('')}
    ${rabbit('other-rabbit-black', '270-15407-source.png', 1523.23046875, 370.9999694824219, 100.0920639038086, 125.92227172851562, '黑色兔子')}
    ${rabbit('other-rabbit-white', '270-15408-source.png', 994, 453.9999694824219, 116, 142, '白色兔子')}
  </section>`;
}

function createFigmaCover() {
  return `
    <div class="figma-cover" aria-label="设计作品集封面">
      <img class="cover-background" src="./public/figma/page-01/background.png" alt="" />
      <div class="cover-layer cover-title">DESIGN portfolio</div>
      <div class="cover-layer cover-year cover-year-start">2023</div>
      <img class="cover-layer cover-line cover-line-top" src="./public/figma/page-01/line-top.svg" alt="" />
      <div class="cover-layer cover-year cover-year-end">2026</div>
      <img class="cover-layer cover-line cover-line-bottom" src="./public/figma/page-01/line-bottom.svg" alt="" />
      <div class="cover-layer cover-name">JIN TAIZHEN</div>
      <div class="cover-layer cover-categories"><strong>INTERACTION DESIGN</strong><i>/</i><strong>UX DESIGN</strong><i>/</i><strong>INDUSTRIAL DESIGN</strong></div>
      <div class="cover-layer cover-word">portfolio<img class="cover-mark cover-mark-large" src="./public/figma/page-01/mark-large.svg" alt="" /></div>
      <img class="cover-layer cover-mark cover-mark-small" src="./public/figma/page-01/mark-small.svg" alt="" />
      ${createParticleZone(1)}
      ${createCursorParticleZone(1)}
    </div>`;
}

// Page 28 comes directly from Figma Frame 270:2112.  Every visible item is
// represented by its own source node: the background image fill, four vectors,
// and the exact text content/typography from Figma's design context.  The old
// full-frame raster is intentionally not present in this composition.
function createFigmaEnd() {
  const root = './public/figma/page-28';
  return `
    <section class="figma-end" aria-label="作品集结束页" data-figma-frame-id="270:2112">
      <img class="end-background" src="${root}/270-2113-image-2157.png" alt="" data-figma-node-id="270:2113" />
      <div class="end-layer end-thank" data-figma-node-id="270:2114">THANK</div>
      <div class="end-layer end-you" data-figma-node-id="270:2115">YOU<img class="end-mark end-mark-large" src="${root}/270-2122-vector-248.svg" alt="" data-figma-node-id="270:2122" /></div>
      <div class="end-layer end-year end-year-start" data-figma-node-id="270:2116">2023</div>
      <div class="end-layer end-name" data-figma-node-id="270:2117">JIN TAIZHEN</div>
      <div class="end-layer end-categories" data-figma-node-id="270:2118"><strong>INTERACTION DESIGN</strong><i>/</i><strong>UX DESIGN</strong><i>/</i><strong>INDUSTRIAL DESIGN</strong></div>
      <img class="end-layer end-line end-line-top" src="${root}/270-2119-vector-3211.svg" alt="" data-figma-node-id="270:2119" />
      <img class="end-layer end-line end-line-bottom" src="${root}/270-2120-vector-3212.svg" alt="" data-figma-node-id="270:2120" />
      <div class="end-layer end-year end-year-end" data-figma-node-id="270:2121">2026</div>
      <img class="end-layer end-mark end-mark-small" src="${root}/270-2123-vector-3213.svg" alt="" data-figma-node-id="270:2123" />
      <div class="end-layer end-label" data-figma-node-id="270:2124">END</div>
      ${createParticleZone(28)}
      ${createCursorParticleZone(28)}
    </section>`;
}

function createFigmaDirectoryModules2x() {
  const root = './public/figma/page-02';
  const modules = [
    ['module-2249.png',18,331,204,246,'directory-2x-left directory-2x-profile'],
    ['research-module-2x.png',241,34,321,397,'directory-2x-left directory-2x-research'],
    ['module-2178.png',241,445,324,128,'directory-2x-left directory-2x-student'],
    ['module-2190.png',566,34,273,412,'directory-2x-left directory-2x-awards'],
    ['module-2221.png',566,450,272.5,123,'directory-2x-left directory-2x-tools'],
    ['module-2286.png',1478,42,224,35,'directory-2x-right directory-2x-content'],
    ['module-2304.png',939,535,762,33,'directory-2x-right directory-2x-categories']
  ];
  // Node screenshots are rendered by Figma at their visible bounds. Keep
  // those exact bounds so the screenshots are never stretched or clipped.
  const rightText = [
    ['2288',885.07,104.88,16.08,57.12],['2294',1052.92,103.76,35.2,58.24],['2295',1221.54,103.76,36.96,59.36],['2296',1389.5,104.88,43.12,57.12],['2297',1559.54,104.88,37.04,58.24],
    ['2299',884.92,174.8,110.64,29.87],['2301',1052.66,174.08,52.99,31.16],['2302',1220.66,174.08,53.23,31.16],['2303',1388.66,174.08,114.44,31.16],['2300',1558.66,174.08,114.3,31.16],
    ['2289',885.99,217.75,142.13,9.25],['2290',1053.48,217.71,89.1,9.31],['2291',1221.48,217.79,99.1,9.22],['2292',1390.8,217.72,107.57,9.3],['2293',1558.45,217.72,89.13,9.29]
  ];
  const rightGroup = (id) => {
    if (['2288','2294','2295','2296','2297'].includes(id)) return 'directory-2x-numbers';
    if (['2299','2300','2301','2302','2303'].includes(id)) return 'directory-2x-titles';
    return 'directory-2x-subtitles';
  };
  const image = (src,x,y,w,h,group='') => `<img class="directory-2x-node ${group}" src="${src}" alt="" style="--x:${x};--y:${y};--w:${w};--h:${h}" />`;
  return `<section class="figma-directory-2x" aria-label="作品集目录">
    <img class="directory-2x-background" src="${root}/native/270-2139.png" alt="" />
    ${createParticleZone(2)}
    ${createCursorParticleZone(2)}
    ${image(`${root}/probe-2239.png`,0,0,239,327,'directory-2x-left directory-2x-photo')}
    ${modules.map(([file,x,y,w,h,group]) => image(`${root}/${file}`,x,y,w,h,`directory-2x-module ${group}${file === 'research-module-2x.png' ? ' directory-2x-research-base' : ''}`)).join('')}
    <div class="directory-publications-author-patch" aria-hidden="true"><img src="${root}/native/270-2139.png" alt="" /></div>
    <img class="directory-publications-author-updated directory-2x-left directory-2x-research" src="${root}/user/270-2152-updated.png" alt="" />
    <div class="directory-publications-update" aria-label="Publications">
      <div class="directory-publications-heading">Publications</div>
      <div class="directory-publications-title">《基于小空间场景用户分析的空气调节器设计》</div>
      <div class="directory-publications-author">-第一作者，发表于《上海轻工业》，2026.07</div>
      <div class="directory-publications-title directory-publications-title-second">《探析多模态交互设计在人工智能时代的演进路径与核心议题》</div>
      <div class="directory-publications-author directory-publications-author-second">-第一作者，发表于《重庆科技报》，2025.12</div>
    </div>
    <div class="directory-publications-corrected directory-2x-left" aria-label="Publications">
      <div class="directory-publications-heading">Publications</div>
      <div class="directory-publications-title">\u300a\u57fa\u4e8e\u5c0f\u7a7a\u95f4\u573a\u666f\u7528\u6237\u5206\u6790\u7684\u7a7a\u6c14\u8c03\u8282\u5668\u8bbe\u8ba1\u300b</div>
      <div class="directory-publications-author">-\u7b2c\u4e00\u4f5c\u8005\uff0c\u53d1\u8868\u4e8e\u300a\u4e0a\u6d77\u8f7b\u5de5\u4e1a\u300b\uff0c2026.07</div>
      <div class="directory-publications-title directory-publications-title-second">\u300a\u63a2\u6790\u591a\u6a21\u6001\u4ea4\u4e92\u8bbe\u8ba1\u5728\u4eba\u5de5\u667a\u80fd\u65f6\u4ee3\u7684\u6f14\u8fdb\u8def\u5f84\u4e0e\u6838\u5fc3\u8bae\u9898\u300b</div>
      <div class="directory-publications-author directory-publications-author-second">-\u7b2c\u4e00\u4f5c\u8005\uff0c\u53d1\u8868\u4e8e\u300a\u91cd\u5e86\u79d1\u6280\u62a5\u300b\uff0c2025.12</div>
    </div>
    ${rightText.map(([id,x,y,w,h]) => {
      const file = ['2299','2300','2301','2302','2303'].includes(id)
        ? `right-title-2x-${id}.png`
        : ['2289','2290','2291','2292','2293'].includes(id)
          ? `right-subtitle-2x-${id}.png`
          : `right-screenshot-${id}.png`;
      return image(`${root}/${file}`,x,y,w,h,`directory-2x-right ${rightGroup(id)}`);
    }).join('')}
    ${image(`${root}/cards-group-2325@2x.png`,885,248,816,264,'directory-2x-right directory-2x-cards')}
  </section>`;
}

pages.forEach(({ number, src }) => {
  const page = document.createElement('section');
  page.className = 'page';
  page.id = `page-${number}`;
  page.dataset.page = number;
  page.setAttribute('aria-label', `作品集第 ${number} 页`);
  const content = number === 1
    ? createFigmaCover()
    : number === 2
      ? createFigmaDirectoryModules2x()
    : number === 3
      ? createFigmaNOVA()
      : number === 8
        ? createFigmaLumenCover()
        : number === 13
          ? createFigmaJinxiangCover()
        : number === 18
          ? createFigmaTigerCover()
        : number === 23
          ? createFigmaOtherWorksCover()
        : number === 28
          ? createFigmaEnd()
      : `<img class="page-image" src="${number >= 3 && number <= 27 ? `./public/pages/${String(number).padStart(2, '0')}@2x.webp` : src}" alt="作品集第 ${number} 页" loading="${number < 3 || number === 28 ? 'eager' : 'lazy'}" decoding="async" />${createParticleZone(number)}${createCursorParticleZone(number)}`;
  page.innerHTML = `<div class="page-inner">${content}<span class="page-caption">PAGE ${String(number).padStart(2, '0')} / JIN TAIZHEN</span></div>`;
  portfolio.appendChild(page);

  const link = document.createElement('a');
  link.className = 'page-link';
  link.href = `#page-${number}`;
  link.dataset.page = number;
  link.innerHTML = `<small>${String(number).padStart(2, '0')}</small><span>${number === 1 ? 'COVER' : number === 28 ? 'END' : 'PORTFOLIO'}</span>`;
  pageLinks.appendChild(link);
});

const pageElements = [...document.querySelectorAll('.page')];
const links = [...document.querySelectorAll('.page-link')];

// Preload the next raster content page once the current page is visible, so
// scrolling into it never waits on a WebP download. Covers and the ending
// page are layer-built and carry no `page-image`, so they are skipped.
const preloadedPageImages = new Set();
const nextContentImageSrc = (page) => {
  const next = Number(page.dataset.page) + 1;
  if (next < 3 || next > 27) return null;
  if ([3, 8, 13, 18, 23].includes(next)) return null;
  return `./public/pages/${String(next).padStart(2, '0')}@2x.webp`;
};
const pageImagePreloader = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const src = nextContentImageSrc(entry.target);
    if (!src || preloadedPageImages.has(src)) continue;
    preloadedPageImages.add(src);
    const preload = new Image();
    preload.src = src;
  }
}, { threshold: 0.1 });
pageElements.forEach((page) => pageImagePreloader.observe(page));

// A fresh visit always opens on the cover. Do not restore a stale #page-N hash
// left in the preview URL, otherwise the browser appears to skip the opening.
if (window.location.hash) history.replaceState(null, '', window.location.pathname);
window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll <= 0 ? 0 : window.scrollY / maxScroll;
  progressBar.style.transform = `scaleX(${ratio})`;
  scrollHint.classList.toggle('is-hidden', window.scrollY > window.innerHeight * .35);
}

function setCurrentPage(number) {
  currentPage.textContent = `${String(number).padStart(2, '0')} / 28`;
  links.forEach((link) => link.classList.toggle('is-current', Number(link.dataset.page) === number));
}

const pageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // A page enters once and then remains settled. Re-arming this transform
    // while a cover hands off can create a visible 24px bounce in its body.
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: .16, rootMargin: '0px 0px -7% 0px' });
pageElements.forEach((page) => pageObserver.observe(page));

const coverPage = document.querySelector('#page-1');
if (coverPage) {
  const coverComposition = coverPage.querySelector('.figma-cover');
  let coverIntroReady = reduceMotion;
  const allowCoverScroll = () => {
    coverIntroReady = true;
    coverPage.dataset.introComplete = 'true';
  };

  if (coverComposition) {
    window.setTimeout(() => coverComposition.classList.add('cover-copy-revealed'), 280);
    // The final cover layer starts at 1.60s and has a 1.50s transition.
    window.setTimeout(allowCoverScroll, reduceMotion ? 0 : 3160);
  } else {
    allowCoverScroll();
  }

  // The opening holds only while its own animation is running.  It never
  // repositions the document or interprets wheel distance after release.
  // The guard is the first viewport, not `scrollY <= 1`: a reload can restore
  // a slightly scrolled position, which would otherwise disable the lock
  // while the cover is still animating.
  window.addEventListener('wheel', (event) => {
    if (!coverIntroReady && event.deltaY > 0 && window.scrollY < window.innerHeight) event.preventDefault();
  }, { capture: true, passive: false });

  window.addEventListener('keydown', (event) => {
    const downKeys = ['ArrowDown', 'PageDown', ' ', 'Spacebar', 'End'];
    if (!coverIntroReady && window.scrollY < window.innerHeight && downKeys.includes(event.key)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, { capture: true });
}

// Page 01 → 02 bridge: the two existing particle layers stay inside their
// own Figma pages and use mirrored falloff at the shared boundary.
// Page 28 uses the same staggered source-layer entrance as Page 01. It is
// viewport-triggered only: it neither locks nor repositions normal scrolling.
const endPage = document.querySelector('#page-28');
if (endPage) {
  const endComposition = endPage.querySelector('.figma-end');
  if (endComposition) {
    const endRevealObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      window.setTimeout(() => endComposition.classList.add('end-copy-revealed'), reduceMotion ? 0 : 280);
      observer.disconnect();
    }, { threshold: .28 });
    endRevealObserver.observe(endPage);
  }
}

const bridgeDirectoryPage = document.querySelector('#page-2');
if (coverPage && bridgeDirectoryPage && !reduceMotion) {
  let bridgeFrame = 0;
  let bridgeAttached = false;
  let bridgeGap = 0;
  const coverCanvas = coverPage.querySelector('.page-inner');
  const directoryInner = bridgeDirectoryPage.querySelector('.page-inner');
  const scheduleBridgeUpdate = () => {
    if (!bridgeFrame) bridgeFrame = window.requestAnimationFrame(updateCoverDirectoryBridge);
  };
  const updateCoverDirectoryBridge = () => {
    bridgeFrame = 0;
    // The cover owns the opening by itself.  Directory bridging begins only
    // after its intro has completed and the visitor has naturally departed.
    const bridgeCanStart = coverPage.dataset.introComplete === 'true' && window.scrollY > 1;
    if (!bridgeCanStart) {
      const directoryRevealHasStarted = bridgeDirectoryPage
        .querySelector('.figma-directory-2x')?.dataset.revealStage !== '0';
      bridgeAttached = false;
      bridgeGap = 0;
      coverPage.classList.remove('cover-directory-bridged');
      coverPage.classList.remove('cover-directory-pinned');
      // The approved Page 01 particle interaction remains fully present while
      // the cover is on screen. The bridge may reveal Page 02 separately, but
      // must never attenuate Page 01's own interactive field.
      coverPage.style.setProperty('--cover-particle-opacity', '1');
      bridgeDirectoryPage.style.setProperty(
        '--directory-particle-opacity',
        directoryRevealHasStarted ? '1' : '.38'
      );
      coverPage.style.setProperty('--cover-bridge-lift', '0px');
      return;
    }
    const bounds = coverPage.getBoundingClientRect();
    const travelled = Math.max(0, window.innerHeight - bounds.bottom);
    const range = Math.max(1, Math.min(bounds.height * .52, window.innerHeight * .52));
    const progress = Math.min(1, travelled / range);
    // Both fields build from the same early, continuous transition; neither
    // relies on a viewport-boundary class switch.
    const easedProgress = 1 - Math.pow(1 - progress, 2);
    const opacity = .38 + .62 * easedProgress;
    const directoryBounds = directoryInner?.getBoundingClientRect();
    if (!bridgeAttached && coverCanvas && directoryBounds) {
      bridgeGap = Math.max(0, directoryBounds.top - coverCanvas.getBoundingClientRect().bottom);
      bridgeAttached = true;
      coverPage.classList.add('cover-directory-bridged');
    }
    // Close the cover's flex-centre whitespace through normal scrolling first.
    // Only then is fixed positioning visually identical to the scroll state.
    // Keep both pages in normal document flow. The earlier fixed-position
    // bridge could make the directory jump over the cover at the handoff.
    // The directory's own sticky reading position remains responsible for
    // the centre hold; this bridge only controls the particle fade.
    coverPage.classList.remove('cover-directory-pinned');
    coverPage.style.setProperty('--cover-particle-opacity', '1');
    // Once the directory has begun its own staged reveal, its local particle
    // field is an active interaction surface rather than a distant bridge.
    // Keep it fully legible; otherwise the bridge falloff leaves a working
    // canvas at .38 opacity and makes the interaction appear to have stopped.
    const directoryRevealHasStarted = bridgeDirectoryPage
      .querySelector('.figma-directory-2x')?.dataset.revealStage !== '0';
    bridgeDirectoryPage.style.setProperty(
      '--directory-particle-opacity',
      directoryRevealHasStarted ? '1' : opacity.toFixed(3)
    );
    coverPage.style.setProperty('--cover-bridge-lift', '0px');
  };
  window.addEventListener('scroll', scheduleBridgeUpdate, { passive: true });
  // The directory handoff changes its own layout reserve without necessarily
  // producing a scroll event. Keep the pinned cover on the same visual edge.
  new ResizeObserver(scheduleBridgeUpdate).observe(bridgeDirectoryPage);
  updateCoverDirectoryBridge();
}

let setDirectoryStage = () => {};
let setNovaStage = () => {};
let setLumenStage = () => {};
let setJinxiangStage = () => {};
let setTigerStage = () => {};
let setOtherWorksStage = () => {};
// Wired after the staged-page block so a completed cover can immediately
// release the physical document scroll lock without waiting for the next
// wheel event.
let onCoverReady = () => {};

// Keep the reading lock until the longest verified interaction preview has
// completed, but do not leave a long inert pause after the final reveal.
// These values are the actual final transition lengths, not an extra pause:
// unlock exactly when the last staged layer has finished settling.
const directoryRevealCompleteDelay = 1000;
const coverPreviewStartDelay = 1000;
const coverPreviewCompleteDelay = 2200;

function playCoverInteractionPreview(composition, stage) {
  // A cover that leaves stage 4 (scrolling back up) may play its interaction
  // preview again on the next arrival. Without this, repeat visits show the
  // interactive layers with no auto-play and the release logic over-waits.
  if (stage < 4) {
    delete composition.dataset.interactionPreviewPlayed;
    return;
  }
  if (composition.dataset.interactionPreviewPlayed === 'true') return;
  composition.dataset.interactionPreviewPlayed = 'true';
  window.setTimeout(() => {
    composition.classList.add('cover-preview-expanded');
    window.setTimeout(() => composition.classList.remove('cover-preview-expanded'), 650);

    composition.querySelectorAll('.other-rabbit-node').forEach((rabbit) => {
      rabbit.addEventListener('animationend', () => rabbit.classList.remove('other-rabbit-previewing'), { once: true });
      rabbit.classList.add('other-rabbit-previewing');
    });
  }, coverPreviewStartDelay);
}

// Release a project cover's scroll lock only after its animations have truly
// completed (last transition/animation end plus a short settle buffer). A
// fixed timer races the reveal, which lets the page scroll while the cover
// is still animating.
const armCoverReady = (composition, page, ready, minDelay = coverPreviewCompleteDelay, fallbackDelay = 500) => {
  composition.__coverReadyCancel?.();
  const startedAt = performance.now();
  let done = false;
  let quietTimer = 0;
  let fallbackTimer = 0;
  const finish = () => {
    if (done) return;
    done = true;
    window.clearTimeout(quietTimer);
    window.clearTimeout(fallbackTimer);
    composition.removeEventListener('transitionend', onAnimationEnd);
    composition.removeEventListener('animationend', onAnimationEnd);
    composition.__coverReadyCancel = null;
    ready();
  };
  const onAnimationEnd = () => {
    // Ignore the early staggered batches; only the tail of the reveal counts.
    if (performance.now() - startedAt < minDelay) return;
    window.clearTimeout(quietTimer);
    quietTimer = window.setTimeout(finish, 350);
  };
  composition.addEventListener('transitionend', onAnimationEnd);
  composition.addEventListener('animationend', onAnimationEnd);
  // The fallback is only a safety net; the release must be driven by the
  // final staged-layer transition, otherwise a reveal longer than the floor
  // gets released early. It sits well past the longest known tail event, so
  // a repeat visit still releases from the real transition end instead of
  // waiting out this timer.
  fallbackTimer = window.setTimeout(finish, minDelay + fallbackDelay);
  composition.__coverReadyCancel = () => {
    window.clearTimeout(quietTimer);
    window.clearTimeout(fallbackTimer);
    composition.removeEventListener('transitionend', onAnimationEnd);
    composition.removeEventListener('animationend', onAnimationEnd);
  };
};

const directoryPage = document.querySelector('#page-2');
const directoryComposition = directoryPage?.querySelector('.figma-directory-2x');
if (directoryPage && directoryComposition && !reduceMotion && !usePinnedReveal) {
  let directoryStage = 0;
  let directoryWheelLock = false;
  let directoryReadyTimer = 0;
  const applyDirectoryStage = () => {
    directoryComposition.classList.add('directory-scroll-pending');
    directoryComposition.dataset.revealStage = directoryStage;
    // Both direct stage setup and wheel-driven reveal flow through here.
    // Keep the directory field fully visible from its first active stage.
    bridgeDirectoryPage.style.setProperty(
      '--directory-particle-opacity',
      directoryStage > 0 ? '1' : '.38'
    );
    // A wheel-driven stage can begin while the pointer remains still. Wake
    // the existing local field from its last real pointer position so the
    // stage does not make the approved repulsion interaction appear frozen.
    // The directory's own mask is part of the loading canvas. Wake it from
    // stage 0 as well: adding `directory-scroll-pending` can otherwise clear
    // a sleeping canvas before the first reveal gesture.
    directoryPage.querySelector('.particle-zone')?.dispatchEvent(
      new CustomEvent('particlewake', { detail: { duration: 1200 } })
    );
    if (directoryStage > 0) {
      // The cover stays visually pinned above the directory during this
      // sequence. Its original mask canvas must be repainted from that
      // rendered position, not treated as off-screen with its old document
      // bounds while Page 02 reveals.
      document.querySelector('#page-1 .particle-zone')?.dispatchEvent(
        new CustomEvent('particlewake', { detail: { duration: 1800 } })
      );
    }
    for (let stage = 1; stage <= 9; stage += 1) directoryComposition.classList.toggle(`directory-stage-${stage}`, directoryStage >= stage);
  };
  setDirectoryStage = (stage) => {
    directoryStage = Math.max(0, Math.min(9, stage));
    directoryComposition.dataset.revealReady = 'false';
    directoryPage.classList.remove('chapter-ready', 'chapter-handoff', 'chapter-complete');
    window.clearTimeout(directoryReadyTimer);
    applyDirectoryStage();
    if (directoryStage === 9) armCoverReady(directoryComposition, directoryPage, () => {
      directoryComposition.dataset.revealReady = 'true';
      directoryPage.classList.add('chapter-complete');
      onCoverReady();
    }, 800, 2500);
  };
  const directoryIsInReadingZone = () => {
    const bounds = directoryPage.getBoundingClientRect();
    const directoryCenter = bounds.top + bounds.height / 2;
    return Math.abs(directoryCenter - window.innerHeight / 2) <= Math.max(112, bounds.height * .16);
  };
  const directoryCenterOffset = () => {
    const bounds = directoryPage.getBoundingClientRect();
    return bounds.top + bounds.height / 2 - window.innerHeight / 2;
  };
  applyDirectoryStage();
}

const novaPage = document.querySelector('#page-3');
if (novaPage && !reduceMotion && !usePinnedReveal) {
  const novaComposition = novaPage.querySelector('.figma-nova');
  let novaStage = 0;
  let novaWheelLock = false;
  let novaAligning = false;
  let novaReadyTimer = 0;
  const novaCenterOffset = () => {
    const bounds = novaPage.getBoundingClientRect();
    return bounds.top + bounds.height / 2 - window.innerHeight / 2;
  };
  const novaIsNearReadingZone = () => {
    const bounds = novaPage.getBoundingClientRect();
    const centre = bounds.top + bounds.height / 2;
    return Math.abs(centre - window.innerHeight / 2) <= Math.max(180, bounds.height * .28);
  };
  const novaCanSettleAtReadingZone = () => {
    const bounds = novaPage.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > window.innerHeight / 2;
  };
  const applyNovaStage = () => {
    novaComposition.classList.add('nova-scroll-pending');
    novaComposition.dataset.revealStage = novaStage;
    for (let stage = 1; stage <= 4; stage += 1) novaComposition.classList.toggle(`nova-stage-${stage}`, novaStage >= stage);
    playCoverInteractionPreview(novaComposition, novaStage);
  };
  setNovaStage = (stage) => {
    novaStage = Math.max(0, Math.min(4, stage));
    novaComposition.dataset.revealReady = 'false';
    novaPage.classList.remove('chapter-ready', 'chapter-handoff', 'chapter-complete');
    window.clearTimeout(novaReadyTimer);
    applyNovaStage();
    if (novaStage === 4) armCoverReady(novaComposition, novaPage, () => {
      novaComposition.dataset.revealReady = 'true';
      onCoverReady();
    });
  };

  applyNovaStage();

  window.addEventListener('scroll', () => {
    if (novaAligning && Math.abs(novaCenterOffset()) <= 8) novaAligning = false;
  }, { passive: true });
}

// Page 08 uses its existing Figma leaf layers. The Figma background remains
// untouched; only verified foreground nodes are revealed during the same
// centre-hold wheel sequence as the NOVA cover.
const lumenPage = document.querySelector('#page-8');
const lumenComposition = lumenPage?.querySelector('.figma-lumen');
if (lumenPage && lumenComposition && !reduceMotion && !usePinnedReveal) {
  let lumenStage = 0;
  let lumenWheelLock = false;
  let lumenAligning = false;
  let lumenReadyTimer = 0;
  const lumenCenterOffset = () => {
    const bounds = lumenPage.getBoundingClientRect();
    return bounds.top + bounds.height / 2 - window.innerHeight / 2;
  };
  const lumenIsNearReadingZone = () => {
    const bounds = lumenPage.getBoundingClientRect();
    const centre = bounds.top + bounds.height / 2;
    // Keep the centre capture generous enough to catch a trackpad's next
    // momentum step, while still requiring the user to bring the cover close
    // to the reading position themselves.
    return Math.abs(centre - window.innerHeight / 2) <= Math.max(180, bounds.height * .28);
  };
  const lumenCanSettleAtReadingZone = () => {
    const bounds = lumenPage.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > window.innerHeight / 2;
  };
  const applyLumenStage = () => {
    lumenComposition.classList.add('lumen-scroll-pending');
    lumenComposition.dataset.revealStage = lumenStage;
    for (let stage = 1; stage <= 4; stage += 1) lumenComposition.classList.toggle(`lumen-stage-${stage}`, lumenStage >= stage);
    playCoverInteractionPreview(lumenComposition, lumenStage);
  };
  setLumenStage = (stage) => {
    lumenStage = Math.max(0, Math.min(4, stage));
    lumenComposition.dataset.revealReady = 'false';
    lumenPage.classList.remove('chapter-ready', 'chapter-handoff', 'chapter-complete');
    window.clearTimeout(lumenReadyTimer);
    applyLumenStage();
    if (lumenStage === 4) armCoverReady(lumenComposition, lumenPage, () => {
      lumenComposition.dataset.revealReady = 'true';
      onCoverReady();
    });
  };

  applyLumenStage();

  window.addEventListener('scroll', () => {
    if (lumenAligning && Math.abs(lumenCenterOffset()) <= 8) lumenAligning = false;
  }, { passive: true });
}

const jinxiangPage = document.querySelector('#page-13');
const jinxiangComposition = jinxiangPage?.querySelector('.figma-jinxiang');
if (jinxiangPage && jinxiangComposition && !reduceMotion && !usePinnedReveal) {
  let jinxiangStage = 0;
  let jinxiangWheelLock = false;
  let jinxiangAligning = false;
  let jinxiangReadyTimer = 0;
  const jinxiangCenterOffset = () => {
    const bounds = jinxiangPage.getBoundingClientRect();
    return bounds.top + bounds.height / 2 - window.innerHeight / 2;
  };
  const jinxiangIsNearReadingZone = () => {
    const bounds = jinxiangPage.getBoundingClientRect();
    return Math.abs(bounds.top + bounds.height / 2 - window.innerHeight / 2) <= Math.max(180, bounds.height * .28);
  };
  const applyJinxiangStage = () => {
    jinxiangComposition.classList.add('jinxiang-scroll-pending');
    jinxiangComposition.dataset.revealStage = jinxiangStage;
    for (let stage = 1; stage <= 4; stage += 1) jinxiangComposition.classList.toggle(`jinxiang-stage-${stage}`, jinxiangStage >= stage);
    playCoverInteractionPreview(jinxiangComposition, jinxiangStage);
  };
  setJinxiangStage = (stage) => {
    jinxiangStage = Math.max(0, Math.min(4, stage));
    jinxiangComposition.dataset.revealReady = 'false';
    jinxiangPage.classList.remove('chapter-ready', 'chapter-handoff', 'chapter-complete');
    window.clearTimeout(jinxiangReadyTimer);
    applyJinxiangStage();
    if (jinxiangStage === 4) armCoverReady(jinxiangComposition, jinxiangPage, () => {
      jinxiangComposition.dataset.revealReady = 'true';
      onCoverReady();
    });
  };
  applyJinxiangStage();
  window.addEventListener('scroll', () => { if (jinxiangAligning && Math.abs(jinxiangCenterOffset()) <= 8) jinxiangAligning = false; }, { passive: true });
}

const tigerPage = document.querySelector('#page-18');
const tigerComposition = tigerPage?.querySelector('.figma-tiger');
if (tigerPage && tigerComposition && !reduceMotion && !usePinnedReveal) {
  let tigerStage = 0;
  let tigerWheelLock = false;
  let tigerAligning = false;
  let tigerReadyTimer = 0;
  const tigerCenterOffset = () => {
    const bounds = tigerPage.getBoundingClientRect();
    return bounds.top + bounds.height / 2 - window.innerHeight / 2;
  };
  const tigerIsNearReadingZone = () => {
    const bounds = tigerPage.getBoundingClientRect();
    return Math.abs(bounds.top + bounds.height / 2 - window.innerHeight / 2) <= Math.max(180, bounds.height * .28);
  };
  const applyTigerStage = () => {
    tigerComposition.classList.add('tiger-scroll-pending');
    tigerComposition.dataset.revealStage = tigerStage;
    for (let stage = 1; stage <= 4; stage += 1) tigerComposition.classList.toggle(`tiger-stage-${stage}`, tigerStage >= stage);
    playCoverInteractionPreview(tigerComposition, tigerStage);
  };
  setTigerStage = (stage) => {
    tigerStage = Math.max(0, Math.min(4, stage));
    tigerComposition.dataset.revealReady = 'false';
    tigerPage.classList.remove('chapter-ready', 'chapter-handoff', 'chapter-complete');
    window.clearTimeout(tigerReadyTimer);
    applyTigerStage();
    if (tigerStage === 4) armCoverReady(tigerComposition, tigerPage, () => {
      tigerComposition.dataset.revealReady = 'true';
      onCoverReady();
    });
  };
  applyTigerStage();
  window.addEventListener('scroll', () => { if (tigerAligning && Math.abs(tigerCenterOffset()) <= 8) tigerAligning = false; }, { passive: true });
}

const otherWorksPage = document.querySelector('#page-23');
const otherWorksComposition = otherWorksPage?.querySelector('.figma-other-works');
if (otherWorksPage && otherWorksComposition && !reduceMotion && !usePinnedReveal) {
  let otherWorksStage = 0;
  let otherWorksWheelLock = false;
  let otherWorksAligning = false;
  let otherWorksReadyTimer = 0;
  const otherWorksCenterOffset = () => {
    const bounds = otherWorksPage.getBoundingClientRect();
    return bounds.top + bounds.height / 2 - window.innerHeight / 2;
  };
  const otherWorksIsNearReadingZone = () => {
    const bounds = otherWorksPage.getBoundingClientRect();
    return Math.abs(bounds.top + bounds.height / 2 - window.innerHeight / 2) <= Math.max(180, bounds.height * .28);
  };
  const applyOtherWorksStage = () => {
    otherWorksComposition.classList.add('other-scroll-pending');
    otherWorksComposition.dataset.revealStage = otherWorksStage;
    for (let stage = 1; stage <= 4; stage += 1) otherWorksComposition.classList.toggle(`other-stage-${stage}`, otherWorksStage >= stage);
    playCoverInteractionPreview(otherWorksComposition, otherWorksStage);
  };
  setOtherWorksStage = (stage) => {
    otherWorksStage = Math.max(0, Math.min(4, stage));
    otherWorksComposition.dataset.revealReady = 'false';
    otherWorksPage.classList.remove('chapter-ready', 'chapter-handoff', 'chapter-complete');
    window.clearTimeout(otherWorksReadyTimer);
    applyOtherWorksStage();
    if (otherWorksStage === 4) armCoverReady(otherWorksComposition, otherWorksPage, () => {
      otherWorksComposition.dataset.revealReady = 'true';
      onCoverReady();
    });
  };
  applyOtherWorksStage();
  window.addEventListener('scroll', () => { if (otherWorksAligning && Math.abs(otherWorksCenterOffset()) <= 8) otherWorksAligning = false; }, { passive: true });
}

// Ordered staged pages. Their Figma compositions remain untouched; this list
// owns only the document-level reading-stop state.
const scrollStageLocks = [
  ['#page-2', '.figma-directory-2x', 9, (stage) => setDirectoryStage(stage)],
  ['#page-3', '.figma-nova', 4, (stage) => setNovaStage(stage)],
  ['#page-8', '.figma-lumen', 4, (stage) => setLumenStage(stage)],
  ['#page-13', '.figma-jinxiang', 4, (stage) => setJinxiangStage(stage)],
  ['#page-18', '.figma-tiger', 4, (stage) => setTigerStage(stage)],
  ['#page-23', '.figma-other-works', 4, (stage) => setOtherWorksStage(stage)],
].map(([pageSelector, compositionSelector, total, apply]) => ({
  page: document.querySelector(pageSelector),
  composition: document.querySelector(compositionSelector),
  total,
  apply,
})).filter(({ page, composition }) => page && composition);

if (!reduceMotion && !usePinnedReveal) {
  // Page position, rather than wheel distance, owns the reading stop. Native
  // sticky keeps a staged page at its reading position; wheel input only
  // progresses a page that is already there.
  const wheelState = new WeakMap();
  const handoffTimers = new WeakMap();
  const handoffRuns = new WeakMap();
  const returnTimers = new WeakMap();
  // Physical scroll lock: while an unfinished staged page sits at the reading
  // centre, the document scroller itself is locked. Wheel preventDefault is
  // the primary gate; this second gate stops input the browser handles at the
  // compositor level (fast wheel bursts, trackpad momentum, app webviews)
  // before the page listener ever runs.
  const scrollLockTarget = document.scrollingElement || document.documentElement;
  let scrollLockActive = false;
  let lockPage = null;
  const applyScrollLock = () => {
    if (!scrollLockActive) {
      scrollLockActive = true;
      scrollLockTarget.style.overflow = 'hidden';
    }
  };
  const releaseScrollLock = () => {
    if (scrollLockActive) {
      scrollLockActive = false;
      scrollLockTarget.style.overflow = '';
    }
  };
  const syncScrollLock = (lockStates, direction) => {
    // Release when the held page completed or its frame clearly left the
    // reading zone, so a settling frame can never keep the lock stuck.
    if (lockPage) {
      const held = lockStates.find((state) => state.lock.page === lockPage);
      if (!held || !held.isUnfinished || Math.abs(held.frameOffset) > 120) {
        lockPage = null;
        releaseScrollLock();
      }
    }
    const unfinishedAtCentre = lockStates.find((state) => state.isUnfinished && state.isAtReadingCentre);
    // Deliberately wheeling up from an unfinished stage-0 cover leaves the
    // reading zone: open the physical lock so the page can scroll up.
    if (direction < 0 && unfinishedAtCentre && unfinishedAtCentre.stage === 0) {
      lockPage = null;
      releaseScrollLock();
      return;
    }
    if (unfinishedAtCentre) {
      lockPage = unfinishedAtCentre.lock.page;
      applyScrollLock();
    }
  };
  onCoverReady = () => {
    lockPage = null;
    releaseScrollLock();
  };
  const readLockState = (lock) => {
    const frameBounds = lock.composition.getBoundingClientRect();
    const pageBounds = lock.page.getBoundingClientRect();
    // The generic page-entry transform (translateY 24px -> 0) shifts the
    // frame visually while it settles. Subtract it so the reading gate sees
    // the true layout centre and a cover locks exactly at the middle.
    const inner = lock.page.querySelector(':scope > .page-inner');
    const innerTransform = inner ? getComputedStyle(inner).transform : 'none';
    let entryShift = 0;
    if (innerTransform && innerTransform !== 'none') {
      if (innerTransform.startsWith('matrix3d')) {
        entryShift = Number.parseFloat(innerTransform.slice(8, -1).split(',')[13] || '0') || 0;
      } else {
        entryShift = Number.parseFloat(innerTransform.slice(7, -1).split(',')[5] || '0') || 0;
      }
    }
    const frameOffset = frameBounds.top + frameBounds.height / 2 - entryShift - window.innerHeight / 2;
    const stage = Number(lock.composition.dataset.revealStage || 0);
    const revealReady = lock.composition.dataset.revealReady === 'true';
    return {
      lock,
      frameOffset,
      // The native sticky pin holds the frame at the exact reading centre;
      // only that pinned position consumes input, so the cover stops at the
      // middle rather than somewhere in a wide tolerance band.
      isAtReadingCentre: Math.abs(frameOffset) <= 10,
      isActive: pageBounds.top < window.innerHeight && pageBounds.bottom > 0,
      stage,
      revealReady,
      isUnfinished: stage < lock.total || !revealReady,
      isHandoffRunning: lock.page.classList.contains('chapter-handoff') || lock.page.classList.contains('chapter-returning'),
    };
  };
  const consumeWheel = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  const advanceStage = (state, direction) => {
    const { lock, stage } = state;
    const wheelLock = wheelState.get(lock.page) || { locked: false };
    if (wheelLock.locked) return;
    if (direction > 0 && stage < lock.total) lock.apply(stage + 1);
    if (direction < 0 && stage > 0) lock.apply(stage - 1);
    wheelLock.locked = true;
    wheelState.set(lock.page, wheelLock);
    window.setTimeout(() => { wheelLock.locked = false; }, 220);
  };
  const beginCoverHandoff = (lock) => {
    const handoffDuration = 900;
    handoffRuns.get(lock.page)?.cancel();
    lock.composition.dataset.revealReady = 'false';
    lock.page.classList.remove('chapter-ready', 'chapter-complete');
    lock.page.classList.add('chapter-handoff');
    window.clearTimeout(handoffTimers.get(lock.page));
    // Compositor handoff: keep the reserve in place while the next page
    // glides up by the collapse distance via transform, then collapse the
    // reserve and reset the transform in the same frame. This avoids the
    // layout reflow jank of animating `::after` height every frame.
    const nextPage = document.querySelector(`#page-${Number(lock.page.dataset.page) + 1}`);
    const reserveHeight = Number.parseFloat(getComputedStyle(lock.page, '::after').height);
    const pageHeight = lock.page.getBoundingClientRect().height;
    const pageMinHeight = Number.parseFloat(getComputedStyle(lock.page).minHeight) || 0;
    // The reserve is the layout difference between the page's current height
    // and its minimum handoff height, not the raw 120vh: margins and min-height
    // make those differ, and using the wrong value causes a visible jump when
    // the reserve collapses and the lift resets.
    const liftDistance = Math.max(0, Math.min(
      Number.isFinite(reserveHeight) && reserveHeight > 0 ? reserveHeight : window.innerHeight * 1.2,
      pageHeight - pageMinHeight
    ));
    let finished = false;
    let fallbackTimer = 0;
    const cleanupLift = () => {
      if (!nextPage) return;
      nextPage.style.transition = 'none';
      nextPage.style.transform = '';
      nextPage.style.willChange = '';
    };
    const finishHandoff = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(fallbackTimer);
      nextPage?.removeEventListener('transitionend', onLiftEnd);
      lock.page.classList.remove('chapter-handoff');
      lock.page.classList.add('chapter-complete');
      lock.composition.dataset.revealReady = 'true';
      // Collapsing the reserve (layout) and resetting the lift (transform)
      // in one frame cancel out, so the next page never jumps.
      cleanupLift();
    };
    const onLiftEnd = (event) => {
      if (event.target === nextPage && event.propertyName === 'transform') finishHandoff();
    };
    const run = {
      cancel: () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(fallbackTimer);
        nextPage?.removeEventListener('transitionend', onLiftEnd);
        cleanupLift();
      },
    };
    handoffRuns.set(lock.page, run);

    if (nextPage && liftDistance > 0) {
      nextPage.style.transition = 'transform .9s cubic-bezier(.4, 0, .2, 1)';
      nextPage.style.willChange = 'transform';
      nextPage.style.transform = `translateY(${-liftDistance}px)`;
      nextPage.addEventListener('transitionend', onLiftEnd);
    }
    fallbackTimer = window.setTimeout(finishHandoff, handoffDuration + 220);
    handoffTimers.set(lock.page, fallbackTimer);
  };
  const beginCoverReturn = (state) => {
    const { lock } = state;
    const returnDuration = 1900;
    lock.composition.dataset.revealReady = 'false';
    lock.page.classList.remove('chapter-ready', 'chapter-complete');
    lock.page.classList.add('chapter-returning');
    advanceStage(state, -1);
    window.clearTimeout(returnTimers.get(lock.page));
    returnTimers.set(lock.page, window.setTimeout(() => {
      lock.page.classList.remove('chapter-returning');
    }, returnDuration));
  };
  window.addEventListener('wheel', (event) => {
    const wheelDistance = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? event.deltaY * 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? event.deltaY * window.innerHeight
        : event.deltaY;
    const direction = Math.sign(wheelDistance);
    if (!direction) return;

    // IntersectionObserver updates asynchronously, so its nearby set can
    // briefly omit the page that a fast gesture has just brought to centre.
    // Read every controlled page synchronously and let actual geometry choose
    // the active lock; no wheel distance or velocity is used here.
    const lockStates = scrollStageLocks.map(readLockState);
    // Keep the physical lock engaged while an unfinished page is at the
    // centre. Completion (onCoverReady) or a deliberate up-wheel from stage 0
    // unlocks; a settling frame never flaps the lock.
    syncScrollLock(lockStates, direction);
    // During the cover-to-content handoff the reserve height is intentionally
    // contracting, so its frame can briefly leave the centre band. Keep the
    // input consumed by the active handoff state instead of letting a fast
    // wheel step leak through to the following page.
    // A completed cover hands off without locking input: the reserve shrinks
    // behind the scroll, so the visitor is released as soon as the animation
    // has settled. Only an active upward return still consumes input.
    const returningState = lockStates.find((state) => state.lock.page.classList.contains('chapter-returning'));
    if (returningState) {
      consumeWheel(event);
      return;
    }
    // Fast-input safety net: a single wheel step can carry an unfinished cover
    // past its reading centre and beyond the sticky hold before the position
    // gate observes the new position. Consume only that overshooting step; it
    // is not spent on a reveal stage, so the cover animation is never skipped.
    const stickyTop = window.innerHeight / 2 - window.innerWidth * 0.176628;
    const overshootCover = lockStates
      .filter((state) => {
        if (!state.isUnfinished || state.frameOffset <= 10 || wheelDistance <= 0) return false;
        const frameBounds = state.lock.composition.getBoundingClientRect();
        const pageHeight = state.lock.page.getBoundingClientRect().height;
        const pinOffset = stickyTop + frameBounds.height / 2 - window.innerHeight / 2;
        const stickyHold = pageHeight - frameBounds.height - stickyTop;
        return wheelDistance > (state.frameOffset - pinOffset) + stickyHold;
      })
      .sort((a, b) => a.frameOffset - b.frameOffset)[0];
    if (overshootCover) {
      consumeWheel(event);
      return;
    }
    const centredState = lockStates
      .filter((state) => state.isActive && state.isAtReadingCentre)
      .sort((a, b) => Math.abs(a.frameOffset) - Math.abs(b.frameOffset))[0];

    // The page already at the reading position always wins over a later cover.
    // This prevents a large wheel gesture from starting a later chapter before
    // the currently centred chapter has finished its own stages or handoff.
    if (centredState) {
      const { lock, stage, revealReady, isUnfinished, isHandoffRunning } = centredState;
      // A finished cover keeps its reading reserve until the visitor actually
      // scrolls, so the following content page is revealed by scrolling rather
      // than popping in when the cover animation completes. Collapsing the
      // reserve here starts exactly at the release wheel; the event itself is
      // not consumed, so the scroll brings the content up.
      if (direction > 0 && !isUnfinished && !lock.page.classList.contains('chapter-complete') && lock.page.dataset.page !== '2') {
        lock.page.classList.add('chapter-complete');
        return;
      }
      if (direction < 0 && stage > 0 && lock.page.classList.contains('chapter-complete') && lock.page.dataset.page !== '2') {
        consumeWheel(event);
        beginCoverReturn(centredState);
        return;
      }
      if ((direction > 0 && isUnfinished && !isHandoffRunning) || (direction < 0 && stage > 0 && !isHandoffRunning)) {
        consumeWheel(event);
        advanceStage(centredState, direction);
        return;
      }
    }

  }, { capture: true, passive: false });

  // Safety net for input that scrolls without a wheel event (scrollbar drag,
  // compositor prediction landing the frame at the centre): re-sync the
  // physical lock from the live geometry on every scroll.
  let scrollSyncQueued = false;
  window.addEventListener('scroll', () => {
    if (scrollSyncQueued) return;
    scrollSyncQueued = true;
    requestAnimationFrame(() => {
      scrollSyncQueued = false;
      syncScrollLock(scrollStageLocks.map(readLockState), 0);
    });
  }, { passive: true });
}

// Keep any future verified static covers centred without changing their
// Figma artwork. The current five project covers are layer-built.
const currentObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) setCurrentPage(Number(entry.target.dataset.page));
  });
}, { threshold: .52 });
pageElements.forEach((page) => currentObserver.observe(page));

function closeMenu() {
  menu.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
links.forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  event.preventDefault();
  const current = Number(currentPage.textContent.slice(0, 2));
  const next = Math.min(28, Math.max(1, current + (event.key === 'ArrowDown' ? 1 : -1)));
  document.querySelector(`#page-${next}`).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
});

const latestPointerPosition = { x: -10000, y: -10000, valid: false };
window.addEventListener('pointermove', (event) => {
  latestPointerPosition.x = event.clientX;
  latestPointerPosition.y = event.clientY;
  latestPointerPosition.valid = true;
}, { passive: true });

function setupParticles(zone) {
  const canvas = zone.querySelector('canvas');
  const context = canvas.getContext('2d');
  const particles = [];
  const bursts = [];
  const pointer = { x: -100, y: -100, active: false };
  const isCursorParticleField = zone.dataset.particleRole === 'cursor';
  const isBoundaryParticleField = zone.dataset.particles === '1' || zone.dataset.particles === '2';
  // Page 01 and Page 02 retain their own original masked canvases, but the
  // interaction surface is the complete original Figma page. This prevents a
  // directory module appearing below the 42% mask from cancelling the mask's
  // pointer response merely because the cursor left the canvas bounds.
  const usesHostSurface = isCursorParticleField || isBoundaryParticleField;
  const interactionSurface = usesHostSurface
    ? zone.closest('.figma-cover, .figma-directory-2x, .page-inner')
    : zone;
    const density = isCursorParticleField
      ? Math.min(1800, Math.max(1050, Math.floor(window.innerWidth * .82)))
      : Math.min(isBoundaryParticleField ? 3000 : 1800, Math.max(isBoundaryParticleField ? 1500 : 900, Math.floor(window.innerWidth * (isBoundaryParticleField ? 1.55 : .95))));
  let bounds = { height: 0, left: 0, top: 0, width: 0 };
  let frameId = 0;
  let isVisible = false;
  let wakeUntil = 0;

  function scheduleDraw() {
    if (isVisible && !frameId && !document.hidden) frameId = requestAnimationFrame(draw);
  }

  function isOnScreen() {
    const nextBounds = zone.getBoundingClientRect();
    return nextBounds.bottom > 0 && nextBounds.top < window.innerHeight && nextBounds.right > 0 && nextBounds.left < window.innerWidth;
  }

  function isPinnedCoverMask() {
    return zone.dataset.particles === '1'
      && zone.closest('.page[data-page="1"]')?.classList.contains('cover-directory-pinned');
  }

  function isDirectoryMaskLoading() {
    return zone.dataset.particles === '2'
      && zone.closest('.figma-directory-2x')?.classList.contains('directory-scroll-pending');
  }

  function wake(duration = 760) {
    wakeUntil = Math.max(wakeUntil, performance.now() + duration);
    scheduleDraw();
  }

  function refreshPointerBounds() {
    const nextBounds = zone.getBoundingClientRect();
    if (!nextBounds.width || !nextBounds.height) return false;
    const sizeChanged = Math.abs(nextBounds.width - bounds.width) > .5
      || Math.abs(nextBounds.height - bounds.height) > .5;
    if (sizeChanged) {
      resize();
    } else {
      // Scroll changes a canvas's viewport coordinates without triggering a
      // ResizeObserver. Pointer positions must always use the current frame.
      bounds = nextBounds;
    }
    return true;
  }

  function updatePointerPosition(event) {
    if (!refreshPointerBounds()) return false;
    if (usesHostSurface) {
      const surfaceBounds = interactionSurface.getBoundingClientRect();
      const insideSurface = event.clientX >= surfaceBounds.left
        && event.clientX <= surfaceBounds.right
        && event.clientY >= surfaceBounds.top
        && event.clientY <= surfaceBounds.bottom;
      if (!insideSurface || !surfaceBounds.width || !surfaceBounds.height) return false;
      // The page host keeps the mask active while content is revealing, but
      // the visual itself must retain its real screen coordinates. Compressing
      // the full page into the 42% mask shifts every particle far above the
      // pointer, so render from the canvas bounds exactly.
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      return true;
    }
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    return true;
  }

  function wakeFromLatestPointer(duration = 1200) {
    // During the Page 01 → Page 02 bridge, the cover is rendered from a
    // fixed descendant while its normal-flow page has moved away. The
    // observer can therefore report the mask as off-screen even though it is
    // visibly pinned above the directory. Keep only that original cover mask
    // live until the bridge releases it.
    if (!isVisible && (isOnScreen() || isPinnedCoverMask() || isDirectoryMaskLoading())) {
      isVisible = true;
      resize();
    }
    refreshPointerBounds();
    if (latestPointerPosition.valid) move(latestPointerPosition);
    wake(duration);
  }

  function resize() {
    bounds = zone.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = bounds.width * ratio;
    canvas.height = bounds.height * ratio;
    canvas.style.width = `${bounds.width}px`;
    canvas.style.height = `${bounds.height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles.length = 0;
    for (let index = 0; index < density; index += 1) {
      const fade = Math.pow(Math.random(), 1.35);
      const y = Math.random() * bounds.height;
      const fieldPosition = zone.dataset.particles === '2' ? 1 - y / bounds.height : y / bounds.height;
      const lowerDensity = .22 + .78 * Math.pow(fieldPosition, 1.55);
      const intensity = isCursorParticleField ? 1.45 : (isBoundaryParticleField ? 2.9 : 1);
      const size = isCursorParticleField ? Math.random() * .92 + .2 : (isBoundaryParticleField ? Math.random() * 1.18 + .26 : Math.random() * .78 + .16);
      particles.push({ x: Math.random() * bounds.width, y, vx: (Math.random() - .5) * .018, vy: (Math.random() - .5) * .018, size, alpha: Math.min(.72, (fade * .2 + .018) * lowerDensity * intensity) });
    }
  }
  function move(event) {
    if (!updatePointerPosition(event)) return;
    pointer.active = true;
    for (let index = 0; index < 24; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * .95 + .16;
      bursts.push({ x: pointer.x, y: pointer.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, size: Math.random() * 1.1 + .22 });
    }
    if (bursts.length > 900) bursts.splice(0, bursts.length - 900);
  }
  function draw(now) {
    frameId = 0;
    if (!isVisible || !bounds.width || !bounds.height) return;
    context.clearRect(0, 0, bounds.width, bounds.height);
    particles.forEach((particle) => {
      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance < 260) {
          const force = (260 - distance) / 260;
          particle.vx += (dx / distance) * force * .022;
          particle.vy += (dy / distance) * force * .022;
        }
      }
      particle.vx *= .985;
      particle.vy *= .985;
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -8) particle.x = bounds.width + 8;
      if (particle.x > bounds.width + 8) particle.x = -8;
      if (particle.y < -8) particle.y = bounds.height + 8;
      if (particle.y > bounds.height + 8) particle.y = -8;
      context.beginPath();
      context.fillStyle = `rgba(195,201,202,${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
    for (let index = bursts.length - 1; index >= 0; index -= 1) {
      const burst = bursts[index];
      burst.x += burst.vx;
      burst.y += burst.vy;
      burst.vx *= .975;
      burst.vy *= .975;
      burst.life -= .018;
      if (burst.life <= 0) { bursts.splice(index, 1); continue; }
      context.beginPath();
      context.fillStyle = `rgba(195,201,202,${burst.life * .68})`;
      context.arc(burst.x, burst.y, burst.size * (1.15 - burst.life * .25), 0, Math.PI * 2);
      context.fill();
    }
    // A static particle field does not need a permanent animation loop. It is
    // redrawn immediately while the pointer interaction settles, then sleeps
    // until the next pointer gesture or resize.
    if (bursts.length || now < wakeUntil) scheduleDraw();
  }
  const handlePointerMove = (event) => {
    if (!isVisible && isOnScreen()) {
      isVisible = true;
      resize();
    }
    move(event);
    wake();
  };
  (isCursorParticleField ? window : interactionSurface).addEventListener('pointermove', handlePointerMove, { passive: true });
  if (!isCursorParticleField) interactionSurface.addEventListener('pointerenter', (event) => { move(event); wake(1200); });
  if (!isCursorParticleField) interactionSurface.addEventListener('pointerleave', () => {
    pointer.active = false;
    pointer.x = -100;
    pointer.y = -100;
    // A constrained visual mask must not leave an old cursor burst visible
    // after the cursor has moved outside it; that reads as a false position.
    bursts.length = 0;
    wake(80);
  });
  zone.addEventListener('particlewake', (event) => {
    wakeFromLatestPointer(event.detail?.duration || 1200);
  });
  new ResizeObserver(resize).observe(zone);
  new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting || isPinnedCoverMask() || isDirectoryMaskLoading();
    if (!isVisible && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      return;
    }
    if (isVisible) {
      resize();
      wakeUntil = performance.now();
      scheduleDraw();
    }
  }, { threshold: 0 }).observe(zone);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    } else if (!document.hidden) scheduleDraw();
  });
  resize();
}

function setupCursorParticles(zone) {
  const canvas = zone.querySelector('canvas');
  const context = canvas?.getContext('2d');
  const host = zone.closest('.figma-cover, .figma-directory-2x');
  if (!canvas || !context || !host) return;

  const particles = [];
  const bursts = [];
  const pointer = { active: false, lastMoveAt: -Infinity, x: -1000, y: -1000 };
  let bounds = { height: 0, left: 0, top: 0, width: 0 };
  let frameId = 0;
  let isVisible = false;

  function resize() {
    bounds = zone.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * ratio);
    canvas.height = Math.round(bounds.height * ratio);
    canvas.style.width = `${bounds.width}px`;
    canvas.style.height = `${bounds.height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles.length = 0;
    const density = Math.min(1500, Math.max(850, Math.round(bounds.width * 1.05)));
    for (let index = 0; index < density; index += 1) {
      const x = Math.random() * bounds.width;
      const y = Math.random() * bounds.height;
      const prominence = Math.pow(Math.random(), 1.8);
      particles.push({
        x,
        y,
        homeX: x,
        homeY: y,
        vx: 0,
        vy: 0,
        size: .22 + prominence * .78,
        alpha: .035 + prominence * .16,
      });
    }
  }

  function scheduleDraw() {
    if (isVisible && !frameId && !document.hidden) frameId = requestAnimationFrame(draw);
  }

  function draw(now) {
    frameId = 0;
    if (!isVisible || !bounds.width || !bounds.height) return;
    context.clearRect(0, 0, bounds.width, bounds.height);
    const isRepelling = pointer.active && now - pointer.lastMoveAt < 260;
    let maxSpeed = 0;
    particles.forEach((particle) => {
      particle.vx += (particle.homeX - particle.x) * .0009;
      particle.vy += (particle.homeY - particle.y) * .0009;
      if (isRepelling) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        const radius = 178;
        if (distance < radius) {
          const force = Math.pow((radius - distance) / radius, 1.45);
          particle.vx += (dx / distance) * force * .55;
          particle.vy += (dy / distance) * force * .55;
        }
      }
      particle.vx *= .9;
      particle.vy *= .9;
      particle.x += particle.vx;
      particle.y += particle.vy;
      maxSpeed = Math.max(maxSpeed, Math.abs(particle.vx) + Math.abs(particle.vy));
      context.beginPath();
      context.fillStyle = `rgba(195,201,202,${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
    for (let index = bursts.length - 1; index >= 0; index -= 1) {
      const burst = bursts[index];
      burst.x += burst.vx;
      burst.y += burst.vy;
      burst.vx *= .94;
      burst.vy *= .94;
      burst.life -= .04;
      if (burst.life <= 0) { bursts.splice(index, 1); continue; }
      context.beginPath();
      context.fillStyle = `rgba(201,207,209,${burst.life * .34})`;
      context.arc(burst.x, burst.y, burst.size, 0, Math.PI * 2);
      context.fill();
    }
    if (isRepelling || bursts.length || maxSpeed > .008) scheduleDraw();
  }

  function updatePointer(event) {
    const hostBounds = host.getBoundingClientRect();
    const insideHost = event.clientX >= hostBounds.left && event.clientX <= hostBounds.right
      && event.clientY >= hostBounds.top && event.clientY <= hostBounds.bottom;
    if (!insideHost) {
      pointer.active = false;
      return;
    }
    const nextBounds = zone.getBoundingClientRect();
    if (Math.abs(nextBounds.width - bounds.width) > .5 || Math.abs(nextBounds.height - bounds.height) > .5) resize();
    else bounds = nextBounds;
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
    pointer.lastMoveAt = performance.now();
    for (let index = 0; index < 16; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * .6 + .1;
      bursts.push({ x: pointer.x, y: pointer.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, size: Math.random() * .8 + .18 });
    }
    if (bursts.length > 380) bursts.splice(0, bursts.length - 380);
    scheduleDraw();
  }

  window.addEventListener('pointermove', updatePointer, { passive: true });
  new ResizeObserver(() => { resize(); scheduleDraw(); }).observe(zone);
  new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible) { resize(); scheduleDraw(); }
    else if (frameId) { cancelAnimationFrame(frameId); frameId = 0; }
  }, { threshold: 0 }).observe(zone);
  resize();
}

function setupSiteBackgroundParticles(canvas) {
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const particles = [];
  const pointer = { active: false, lastMoveAt: -Infinity, x: -1000, y: -1000 };
  let width = 0;
  let height = 0;
  let frameId = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles.length = 0;

    const density = Math.min(1800, Math.max(900, Math.round((width * height) / 900)));
    for (let index = 0; index < density; index += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const prominence = Math.pow(Math.random(), 1.9);
      particles.push({
        x,
        y,
        homeX: x,
        homeY: y,
        vx: 0,
        vy: 0,
        size: .28 + prominence * 1.15,
        alpha: .16 + prominence * .52,
      });
    }
  }

  function wakeBackgroundParticles() {
    if (!frameId && !document.hidden) frameId = requestAnimationFrame(draw);
  }

  function draw(now) {
    frameId = 0;
    context.clearRect(0, 0, width, height);
    const isRepelling = pointer.active && now - pointer.lastMoveAt < 420;
    let maxSpeed = 0;
    particles.forEach((particle) => {
      const homeX = particle.homeX - particle.x;
      const homeY = particle.homeY - particle.y;
      particle.vx += homeX * .00075;
      particle.vy += homeY * .00075;

      if (isRepelling) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        const radius = 168;
        if (distance < radius) {
          const force = Math.pow((radius - distance) / radius, 1.55);
          particle.vx += (dx / distance) * force * .72;
          particle.vy += (dy / distance) * force * .72;
        }
      }

      particle.vx *= .91;
      particle.vy *= .91;
      particle.x += particle.vx;
      particle.y += particle.vy;
      maxSpeed = Math.max(maxSpeed, Math.abs(particle.vx) + Math.abs(particle.vy));

      context.beginPath();
      context.fillStyle = `rgba(198, 207, 211, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
    if (isRepelling || maxSpeed > .008) wakeBackgroundParticles();
  }

  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    pointer.lastMoveAt = performance.now();
    wakeBackgroundParticles();
  }, { passive: true });
  window.addEventListener('pointerleave', () => { pointer.active = false; wakeBackgroundParticles(); }, { passive: true });
  window.addEventListener('blur', () => { pointer.active = false; wakeBackgroundParticles(); }, { passive: true });
  window.addEventListener('resize', () => { resize(); wakeBackgroundParticles(); }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
    else wakeBackgroundParticles();
  });

  resize();
  wakeBackgroundParticles();
}

setupSiteBackgroundParticles(document.querySelector('#site-background-particles'));
document.querySelectorAll('.particle-zone').forEach(setupParticles);
