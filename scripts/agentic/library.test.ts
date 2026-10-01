// The capture library must key an index page by the map's route id (2026-10-01: publish found 0
// images for configuration/neural-config/index because `/index` was stripped).
import { describe, expect, test } from 'bun:test';
import { routeOfPage } from './library';

const routes = { 'configuration/neural-config/index': {}, 'governance/overview': {}, seek: {} };

describe('routeOfPage', () => {
	test('index.md whose route keeps /index', () => {
		expect(routeOfPage('configuration/neural-config/index.md', routes)).toBe(
			'configuration/neural-config/index'
		);
	});
	test('index.md whose route is the folder', () => {
		expect(routeOfPage('seek/index.md', routes)).toBe('seek');
	});
	test('a plain page', () => {
		expect(routeOfPage('governance/overview.md', routes)).toBe('governance/overview');
	});
	test('mdx too', () => {
		expect(routeOfPage('governance/overview.mdx', routes)).toBe('governance/overview');
	});
});
