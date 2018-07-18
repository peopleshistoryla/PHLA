module.exports = {
    entry: [
        __dirname + "/src/index.jsx"
    ],
    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    output: {
        path: __dirname + "/server/templates/static/",
        filename: "bundle.js"
    }
}