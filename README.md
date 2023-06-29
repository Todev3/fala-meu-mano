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

    {
        receiver: string,
        msg: string
    }

clients: utilizado para receber a lista de usuarios conectados no sistema

    { 
        name: string, 
        online: boolean, 
        lastLogin: Date | null 
    } []

msg: utilizado para receber as mensagens direcionadas ao seu usuario
    
        {
            sender: string,
            msg: string
            date: string
        }

error: utilizado para receber erros do servidor de acordo com as ações do usario

        string[]