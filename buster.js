var config = module.exports;

config["GoogleBundle"] = {
    rootPath: "./",
    environment: "browser",
    sources: [
        "Resources/public/js/ga.js"
    ],
    tests: [
        "Tests/JavaScript/*-test.js"
    ]
}
