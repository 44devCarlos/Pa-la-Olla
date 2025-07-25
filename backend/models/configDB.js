import mysql from "mysql2/promise";

const configDB = {
	host: "localhost",
	user: "root",
	port: 3307,
	password: "1234",
	database: "pa_la_olla",
};

export const connection = await mysql.createConnection(configDB);
