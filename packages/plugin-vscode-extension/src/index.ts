import path from 'path';
import type {
  RspackPluginInstance,
  Compiler,
  EntryStaticNormalized,
} from '@rspack/core';

export interface RspackVsCodeExtensionPluginOptions {
  /**
   * By default is `{ vscode: "commonjs vscode" }`
   */
  externals?: Record<
    string,
    string | boolean | string[] | Record<string, string | string[]>
  >;
}

/**
 * Inspired in https://gist.github.com/RussellCanfield/b566a3f4ad2efad8d72410f2b542b178
 */
export class RspackVsCodeExtensionPlugin implements RspackPluginInstance {
  #externals: Record<
    string,
    string | boolean | string[] | Record<string, string | string[]>
  >;

  constructor(options: RspackVsCodeExtensionPluginOptions) {
    this.#externals = options.externals ?? {};
  }

  apply(compiler: Compiler) {
    compiler.options = {
      ...compiler.options,
      entry: {
        extension: path.resolve(__dirname, 'src', 'extension.ts'),
      } as EntryStaticNormalized,
      resolve: {
        tsConfigPath: path.resolve(__dirname, 'tsconfig.json'),
      },
      output: {
        path: path.resolve(__dirname, 'out'),
        clean: true,
        filename: 'extension.js',
        library: {
          type: 'commonjs2',
          export: 'default',
        },
      },
      devtool: 'source-map',
      externals: {
        vscode: 'commonjs vscode',
        ...this.#externals,
      },
      module: {
        ...compiler.options.module,
        rules: [
          {
            test: /\.(j|t)s$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'builtin:swc-loader',
                options: {
                  sourceMap: true,
                  jsc: {
                    parser: {
                      syntax: 'typescript',
                    },
                    externalHelpers: true,
                    transform: {
                      react: {
                        runtime: 'automatic',
                      },
                    },
                  },
                  env: {
                    targets: 'Chrome >= 48',
                  },
                },
              },
            ],
          },
          {
            test: /\.(j|t)sx$/,
            loader: 'builtin:swc-loader',
            exclude: [/[\\/]node_modules[\\/]/],
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
                externalHelpers: true,
              },
              env: {
                targets: 'Chrome >= 48', // browser compatibility
              },
            },
          },
        ],
      },
    };
  }
}

export default RspackVsCodeExtensionPlugin;
