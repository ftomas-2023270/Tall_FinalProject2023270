import Car from "../car/car.model.js";
import Product from "../product/product.model.js";
import Invoice from "../invoice/invoice.model.js";

// Agregar productos al carrito y restar del stock
export const addToCart = async (req, res) => {
    try {
        const clientId = req.usuario._id;
        const { productId, cant } = req.body;
        
        let cart = await Car.findOne({ client: clientId });
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.stock < cant) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        if (!cart) {
            cart = new Car({ client: clientId, items: [], total: 0 });
        }

        const subTotal = product.price * cant;
        cart.items.push({ _id: productId, nameP: product.name, cant, price: product.price, subTotal });
        cart.total += subTotal;

        // Restar stock
        product.stock -= cant;
        await product.save();
        await cart.save();

        res.json({ message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Editar productos en el carrito y ajustar stock
export const editCart = async (req, res) => {
    try {
        const clientId = req.usuario._id;
        const { productId, cant } = req.body;

        let cart = await Car.findOne({ client: clientId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        let item = cart.items.find(item => item._id.toString() === productId);
        if (!item) return res.status(404).json({ message: "Product not found in cart" });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let diff = cant - item.cant; // Diferencia entre la nueva y la anterior cantidad

        if (diff > 0 && product.stock < diff) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        // Ajustar stock
        product.stock -= diff;
        await product.save();

        // Actualizar carrito
        cart.total -= item.subTotal;
        item.cant = cant;
        item.subTotal = product.price * cant;
        cart.total += item.subTotal;

        await cart.save();
        res.json({ message: "Cart updated", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Eliminar un producto del carrito y devolver stock
export const removeFromCart = async (req, res) => {
    try {
        const clientId = req.usuario._id;
        const { productId } = req.body;

        let cart = await Car.findOne({ client: clientId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        let item = cart.items.find(item => item._id.toString() === productId);
        if (!item) return res.status(404).json({ message: "Product not found in cart" });

        const product = await Product.findById(productId);
        if (product) {
            product.stock += item.cant; // Devolver stock
            await product.save();
        }

        cart.items = cart.items.filter(item => item._id.toString() !== productId);
        cart.total = cart.items.reduce((acc, item) => acc + item.subTotal, 0);
        await cart.save();

        res.json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Confirmar compra y generar factura
export const confirmPurchase = async (req, res) => {
    try {
        const clientId = req.usuario._id;
        const cart = await Car.findOne({ client: clientId }).populate("items._id");
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const invoice = new Invoice({
            client: clientId,
            items: cart.items,
            total: cart.total,
            date: new Date()
        });

        await invoice.save();
        await Car.findOneAndDelete({ client: clientId });

        res.json({ message: "Purchase confirmed, invoice generated", invoice });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Visualizar el carrito de compras
export const viewCart = async (req, res) => {
    try {
        const clientId = req.usuario._id;
        const cart = await Car.findOne({ client: clientId }).populate("items._id", "name price stock");

        if (!cart) {
            return res.status(404).json({ success: false, msg: "Cart not found" });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error retrieving cart", error });
    }
};
