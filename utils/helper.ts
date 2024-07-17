import { performance } from 'perf_hooks';
import adminController from '../controller/admin.controller';
import categoriesController from '../controller/categories.controller';
// import SuperTest from "supertest";

export const performanceTime = () => performance.now();

export const login = async (email: string, password: string) => {
    const body = { "email": email, "password": password }
    const res = await adminController.postAdminLogin(body);
    return res.body.token;
}

export const getCategoryId = async (token: string) => {
    const body = { "name": "Test Category " + Math.floor(Math.random() * 10000) }
    const res = await categoriesController
        .postCategories(body)
        .set('Authorization', 'Bearer ' + token);
    return res.body._id;
}

// export const checkStatusCode = (res: any, expectedStatus: any = 200): SuperTest.Response => {
//     if (res.status === expectedStatus) {
//         return res
//     };
//     const error = res.error;
//     const reqData = JSON.parse(JSON.stringify(res)).req;
//     throw new Error(` 
//     request-method  : ${JSON.stringify(reqData.method)} 
//     request-url     : ${JSON.stringify(reqData.url)}
//     request-data    : ${JSON.stringify(reqData.data)}
//     request-headers : ${JSON.stringify(reqData.headers)}
//     reponse-status  : ${JSON.stringify(res.status)}
//     reponse-body    : ${JSON.stringify(res.body)}
//     `
//     );
// };

export const requestLogs = (res: any) => {
    const reqData = JSON.parse(JSON.stringify(res)).req;
    const log = ` 
    request-method  : ${JSON.stringify(reqData.method)} 
    request-url     : ${JSON.stringify(reqData.url)}
    request-data    : ${JSON.stringify(reqData.data)}
    request-headers : ${JSON.stringify(reqData.headers)}
    reponse-status  : ${JSON.stringify(res.status)}
    reponse-body    : ${JSON.stringify(res.body)}
    `
    return log;
};