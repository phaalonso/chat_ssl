# Chat simples com SSL

Uma pequena implementação de um chat por Socket TCP/IP sobre SSL

# Certificados
Para executar o sistema é necessário gerar os certificados

Primerio geraremos a chave privada
```bash
openssl genrsa -out private-key.pem 1024 
```

Após a geração da chave privada, deve-se gerar o certificao o qual será utilizado no processo
```bash
openssl req -new -key private-key.pem -out csr.pem
```

O certificado gerado precisa ser assinado por alguma autoridade certificadora, nesse caso como se trata de um sistema desenvolvido para um trabalho o certificado sera self-assigned
```bash
openssl x509 -req -in csr.pem -signkey private-key.pem -out public-cert.pem
```

Obs: caso for utilizar um certificado assinado por uma entidade, ou realizar deploy em produção deve-se configurar o parâmetro rejectUnathorized como true
