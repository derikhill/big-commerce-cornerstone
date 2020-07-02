import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';

export default class Category extends CatalogPage {
    onReady() {
        compareProducts(this.context.urls);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        const token = this.context.token;
        const imagesArr = [];
        let imgSize;

        if (this.context.themeSettings.zoom_size.indexOf('1280') !== -1) {
            imgSize = this.context.themeSettings.zoom_size.slice(0, 4);
        } else {
            imgSize = this.context.themeSettings.zoom_size.slice(0, 3);
        }

        function getImages() {
            fetch(
                '/graphql',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        query: `
                            query SrcsetImages {
                                site {
                                    product(entityId: 112) {
                                        images {
                                            edges {
                                                node {
                                                    url${imgSize}wide: url(width: ${imgSize})
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        `,
                    }),
                },
            )
                .then(response => response.json())
                .then(response => {
                    response.data.site.product.images.edges.forEach(imgPush => {
                        imagesArr.push(imgPush);
                    });
                });
        }
        if (this.context.categoryId === 24) {
            getImages();

            const cardContainer = document.querySelectorAll('.card-img-container > img');

            cardContainer.forEach(cardImg => {
                $('.card-img-container').mouseover(() => {
                    Object.assign(cardImg, {
                        src: Object.values(Object.values(imagesArr[1])[0]),
                        srcset: Object.values(Object.values(imagesArr[1])[0]),
                    });
                });
                $('.card-img-container').mouseout(() => {
                    Object.assign(cardImg, {
                        src: Object.values(Object.values(imagesArr[0])[0]),
                        srcset: Object.values(Object.values(imagesArr[0])[0]),
                    });
                });
            });
        }
    }

    initFacetedSearch() {
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        });
    }
}
