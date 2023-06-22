const router = require('express').Router()
const produit = require('../controllers/produitController')

router.get('/', produit.getAll)
router.get('/totalMontant', produit.getTotalMontant)
router.get('/minPrix', produit.getMinPrix)
router.get('/newNumero', produit.getNewNumero)
router.get('/maxPrix', produit.getMaxPrix)
router.get('/produit_information', produit.getProduitInformation)
router.get('/:id', produit.getById)
router.post('/', produit.create)
router.put('/:id', produit.update)
router.delete('/:id', produit.delete)

module.exports = router