const { Check, validateCheck } = require("../models/check");
const { User, validateUser } = require("../models/user");
const sendEmail = require("../notifications/email");
const sendWebhookNotification = require("../notifications/webhook");
const jwt = require('jsonwebtoken');
const Monitor = require('ping-monitor');

const createCheck = async (req, res) => {

    try {
        req.body.userId = req.user.id;
        const error = validateCheck(req.body);
        if (error.error) return res.status(400).send(error.error.message);

        let check = await new Check(req.body).save();

        res.status(200).send({
            check,
        });
    }
    catch (error) {
        res.status(400).send("An error occured");
    }

};

const updateCheck = async (req, res) => {

    try {

        const check = await Check.findOne({ _id: req.params.id });
        if (!check) return res.status(404).send({ message: 'Check Not Found' });

        if (req.user.id != check.userId) {
            return res.status(403).send({ message: 'Unauthorized' });
        }


        if (req.body.name) {
            const dupCheck = await Check.find({ name: req.body.name });

            if (dupCheck.length) {
                return res.status(400).send({ message: 'Duplicate Name' });
            }
        }

        const updateKeys = Object.keys(req.body);

        updateKeys.forEach((key) => {
            if (key !== 'userId') {
                check[key] = req.body[key];
            }
        });

        check.save();

        return res.status(200).send(check);
    } catch (err) {
        return res.status(500).send({ message: 'Something went wrong' });
    }
};

const deleteCheck = async (req, res) => {

    try {

        var check = await Check.findOne({ _id: req.params.id });

        if (!check) return res.status(404).send({ message: 'Check Not Found' });

        if (req.user.id != check.userId) {
            return res.status(403).send({ message: 'Unauthorized' });
        }
        check = await Check.findOneAndRemove({ _id: req.params.id });

        res.status(200).send({
            check,
        });
    }
    catch (error) {
        res.status(400).send("An error occured");
    }

};

const getCheck = async (req, res) => {
    const check = await Check.find({ name: req.params.name });

    if (check.length==0) return res.status(404).send({ message: 'Check Not Found' });

    const user = await User.findOne({ _id: req.user.id });

    monitorCheck(check, user);

    return res.status(200).send({ message: `Started monitoring check` });
};

/*const puseCheck = async (req, res) => {
    const check = await Check.find({ name: req.params.name });

    if (check.length == 0) return res.status(404).send({ message: 'Check Not Found' });

    const user = await User.findOne({ _id: req.user.id });

    monitorCheck(check, user);

    return res.status(200).send({ message: `Started monitoring check` });
};*/



const GroupChecksByTag = async (req, res) => {

    const checks = await Check.find({ tags : req.body.tags });

    if (!checks) return res.status(404).send({ message: 'Invalid Tag' });

    monitorCheck(checks, user);


    return res.status(200).send({ message: `Started monitoring checks` });
};

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader;

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).send();
            }

            req.user = decoded;
            next();
        });
    } else {
        return res.status(403).send({ message: 'No Token Provided' });
    }
};
//   authentication  assert  
const monitorCheck = (checks, user) => {
    checks.forEach((check) => {
        const checkOptions = {
            website: check.url,
            title: check.name,
            interval: check.interval,
            ignoreSSL: check.ignoreSSL,
            threshold: check.threshold,
            timeout: check.timeout,
            httpOptions: {
                path: check.path,
                httpHeaders: check.httpHeaders,
            }
            
        };
        const urlMonitor = new Monitor(checkOptions);

        try {

            urlMonitor.on('up', async (res, state) => {
                    const message = `Your url: ${res.website} is up.`;
                    await sendEmail(user.email, "Check Status Changed ", message);
                    if (check.webhook) {
                        sendWebhookNotification(check.webhook, res);
                    }
               
            });

            urlMonitor.on('down', async (res, state) => {
                    const message = `Your url: ${res.website} is down.`;
                    await sendEmail(user.email, "Check Status Changed ", message);
                    if (check.webhook) {
                        sendWebhookNotification(check.webhook, res);
                    }
                
            });


        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    });
};

module.exports = {
    createCheck,
    getCheck,
    updateCheck,
    deleteCheck,
    GroupChecksByTag,
    verifyToken,
};

