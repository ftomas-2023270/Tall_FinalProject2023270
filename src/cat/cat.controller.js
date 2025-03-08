import Category from "./cat.model.js";

export const initCat = async(req, res) => {

    try {
        const data = {
            name: 'Default',
            description: 'Default'
        }
        
        if((await Category.findOne({name: data.name }))){
            return console.log('Default category already exist')
        }
        const cat= new Category(data);

        await cat.save()

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Category registration failed",
            error: error.message
        });
    }
}

export const addCat = async(req, res) => {

    try {
        const data = req.body;
        
        const cat = await Category.create({
            name: data.name,
           
            description: data.description
        })

        return res.status(201).json({
            message: "Category registred succesfully",
            catDetails:{
                Category: cat.email
            }
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Category registration failed",
            error: error.message
        });
    }
}


export const getCats = async (req = request, res = response) =>{
    try {
        const {limite = 10, desde = 0} = req.query;
        const query = {status : true};

        const [total, cats] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            cats
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las categorias',
            error
        })
    }
}

export const getCatById = async(req,res)=>{
    try {
        const {id} = req.params;

        const cat = await Category.findById(id);

        if(!cat){
            return res.status(404).json({
                success: false,
                msg: 'Category not found'
            })
        }

        res.status(200).json({
            success : true,
            cat
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener la categoria',
            error
        })
    }
}

export const updateCat = async(req,res = response)=>{
    try {
        
        const {id} = req.params;
        const {...data }= req.body;

        const cat = await Category.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg:'Categoria actualizada',
            cat
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error al actualizar categoria',
            error
        })
    }
}

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