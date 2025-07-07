import asyncHandler from 'express-async-handler';
import passport from "../utils/passport-config.js"
import UserLogin from '../models/userLoginModel.js';
import generateToken from '../utils/generateToken.js';
import path from "path"
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import ldap from 'ldapjs';



// LDAP server connection settings
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

//@desc Auth user/set token
//route POST /api/users/auth
//@access Public
export const authUser = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    passport.authenticate('ldapauth', { session: false }, async (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Authentication Failed' });
        } else if (!user) {
            return res.status(401).json({ message: 'Authentication Error' });
        }

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


//@desc Logout a User and clear cookie
//route POST /api/users/logout
//@access Public
export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    return res.status(200).json({ message: 'User logged out' });
});

//@desc Get user Profile
//route GET /api/users/profile
//@access Private Role: User
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

//@desc Get All user Profile
//route GET /api/users/profile
//@access Private Role: Admin
export const getAllUsers = asyncHandler(async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            const { search, status, role } = req.query;

            let query = {};

            // Search functionality
            if (search) {
                const numericSearch = Number(search); // Try to convert search to a number

                if (!isNaN(numericSearch)) {
                    query.$or = [
                        { uId: numericSearch }
                    ];
                } else {
                    query.$or = [
                        { username: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } }
                    ];
                }
            }

            if (status) {
                query.status = status;
            }

            if (role) {
                query.role = role;
            }

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

//@desc Get All user Profile
//route POST /api/users/add
//@access Private Role: Admin
export const addUser = asyncHandler(async (req, res) => {
    const { username, password, email, status, role } = req.body;


    // Check if the username already exists
    const existingUser = await UserLogin.findOne({ username });
    if (existingUser) {
        res.status(400);
        throw new Error('Username already exists')
    }

    // Path to your script
    const scriptPath = path.join(__dirname, '../scripts/add-user.sh');

    // Command to execute the script
    const command = `bash ${scriptPath} ${username} ${password}`;

    exec(command, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Script error: ${stderr}`);
            return res.status(500).json({ message: 'Failed to add user to the system' });
        }

        // Script executed successfully, now get the user ID
        const uidCommand = `id -u ${username}`;
        exec(uidCommand, async (uidError, uidStdout, uidStderr) => {
            if (uidError) {
                console.error(`UID command error: ${uidStderr}`);
                return res.status(500).json({ message: 'Failed to get user ID' });
            }

            const userId = uidStdout.trim();

            // Now add the user to the database
            try {
                const userFields = { username, password, email, uId: userId };
                
                // Include status and role if they are provided
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















//@desc Get User with id
//route POST /api/users/:uId
//@access Private Role: Admin
export const getUserByUID = asyncHandler(async (req, res) => {
    const { uId } = req.params;

    // First, search for the user in your database
    const user = await UserLogin.findOne({ uId }).select('-password');

    if (user) {
        const searchOptions = {
            filter: `(uidNumber=${uId})`,
            scope: 'sub',
            attributes: ['dn', 'cn', 'uid','gidNumber','homeDirectory','sn','uidNumber','loginShell','shadowInactive','shadowLastChange','shadowMax','shadowMin','shadowWarning'] // Modify these attributes as needed
        };

        ldapClient.search('ou=users,dc=aura,dc=hpc,dc=org', searchOptions, (error, searchRes) => {
            if (error) {
                res.status(500);
                throw new Error('Failed to delete user from the database', error);            
            }

            let userFound = false;
            searchRes.on('searchEntry', (entry) => {
                userFound = true;

                // Manually create a user object based on the attributes available
                const userObject = {
                    username : user.username,
                    email : user.email,
                    status : user && user.status,
                    role: user && user.role,
                    uid: entry.attributes.find(attr => attr.type === 'uid')?.values[0],
                    cn: entry.attributes.find(attr => attr.type === 'cn')?.values[0],
                    gidNumber: entry.attributes.find(attr => attr.type === 'gidNumber')?.values[0],
                    homeDirectory: entry.attributes.find(attr => attr.type === 'homeDirectory')?.values[0],
                    sn: entry.attributes.find(attr => attr.type === 'sn')?.values[0],
                    uidNumber: entry.attributes.find(attr => attr.type === 'uidNumber')?.values[0],                   // what is the meaning of this when we already have the GID. what is the difference between UI and the GID 9;
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

//@desc Get User with id
//route PATCH /api/users/:uID
//@access Private Role: Admin
export const updateUserByUID = asyncHandler(async (req, res) => {
    const { uId } = req.params; 
    const {
        username,
        email,
        loginShell,
        shadowInactive,
        shadowLastChange,
        shadowMax,
        shadowMin,
        shadowWarning,
        status,
        role
    } = req.body;

   

    // Find the user by uId in MongoDB
    const existingUser = await UserLogin.findOne({ uId });

    if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    existingUser.username = username || existingUser.username;
    existingUser.email = email || existingUser.email;
    existingUser.status = status || existingUser.status;
    existingUser.role = role || existingUser.role;

    // Save the updated user back to MongoDB
    await existingUser.save();

    // Path to your script
    const scriptPath = path.join(__dirname, '../scripts/edit-user.sh');

    // Command to execute the script
    const command = `bash ${scriptPath} ${username || ''} ${loginShell || ''} ${shadowInactive || ''} ${shadowLastChange || ''} ${shadowMax || ''} ${shadowMin || ''} ${shadowWarning || ''}`;

    // Execute the script
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return res.status(500).json({ message: 'Error updating user details in the system', error: error.message });
        }

        if (stderr) {
            console.error(`Script stderr: ${stderr}`);
            return res.status(500).json({ message: 'Script execution error', error: stderr });
        }

        console.log(`Script stdout: ${stdout}`);
        return res.status(200).json({ message: 'User updated successfully', user: existingUser });
    });
});




//route PATCH /api/users/:uID
//@access Private Role: Admin
export const updateUserPassword = asyncHandler(async (req, res) => {
    const { uId } = req.params; 
    const {
        username,
        password
    } = req.body;

   

    // Find the user by uId in MongoDB
    const existingUser = await UserLogin.findOne({ uId });

    if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    existingUser.passwoprd = password || existingUser.password;


    // Save the updated user back to MongoDB
    await existingUser.save();

    // Path to your script
    const scriptPath = path.join(__dirname, '../scripts/update-password.sh');

    // Command to execute the script
    const command = `bash ${scriptPath} ${username || ''} ${password || ''} `;

    // Execute the script
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return res.status(500).json({ message: 'Error updating user password in the system', error: error.message });
        }

        if (stderr) {
            console.error(`Script stderr: ${stderr}`);
            return res.status(500).json({ message: 'Script execution error', error: stderr });
        }

        console.log(`Script stdout: ${stdout}`);
        return res.status(200).json({ message: 'User Password successfully', user: existingUser });
    });
});




//@desc Get User with id
//route DELETE /api/users/:uID
//@access Private Role: Admin
export const deleteUserByUID = asyncHandler(async (req, res, next) => {
    const { uId } = req.params;

    // Find the user by uId
    const user = await UserLogin.findOne({ uId });

    if (!user) {
        res.status(404);
        return next(new Error('User not found'));
    }

    const scriptPath = path.join(__dirname, '../scripts/delete-user.sh');
    const command = `bash ${scriptPath} ${user.username}`;

    exec(command, async (error, stdout, stderr) => {
        if (error) {
            res.status(500)
            throw new Error('Failed to delete user from the system: ' + error.message);
        }

        try {
            await UserLogin.deleteOne({ uId });
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (dbError) {
            res.status(500)
            throw new Error('Failed to delete user from the database: ' + dbError.message);
        }
    });
});


//@desc Get User with id
//route DELETE /api/users/match-password
//@access All Users
export const matchCurrentUserPassword = asyncHandler(async (req, res, next) => {
    const { username } = req.user;
    const { password } = req.body;

    try {
        const userInfo = await UserLogin.findOne({ username });

        if (userInfo) {
           
            if (userInfo.status === 'active') {
                const isPasswordMatch = await userInfo.matchPassword(password);
                

                if (isPasswordMatch) {
                    return res.status(200).json({ message: 'Password Matched' });
                }
            }
        }
        
        res.status(401); // Unauthorized status code
        return next(new Error('Password Not Matched'));
    } catch (error) {
        console.error(`Error in matchCurrentUserPassword: ${error.message}`);
        res.status(500); // Internal Server Error
        return next(error);
    }
});


