describe("test auth sign in route", () => {
    test("It responds with a sucsses msg for authenticated user", async () => {
        const response = await request(app).post("/auth/signin");
        expect(response.statusCode).toBe(200);
    }

    );
});

describe("test auth sign up route", () => {
    test("It responds with the newly created user", async () => {
        const user = await request(app)
            .post("/auth/signup")
            .send({

                name: "name",
                email: "email",
                password: "password",

            });
        expect(user.body.name).toBe("name");
        expect(user.body.email).toBe("email");
        expect(user.body.password).toBe("password");
        expect(user.statusCode).toBe(200);


    });
});