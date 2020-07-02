import { showSuccessModal } from './global/modal';

export default function () {
    let cartId;
    const url = cartId ? `/api/storefront/carts/${cartId}/items` : '/api/storefront/carts';
    const pId = document.querySelectorAll('.card-id');
    const specialItemsDiv = document.getElementById('special-items-add');
    let itemId;
    let data = {};

    pId.forEach(prodId => {
        data = {
            lineItems: [
                {
                    productId: prodId.value,
                    quantity: 1,
                },
            ],
        };
    });

    function getCart(url) {
        return fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
        })
            .then(response => response.json());
    }

    function addToCart(url, data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'same-origin',
        };

        return fetch(url, options)
            .then(response => response.json())
            .then(cartData => {
                cartId = cartData.id;
                itemId = cartData.lineItems.physicalItems[0].id;
                specialItemsDiv.innerHTML += `<a id="removeAllFromCart" data-wait-message="{{lang 'products.removing_from_cart'}}" class="button button--small remove-all-from-cart">Remove Items From Cart</a>`;

                const message = 'Items have been added to cart';

                showSuccessModal(message);
            });
    }

    function deleteCart(url, cartId, item) {
        return fetch(`${url}/${cartId}/items/${item}`, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-type': 'appliaction/json',
            },
        })
            .then(deleteResponse => {
                document.getElementById('removeAllFromCart').remove();

                const message = 'Items have been removed from cart';

                showSuccessModal(message);
            });
    }

    getCart(url)
        .then(response => {
            if (response !== '' && response !== null && response.length !== 0) {
                cartId = response[0].id;
                if (cartId) {
                    if (specialItemsDiv.children.length !== 2) {
                        document.getElementById('special-items-add').innerHTML += `<a id="removeAllFromCart" data-wait-message="{{lang 'products.removing_from_cart'}}" class="button button--small remove-all-from-cart">Remove Items From Cart</a>`;
                    }
                }
            }
        });

    $('body').on('click', '.add-all-to-cart', e => {
        e.preventDefault();
        addToCart(url, data);
    });

    $('body').on('click', '.remove-all-from-cart', e => {
        e.preventDefault();
        getCart(url).then(deleteCart(url, cartId, itemId));
    });
}
