import axios from 'axios';

const updateProductsQuantity = async () => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products');
        const productsWithQuantity = response.data.map(product => ({
            ...product,
            quantity: Math.floor(Math.random() * 100) + 1 
        }));
        return productsWithQuantity;
    } catch (error) {
        console.error('Error updating products:', error);
    }
};
// מיצא את המערך בכדי לעבוד עליו בעריכות
let AllProducts = await updateProductsQuantity();



export  {AllProducts}

