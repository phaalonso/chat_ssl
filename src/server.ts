import tls from 'tls';
import fs from 'fs';
import path from 'path';
import { MessageBuffer } from './MessageBuffer';

const PORT = 1337;
const HOST = 'localhost';

interface CustomSocket extends tls.TLSSocket {
	buffer: MessageBuffer;
}

const certsDirectory = path.join(__dirname, '..', 'certs');

const options: tls.TlsOptions = {
	key: fs.readFileSync(path.join(certsDirectory, 'private-key.pem')),
	cert: fs.readFileSync(path.join(certsDirectory, 'public-cert.pem')),
}

const connectedClients: CustomSocket[] = [];

const server = tls.createServer(options, (s) => {
	const socket = <CustomSocket> s;

	socket.buffer = new MessageBuffer('\n');

	connectedClients.push(socket);

	socket.write("I'm the server sending you a message");

	socket.on('data', data => {
		socket.buffer.push(data);

		/*
		console.log('Received %d bytes long: %s',
			data.length,
			data.toString(),
		);
		*/

		while(!socket.buffer.isDone()) {
			let message = socket.buffer.getMessage();

			if (!message) continue;

			console.log(message);

			message += '\n'
			for (const con of connectedClients) {
				con.write(message);
			}
		}
	});

	socket.on('end', () => {
		const pos = connectedClients.findIndex((value) => value == socket);

		connectedClients.splice(pos);
		console.log('EOT');
	});
});

server.listen(PORT, HOST, () => {
	console.log(`I'm listening at ${HOST}, on port ${PORT}`);
});

server.on('error', (error) => {
	console.log(error);

	// Fecha o server após a ocorrência do erro
	server.close();
})
