import mysql from "mysql2/promise";

const configDB = {
	host: "localhost",
	user: "root",
	port: 3306,
	password: "",
	database: "pa_la_olla",
};

export const connection = await mysql.createConnection(configDB);
