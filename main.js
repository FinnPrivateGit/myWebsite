const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const sheetsWrap = document.getElementById("sheets");
const leftStatic = document.getElementById("leftStatic");
const rightStatic = document.getElementById("rightStatic");

/**
 * Pages are simple HTML strings.
 * Spread logic:
 * - Static left/right show the CURRENT spread.
 * - Each sheet is used only for the flip animation between spreads.
 */
const pages = [
  `<h2>Seite 1</h2><p>Das ist die erste Seite.</p>`,
  `<h2>Seite 2</h2><p>Inhalt auf der linken Seite nach dem ersten Flip.</p>`,
  `<h2>Seite 3</h2><p>Noch mehr Inhalt…</p>`,
  `<h2>Seite 4</h2><p>Noch mehr Inhalt…</p>`,
  `<h2>Seite 5</h2><p>Fast fertig.</p>`,
  `<h2>Seite 6</h2><p>The End 🎉</p>`
];

// spread index: 0 => (page0,page1), 1 => (page2,page3), ...
let spread = 0;

function getPage(i){
  return pages[i] ?? `<h2>Leer</h2><p>—</p>`;
}

function renderStatic(){
  const leftIndex = spread * 2;
  const rightIndex = leftIndex + 1;
  leftStatic.innerHTML = getPage(leftIndex);
  rightStatic.innerHTML = getPage(rightIndex);

  prevBtn.disabled = spread === 0;
  nextBtn.disabled = (spread + 1) * 2 >= pages.length;
}

function makeSheet(frontHTML, backHTML){
  const sheet = document.createElement("div");
  sheet.className = "sheet";

  const front = document.createElement("div");
  front.className = "face front";
  front.innerHTML = `<div class="pageContent">${frontHTML}</div>`;

  const back = document.createElement("div");
  back.className = "face back";
  back.innerHTML = `<div class="pageContent">${backHTML}</div>`;

  sheet.append(front, back);
  return sheet;
}

async function flipNext(){
  if (nextBtn.disabled) return;

  const fromLeft = spread * 2;
  const fromRight = fromLeft + 1;
  const toLeft = fromLeft + 2;
  const toRight = fromLeft + 3;

  // Sheet: front is current RIGHT, back is next LEFT
  const sheet = makeSheet(getPage(fromRight), getPage(toLeft));
  sheetsWrap.appendChild(sheet);

  // lock buttons
  prevBtn.disabled = true;
  nextBtn.disabled = true;

  // force layout then animate
  sheet.getBoundingClientRect();
  sheet.classList.add("turning");
  requestAnimationFrame(() => sheet.classList.add("flipped"));

  // when animation ends, update spread & cleanup
  sheet.addEventListener("transitionend", () => {
    spread++;
    renderStatic();
    sheet.remove();
  }, { once: true });
}

async function flipPrev(){
  if (prevBtn.disabled) return;

  const toLeft = (spread - 1) * 2;
  const toRight = toLeft + 1;
  const fromLeft = spread * 2;
  const fromRight = fromLeft + 1;

  // We simulate flipping back:
  // Create a sheet already flipped (so it appears on left),
  // then unflip it to return to previous spread.
  // Sheet: front is previous RIGHT, back is current LEFT
  const sheet = makeSheet(getPage(toRight), getPage(fromLeft));
  sheetsWrap.appendChild(sheet);

  // Start in flipped state
  sheet.classList.add("flipped");
  sheet.getBoundingClientRect();

  prevBtn.disabled = true;
  nextBtn.disabled = true;

  sheet.classList.add("turning");
  requestAnimationFrame(() => sheet.classList.remove("flipped"));

  sheet.addEventListener("transitionend", () => {
    spread--;
    renderStatic();
    sheet.remove();
  }, { once: true });
}

prevBtn.addEventListener("click", flipPrev);
nextBtn.addEventListener("click", flipNext);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") flipNext();
  if (e.key === "ArrowLeft") flipPrev();
});

renderStatic();