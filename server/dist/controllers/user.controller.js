import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
const expiration = 3 * 24 * 60 * 60; /// 3 days
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: expiration
    });
};
export const signIn = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user)
            throw Error("Incorrect username!");
        const auth = await bcrypt.compare(password, user.password);
        if (!auth)
            throw Error("Incorrect password!");
        const token = createToken(user.id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: expiration * 1000 });
        return res.status(200).json({ user: user.id });
    }
    catch (err) {
        return res.status(401).json({ err: err.message });
    }
};
export const signUp = async (req, res) => {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(401).json({ msg: "Username already exists!" });
        }
        const user = await User.create({ username, password: hashedPassword });
        const token = createToken(user.id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: expiration * 1000 });
        return res.status(201).json({ user: user.id });
    }
    catch (err) {
        return res.status(400).json({ msg: err.message });
    }
};
//# sourceMappingURL=user.controller.js.map