import tls from "tls";
import fs from "fs";
import path from "path";
import readline from "readline";
import { MessageBuffer } from "./MessageBuffer";

const PORT = 1337;
const HOST = "localhost";

const certsDirectory = path.join(__dirname, "..", "certs");

const options: tls.ConnectionOptions = {
	key: fs.readFileSync(path.join(certsDirectory, "private-key.pem")),
	cert: fs.readFileSync(path.join(certsDirectory, "public-cert.pem")),
	rejectUnauthorized: false, // é necessário por ser um certificado self-assigned
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function startClient(username: string) {
	username += ': ';
	const buffer = new MessageBuffer('\n');

	const client = tls.connect(PORT, HOST, options, () => {
		if (client.authorized) {
			console.log("Connection authorized by a Certificate Authority");
		} else {
			console.log(
				"Connectio not authorized:" + client.authorizationError
			);
		}

		rl.addListener("line", (line) => {
			client.write(username + line + "\n");
		});
	});

	client.on("data", (data) => {
		buffer.push(data);

		while(!buffer.isDone()) {
			const message = buffer.getMessage();

			console.log(message);
		}
	});

	client.on("close", () => {
		console.log("Connection closed");
		rl.close();
	});

	client.on("error", (error) => {
		console.error(error);

		client.destroy();
		rl.close();
	});
}

rl.question('Nome do usuário:', nome => {
	if (!nome && nome.length === 0) {
		console.log('Nome não pode estar vazio');
		return;
	}

	startClient(nome);
})
