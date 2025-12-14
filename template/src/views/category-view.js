export const toCategoriesView = (categories) => `
<div id="categories">
  <h1>Categories</h1>
  <div class="content">
    ${categories.map(toSingleCategoryView).join('\n')}
  </div>
</div>
`;

const toSingleCategoryView = (category) => `
<div class="category">
  <h1>${category.name}</h1>
  <p>${category.moviesCount} movies</p>
  <button class="view-category-btn" data-category-id="${category.id}">View category</button>
</div>
`;
