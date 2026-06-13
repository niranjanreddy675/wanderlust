//sending cookies

app.get("/getcookies", (req, res) => {
    res.cookie("greet", "namaste");
    res.cookie("madeIn", "india");
    res.send("sent you some cookies!")
});

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi, i am root!");
});