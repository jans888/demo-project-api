import config from '../config/base.config';
import controller from '../controller/categories.controller';
import { performanceTime, checkStatusCode } from '../utils/helper'
import { getCategoryId, login } from '../utils/helper';

describe('Categories', () => {
  it('GET /categories', async () => {
    const res = await controller.getCategories();
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(1);
    expect(Object.keys(res.body[0])).toEqual(['_id', 'name'])
  });

  describe('Create Categories', () => {
    const startTime = performanceTime()
    let token: string;

    beforeAll(async () => {
      token = await login(config.email, config.password);
    })

    it('POST /categories', async () => {
      const body = { "name": "Test Category " + Math.floor(Math.random() * 10000) }
      const res = await controller
        .postCategories(body)
        .set("Authorization", "Bearer " + token)
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual(body.name);
      expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
    });
  });

  describe('Update Categories', () => {
    const startTime = performanceTime()
    let token: string, categoryId: string;

    beforeAll(async () => {
      token = await login(config.email, config.password);
      categoryId = await getCategoryId(token);
    })

    it('PUT /categories/id', async () => {
      const body = { "name": "Test Category Updated " + Math.floor(Math.random() * 10000) }
      const res = await controller
        .putCategories(body, categoryId)
        .set("Authorization", "Bearer " + token)
        expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe(body.name);
      expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
    });
  });

  describe('Delete Categories', () => {
    const startTime = performanceTime()
    let token, categoryId;
    beforeAll(async () => {
      token = await login(config.email, config.password);
      categoryId = await getCategoryId(token);
    });

    it('DELETE /categories', async () => {
      const res = await controller
        .deleteCategories(categoryId)
        .set('Authorization', 'Bearer ' + token);

      expect(res.statusCode).toEqual(200);
      expect(performanceTime() - startTime).toBeLessThan(config.responseTime)
    });
  });
});