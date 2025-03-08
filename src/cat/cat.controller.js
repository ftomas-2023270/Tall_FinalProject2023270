
export const deleteCat = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la categoría "Default"
        const defaultCategory = await Category.findOne({ name: "Default" });
        if (!defaultCategory) {
            return res.status(400).json({
                success: false,
                msg: "No existe una categoría 'Default'. Asegúrate de crearla primero."
            });
        }

        // Verificar si hay productos asociados a la categoría que se quiere eliminar
        const productsWithCat = await Product.find({ cat: id });

        if (productsWithCat.length > 0) {
            // Actualizar productos a la categoría "Default"
            await Product.updateMany({ cat: id }, { cat: defaultCategory._id });
        }

        // Desactivar la categoría
        const cat = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!cat) {
            return res.status(404).json({
                success: false,
                msg: "Categoría no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Categoría desactivada. Los productos asociados fueron movidos a 'Default'.",
            cat
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al desactivar categoría",
            error: error.message
        });
    }
};