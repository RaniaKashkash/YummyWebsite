//^ Aside
const leftAside = document.querySelector('.left-aside');
const rightAside = document.querySelector('.left-aside');
const menuBtn = document.querySelector('.menuBtn');
const icon = menuBtn.querySelector('i');
const asideContainer = document.querySelector('.asideContainer');
const menuLinks = document.querySelectorAll('.menu-links li')
//^ Meals
const mealsRow = document.querySelector('.mealsRow');
const mealsContainer = document.querySelector('.mealsContainer');

//^ Meal Details
const mealDetailsRow = document.querySelector('.mealDetailsRow')
const mealDetailsContainer = document.querySelector('.mealDetailsContainer');

//^ Search
const searchLink = document.querySelector('#searchLink');
const searchContainer = document.querySelector('.searchContainer');
const searchByNameInput = document.querySelector('#searchByNameInput');
const searchByLetterInput = document.querySelector('#searchByLetterInput');

//^ Category
const categoryLink = document.querySelector('#categoryLink');
const categoriesRow = document.querySelector('.categoriesRow');
const categoriesContainer = document.querySelector('.categoriesContainer');

const categoryMealsRow = document.querySelector('.categoryMealsRow');
const categoryMealsContainer = document.querySelector('.categoryMealsContainer');

//^ Area
const areaLink = document.querySelector('#areaLink');
const areaRow = document.querySelector('.areaRow');
const areaContainer = document.querySelector('.areaContainer');
const areaMealsRow = document.querySelector('.areaMealsRow');
const areaMealsContainer = document.querySelector('.areaMealsContainer');

//^ Ingredients
const IngredientLink = document.querySelector('#Ingredient');
const IngredientRow = document.querySelector('.ingredientRow');
const IngredientContainer = document.querySelector('.ingredientContainer');
const IngredientMealsRow = document.querySelector('.ingredientMealsRow');
const IngredientMealsContainer = document.querySelector('.ingredientMealsContainer');

// ^Contact us
const contactUsLink = document.querySelector('#contactUs');
const contactUsContainer = document.querySelector('.contactContainer');
const rewritePassInput = document.querySelector('#rewritePassInput');
const button = document.querySelector('button');

function hideMenu() {
    icon.classList.replace('fa-x', 'fa-bars');
    asideContainer.classList.replace('active', 'none')
}
function changeIcon() {
    let closeIcon = '';
    menuBtn.addEventListener('click', function () {
        if (asideContainer.classList.contains('active')) {
            icon.classList.replace('fa-x', 'fa-bars');
            asideContainer.classList.toggle('active');
            menuLinks.forEach((li) => li.classList.remove('active'));
        } else {
            icon.classList.replace('fa-bars', 'fa-x');
            asideContainer.classList.toggle('active');
            menuLinks.forEach((li, i) => {
                setTimeout(() => li.classList.add('active'), i * 100);
            });
        }
    });
}
changeIcon();

class Meal {
    async getDataByAPI(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("API Error:", error);
            return null;
        }
    }
    async getAllMeals(name = '') {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
        return await this.getDataByAPI(url);
    }

    async getMealByLetter(letter = 'a') {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;
        return await this.getDataByAPI(url);
    }

    async getMealById(id) {
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        const data = await this.getDataByAPI(url);
        return data?.meals?.[0] ?? null;
    }

    async getAllCategories() {
        const url = `https://www.themealdb.com/api/json/v1/1/categories.php`;
        return await this.getDataByAPI(url);
    }

    async getMealsOfCategory(category) {
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        return await this.getDataByAPI(url);
    }
    async getAllMealsByArea() {
        const url = `https://www.themealdb.com/api/json/v1/1/list.php?a=list`;
        return await this.getDataByAPI(url);
    }
    async getMealsbyArea(area) {
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
        return await this.getDataByAPI(url);
    }
    async getAllMealsByIngredient() {
        const url = `https://www.themealdb.com/api/json/v1/1/list.php?i=list`;
        return await this.getDataByAPI(url);
    }
    async getMealsbyIngredient(ingredient) {
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
        return await this.getDataByAPI(url);
    }

}

let newMeal = new Meal();
//^ Display all meals
async function displayMeals(searchName = '', type = ' ') {
    let allMeals
    if (type == 'letter' && searchName != '') {
        allMeals = await newMeal.getMealByLetter(searchName);
    } else {
        allMeals = await newMeal.getAllMeals(searchName);
    }
    let content = '';

    if (allMeals.meals) {
        allMeals.meals.forEach(meal => {
            content += `
                <div class="col-md-3 p-2">
                    <div class="image position-relative overflow-hidden" data-id="${meal.idMeal}">
                        <img src=${meal.strMealThumb} class="w-100 rounded-3" alt="thumb">
                        <div class="layerOverImage w-100 position-absolute top-0 bottom-0 d-flex align-items-center">
                            <p class="fs-4 p-1 text-black fw-bold">${meal.strMeal}</p>
                        </div>
                    </div>
                </div>`;
        });
    } else {
        content = '<p class="text-center fs-4">There is no meals based on search key</p>';
    }

    mealsRow.innerHTML = content;

    mealsContainer.querySelectorAll('.image').forEach(image => {
        image.addEventListener('click', function () {
            searchContainer.classList.replace('d-block', 'd-none');
            const id = this.dataset.id;
            mealsContainer.classList.replace('d-block', 'd-none');
            mealDetailsContainer.classList.replace('d-none', 'd-block');
            getMealDetailsById(id);
        });
    });
}

async function getMealDetailsById(id) {
    hideContainers()
    let mealDetails = await newMeal.getMealById(id);
    const { strMealThumb, strMeal, strInstructions, strArea, strCategory, strTags, strSource, strYoutube } = mealDetails;
    let ingredientList = '';
    let measureList = '';
    let tagsList = '';
    let tags = [];
    for (let y = 1; y <= 20; y++) {
        const ingredient = mealDetails[`strIngredient${y}`];
        const measure = mealDetails[`strMeasure${y}`];
        if (ingredient && ingredient.trim() != '' && measure && measure.trim() != '') {
            measureList += `<li class="p-1">${measure} ${ingredient}</li>`
        }
    }
    if (strTags) {
        tags = strTags.split(',');
        for (let i = 0; i < tags.length; i++) {
            tagsList += `<li class="p-1">${tags[i]}</li>`
        }

    }
    let content = `<div class="col-md-4">
            <div class="mealImage">
                <img src=${strMealThumb} alt="" class="w-100">
            </div>
            <h2>${strMeal}</h2>
            </div>
            <div class="col-md-8">
                <div class="instructionDiv">
                    <h2>Instruction</h2>
                    <p class="strInstructions">${strInstructions}</p>
                </div>
                <h3>Area: <span class="strArea">${strArea}</span></h3>
                <h3>Category: <span class="strCategory">${strCategory}</span></h3>
                <div class="recipesDiv">
                    <h3>Recipes: </h3>
                    <ul class="list-unstyled d-flex flex-wrap ingredientUL">
                        ${measureList}${ingredientList}
                    </ul>
                </div>
                <div class="tagsDiv text-white">
                    <h3>Tags:</h3>
                    <ul class="list-unstyled d-flex flex-wrap tagsUL">
                        ${tagsList}
                    </ul>
                </div>
                <button class="btn btn-success"><a  class="text-white text-decoration-none" href="${strSource}">Source</a></button>
                \<button class="btn btn-danger"><a  class="text-white text-decoration-none" href="${strYoutube}">Youtube</a></button>
             </div>`;

    mealDetailsRow.innerHTML = content;
    mealDetailsContainer.classList.replace('d-none', 'd-block');


}

// ^Search
searchLink.addEventListener('click', () => {
    hideContainers();
    mealsContainer.classList.replace('d-block', 'd-none');
    searchContainer.classList.replace('d-none', 'd-block');

})

searchByLetterInput.addEventListener('input', async () => {
    mealsContainer.classList.replace('d-none', 'd-block');
    const char = searchByLetterInput.value.trim();
    displayMeals(char, 'letter');

});

searchByNameInput.addEventListener('input', () => {
    mealsContainer.classList.replace('d-none', 'd-block');
    const name = searchByNameInput.value.trim();
    displayMeals(name);
})


// ^ Category
categoryLink.addEventListener('click', () => {
    hideContainers();
    mealsContainer.classList.replace('d-block', 'd-none');
    categoriesContainer.classList.replace('d-none', 'd-block');
    displayAllCategory();
});

async function displayAllCategory() {
    let allCategories = await newMeal.getAllCategories();
    let content = '';
    allCategories.categories.forEach(category => {
        content += `
                <div class="col-md-3 p-2">
                    <div class="image position-relative overflow-hidden" data-category-name="${category.strCategory}">
                        <img src=${category.strCategoryThumb} class="w-100 rounded-3" alt="thumb">
                        <div class="layerOverImage w-100 position-absolute top-0 bottom-0 d-flex flex-column align-items-center">
                            <h3 class="p-1 text-black mb-0">${category.strCategory}</h3>
                            <p class="text-black text-center">${category.strCategoryDescription.split(' ', 20).join(' ')}</p>
                        </div>
                    </div>
                </div>`
    });

    categoriesRow.innerHTML = content;
    categoriesRow.querySelectorAll('.image').forEach(image => {
        image.addEventListener('click', async function () {
            const categoryName = this.dataset.categoryName;
            let mealC = await newMeal.getMealsOfCategory(categoryName);
            let innerContent = '';
            mealC.meals.slice(0, 20).forEach(meal => {
                innerContent += `
                        <div class="col-md-3 p-2">
                            <div class="image position-relative overflow-hidden" data-id="${meal.idMeal}">
                                <img src=${meal.strMealThumb} class="w-100 rounded-3" alt="thumb">
                                <div class="layerOverImage w-100 position-absolute top-0 bottom-0 d-flex align-items-center">
                                    <p class="fs-4 p-1 text-black fw-bold">${meal.strMeal}</p>
                                </div>
                            </div>
                        </div>`
            });

            categoryMealsRow.innerHTML = innerContent;
            categoriesContainer.classList.replace('d-block', 'd-none');
            categoryMealsContainer.classList.replace('d-none', 'd-block');

            categoryMealsContainer.querySelectorAll('.image').forEach(image => {
                image.addEventListener('click', function () {
                    const id = this.dataset.id;
                    hideContainers();
                    getMealDetailsById(id);
                });
            });
        });
    });


}

//^ Area
areaLink.addEventListener('click', () => {
    hideContainers();
    mealsContainer.classList.replace('d-block', 'd-none');
    displayAllAreas();
})

async function displayAllAreas() {
    let allAreas = await newMeal.getAllMealsByArea();
    let content = '';

    allAreas.meals.forEach(area => {
        content += `
                <div class="col-md-3 p-2 d-flex flex-column align-items-center">
                  <div class="area" data-area-name="${area.strArea}">
                    <i class="fa-solid fa-house-laptop"></i>
                    <h3 class="text-white">${area.strArea}</h3></div>
                </div>`
    });
    areaRow.innerHTML = content;
    areaContainer.classList.replace('d-none', 'd-block');

    areaRow.querySelectorAll('.area').forEach(area => {
        area.addEventListener('click', async function () {
            const areaName = this.dataset.areaName;
            let mealsByArea = await newMeal.getMealsbyArea(areaName);
            let innerContent = '';
            mealsByArea.meals.slice(0, 20).forEach(meal => {
                innerContent += `
                        <div class="col-md-3 p-2">
                            <div class="image position-relative overflow-hidden" data-id="${meal.idMeal}">
                                <img src=${meal.strMealThumb} class="w-100 rounded-3" alt="thumb">
                                <div class="layerOverImage w-100 position-absolute top-0 bottom-0 d-flex align-items-center">
                                    <p class="fs-4 p-1 text-black fw-bold">${meal.strMeal}</p>
                                </div>
                            </div>
                        </div>`
            });
            areaRow.innerHTML = innerContent;

            areaContainer.querySelectorAll('.image').forEach(image => {
                image.addEventListener('click', function () {
                    areaContainer.classList.replace('d-block', 'd-none');
                    areaMealsContainer.classList.replace('d-none', 'd-block');
                    const id = this.dataset.id;
                    hideContainers();
                    getMealDetailsById(id);
                });
            });
        });
    });


}

//^ Ingredient
IngredientLink.addEventListener('click', () => {
    hideContainers();
    mealsContainer.classList.replace('d-block', 'd-none');
    displayAllIngredients();
})

async function displayAllIngredients() {
    let allIngredients = await newMeal.getAllMealsByIngredient();
    let content = '';

    allIngredients.meals.slice(0, 20).forEach(ingredient => {

        content += `
               <div class="col-md-3 p-2">
                  <div class="ingredient  d-flex flex-column align-items-center" data-ingredient-name="${ingredient.strIngredient}">
                    <i class="fa-solid fa-drumstick-bite"></i>
                    <h3 class="text-white">${ingredient.strIngredient}</h3>
                    <p class="text-center">${ingredient.strDescription.split(' ', 20).join(' ')}</p>
                </div>
            </div>`
    });

    IngredientRow.innerHTML = content;
    IngredientContainer.classList.replace('d-none', 'd-block');
    IngredientRow.querySelectorAll('.ingredient').forEach(ingredient => {
        ingredient.addEventListener('click', async function () {
            const ingredientName = this.dataset.ingredientName;
            let mealsByIngredient = await newMeal.getMealsbyIngredient(ingredientName);
            let innerContent = '';
            mealsByIngredient.meals.slice(0, 20).forEach(meal => {
                innerContent += `
                        <div class="col-md-3 p-2">
                            <div class="image position-relative overflow-hidden" data-id="${meal.idMeal}">
                                <img src=${meal.strMealThumb} class="w-100 rounded-3" alt="thumb">
                                <div class="layerOverImage w-100 position-absolute top-0 bottom-0 d-flex align-items-center">
                                    <p class="fs-4 p-1 text-black fw-bold">${meal.strMeal}</p>
                                </div>
                            </div>
                        </div>`
            });
            IngredientRow.innerHTML = innerContent;

            IngredientContainer.querySelectorAll('.image').forEach(image => {
                image.addEventListener('click', function () {
                    IngredientContainer.classList.replace('d-block', 'd-none');
                    IngredientMealsContainer.classList.replace('d-none', 'd-block');
                    const id = this.dataset.id;
                    hideContainers();
                    getMealDetailsById(id);
                });
            });
        });
    });


}

//^ Contact Us
contactUsLink.addEventListener('click', () => {
    hideContainers();
    contactUsContainer.classList.replace('d-none', 'd-flex');
    contactUsValidation();
})

function contactUsValidation() {
    var regexPattern = {
        name: /[\sa-zA-Z]{1,}/,
        age: /^[0-9]{1,2}$/,
        email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
        phone: /^\+?[0-9]{10,13}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    }

    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const inputId = input.getAttribute("id");
            if (inputId == 'rewritePassInput') {
                const password = document.querySelector('#password');
                if (input.value == password.value && input.value != '') {
                    input.classList.add("is-valid");
                    input.classList.remove("is-invalid");
                    input.nextElementSibling.classList.replace("d-block", "d-none");
                } else {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    input.nextElementSibling.classList.replace("d-none", "d-block");
                }
            } else {
                const pattern = regexPattern[inputId];
                validate(pattern, input);
            }

        });
    });
    function validate(regex, input) {
        if (regex.test(input.value.trim())) {
            input.classList.add("is-valid");
            input.classList.remove("is-invalid");
            input.nextElementSibling.classList.replace("d-block", "d-none");

        } else {
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
            input.nextElementSibling.classList.replace("d-none", "d-block");
            return false;
        }
    }
}

// ^Hide all containers
function hideContainers() {
    mealsContainer.classList.replace('d-block', 'd-none');
    mealDetailsContainer.classList.replace('d-block', 'd-none');
    categoriesContainer.classList.replace('d-block', 'd-none');
    categoryMealsContainer.classList.replace('d-block', 'd-none');
    searchContainer.classList.replace('d-block', 'd-none');
    areaContainer.classList.replace('d-block', 'd-none');
    IngredientContainer.classList.replace('d-block', 'd-none');
    contactUsContainer.classList.replace('d-flex', 'd-none');
    leftAside.classList.replace('d-block', 'd-none');
    hideMenu();

}

document.addEventListener('DOMContentLoaded', () => {
    displayMeals();
})


