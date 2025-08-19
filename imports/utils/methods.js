import logging from "/imports/api/logging";
const logger = logging.getLogger(module.id);

export const marbleMethods = function(methods){
    Object.keys(methods).forEach(m=>{
        const tempM = methods[m];
        methods[m] = async (...args)=>{
            const res = await tempM(...args);
            logger.info(`methodsCalledLog:${Meteor.user()?`${Meteor.user().username} ${Meteor.userId()}`:null} ${JSON.stringify({name:m,args:args})}, ${JSON.stringify(res)}`);
            return res;
        }
    })
    return Meteor.methods(methods);
}
// export const marbleMethodsObj = function(methods){
//     Object.keys(methods).forEach(m=>{
//         const tempM = methods[m];
//         methods[m] = async function (...args) {
//             const res = await tempM(...args);
//             logger.info(`methodsCalledLog:${Meteor.user()?`${Meteor.user().username} ${Meteor.userId()}`:null} ${JSON.stringify({name:m,args:args})}, ${JSON.stringify(res)}`);
//             return res;
//         }
//     })
//     return methods;
// }
