module: {
    rules: [
        {
            test: /\.scss$/,
            use: [
                'vue-style-loader',
                'css-loader',
                {
                    loader: 'sass-loader',
                    options: {
                        implementation: require('sass')
                    }
                }
            ]
        }
    ]
}
