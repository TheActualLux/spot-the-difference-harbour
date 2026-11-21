// Painterly procedural illustrations for Harbor, Twice. Both pictures share one carefully
// composed harbor; only the explicitly-authored detail variants below can change between them.
import { LEVELS as LEVELS_REF } from './levels.js';

const C = {
  sky0: '#263a45', sky1: '#b46f60', glow: '#e7aa77', water0: '#24434a', water1: '#142c35',
  ridge: '#30444a', ridge2: '#3c4d4d', ink: '#172a30', inkSoft: '#264047', stone: '#718078',
  stoneLight: '#97a18d', cream: '#f0d4a0', gold: '#edc77f', light: '#ffe2a0', roof: '#684f49',
  plaster: '#b88c6c', plaster2: '#d2aa7e', window: '#f0bd76', windowDark: '#2c4145',
  sail: '#e7d2aa', sailShade: '#c8b18d', hull: '#563d38', hullHi: '#85584a', red: '#b86c58',
  redLight: '#d58a68', rope: '#c7a979', green: '#738878', seaLine: '#77908a', foam: '#b4b9a0',
};

function path(ctx, points, fill, stroke = null, width = 1) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function line(ctx, points, color, width = 1, cap = 'round') {
  ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = cap; ctx.lineJoin = 'round'; ctx.stroke();
}
function ellipse(ctx, x, y, rx, ry, fill, rotation = 0) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}
function circle(ctx, x, y, radius, fill) {
  ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}

function skyAndSea(ctx, level, variant) {
  const g = ctx.createLinearGradient(0, 0, 0, 440);
  g.addColorStop(0, level === 1 ? '#273d4c' : level === 2 ? '#35404a' : '#344b55');
  g.addColorStop(.48, level === 1 ? '#cb8068' : level === 2 ? '#b96f5e' : '#d39972');
  g.addColorStop(1, level === 1 ? '#6e6258' : level === 2 ? '#725d56' : '#8a6958');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 720, 440);
  const glow = ctx.createRadialGradient(520, 150, 4, 520, 150, 170);
  glow.addColorStop(0, level === 2 ? '#f5cd88aa' : '#f5c98788'); glow.addColorStop(1, '#f5c98700');
  ctx.fillStyle = glow; ctx.fillRect(320, 0, 400, 330);

  // Fine atmospheric paper grain: deterministic, sparse and quiet, never competing with details.
  let seed = 193 + level * 41;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  ctx.globalAlpha = .12;
  for (let i = 0; i < 130; i++) {
    const x = rand() * 720, y = rand() * 440;
    ctx.fillStyle = rand() > .55 ? '#f3d8ad' : '#142c35';
    ctx.fillRect(x, y, rand() * 1.5 + .4, rand() * 1.2 + .4);
  }
  ctx.globalAlpha = 1;

  // Far headlands and the far bank.
  path(ctx, [[0,190],[40,171],[75,175],[105,154],[136,163],[173,145],[204,159],[237,136],[273,151],[312,143],[350,160],[395,148],[438,160],[475,139],[513,155],[554,146],[588,161],[621,150],[665,167],[720,151],[720,244],[0,244]], '#394c4d');
  path(ctx, [[0,213],[52,195],[95,202],[142,184],[181,200],[228,180],[269,198],[314,183],[351,201],[401,186],[441,199],[488,178],[535,199],[574,187],[621,203],[662,188],[720,204],[720,260],[0,260]], '#283d41');
  // Tiny far-shore lights.
  [[44,201],[90,204],[157,194],[212,199],[267,190],[421,194],[470,190],[551,200],[637,195],[683,201]].forEach(([x,y],i)=>{
    circle(ctx,x,y,1.6,i%3===0?'#f2c982':'#e7aa77');
  });
  const water = ctx.createLinearGradient(0, 227, 0, 440);
  water.addColorStop(0, level === 3 ? '#35555a' : '#2c4b51'); water.addColorStop(1, '#122a33');
  ctx.fillStyle = water; ctx.fillRect(0, 226, 720, 214);
  // Still, horizontal glints with tiny offset variations.
  for (let row = 0; row < 11; row++) {
    const y = 251 + row * 16;
    for (let col = 0; col < 7; col++) {
      const x = (col * 113 + (row % 2) * 37 + 8) % 710;
      const w = 15 + ((row * 17 + col * 11) % 31);
      const color = (row + col + level) % 4 === 0 ? '#d8ad7a' : '#91a89a';
      ctx.globalAlpha = .23 + ((row * 3 + col) % 4) * .045;
      line(ctx, [[x,y],[x+w,y]], color, (row + col) % 3 === 0 ? 1.4 : .8);
    }
  }
  ctx.globalAlpha = 1;
  // Warm vertical glimmer from the sinking sun, broken into separate strokes.
  for (let i = 0; i < 9; i++) {
    const y = 242 + i * 15;
    const width = Math.max(9, 45 - i * 4) + (i % 3) * 5;
    line(ctx, [[518 - width/2 + (i%2)*9,y],[518 + width/2 + (i%2)*9,y]], '#eab679', 1.1);
    ctx.globalAlpha = .35; line(ctx, [[522-width/4,y+3],[522+width/3,y+3]], '#f2d09a', .7); ctx.globalAlpha = 1;
  }
  if (level === 2) {
    // Moon and its cool broken reflection.
    circle(ctx, 584, 70, 19, '#f0d8a2');
    if (variant === 0) { circle(ctx, 591, 65, 17, '#877a72'); }
    else { circle(ctx, 578, 67, 17, '#877a72'); }
    for (let i=0;i<7;i++) line(ctx, [[575-(i%3)*5,245+i*22],[587+(i%4)*6,245+i*22]], '#d3c79c', .8);
  } else if (level === 3) {
    [[541,91],[625,60],[673,116],[392,74],[611,123]].forEach(([x,y],i)=> {
      circle(ctx,x,y,i%2?1.2:1.7,'#f7dfaa');
    });
    if (variant === 0) { circle(ctx,473,53,1.7,'#f8dfa9'); circle(ctx,477,55,1,'#fff0ca'); }
  }
  // Reflected lighthouse line lives at x≈160 in final evening.
  if (level === 3) {
    for (let i=0;i<6;i++) line(ctx, [[152+(i%2)*7,245+i*18],[169-(i%3)*3,245+i*18]], '#efd091', 1.25);
  }
}

function drawLighthouse(ctx, level, variant) {
  // Narrow tapered stone tower, with a tiny lantern house and quiet roof.
  path(ctx, [[76,224],[91,157],[123,157],[140,224]], '#d0b28b', '#786c5a', 1.2);
  path(ctx, [[88,172],[127,172],[123,157],[92,157]], '#e0c69a');
  ctx.fillStyle = '#513f3c'; ctx.fillRect(87, 150, 40, 8);
  path(ctx, [[91,150],[107,138],[124,150]], '#493c3a');
  ctx.fillStyle = '#2c383a'; ctx.fillRect(98, 143, 8, 10); ctx.fillRect(111, 143, 8, 10);
  ctx.fillStyle = '#d79b67'; ctx.fillRect(99, 145, 6, 7); ctx.fillRect(112, 145, 6, 7);
  ctx.fillStyle = '#514542'; ctx.fillRect(102, 129, 3, 9);
  circle(ctx, 104, 128, 2.4, '#e8c17c');
  line(ctx, [[106,126],[121,124]], level === 1 && variant === 1 ? '#f2cb81' : '#efdfa8', 1.3);
  line(ctx, [[106,129],[116,131]], '#e5bc79', .8);
  ctx.fillStyle = '#8c8977'; ctx.fillRect(72, 222, 72, 4);
  line(ctx, [[81,226],[140,226]], '#c1a880', 1);
  // Door and one narrow slit.
  ctx.fillStyle = '#354246'; ctx.fillRect(103, 200, 12, 24);
  ctx.fillStyle = '#d6b17f'; ctx.fillRect(119, 180, 3, 7);
  // Beacon rays, only the orientation changes in last light.
  if (level === 3) {
    const variantAngle = variant === 1 ? .22 : -.23;
    ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = '#f6d18b';
    ctx.beginPath(); ctx.moveTo(107,128); ctx.lineTo(195, 128 + Math.tan(variantAngle)*88); ctx.lineTo(194, 128 + Math.tan(variantAngle)*88 + 13); ctx.closePath(); ctx.fill();
    ctx.restore();
    line(ctx, [[110,128],[175,128 + Math.tan(variantAngle)*65]], '#f3d494', 1.1);
  }
}

function drawCottage(ctx, level, variant) {
  // Quay-side home with crooked roof, chimney and a warm window.
  path(ctx, [[526,204],[531,166],[594,166],[601,204]], '#bd9470', '#594945', 1);
  path(ctx, [[520,170],[557,143],[604,169],[598,175],[557,153],[526,176]], '#684e48', '#493e3b', 1);
  path(ctx, [[533,166],[540,160],[540,150],[548,146],[549,158],[559,151],[568,156],[568,166]], '#72534a');
  ctx.fillStyle = '#514341'; ctx.fillRect(543, 142, 9, 19);
  // Chimney smoke disappears in level two's second view.
  if (!(level === 2 && variant === 1)) {
    ctx.globalAlpha = .22; ellipse(ctx, 548, 134, 5, 3, '#e9c49c', -.35); ellipse(ctx, 554, 126, 4, 2.5, '#e9c49c', .2); ctx.globalAlpha = 1;
  }
  ctx.fillStyle = '#334348'; ctx.fillRect(540, 177, 13, 13); ctx.fillRect(566, 177, 13, 13);
  ctx.fillStyle = '#f2c483'; ctx.fillRect(542, 179, 9, 9); ctx.fillRect(568, 179, 9, 9);
  ctx.fillStyle = '#665247'; ctx.fillRect(546, 178, 1.5, 11); ctx.fillRect(572, 178, 1.5, 11);
  // Blue-hour and Lantern Tide windows go dark; Last Light gains one warm window.
  if (level === 1 && variant === 1) { ctx.fillStyle = '#314147'; ctx.fillRect(569, 178, 8, 11); }
  if (level === 2 && variant === 1) { ctx.fillStyle = '#34434a'; ctx.fillRect(541, 178, 10, 11); }
  if (level === 3) {
    ctx.fillStyle = variant === 1 ? '#efbd75' : '#34434a';
    ctx.fillRect(568, 178, 9, 11);
  }
  ctx.fillStyle = '#5e4a42'; ctx.fillRect(555, 184, 8, 20);
  circle(ctx, 561, 194, 1, '#dfbd7b');
  ctx.fillStyle = '#655249'; ctx.fillRect(520, 203, 87, 5);
}

function drawBoat(ctx, level, variant) {
  // Hull at rest in the little pool between quays.
  path(ctx, [[294,274],[411,274],[397,294],[312,294]], '#503d3a', '#342f31', 1.2);
  path(ctx, [[302,275],[402,275],[392,283],[310,283]], '#91614e');
  line(ctx, [[309,286],[394,286]], '#c18a66', 1.3);
  ctx.fillStyle = '#59443b'; ctx.fillRect(346, 238, 3, 38);
  line(ctx, [[348,239],[348,271],[379,271]], '#d1b58e', 1.5);
  path(ctx, [[345,243],[321,267],[345,267]], C.sail, '#8d8170', .8);
  if (level === 1 && variant === 1) {
    // Shorten the east-facing sail without changing mast or rigging.
    path(ctx, [[351,251],[351,267],[367,267]], C.sailShade, '#897d70', .8);
  } else {
    path(ctx, [[351,244],[351,267],[373,267]], C.sailShade, '#897d70', .8);
  }
  // Level two anchor is a tiny silhouette against the bow.
  if (level === 2 && variant === 0) {
    line(ctx, [[378,274],[378,284],[370,287]], '#ddc18e', 1.7);
    line(ctx, [[370,287],[373,282]], '#ddc18e', 1.7); line(ctx, [[370,287],[366,283]], '#ddc18e', 1.7);
  }
  // The final boat's missing wooden oar.
  if (!(level === 3 && variant === 1)) line(ctx, [[382,264],[401,281]], '#c49a6d', 2.1);
  line(ctx, [[316,295],[380,295]], '#a9b0a0', .8);
}

function drawHarborLife(ctx, level, variant) {
  // Quay edge slopes into the water and follows the painting's strong horizontal structure.
  path(ctx, [[0,294],[206,289],[292,301],[413,294],[490,286],[555,291],[720,280],[720,440],[0,440]], '#29383a', '#53615a', 1.2);
  path(ctx, [[0,300],[205,295],[291,307],[415,300],[490,292],[557,297],[720,286],[720,302],[560,314],[488,307],[416,314],[291,321],[205,309],[0,315]], '#8c8977');
  line(ctx, [[0,305],[205,301],[291,313],[415,306],[490,298],[557,303],[720,292]], '#c0aa84', 1.2);
  // Mooring bollards.
  [[47,299],[241,304],[463,303],[669,296]].forEach(([x,y])=>{
    ctx.fillStyle='#555650'; ctx.fillRect(x-4,y-11,8,12); ctx.fillStyle='#9b927c'; ctx.fillRect(x-7,y-12,14,3);
  });
  drawBoat(ctx, level, variant);

  // Weathered crate(s) on the foreground quay.
  const crateX = level === 1 && variant === 1 ? 300 : 270;
  ctx.fillStyle = '#725344'; ctx.fillRect(crateX, 326, 35, 30);
  ctx.strokeStyle = '#bd9568'; ctx.lineWidth = 1.3; ctx.strokeRect(crateX+1,327,33,28);
  line(ctx, [[crateX+2,328],[crateX+32,354]], '#ba9169', 1.2);
  line(ctx, [[crateX+32,328],[crateX+2,354]], '#a98160', 1.2);
  line(ctx, [[crateX+17,328],[crateX+17,354]], '#a98160', .9);
  if (level === 3) {
    // Rope coil shifts a few pixels in the final pair.
    const rx = variant === 1 ? 258 : 241;
    ctx.strokeStyle = '#c6a878'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(rx,354,10,4,-.1,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(rx,354,5,2,-.1,0,Math.PI*2); ctx.stroke();
  }
  // A dark little cat, tail curled like a question mark.
  if (!(level === 2 && variant === 1)) {
    const catX = level === 2 ? 183 : 202;
    ellipse(ctx,catX,335,11,5,'#253438',-.08);
    circle(ctx,catX+9,330,5,'#293a3b');
    path(ctx,[[catX+5,327],[catX+7,320],[catX+11,326]],'#293a3b');
    path(ctx,[[catX+10,326],[catX+15,321],[catX+15,328]],'#293a3b');
    circle(ctx,catX+11,330,1,'#e9c17f');
    ctx.beginPath(); ctx.arc(catX-12,331,7,Math.PI*.15,Math.PI*1.6); ctx.strokeStyle='#293a3b'; ctx.lineWidth=2; ctx.stroke();
    line(ctx,[[catX-5,339],[catX-4,343]],'#293a3b',2); line(ctx,[[catX+3,339],[catX+4,343]],'#293a3b',2);
  }
  // Level two buoy: the right view slips it east, level one gains an extra buoy.
  const buoyX = level === 2 ? (variant === 1 ? 540 : 512) : 454;
  if (level !== 1 || variant === 1) {
    ellipse(ctx,buoyX,284,8,5,'#b75f4e',.1); path(ctx,[[buoyX-6,283],[buoyX,273],[buoyX+6,283]],'#ce8464');
    line(ctx,[[buoyX,288],[buoyX+2,294]],'#ceb17e',1);
    circle(ctx,buoyX,272,1.5,'#edcd8a');
  }
}

function drawGulls(ctx, level, variant) {
  const gull = (x,y,s=1) => {
    line(ctx,[[x-9*s,y+2*s],[x-4*s,y-2*s],[x,y+1*s],[x+5*s,y-3*s],[x+10*s,y+1*s]],'#27373b',1.8*s);
  };
  if (!(level === 1 && variant === 1)) gull(518,100,1.1);
  gull(558,89,.7); gull(488,114,.65);
  // One extra gull joins the flock only in the second Last Light picture.
  if (level === 3 && variant === 1) gull(340,94,.85);
}

function drawFlagAndLaundry(ctx, level, variant) {
  // Quay pennant, up on the post to the right of the cottage.
  line(ctx,[[577,146],[577,125]],'#3a4240',1.7);
  const reversed = level === 1 && variant === 1;
  const fill = level === 3 && variant === 1 ? '#8ca08a' : '#bd765c';
  if (!reversed) path(ctx,[[578,126],[598,130],[578,137]],fill,'#6c5547',.8);
  else path(ctx,[[577,126],[558,130],[577,137]],fill,'#6c5547',.8);
  if (level === 2) {
    // Washing line and a tiny red sock, removed in the right-hand image.
    line(ctx,[[208,151],[310,151]],'#554b42',1);
    ctx.fillStyle='#d1b48a'; ctx.fillRect(218,152,17,22);
    ctx.fillStyle='#799086'; ctx.fillRect(242,152,16,19);
    if (variant === 0) {
      path(ctx,[[270,152],[286,152],[286,166],[281,166],[281,174],[275,174],[275,166],[270,166]],'#b56553','#704c43',.6);
    }
    ctx.fillStyle='#d7c49e'; ctx.fillRect(292,152,13,17);
    line(ctx,[[218,150],[218,154]],'#edc586',.8); line(ctx,[[242,150],[242,154]],'#edc586',.8);
  }
}

function drawReflectionVariant(ctx, level, variant) {
  if (level === 1 && variant === 1) {
    // Shift a selected warm glimmer near the sail reflection, leaving the broad sun trail alone.
    line(ctx,[[420,340],[444,340]],'#eab679',1.5);
    line(ctx,[[426,345],[439,345]],'#aeb0a0',.8);
  }
  if (level === 1 && variant === 0) {
    line(ctx,[[404,340],[429,340]],'#eab679',1.5);
    line(ctx,[[410,345],[423,345]],'#aeb0a0',.8);
  }
  if (level === 2) {
    // Wave curls near starboard; the middle curl is flipped in the second harbor.
    line(ctx,[[625,311],[631,307],[637,311],[643,307],[649,311]],'#a9b5a7',1.4);
    if (variant === 1) line(ctx,[[629,315],[635,319],[641,315],[647,319]],'#91a69d',1);
    else line(ctx,[[629,315],[635,311],[641,315],[647,311]],'#91a69d',1);
  }
  if (level === 1 && variant === 1) {
    // One additional buoy has appeared beside the steady mooring buoy.
    ellipse(ctx,436,282,7,4.5,'#ba6550',.1);
    path(ctx,[[431,281],[436,272],[441,281]],'#d38a69');
    circle(ctx,436,271,1.2,'#eed092');
  }
}

function drawQuayDetails(ctx, level, variant) {
  drawFlagAndLaundry(ctx, level, variant);
  drawCottage(ctx, level, variant);
  drawLighthouse(ctx, level, variant);
  drawHarborLife(ctx, level, variant);
  drawGulls(ctx, level, variant);
  drawReflectionVariant(ctx, level, variant);
  // Wooden mooring posts at the foreground edge, always repeated at the same light.
  [[90,315],[605,307]].forEach(([x,y])=>{
    path(ctx,[[x-4,y],[x-3,y-21],[x+3,y-21],[x+5,y]],'#634e41');
    line(ctx,[[x-4,y-19],[x+3,y-19]],'#bd9b70',1.3);
  });
  // Tiny ladder descending the quay.
  line(ctx,[[480,307],[478,328]],'#957f60',1.5);
  [312,318,324].forEach(y=>line(ctx,[[478,y],[485,y]],'#957f60',1));
}

export function drawScene(canvas, levelIndex, variant, foundIds = [], cursor = null, wrong = 0) {
  const ctx = canvas.getContext('2d');
  const level = levelIndex + 1;
  const w = 720, h = 440;
  ctx.clearRect(0,0,w,h);
  ctx.save();
  skyAndSea(ctx, level, variant);
  drawQuayDetails(ctx, level, variant);
  // A subtle vignette and fine frame finish the printed, painted feeling.
  const vignette = ctx.createRadialGradient(360,205,160,360,205,470);
  vignette.addColorStop(0,'#08171a00'); vignette.addColorStop(1,'#08171a44');
  ctx.fillStyle=vignette; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1b2f34'; ctx.lineWidth=5; ctx.strokeRect(2.5,2.5,w-5,h-5);

  // Found marks are projected into both paintings and gently ticked.
  const data = LEVELS_REF[levelIndex];
  if (data) for (const diff of data.differences) {
    if (!foundIds.includes(diff.id)) continue;
    ctx.save(); ctx.strokeStyle='#b6e1be'; ctx.fillStyle='#9ad5b822'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(diff.x,diff.y,diff.r,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(diff.x-5,diff.y+1); ctx.lineTo(diff.x-1,diff.y+6); ctx.lineTo(diff.x+7,diff.y-5);
    ctx.strokeStyle='#e9f1d5'; ctx.lineWidth=2.6; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke(); ctx.restore();
  }
  if (cursor) {
    ctx.save(); ctx.setLineDash([4,4]); ctx.lineWidth=1.7; ctx.strokeStyle='#f5dfaa';
    ctx.beginPath(); ctx.arc(cursor.x,cursor.y,10,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(cursor.x,cursor.y,2,0,Math.PI*2); ctx.fillStyle='#f5dfaa'; ctx.fill(); ctx.restore();
  }
  if (wrong > 0) {
    ctx.save(); ctx.globalAlpha=Math.min(.42,wrong*.42); ctx.fillStyle='#d75d54'; ctx.fillRect(3,3,w-6,h-6); ctx.restore();
  }
  ctx.restore();
}

