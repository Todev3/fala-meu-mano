# Chat - Fala Meu Mano

Projeto com finalidade de ser um chat em tempo real.

## Tecnologias:
- Node.Js
- TypeScript
- Sqlite
- express
- Socket.io

### Como usar
- Clone o repositório
- Instale as dependências com `yarn` ou `npm install`
- Inicie o servidor com `yarn start` ou `npm start`
- Acesse o chat via socket.io em `http://localhost:3000`

## Eventos

message (evento defualt socket.io): utilizado para enviar mensagens para o um usuario existente no sistema

Request:

    {
        receiverId: number,
        msg: string
    }

users: utilizado para receber a lista de usuarios conectados no sistema

Response:

    { 
        name: string, 
        online: boolean, 
        lastLogin: Date | null 
    } []

msg: utilizado para receber as mensagens direcionadas ao seu usuario
Request: 

        {
            senderId: number,
            msg: string
            date: string
        }

history: utilizado para receber o historico de mensagens trocadas com um usuario

Request:

        {
            senderId: number,
            size: number
        } []

Response: 

        {
            senderId: number,
            msg: string
            date: string
        } []
        
error: utilizado para receber erros do servidor de acordo com as ações do usario

        string[]