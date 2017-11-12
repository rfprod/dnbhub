const assert = require('chai').assert,
	expect = require('chai').expect;

const request = require('request');
const cheerio = require('cheerio'),
	str = require('string');

const baseUrl = 'http://localhost:3000';

describe('/ endpoint', () => {
	it('should load a an angular initialization page', async () => {
		request(baseUrl + '/', (error,response,body) => {

			expect(error).to.be.not.ok;
			expect(response).to.be.not.a('undefined');
			expect(response.statusCode).to.be.equal(200);

		});
	});
	it('should deliver index page with elements with navbar and \'view-frame\' classes', async () => {
		request(baseUrl + '/', (error,response,body) => {

			const $ = cheerio.load(body);
			assert.equal(1, $('div[data-ng-include]').length);
			assert.equal(1, $('div.view-frame').length);

		});
	});
});
