import express from "express";

const router = express.Router();

// Rutas de vistas
router.get('/', (req, res) => res.render('index'));
router.get('/error', (req, res) => res.render('error'));
router.get('/billetera', (req, res) => res.render('billetera'));
router.get('/menu', (req, res) => res.render('menu'));
router.get('/sucursal', (req, res) => res.render('sucursal'));
router.get('/catalogo', (req, res) => res.render('catalogo'));
router.get('/requisicion', (req, res) => res.render('requisicion'));
router.get('/requisicionD', (req, res) => res.render('requisicionForm'));
router.get('/usuarios', (req, res) => res.render('usuarios'));
router.get('/entrega', (req, res) => res.render('entrega'));
router.get('/entregaD', (req, res) => res.render('entregaForm'));
router.get('/infEntregaFecha', (req, res) => res.render('infEntregaFecha'));

export default router;
