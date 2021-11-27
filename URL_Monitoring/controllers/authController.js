const { User, validateUser } = require('../models/user');
const jwt = require('jsonwebtoken');
const sendEmail = require("../notifications/email");


const signUp = async (req, res) => {

    try {
        const error = validateUser(req.body);
        if (error.error) return res.status(400).send(error.error.message);

        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).send("User with given email already exist!");

        user = await new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,

        }).save();

        const token = generateToken(user.id);
        const data = {
            accessToken: token,
        };
        
        const message = `Please Activate your mail from this link: ${process.env.BASE_URL}auth/verify/email?token=${token}`;
        await sendEmail(user.email, "Verify Email", message);

        res.status(201).send({
            data,
            message: 'Registered Successfully  ( An Email sent to your account please verify ) ',
        });
     
    }

    catch (error) {
        res.status(400).send("An error occured");
    }

};

const verifyEmail = async (req, res) => {
    try {

        const user_id = jwt.verify(req.query.token, process.env.JWT_SECRET);
        await User.updateOne({ _id: user_id.id, verified: true });
       
        res.status(200).send({
            message: "Mail Verified Successfully",
        });
       
    } catch (error) {
        res.status(400).send("An error occured");
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({
                message: 'Invalid Email or Password',
            });
        }

        if (!user.verified) {
            return res.status(400).send({
                message: 'Email is not verified',
            });
        }

        const passwordIsValid = password==user.password? true:false ;

        if (!passwordIsValid) {
            return res.status(400).send({
                message: 'Invalid Email or Password',
            });
        }

        
        const token = generateToken(user.id);

        res.status(200).send({
            accessToken: token,
            message:'Logged In Successfully'

        });
    } catch (err) {
        res.status(500).send({
            message: 'Server Error',
        });
    }
};

const generateToken = (userId) => {
    // assign the three parts ot the token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: 172800, // 8 hours
    });

    return token;
};

module.exports = {
    signUp,
    signIn,
    verifyEmail
};