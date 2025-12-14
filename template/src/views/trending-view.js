export const toTrendingView = (gif) => `
  <div class="gif-card">
    <img 
      src="${gif.images.fixed_height.url}" 
      alt="${gif.title}"
    />
    <p>${gif.title}</p>
  </div>
`;