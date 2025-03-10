// Middleware para verificar el inventario antes de agregar al carrito
export const validStock = async (req, res, next) => {
    try {
        const { productId, cant } = req.body;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock < cant) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
