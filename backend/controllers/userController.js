import asyncHandler from 'express-async-handler';
import passport from "../utils/passport-config.js"
import UserLogin from '../models/userLoginModel.js';
import generateToken from '../utils/generateToken.js';
import path from "path"
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import ldap from 'ldapjs';

const ldapClient = ldap.createClient({
    url: 'ldap://aura.hpc.org'
});

ldapClient.bind('cn=Manager,dc=aura,dc=hpc,dc=org', 'secret', (err) => {
    if (err) {
        console.error('LDAP bind failed:', err);
    } else {
        console.log('LDAP bind successful');
    }
})

export const authUser = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    passport.authenticate('ldapauth', { session: false }, async (err, user, info) => {
        if (err) return res.status(500).json({ message: 'Authentication Failed' });
        if (!user) return res.status(401).json({ message: 'Authentication Error' });

        const userInfo = await UserLogin.findOne({ username });
        if (userInfo && userInfo.status === 'active' && userInfo.matchPassword(password)) {
            generateToken(res, userInfo._id);
            return res.status(201).json({
                id: userInfo._id,
                username: userInfo.username,
                password: userInfo.password,
                email: userInfo.email,
                uId: userInfo.uId,
                role: userInfo.role
            });
        } else {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    })(req, res, next);
});

export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    return res.status(200).json({ message: 'User logged out' });
});

export const getUserProfile = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(404);
        throw new Error("User not found");
    }

    const user = {
        _id: req.user._id,
        username: req.user.name,
        email: req.user.email,
        uId: req.user.uId,
        role: req.user.role
    };

    return res.status(200).json(user);
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            const { search, status, role } = req.query;
            let query = {};

            if (search) {
                const numericSearch = Number(search);
                query.$or = !isNaN(numericSearch) ? [{ uId: numericSearch }] : [
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            if (status) query.status = status;
            if (role) query.role = role;

            const allUsers = await UserLogin.find(query).select('-password');
            res.status(200).json(allUsers);
        } else {
            res.status(403);
            throw new Error('Access Denied');
        }
    } catch (error) {
        next(error);
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addUser = asyncHandler(async (req, res) => {
    const { username, password, email, status, role } = req.body;

    const existingUser = await UserLogin.findOne({ username });
    if (existingUser) {
        res.status(400);
        throw new Error('Username already exists')
    }

    const scriptPath = path.join(__dirname, '../scripts/add-user.sh');
    const command = `bash ${scriptPath} ${username} ${password}`;

    exec(command, async (error, stdout, stderr) => {
        if (error) return res.status(500).json({ message: 'Failed to add user to the system' });

        const uidCommand = `id -u ${username}`;
        exec(uidCommand, async (uidError, uidStdout, uidStderr) => {
            if (uidError) return res.status(500).json({ message: 'Failed to get user ID' });

            const userId = uidStdout.trim();
            try {
                const userFields = { username, password, email, uId: userId };
                if (status) userFields.status = status;
                if (role) userFields.role = role;

                const user = new UserLogin(userFields);
                await user.save();
                res.status(201).json({ message: 'User added successfully', userId, user });
            } catch (err) {
                res.status(500).json({ message: 'Failed to add user to the database' });
            }
        });
    });
});

export const getUserByUID = asyncHandler(async (req, res) => {
    const { uId } = req.params;
    const user = await UserLogin.findOne({ uId }).select('-password');

    if (user) {
        const searchOptions = {
            filter: `(uidNumber=${uId})`,
            scope: 'sub',
            attributes: ['dn', 'cn', 'uid','gidNumber','homeDirectory','sn','uidNumber','loginShell','shadowInactive','shadowLastChange','shadowMax','shadowMin','shadowWarning']
        };

        ldapClient.search('ou=users,dc=aura,dc=hpc,dc=org', searchOptions, (error, searchRes) => {
            if (error) {
                res.status(500);
                throw new Error('Failed to search LDAP');
            }

            searchRes.on('searchEntry', (entry) => {
                const userObject = {
                    username : user.username,
                    email : user.email,
                    status : user.status,
                    role: user.role,
                    uid: entry.attributes.find(attr => attr.type === 'uid')?.values[0],
                    cn: entry.attributes.find(attr => attr.type === 'cn')?.values[0],
                    gidNumber: entry.attributes.find(attr => attr.type === 'gidNumber')?.values[0],
                    homeDirectory: entry.attributes.find(attr => attr.type === 'homeDirectory')?.values[0],
                    sn: entry.attributes.find(attr => attr.type === 'sn')?.values[0],
                    uidNumber: entry.attributes.find(attr => attr.type === 'uidNumber')?.values[0],
                    loginShell: entry.attributes.find(attr => attr.type === 'loginShell')?.values[0],
                    shadowInactive: entry.attributes.find(attr => attr.type === 'shadowInactive')?.values[0],
                    shadowLastChange: entry.attributes.find(attr => attr.type === 'shadowLastChange')?.values[0],
                    shadowMax: entry.attributes.find(attr => attr.type === 'shadowMax')?.values[0],
                    shadowMin: entry.attributes.find(attr => attr.type === 'shadowMin')?.values[0],
                    shadowWarning: entry.attributes.find(attr => attr.type === 'shadowWarning')?.values[0],
                };
                res.status(200).json(userObject);
            });
        });
    }
});

export const updateUserByUID = asyncHandler(async (req, res) => {
    const { uId } = req.params; 
    const {
        username, email, loginShell, shadowInactive,
        shadowLastChange, shadowMax, shadowMin,
        shadowWarning, status, role
    } = req.body;

    const existingUser = await UserLogin.findOne({ uId });
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    existingUser.username = username || existingUser.username;
    existingUser.email = email || existingUser.email;
    existingUser.status = status || existingUser.status;
    existingUser.role = role || existingUser.role;

    await existingUser.save();

    const scriptPath = path.join(__dirname, '../scripts/edit-user.sh');
    const command = `bash ${scriptPath} ${username || ''} ${loginShell || ''} ${shadowInactive || ''} ${shadowLastChange || ''} ${shadowMax || ''} ${shadowMin || ''} ${shadowWarning || ''}`;

    exec(command, (error, stdout, stderr) => {
        if (error || stderr) return res.status(500).json({ message: 'Script execution error', error: error?.message || stderr });
        return res.status(200).json({ message: 'User updated successfully', user: existingUser });
    });
});

export const updateUserPassword = asyncHandler(async (req, res) => {
    const { uId } = req.params; 
    const { username, password } = req.body;

    const existingUser = await UserLogin.findOne({ uId });
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    existingUser.password = password || existingUser.password;
    await existingUser.save();

    const scriptPath = path.join(__dirname, '../scripts/update-password.sh');
    const command = `bash ${scriptPath} ${username || ''} ${password || ''}`;

    exec(command, (error, stdout, stderr) => {
        if (error || stderr) return res.status(500).json({ message: 'Script execution error', error: error?.message || stderr });
        return res.status(200).json({ message: 'User Password updated successfully', user: existingUser });
    });
});

export const deleteUserByUID = asyncHandler(async (req, res, next) => {
    const { uId } = req.params;
    const user = await UserLogin.findOne({ uId });
    if (!user) return next(new Error('User not found'));

    const scriptPath = path.join(__dirname, '../scripts/delete-user.sh');
    const command = `bash ${scriptPath} ${user.username}`;

    exec(command, async (error) => {
        if (error) throw new Error('Failed to delete user from the system: ' + error.message);

        try {
            await UserLogin.deleteOne({ uId });
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (dbError) {
            throw new Error('Failed to delete user from the database: ' + dbError.message);
        }
    });
});

export const matchCurrentUserPassword = asyncHandler(async (req, res, next) => {
    const { username } = req.user;
    const { password } = req.body;

    try {
        const userInfo = await UserLogin.findOne({ username });

        if (userInfo && userInfo.status === 'active') {
            const isPasswordMatch = await userInfo.matchPassword(password);
            if (isPasswordMatch) return res.status(200).json({ message: 'Password Matched' });
        }

        res.status(401);
        return next(new Error('Password Not Matched'));
    } catch (error) {
        res.status(500);
        return next(error);
    }
});
