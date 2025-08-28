module.exports = function (api) {
  // Cache based on environment for optimal performance
  api.cache.using(() => process.env.NODE_ENV);
  
  const isDevelopment = api.env('development');
  const isProduction = api.env('production');
  const isTest = api.env('test');
  
  return {
    presets: [
      [
        "babel-preset-expo", 
        { 
          jsxImportSource: "nativewind",
          // Enable React 19 features
          runtime: 'automatic',
          // Optimize for the target environment
          development: isDevelopment,
          // Enable modern JS features
          useBuiltIns: 'usage',
          corejs: 3
        }
      ],
      "nativewind/babel",
    ],
    
    // Environment-specific optimizations
    env: {
      development: {
        compact: false, // Better debugging
        sourceMaps: true, // Enable source maps for debugging
      },
      production: {
        compact: true, // Smaller bundle size
        sourceMaps: false, // Disable source maps for production
      },
      test: {
        compact: false,
        sourceMaps: true,
      }
    }
  };
};
