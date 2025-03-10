import Category from "../cat/cat.model.js";
import Product from "./product.model.js";

export const saveProduct = async(req, res )=>{
    try {
        const data = req.body;
        const cat = await Category.findOne({name: data.cat});
        

        if(!cat){
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            })
        }

        const product = new Product({
            ...data,
            cat: cat._id
        });

        await product.save();

        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message: "Error saving the product",
            error
        })
    }
}

export const getProduct = async (req, res) => {
    try {
        const { limite = 10, desde = 0, sellest, soldOut, category } = req.query;

        let query = { status: true };

        // Filtrar por productos agotados si soldOut está presente
        if (soldOut) {
            query.stock = 0;
        }

        // Filtrar por categoría si se proporciona el nombre de la categoría
        if (category) {
            const categoryData = await Category.findOne({ name: category });
            if (!categoryData) {
                return res.status(404).json({
                    success: false,
                    msg: "Category not found"
                });
            }
            query.cat = categoryData._id; // Filtra los productos con esta categoría
        }

        // Configurar el orden de los productos si se solicita sort por sell
        let sortOption = {};
        if (sellest) {
            sortOption.sell = -1; // Orden descendente (más vendidos primero)
        }

        // Obtener los productos filtrados y ordenados
        const products = await Product.find(query)
            .sort(sortOption)
            .skip(Number(desde))
            .limit(Number(limite));

        // Obtener los nombres de las categorías asociadas
        const productsWCategory = await Promise.all(
            products.map(async (product) => {
                const cat = await Category.findById(product.cat);
                return {
                    ...product.toObject(),
                    cat: cat ? cat.name : "Category not found"
                };
            })
        );

        // Contar el total de productos después de aplicar los filtros
        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            products: productsWCategory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting products",
            error: error.message
        });
    }
};


export const searchProduct = async (req, res) =>{

    const {id}= req.params;

    try {
        
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        const cat = await Category.findById(product.cat);

        res.status(200).json({
            success: true,
            product:{
                ...product.toObject(),
                cat: cat ? cat.name : "Category not found"
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching product',
            error: error.message
        })
    }
}


export const deleteProduct  = async (req,res ) =>{

    const {id}= req.params;
    try {
        
        await Product.findByIdAndUpdate(id,{status: false});

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        })
    }
}

export const updateProduct = async (req, res) => {
    
    const {id} = req.params;
    const {...data} = req.body;

    try {
    
        const product = await Product.findByIdAndUpdate(id,data,{new: true});
        
        res.status(200).json({
            success: true,
            message: 'Product updated',
            product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        })
    }
}