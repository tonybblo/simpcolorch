const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

const images = ['1.jpg', `2.jpg`, `3.jpg`, `4.jpg`, `5.jpg`,'6.jpg'];
const alts = {
  '1.jpg' : 'firstone',
  '2.jpg' : 'secondone',
  '3.jpg' : 'thirdone',
  '4.jpg' : 'fourthone',
  '5.jpg' : 'fifthone',
  '6.jpg' : 'sixthone'
}


for (const image of images) {
  const newImage = document.createElement('img');
  newImage.setAttribute('src', `images/${image}`);
  newImage.setAttribute('alt', alts[image]);
  thumbBar.appendChild(newImage);
  newImage.addEventListener('click', e => {
    displayedImage.src = e.target.src;
    displayedImage.alt = e.target.alt;
  });
}

/* Wiring up the Darken/Lighten button */

btn.addEventListener('click', () => {
  const btnClass = btn.getAttribute('class');
  if (btnClass === 'dark') {
    btn.setAttribute('class','light');
    btn.textContent = '返回';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  } else {
    btn.setAttribute('class','dark');
    btn.textContent = '变黑';
    overlay.style.backgroundColor = 'rgba(0,0,0,0)';
  }
});

