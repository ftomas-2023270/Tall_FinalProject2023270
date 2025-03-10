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
                msg: "No 'Default' category found. Please create it first."
            });
        }

        // Desactivar la categoría
        const cat = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!cat) {
            return res.status(404).json({
                success: false,
                msg: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Category desactivated. Associated products were moved to 'Default'.",
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