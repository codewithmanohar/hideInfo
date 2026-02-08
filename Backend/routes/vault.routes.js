import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  listVault,
  createVaultItem,
  updateVaultItem,
  deleteVaultItem,
  revealPassword
} from "../controllers/vault.controller.js";

const router = Router();

router.get("/", requireAuth, listVault);
router.post("/", requireAuth, createVaultItem);
router.put("/:id", requireAuth, updateVaultItem);
router.delete("/:id", requireAuth, deleteVaultItem);
router.post("/:id/reveal", requireAuth, revealPassword);

export default router;
