import {WebTransport} from "../transports";
import logging from "../index";
import winston from "winston";

const browserProfile = winston.format((info) => {
    info.userAgent = window.navigator.userAgent;
    return info;
});

// logging.logger.add(new WebTransport({
//     format: winston.format.combine(
//         browserProfile()
//     )
// }));