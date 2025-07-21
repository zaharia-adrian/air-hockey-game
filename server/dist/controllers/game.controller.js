import { getClients } from '../websocket/services/game.service.js';
export const getConnectedUsers = (req, res) => {
    return res.status(200).json({ users: getClients() });
};
//# sourceMappingURL=game.controller.js.map