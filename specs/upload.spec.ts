import config from '../config/base.config';
import { performanceTime, requestLogs } from '../utils/helper'
import controller from '../controller/upload.controller'

describe('Upload File', () => {

    it('POST /upload/single', async () => {
        const startTime = performanceTime()
        const res = await controller.postUploadSingle('data/test.jpg')
        console.log(requestLogs(res))
        expect(res.statusCode).toEqual(200)
        expect(res.body.filename).toEqual('test.jpg')
        expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
    })

    it('POST /upload/multiple', async () => {
        const startTime = performanceTime()
        const files = [
            'data/test.jpg',
            'data/test1.jpg'
        ]
        const res = await controller.postUploadMultiple(files)
        console.log(requestLogs(res))
        expect(res.statusCode).toEqual(200)
        expect(res.body[0].filename).toEqual('test.jpg')
        expect(res.body[1].filename).toEqual('test1.jpg')
        expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
    })

})