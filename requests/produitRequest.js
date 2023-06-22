const joi = require('@hapi/joi');

module.exports = {
    validate: (data) => {
        const schema = joi.object({
            id: joi.any(),
            num_produit: joi.any(),
            design: joi.any(),
            prix: joi.any(),
            quantite: joi.any()
        })

        return schema.validate(data)
    }
}
