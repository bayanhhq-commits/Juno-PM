const button = document.querySelector('#runDemo');
const steps = [...document.querySelectorAll('#demoSteps li')];
let timer;

button.addEventListener('click', () => {
  clearInterval(timer);
  let index = 0;
  button.disabled = true;
  button.textContent = 'Reading approved evidence…';

  const show = () => {
    steps.forEach((step, i) => step.classList.toggle('active', i === index));
    const labels = ['Reading approved evidence…', 'Scoring opportunities…', 'Creating product pack…', 'Waiting for PM approval'];
    button.textContent = labels[index];
    if (index === steps.length - 1) {
      clearInterval(timer);
      button.disabled = false;
      setTimeout(() => { button.textContent = 'Run the sample workflow'; }, 1800);
      return;
    }
    index += 1;
  };

  show();
  timer = setInterval(show, 900);
});
