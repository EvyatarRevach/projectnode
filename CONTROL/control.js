import { AllProducts } from "../DAL/products.js";
import jsonfile from 'jsonfile';
import bcrypt from 'bcrypt';
import shortid from 'shortid';
// console.log(AllProducts)


export function allProducts() {
    return AllProducts;
}


export async function productById(productId, res) {
    const product = AllProducts.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    } else {
        return res.json(product);
    }
}

export async function toAddProduct(product, res) {
    try {
        if (product.id && product.title && product.price && product.description && product.category && product.image && product.rating.rate && product.rating.count && product.quantity) {
            AllProducts.push(product)
            res.send('The product has been successfully added')
        } else {
            throw new error('The product has not been added. Please complete the missing details')
        }
    } catch (error) {
        res.send(error)
    }
    
}

export async function toEdit(productId, productDetails, res) {
    const productIndex = AllProducts.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    AllProducts[productIndex] = { ...AllProducts[productIndex], ...productDetails };
    return res.send('Product has been successfully edited');
};

export async function toDeleteProduct(productId, res) {
    const productIndex = AllProducts.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    AllProducts.splice(productIndex, 1);
    return res.send('Product has been successfully deleted');
}



export async function addUser(req, res) {
    const saltRounds = 10;
    const user = req.body;
    if (user.password && user.email && user.name) {
        try {
            user.id = shortid.generate();
            user.password = await bcrypt.hash(user.password, saltRounds);
            const users = await jsonfile.readFile('./users.json');

            const existingUser = users.find(existingUser => existingUser.email === user.email);
            if (existingUser) {
                return res.send('User with this email already exists');
            }

            users.push(user);

            await jsonfile.writeFile('./users.json', users, { spaces: 2 });

            res.send('User added successfully');
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.send('The user has not been added. Please complete the missing details');
    }

}
export async function logIn(req, res) {
    const user = req.body;
    if (user.password && user.email) {
        try {
            const users = await jsonfile.readFile('./users.json');

            const existingUser = users.find(existingUser => existingUser.email === user.email);

            if (existingUser) {
                const passwordMatch = await bcrypt.compare(user.password, existingUser.password);
                if (passwordMatch) {
                    return res.send('User logged in successfully');
                } else {
                    return res.send('Invalid password');
                }
            } else {
                return res.send('User not found');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.send('Please provide both email and password');
    }
}
