const assert = require('chai').assert,
	expect = require('chai').expect;

const request = require('request');
const cheerio = require('cheerio'),
	str = require('string');

require('dotenv').load();
const baseUrl = 'http://localhost:3000';

describe('/ endpoint', function() {
	it('should load a an angular initialization page', function (done) {
		request(baseUrl+'/', function (error,response,body) {

			expect(error).to.be.not.ok;
			expect(response).to.be.not.a('undefined');
			expect(response.statusCode).to.be.equal(200);

			done();
		});
	});
	it('should deliver index page with elements with logo and \'view-frame\' classes', function (done) {
		request(baseUrl+'/', function (error,response,body) {

			const $ = cheerio.load(body);
			setTimeout(function() {
				assert.equal(1, $('img.logo').length);
				assert.equal(1, $('div.view-frame').length);
			}, 5000);

			done();
		});
	});
});
