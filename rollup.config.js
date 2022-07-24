import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import path from 'path';
import ignoreImport from 'rollup-plugin-ignore-import';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import babel from '@rollup/plugin-babel';

const packages = {
  shared: {
    dynamicImports: false,
    umd: false,
    external: [],
  },
  'schema-form-react': {
    dynamicImports: true,
    umd: false,
    external: [],
  },
  'schema-form-vue': {
    dynamicImports: false,
    umd: false,
    external: [],
  },
};

const genOutput = (packageName, format, meta, opts = {}) => {
  const { dynamicImports, umd } = meta;
  switch (format) {
    case 'cjs':
    case 'esm': {
      const inlineDynamicImports = dynamicImports && umd;

      if (dynamicImports && !inlineDynamicImports) {
        return {
          dir: `packages/${packageName}/dist/${format}`,
          entryFileNames: `[name].${format}.js`,
          chunkFileNames: `[name]-[hash].${format}.js`,
          format,
          exports: 'named',
        };
      }
      return {
        file: `packages/${packageName}/dist/index.${format}.js`,
        inlineDynamicImports,
        format,
        exports: 'named',
      };
    }
    case 'umd': {
      const config = {
        file: `packages/${packageName}/dist/index.${format}.js`,
        format: 'umd',
        name: packageName.globalVariable,
        plugins: [],
        exports: 'named',
      };

      if (opts.min) {
        config.file = config.file.replace(/\.js$/, '.min.js');
        config.plugins.push(
          terser({
            format: {
              comments: false,
            },
          })
        );
      }
      return config;
    }
    default:
  }
  return null;
};

export const bundle = (packageName, dir = '') => {
  const meta = packages[packageName];
  const baseConfig = {
    input: `packages/${packageName}/src/index.ts`,
    output: [
      genOutput(packageName, 'cjs', meta),
      genOutput(packageName, 'esm', meta),
      meta.umd && genOutput(packageName, 'umd', meta),
      meta.umd && genOutput(packageName, 'umd', meta, { min: true }),
    ].filter(Boolean),
    plugins: [
      resolve({
        browser: true,
      }),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
          },
        },
      }),
      postcss({
        plugins: [cssnano()],
      }),
      babel({ babelHelpers: 'bundled' }),
      commonjs(),
    ],
    external: [...meta.external],
  };

  const dtsConfig = {
    input: `packages/${packageName}/src/index.ts`,
    output: [
      {
        file: `packages/${packageName}/dist/index.d.ts`,
        format: 'esm',
      },
    ],
    plugins: [ignoreImport({ extensions: ['.css'] }), dts()],
    external: [...meta.external],
  };

  const finalConfig = [baseConfig, dtsConfig];

  const resolvePath = (originPath) => path.resolve(dir, originPath);

  finalConfig.forEach((config) => {
    const configCtx = config;
    configCtx.input = resolvePath(config.input);
    configCtx.output.forEach((output) => {
      if (output.file) configCtx.file = resolvePath(output.file);
      if (output.dir) configCtx.dir = resolvePath(output.dir);
    });
  });

  return finalConfig;
};

const configs = Object.keys(packages)
  .map((packageName) => bundle(packageName))
  .reduce((result, configs) => result.concat(configs), []);

export default configs;
