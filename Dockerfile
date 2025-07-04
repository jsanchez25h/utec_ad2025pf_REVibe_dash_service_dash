# Utiliza una imagen de Node.js LTS
FROM node:18

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo package.json y package-lock.json para aprovechar cache de npm
COPY package*.json ./

# Instala dependencias (incluye @aws-sdk/client-athena y athena-express)
RUN npm install --production

# Copia el resto del código
COPY . .

# Exponer el puerto que usa tu app (por defecto 4000)
EXPOSE 4000

# Comando por defecto para arrancar tu servidor
CMD ["node", "src/index.js"]