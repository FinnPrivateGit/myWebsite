console.log("Portfolio läuft 🚀");

const pages = Array.from(document.querySelectorAll(".page"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const counter = document.getElementById("counter");

// currentSheet = how many sheets have been flipped
let currentSheet = 0;

function updateZIndex() {
  // Put later pages behind earlier ones; flipped pages go behind too.
  // This makes the stack feel like a real book.
  const total = pages.length;
  pages.forEach((p, i) => {
    // higher z-index for sheets closer to the top (not yet flipped)
    p.style.zIndex = String(total - i);
  });
}

function render() {
  pages.forEach((p, i) => {
    p.classList.toggle("flipped", i < currentSheet);
  });

  prevBtn.disabled = currentSheet === 0;
  nextBtn.disabled = currentSheet === pages.length;

  // Optional counter text
  const leftPageNum = currentSheet * 2;       // 0,2,4...
  const rightPageNum = leftPageNum + 1;       // 1,3,5...
  counter.textContent = `Spread: ${currentSheet + 1} / ${pages.length + 1}  (L:${leftPageNum} R:${rightPageNum})`;
}

prevBtn.addEventListener("click", () => {
  if (currentSheet > 0) {
    currentSheet--;
    render();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentSheet < pages.length) {
    currentSheet++;
    render();
  }
});

// Optional: keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextBtn.click();
  if (e.key === "ArrowLeft") prevBtn.click();
});

updateZIndex();
render();