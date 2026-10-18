document.addEventListener("DOMContentLoaded", function () {

    // Mobile navigation
    const menuButton = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuButton && navMenu) {
        menuButton.addEventListener("click", function () {
            navMenu.classList.toggle("open");
        });
    }

    // Collection search and filter functionality
    const productGrid = document.getElementById("product-grid");

    if (productGrid) {
        const products = Array.from(
            productGrid.querySelectorAll(".product-card")
        );

        const searchInput = document.getElementById("product-search");
        const categoryInputs = document.querySelectorAll(
            'input[name="category"]'
        );
        const priceInputs = document.querySelectorAll(
            'input[name="price"]'
        );
        const sortSelect = document.getElementById("sort-products");
        const resultCount = document.getElementById("result-count");
        const emptyState = document.getElementById("empty-state");

        // Category link from home page
        const categoryFromURL =
            new URLSearchParams(window.location.search).get("category");

        if (categoryFromURL) {
            categoryInputs.forEach(input => {
                if (input.value === categoryFromURL) {
                    input.checked = true;
                }
            });
        }

        function filterProducts() {
            const searchText = searchInput.value
                .trim()
                .toLowerCase();

            const selectedCategories = Array.from(categoryInputs)
                .filter(input => input.checked)
                .map(input => input.value);

            const selectedPrice = document.querySelector(
                'input[name="price"]:checked'
            ).value;

            const visibleProducts = products.filter(product => {
                const name = product.dataset.name.toLowerCase();
                const category = product.dataset.category;
                const price = Number(product.dataset.price);

                const matchesSearch =
                    name.includes(searchText) ||
                    category.toLowerCase().includes(searchText);

                const matchesCategory =
                    selectedCategories.length === 0 ||
                    selectedCategories.includes(category);

                let matchesPrice = true;

                if (selectedPrice === "under500") {
                    matchesPrice = price < 500;
                } else if (selectedPrice === "500to1000") {
                    matchesPrice = price >= 500 && price <= 1000;
                } else if (selectedPrice === "over1000") {
                    matchesPrice = price > 1000;
                }

                return matchesSearch && matchesCategory && matchesPrice;
            });

            // Sort filtered products
            const sortMode = sortSelect.value;

            visibleProducts.sort((a, b) => {
                if (sortMode === "low-high") {
                    return Number(a.dataset.price) -
                        Number(b.dataset.price);
                }

                if (sortMode === "high-low") {
                    return Number(b.dataset.price) -
                        Number(a.dataset.price);
                }

                if (sortMode === "name") {
                    return a.dataset.name.localeCompare(b.dataset.name);
                }

                return products.indexOf(a) - products.indexOf(b);
            });

            products.forEach(product => {
                product.hidden = true;
            });

            visibleProducts.forEach(product => {
                product.hidden = false;
                productGrid.appendChild(product);
            });

            resultCount.textContent = visibleProducts.length;
            emptyState.hidden = visibleProducts.length !== 0;
            productGrid.hidden = visibleProducts.length === 0;
        }

        searchInput.addEventListener("input", filterProducts);

        categoryInputs.forEach(input => {
            input.addEventListener("change", filterProducts);
        });

        priceInputs.forEach(input => {
            input.addEventListener("change", filterProducts);
        });

        sortSelect.addEventListener("change", filterProducts);

        function clearFilters() {
            searchInput.value = "";

            categoryInputs.forEach(input => {
                input.checked = false;
            });

            document.querySelector(
                'input[name="price"][value="all"]'
            ).checked = true;

            sortSelect.value = "featured";
            filterProducts();
        }

        document.getElementById("clear-filters")
            .addEventListener("click", clearFilters);

        filterProducts();
    }

    // Contact form demo
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            document.getElementById("contact-feedback").textContent =
                "Thank you, " + name +
                "! Your demo form was submitted successfully.";

            contactForm.reset();
        });
    }

});