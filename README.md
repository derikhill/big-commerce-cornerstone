# Cornerstone
- This theme customization was started with adding a "Special Items" category then adding a "Special Item" from 
from the control panel of a Big Commerce store. 
- When on the Special Items category a user can hover on the initial image to reveal a second image. 
- A button has been added to the top of the page where a user can add all items on the page to the cart
    - A second button is then added to remove all items from the cart
Rendering the images to toggle on are retrieved using the Storefront GraphQL API

##### Files I changed:
    - assets/js/theme/category.js
        - added logic to retrieve imgaes and determine if the category is Special Items to change images on hover
    - assets/js/theme/global.js
        - import custom function
    - assets/js/theme/global/modal.js
        - Addition of a success modal when adding/deleting items to/from cart
    - lang/en.json
        - same convention for adding button text to Handlebars elements
    - templates/components/category/product-listing.html
        - if category is Special Items add html file to add buttons
    - templates/components/common/body.html
        - include success modal
    - templates/components/products/card.html
        - get token for api requests, add hidden field to retrieve product id
        
##### Files I added: 
    - templates/components/common/success-modal.html
    - templates/pages/custom/special-item.html
    - assets/js/theme/special-item.js
