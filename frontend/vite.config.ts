server: {
  https: {
    key: fs.readFileSync(path.resolve(__dirname, "key.pem")),
    cert: fs.readFileSync(path.resolve(__dirname, "cert.pem")),
  },
  host: true,
  port: 5173,
  proxy: {
    "/api": {
      target: "http://192.168.50.142:8000",
      changeOrigin: true,
      secure: false,
    },
  },
},
