import { createInfo } from "../controllers/info.route";

const route = express.Router();

route.post("/create" , createInfo);

export default route; 