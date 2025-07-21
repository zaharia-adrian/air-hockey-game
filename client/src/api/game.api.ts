import axios from './index'

export const getConnectedUsers = () =>axios.get(`/connected-users`);
