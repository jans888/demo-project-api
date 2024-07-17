import controller from '../controller/brand.controller'
import { performanceTime, checkStatusCode } from '../utils/helper'
import config from '../config/base.config'

describe('Brands', () => {

    describe('Fetch brands', () => {

        const startTime = performanceTime()
        it('GET /brands', async () => {
            const res = await controller.getBrands()
            expect(res.statusCode).toEqual(200)
            expect(res.body.length).toBeGreaterThan(1)
            expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
        })
    })

    describe('Create brands', () => {
        const startTime = performanceTime()
        let postBrand: any
        const data = {
            'name': 'Test Brand ' + Math.floor(Math.random() * 100000),
            'description': 'Test Brand Decsription ' + Math.floor(Math.random() * 1000)
        }
        beforeAll(async () => {
            postBrand = await controller.postBrands(data)
        })

        afterAll(async () => {
            postBrand = await controller.getBrandById(postBrand.body._id)
        })
        it('POST /brands', async () => {
            expect(postBrand.statusCode).toEqual(200)
            expect(postBrand.body.name).toEqual(data.name)
            expect(postBrand.body).toHaveProperty('createdAt')
            expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
        })
        it('Schema Verification - Name is a mandatory field', async () => {
            const data = {
                'name': '',
                'description': 'Test Brand Decsription'
            }
            const res = await controller.postBrands(data)

            expect(res.statusCode).toEqual(422)
            expect(res.body.error).toEqual('Name is required')
        })
        it('Schema Verification - Description must be a string', async () => {
            const data = {
                'name': 'Sample Brand',
                'description': 123
            }
            const res = await controller.postBrands(data)

            expect(res.statusCode).toEqual(422)
            expect(res.body.error).toEqual('Brand description must be a string')
        })
        it('Schema Verification - Min char length for name > 1', async () => {
            const data = {
                'name': 'a',
                'description': 'Test Brand Decsription'
            }
            const res = await controller.postBrands(data)

            expect(res.statusCode).toEqual(422)
            expect(res.body.error).toEqual('Brand name is too short')
        })
        it('Schema Verification - Max char length for name = 30', async () => {
            const data = {
                'name': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1',
            }
            const res = await controller.postBrands(data)

            expect(res.statusCode).toEqual(422)
            expect(res.body.error).toEqual('Brand name is too long')
            expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
        })
        it('Business Logic - Duplicate brand entries not allowed', async () => {

            const res2 = await controller.postBrands(data)
            expect(res2.statusCode).toEqual(422)
            expect(res2.body.error).toEqual(data.name + ' already exists')
            expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
        })
    })

    describe('Fetch individual brand', () => {
        const startTime = performanceTime()
        let postBrand: any
        beforeAll(async () => {
            const data = {
                'name': 'Test Brand ' + Math.floor(Math.random() * 100000),
                'description': 'Test Brand Decsription ' + Math.floor(Math.random() * 1000)
            }
            postBrand = await controller.postBrands(data)
        })

        afterAll(async () => {
            postBrand = await controller.getBrandById(postBrand.body._id)
        })
        it('GET /brands/:id', async () => {
            const res = await controller.getBrandById(postBrand.body._id)
            expect(res.statusCode).toEqual(200)
            expect(res.body.name).toEqual(postBrand.body.name)
            expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
        })
        it('Business Logic - GET /brands/:invalid_id should throw 404', async () => {
            const res = await controller.getBrandById('65aa976a5a2863bac6e00105')
            expect(res.statusCode).toEqual(404)
            expect(res.body.error).toEqual('Brand not found.')
        })
    })

    describe('Update brands', () => {
        const startTime = performanceTime()
        let postBrand: any
        const data = {
            'name': 'Test Brand ' + Math.floor(Math.random() * 100000),
            'description': 'Test Brand Decsription ' + Math.floor(Math.random() * 1000)
        }
        beforeAll(async () => {
            postBrand = await controller.postBrands(data)
        })

        afterAll(async () => {
            postBrand = await controller.deleteBrand(postBrand.body._id)
        })
        it('PUT /brands', async () => {
            const data = {
                'name': postBrand.body.name + ' updated222'
            }
            const res = await controller.putBrands(data, postBrand.body._id)

            expect(res.statusCode).toEqual(200)
            expect(res.body.name).toEqual(data.name)
            expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
        })

        it('PUT /brands/invalid_id', async () => {
            const data = {
                'name': 'updated'
            }
            const res = await controller.putBrands(data,123)

            expect(res.statusCode).toEqual(422)
            expect(res.body.error).toEqual('Unable to update brands')
            expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
        })

    })

    describe('Delete brands', () => {
        const startTime = performanceTime()
        let postBrand;
        const data = {
            'name': 'Test Brand ' + Math.floor(Math.random() * 100000),
            'description': 'Test Brand Decsription ' + Math.floor(Math.random() * 1000)
        }
        beforeAll(async () => {
            postBrand = await controller.postBrands(data)
        })
        it('DELETE /brands', async () => {
            const res = await controller.deleteBrand(postBrand.body._id)

            expect(res.statusCode).toEqual(200)
            expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
        })

        it('DELETE /brands/invalid_id', async () => {
            const res = await controller.deleteBrand(1234567)

            expect(res.statusCode).toEqual(422)
            expect(res.body.error).toEqual('Unable to delete brand')
            expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
        })

    })

})