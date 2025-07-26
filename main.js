document.addEventListener('DOMContentLoaded', function() {
  function formatDescription(description) {
    if (Array.isArray(description)) {
      return description.map(item => `<p style="margin: 0.5em 0;">${item}</p>`).join('');
    }
    return `<p style="margin: 0.5em 0;">${description}</p>`;
  }

  function createSection(containerId, data) {
    const container = document.getElementById(containerId);
    data.forEach((entry) => {
      const article = document.createElement('article');
      article.className = 'project';

      const imageContainer = document.createElement('div');
      imageContainer.className = 'carousel';

      if (entry.images && entry.images.length > 0) {
        if (entry.images.length === 1) {
          const imgElem = document.createElement('img');
          imgElem.src = entry.images[0];
          imgElem.alt = `${entry.title} preview`;
          imgElem.className = 'carousel-img';
          imageContainer.appendChild(imgElem);
        } else {
          const imgElem = document.createElement('img');
          imgElem.src = entry.images[0];
          imgElem.alt = `${entry.title} view`;
          imgElem.className = 'carousel-img';
          imageContainer.appendChild(imgElem);

          const dotsContainer = document.createElement('div');
          dotsContainer.className = 'carousel-dots';

          let currentIndex = 0;
          const dots = [];

          const updateCarousel = (newIndex) => {
            imgElem.style.opacity = '0';
            setTimeout(() => {
              imgElem.src = entry.images[newIndex];
              imgElem.style.opacity = '1';
              dots[currentIndex].classList.remove('active');
              dots[newIndex].classList.add('active');
              currentIndex = newIndex;
            }, 200);
          };

          entry.images.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => updateCarousel(i));
            dotsContainer.appendChild(dot);
            dots.push(dot);
          });

          const leftBtn = document.createElement('button');
          leftBtn.className = 'carousel-arrow left';
          leftBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
          leftBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + entry.images.length) % entry.images.length;
            updateCarousel(newIndex);
          });

          const rightBtn = document.createElement('button');
          rightBtn.className = 'carousel-arrow right';
          rightBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
          rightBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % entry.images.length;
            updateCarousel(newIndex);
          });

          imageContainer.appendChild(leftBtn);
          imageContainer.appendChild(rightBtn);
          imageContainer.appendChild(dotsContainer);
        }
      }

      article.appendChild(imageContainer);

      const projectContent = document.createElement('div');
      projectContent.className = 'project-content';
      projectContent.innerHTML = `
        <div class="project-header">
          <div class="project-title">${entry.title}</div>
          <a class="github-link" href="${entry.github}" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub icon">
          </a>
        </div>
        ${formatDescription(entry.description)}
        <div class="tags">
          ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      `;
      article.appendChild(projectContent);
      container.appendChild(article);
    });
  }

  fetch('projects.json')
    .then(response => response.json())
    .then(projects => createSection('project-container', projects));

  fetch('bio.json')
    .then(response => response.json())
    .then(bio => createSection('bio-container', bio));
});
