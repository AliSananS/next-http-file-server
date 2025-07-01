/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		dirs: ['lib', 'app', 'components'],
	},
	images: {
		remotePatterns: [
			{
				hostname: '**',
				protocol: 'http',
				port: '',
			},
		],
	},
};

module.exports = nextConfig;
