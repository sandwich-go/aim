module.exports = {
  transpileDependencies: true,
  runtimeCompiler: true,
  configureWebpack: {
    externals: {
      vue: 'vue'
    }
  },
}

