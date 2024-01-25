module.exports = {
	presets: [['@babel/preset-env',  {
        "modules": false
      }], '@babel/preset-typescript'],
	plugins: [
		['@babel/plugin-transform-class-properties'],
		['@babel/plugin-transform-private-methods'],
		['@babel/plugin-transform-private-property-in-object'],
		[
			'@babel/plugin-transform-react-jsx',
			{
				runtime: 'automatic',
				importSource: 'preact',
			},
		],
	],
};
