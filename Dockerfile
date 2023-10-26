# Use uma imagem oficial do Node.js como base para a primeira etapa de construção
FROM node:18 as build

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Instale o Git para poder clonar repositórios
RUN apt-get update && apt-get install -y git

# Copie o arquivo package.json e o arquivo package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todos os arquivos do diretório atual para o diretório de trabalho no contêiner
COPY . .

# Construa o aplicativo React
RUN npm run build

# Use uma imagem leve do servidor HTTP Nginx como base para a próxima etapa
FROM nginx:alpine

# Copie os arquivos da pasta de construção do estágio anterior para o diretório de publicação do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copie o arquivo de configuração personalizado para a pasta de configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expõe a porta 80 para o tráfego HTTP
EXPOSE 80

# Copie um script de inicialização para o contêiner
COPY entrypoint.sh /entrypoint.sh

# Dê permissão de execução ao script de inicialização
RUN chmod +x /entrypoint.sh

# Defina o comando de entrada para executar o script de inicialização quando o contêiner for iniciado
ENTRYPOINT ["/entrypoint.sh"]
