import { Router } from "express"
import { AeronaveController } from "../controllers/AeronaveController"
import { PecaController } from "../controllers/PecaController"
import { EtapaController } from "../controllers/EtapaController"
import { TesteController } from "../controllers/TesteController"
import { RelatorioController } from "../controllers/RelatorioController"
import { FuncionarioController } from "../controllers/FuncionarioController"
import { autenticar } from "../middleware/auth"

const router = Router()
const aeronaveController = new AeronaveController()
const pecaController = new PecaController()
const etapaController = new EtapaController()
const testeController = new TesteController()
const relatorioController = new RelatorioController()
const funcionarioController = new FuncionarioController()

// Rota pública
router.post("/login", (req, res) => funcionarioController.login(req, res))

// Rotas protegidas por JWT
router.get("/aeronaves", autenticar, (req, res) => aeronaveController.listar(req, res))
router.post("/aeronaves", autenticar, (req, res) => aeronaveController.criar(req, res))

router.post("/aeronaves/:codigo/pecas", autenticar, (req, res) => pecaController.adicionar(req, res))
router.patch("/aeronaves/:codigo/pecas/:pecaId", autenticar, (req, res) => pecaController.avancarStatus(req, res))

router.post("/aeronaves/:codigo/etapas", autenticar, (req, res) => etapaController.criar(req, res))
router.patch("/aeronaves/:codigo/etapas/:etapaId/iniciar", autenticar, (req, res) => etapaController.iniciar(req, res))
router.patch("/aeronaves/:codigo/etapas/:etapaId/finalizar", autenticar, (req, res) => etapaController.finalizar(req, res))

router.post("/aeronaves/:codigo/testes", autenticar, (req, res) => testeController.adicionar(req, res))

router.get("/relatorios", autenticar, (req, res) => relatorioController.listar(req, res))
router.post("/relatorios", autenticar, (req, res) => relatorioController.gerar(req, res))

router.get("/funcionarios", autenticar, (req, res) => funcionarioController.listar(req, res))
router.post("/funcionarios", autenticar, (req, res) => funcionarioController.criar(req, res))

export default router