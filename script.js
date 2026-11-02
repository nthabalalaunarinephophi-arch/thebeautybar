const products = [
    {
        id: 1,
        name: "Face Cream",
        price: 120,
        image: "resor/Face cream.jpeg",
        description: "A skincare essential for your daily routine."
    },
    {
        id: 2,
        name: "Face Mask",
        price: 120,
        image: "resor/Facemask.jpeg",
        description: "A face mask for your skincare routine."
    },
    {
        id: 3,
        name: "Foundation",
        price: 220,
        image: "resor/Foundation.jpeg",
        description: "Foundation for your makeup collection."
    },
    {
        id: 4,
        name: "Lip Gloss",
        price: 80,
        image: "resor/Lipgloss.jpeg",
        description: "A gloss for a finishing touch."
    },
    {
        id: 5,
        name: "Hair Shampoo",
        price: 210,
        image: "resor/Hair Shampoo.jpeg",
        description: "Shampoo for your hair-care routine."
    },
    {
        id: 6,
        name: "Hair Oil",
        price: 150,
        image: "resor/Hair Oil.jpeg",
        description: "Hair oil for your hair-care collection."
    },
    {
        id: 7,
        name: "Perfume",
        price: 210,
        image: "resor/Perfume.jpeg",
        description: "A fragrance for your collection."
    },
    {
        id: 8,
        name: "Cologne",
        price: 900,
        image: "resor/cologne.jpeg",
        description: "A fragrance product."
    }
];

function getCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem("beautyBarCart")
        );

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("beautyBarCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = document.getElementById("cart-count");

    if (!count) {
        return;
    }

    const totalItems = getCart().reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    count.textContent = totalItems;
}

function addToCart(productId) {
    const product = products.find(
        item => item.id === Number(productId)
    );

    if (!product) {
        alert("Sorry, this product could not be found.");
        return;
    }

    const cart = getCart();

    const existingProduct = cart.find(
        item => item.id === product.id
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(product.name + " has been added to your cart.");

    renderCart();
    renderCheckout();
}

function renderProducts() {
    const productList = document.getElementById("product-list");

    if (!productList) {
        return;
    }

    const searchInput = document.getElementById("product-search");
    const sortSelect = document.getElementById("sort-products");
    const feedback = document.getElementById("product-feedback");

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const sortMode = sortSelect ? sortSelect.value : "";

    let shownProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    if (sortMode === "low-high") {
        shownProducts.sort((a, b) => a.price - b.price);
    } else if (sortMode === "high-low") {
        shownProducts.sort((a, b) => b.price - a.price);
    } else if (sortMode === "name") {
        shownProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    productList.replaceChildren();

    if (shownProducts.length === 0) {
        if (feedback) {
            feedback.textContent =
                "No products found. Try another search.";
        }
        return;
    }

    if (feedback) {
        feedback.textContent =
            shownProducts.length + " product(s) found.";
    }

    shownProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");

                 image.src = product.image;
                 image.alt = product.name;
                 image.loading = "lazy";
                 image.decoding = "async";
                 image.width = 95;
                 image.height = 95;
                 
        image.onerror = function () {
            image.alt =
                product.name +
                " picture is missing. Check the image filename.";
            image.removeAttribute("src");
        };

        const info = document.createElement("div");
        info.className = "product-info";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.textContent = product.description;

        const price = document.createElement("p");
        price.textContent = "Price: R" + product.price;

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Add to Cart";

        button.addEventListener("click", function () {
            addToCart(product.id);
        });

        info.append(name, description, price, button);
        card.append(image, info);
        productList.append(card);
    });
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if (!cartItems || !totalElement) {
        return;
    }

    const cart = getCart();
    cartItems.replaceChildren();

    let total = 0;

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
        totalElement.textContent = "Total: R0";
        return;
    }

    cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "cart-row";

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = item.name;

        const subtotal = document.createElement("p");
        subtotal.textContent =
            "Price: R" + item.price +
            " | Subtotal: R" +
            item.price * item.quantity;

        total += item.price * item.quantity;

        details.append(name, subtotal);

        const actions = document.createElement("div");
        actions.className = "cart-actions";

        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        minus.setAttribute(
            "aria-label",
            "Decrease " + item.name + " quantity"
        );
        minus.addEventListener("click", function () {
            changeQuantity(index, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        plus.setAttribute(
            "aria-label",
            "Increase " + item.name + " quantity"
        );
        plus.addEventListener("click", function () {
            changeQuantity(index, 1);
        });

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remove";
        remove.addEventListener("click", function () {
            removeItem(index);
        });

        actions.append(minus, quantity, plus, remove);
        row.append(details, actions);
        cartItems.append(row);
    });

    totalElement.textContent = "Total: R" + total;
}

function changeQuantity(index, amount) {
    const cart = getCart();

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
    renderCheckout();
}

function removeItem(index) {
    const cart = getCart();

    if (index < 0 || index >= cart.length) {
        return;
    }

    cart.splice(index, 1);

    saveCart(cart);
    renderCart();
    renderCheckout();
}

function renderCheckout() {
    const items = document.getElementById("checkout-items");
    const totalElement = document.getElementById("checkout-total");
    const form = document.getElementById("checkout-form");

    if (!items || !totalElement || !form) {
        return;
    }

    const cart = getCart();
    items.replaceChildren();

    let total = 0;

    cart.forEach(item => {
        const line = document.createElement("p");

        line.textContent =
            item.name + " x " + item.quantity +
            " — R" + item.price * item.quantity;

        total += item.price * item.quantity;
        items.append(line);
    });

    const submitButton = form.querySelector(
        "button[type='submit']"
    );

    if (cart.length === 0) {
        items.textContent =
            "Your cart is empty. Add products before checkout.";

        if (submitButton) {
            submitButton.disabled = true;
        }
    } else if (submitButton) {
        submitButton.disabled = false;
    }

    totalElement.textContent = "Total: R" + total;
}

function setupMessageForm(formId, feedbackId, successMessage) {
    const form = document.getElementById(formId);
    const feedback = document.getElementById(feedbackId);

    if (!form || !feedback) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const message = form.querySelector("textarea");

        if (message && message.value.trim().length < 10) {
            feedback.textContent =
                "Please enter a message containing at least 10 characters.";

            message.focus();
            return;
        }

        feedback.textContent = successMessage;
        form.reset();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    renderProducts();
    renderCart();
    renderCheckout();

    const searchInput = document.getElementById("product-search");
    const sortSelect = document.getElementById("sort-products");

    if (searchInput) {
        searchInput.addEventListener("input", renderProducts);
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", renderProducts);
    }

    setupMessageForm(
        "enquiry-form",
        "enquiry-feedback",
        "Your enquiry passed validation. This demonstration does not send it to the store."
    );

    setupMessageForm(
        "contact-form",
        "contact-feedback",
        "Your message passed validation. This demonstration does not email it."
    );

    const accountForm = document.getElementById("account-form");

    if (accountForm) {
        accountForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!accountForm.checkValidity()) {
                accountForm.reportValidity();
                return;
            }

            const password = document.getElementById("account-password");
            const confirmPassword = document.getElementById("confirmPassword");
            const feedback = document.getElementById("account-feedback");

            if (!password || !confirmPassword || !feedback) {
                return;
            }

            if (password.value !== confirmPassword.value) {
                feedback.textContent = "The passwords do not match.";
                confirmPassword.focus();
                return;
            }

            feedback.textContent =
                "The form passed validation. Real account creation needs a secure account system.";

            accountForm.reset();
        });
    }

    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!loginForm.checkValidity()) {
                loginForm.reportValidity();
                return;
            }

            const feedback = document.getElementById("login-feedback");

            if (feedback) {
                feedback.textContent =
                    "This demonstration login is not connected to a real account system.";
            }

            loginForm.reset();
        });
    }

    const checkoutForm = document.getElementById("checkout-form");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!checkoutForm.checkValidity()) {
                checkoutForm.reportValidity();
                return;
            }

            const feedback = document.getElementById("checkout-feedback");

            if (getCart().length === 0) {
                if (feedback) {
                    feedback.textContent = "Your cart is empty.";
                }
                return;
            }

            if (feedback) {
                feedback.textContent =
                    "Thank you. Your demonstration order is complete. No payment was processed.";
            }

            localStorage.removeItem("beautyBarCart");

            updateCartCount();
            checkoutForm.reset();
            renderCart();
            renderCheckout();
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {

    
    const images = document.querySelectorAll(".home-display, .product-image");

    const imageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("show-image");
                imageObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    images.forEach(function (image) {
        image.classList.add("hidden-image");
        imageObserver.observe(image);
    });

   
    const map = document.querySelector(".map-container");

    if (map) {
        map.classList.add("map-animation");
    }

   
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

});
