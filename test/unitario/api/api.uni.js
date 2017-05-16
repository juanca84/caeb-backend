console.log("Ejecución de Test Unitario API")
describe("Ruta: ejemplo de obtencion de proyectos", () => {
  describe("GET / CON TOKEN valido", () => {
    it("Test servicio API, obtencion de proyectos CON TOKEN valido", done => {
      request.get("/api/v1/proyectos/?limit=50")
      .set('authorization','Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF91c3VhcmlvIjoxLCJ1c3VhcmlvIjoia2hpcHVzIiwiZmVjaGFfaW5pY2lvIjoiMjAxNy0wNC0xNVQwNDowMDowMC4wMDBaIiwiZmVjaGFfZmluIjoiMjAxNy0xMi0yOFQwNDowMDowMC4wMDBaIiwiX2ZlY2hhX2NyZWFjaW9uIjoiMjAxNy0wNC0xM1QwNDowMDowMC4wMDBaIn0.MqqVMsFWstUtp5usODs2lZfzG3TyTuyPD-Ld5mbhpIA')
      .expect(200)
      .end((err, res) => {
        console.log("err->",err);
        done(err);
        });
    });
  });
  describe("GET / SIN TOKEN valido", () => {
    it("Test servicio API, obtencion de proyectos SIN TOKEN valido", done => {
      request.get("/api/v1/proyectos/")
      .expect(403)
      .end((err, res) => {
        console.log("err->",err);
        done(err);
        });
    });
  });
  describe("GET / Cantidad de proyectos", () => {
    it("Test servicio API, obtencion de la cantidad de proyectos ", done => {
      request.get("/api/v1/proyectos/cantidad")
      .set('authorization','Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF91c3VhcmlvIjoxLCJ1c3VhcmlvIjoia2hpcHVzIiwiZmVjaGFfaW5pY2lvIjoiMjAxNy0wNC0xNVQwNDowMDowMC4wMDBaIiwiZmVjaGFfZmluIjoiMjAxNy0xMi0yOFQwNDowMDowMC4wMDBaIiwiX2ZlY2hhX2NyZWFjaW9uIjoiMjAxNy0wNC0xM1QwNDowMDowMC4wMDBaIn0.MqqVMsFWstUtp5usODs2lZfzG3TyTuyPD-Ld5mbhpIA')
      .expect(200)
      .end((err, res) => {
        console.log("err->",err);
        done(err);
        });
    });
  });

});
