# Use a imagem oficial do Node.js como base
FROM node:18 as build

# Defina o diretório de trabalho no contêiner
WORKDIR /app

RUN apt install git

# Copie o arquivo package.json e o arquivo package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todos os arquivos do diretório atual para o diretório de trabalho no contêiner
COPY . .

# Construa o aplicativo React
RUN npm run build

# Use uma imagem leve do servidor HTTP Nginx para servir o aplicativo React
FROM nginx:alpine

# Copie os arquivos da pasta de construção do estágio anterior para o diretório de publicação do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta 80 para o tráfego HTTP
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
