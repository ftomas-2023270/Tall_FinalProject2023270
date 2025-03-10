import Category from '../cat/cat.model.js';  // Asegúrate de importar el modelo Category
import Product from '../product/product.model.js';    // Asegúrate de importar el modelo Product

export const moveProductsToDefaultCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Buscar la categoría "Default"
        const defaultCategory = await Category.findOne({ name: "Default" });
        if (!defaultCategory) {
            return res.status(400).json({
                success: false,
                msg: "No 'Default' category found. Please create it first."
            });
        }

        // Verificar si hay productos asociados a la categoría que se quiere eliminar
        const productsWithCat = await Product.find({ cat: id });
        if (productsWithCat.length > 0) {
            // Actualizar los productos a la categoría "Default"
            await Product.updateMany({ cat: id }, { cat: defaultCategory._id });
            console.log(`Moved ${productsWithCat.length} products to 'Default' category.`);
        }

        // Pasar al siguiente middleware o controlador
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error while moving products to 'Default' category",
            error: error.message
        });
    }
};
