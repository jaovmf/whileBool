// npm i express
// npm i axios

const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", async (req, res) => {
  var token;
  await axios
    .post("https://urlparasolicitartoken", {
      user: "usuario",
      password: "senha",
    })
    .then((response) => {
      token = response.data.token.split(" ")[1];
    })
    .catch((err) => {
      console.log(err);
    });

  var n = 0; // PAGINA
  var arrayResults = []; // ARRAY DE RESULTADOS
  var whileBool = true; // BOOLEAN PARA PARAR O WHILE

  //WHILE BOOL PARA VERIFICAR SE O RETORNO POSSUI MAIS DE 2000 REGISTROS (LIMITE POR PAG), CASO TENHA 2000+ VAI RETORNAR FALSE
  //E O WHILE VAI PULAR PARA A PROXIMA PAGINA E PEGAR OS REGISTROS ATÉ RETORNAR TRUE
  while (whileBool) {
    await axios
      .get("https://urlparasolicitardadosdaapi", {
        params: {
          endDate: "2022-10-21 23:59:59", // PARA PUXAR DATAS RETROATIVAS
          startDate: "2022-10-21 00:00:01", // PARA PUXAR DATAS RETROATIVAS
          size: "2000",
          page: n,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        arrayResults.push(response.data.content);
        if (response.data.numberOfElements < 2000) {
          whileBool = false;
        }
        n++;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const results = arrayResults.flat();
  console.log("Total de registros encontrados: " + results.length);
  res.send(results);
  console.log("TOKEN USADO PARA ESTA CONSULTA: " + token);
  save(results);
});
