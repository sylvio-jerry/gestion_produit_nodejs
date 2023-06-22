const { PrismaClient } = require('@prisma/client')
const { produit } = new PrismaClient()
const { validate } = require('../requests/produitRequest')
const { sendResponse, sendError } = require('./baseController')

module.exports={
    getAll: async (req, res, next) => {
        try {
            const all_produit = await produit.findMany()
            sendResponse(res, all_produit, "Liste des produits")
 
        } catch (error) {
            return sendError(res)
        }
     },
     getProduitInformation: async (req, res, next) => {
        try {
            let minPrix = await getValueMinPrix();
            let maxPrix = await getValueMaxPrix();
            let totalMontant = await getValueTotalPrix();

            info = {minPrix:minPrix,maxPrix:maxPrix,totalMontant:totalMontant}
        
            sendResponse(res, info, "Produit Information")
 
        } catch (error) {
            return sendError(res)
        }
     }, 
     getTotalMontant: async (req, res, next) => {
          try {
            const produit__ = await produit.findMany();
            let totalMontant = 0;
    
            produit__.forEach((pro) => {
                const montant = pro.quantite * pro.prix;
                totalMontant += montant;
            });
    
            sendResponse(res, totalMontant, "totalMontant des produits")
    
        } catch (error) {
            sendError(res)
      }
     }, 
     getMinPrix: async (req, res, next) => {
        try {
            const result = await produit.aggregate({
                _min: {
                  prix: true
                }
              });
            
              if (!result._min.prix) {
                return 0; 
              }

            sendResponse(res, result, "minimumPrix de produit")
 
        } catch (error) {
            return sendError(res)
        }
     }, 
     getMaxPrix: async (req, res, next) => {
        try {
            const result = await produit.aggregate({
                _max: {
                  prix: true
                }
              });
            
              if (!result._max.prix) {
                return 0; 
              }
            
            sendResponse(res, result, "maximumPrix")
 
        } catch (error) {
            return sendError(res)
        }
     }, 
     getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const produit_ = await produit.findFirst({
                 where: { id: +id }
             })
 
             sendResponse(res, produit_, "Information sur le produit")
 
         } catch (error) {
            return sendError(res)
         }
     }, 
     create: async (req, res, next) => {
        try {
            // Validate request 
           const { error } = validate(req.body)
            if(error){
                console.log(error.details[0].message);
                return  sendError(res)
            }

            //Destructuring the body
            const {design,prix,quantite}=req.body;
            const num_produit = await generateNumProduit();
            //create new client
             const new_produit = await produit.create({
                data: {
                  num_produit,design,prix,quantite
                }
              })

              return sendResponse(res, new_produit, "Ajout avec succès")
            
        } catch (error) {
            console.log(error);
            return sendError(res)
        }
    }, 
 
     update: async (req, res, next) => {
        const { id } = req.params
        try {
          const {design,prix,quantite}=req.body;
            // Validate request 
            const { error } = validate(req.body)
            if(error) return sendError(res,error.details[0].message)
           
            const updated_produit =  await produit.update({
               where: { id: +id },
               data:{
                design,prix,quantite
               }
           })

           return sendResponse(res, updated_produit, "Mise à jour avec succès")
        } catch (error) {
            return sendError(res)
        }
    }, 
 
     delete: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 

         try {
            const deleted_produit = await produit.delete({
                where: { id: +id } // convert id to number <===> parseInt(id), Number(id)
            })
             return sendResponse(res, deleted_produit, "Suppression avec succès")
 
         } catch (error) {
            return sendError(res)
            
         }
     },
     getNewNumero: async (req, res, next) => {
        try {
            const lastProduit = await produit.findFirst({
                orderBy: {
                  id: 'desc'
                },
                select: {
                  id: true
                }
              });
            
              const newId = lastProduit ? lastProduit.id + 1 : 1;
              const paddedId = String(newId).padStart(3, '0');
            let new_num = `Pro-${paddedId}`;
            return sendResponse(res, new_num, "Nouveau numero")
 
         } catch (error) {
            return sendError(res)
         }
        
     }
}

const generateNumProduit = async () => {
    const lastProduit = await produit.findFirst({
      orderBy: {
        id: 'desc'
      },
      select: {
        id: true
      }
    });
  
    const newId = lastProduit ? lastProduit.id + 1 : 1;
    const paddedId = String(newId).padStart(3, '0');
  
    return `Pro-${paddedId}`;
  };

  const getValueMinPrix = async () => {
    try {
        const result = await produit.aggregate({
            _min: {
              prix: true
            }
          });
        
          if (!result._min.prix) {
            return 0;
          }

        return result;

    } catch (error) {
        console.log(error);
    }
  };
  const getValueMaxPrix = async () => {
    try {
        const result = await produit.aggregate({
            _max: {
              prix: true
            }
          });
        
          if (!result._max.prix) {
            return 0; 
          }
      

        return result;

    } catch (error) {
        console.log(error);
    }
  };
  const getValueTotalPrix = async () => {
    try {
        const produit__ = await produit.findMany();
        let totalMontant = 0;

        produit__.forEach((pro) => {
            const montant = pro.quantite * pro.prix;
            totalMontant += montant;
        });

        return totalMontant;

    } catch (error) {
        console.log(error);
    }
  };