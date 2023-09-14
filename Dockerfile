# Usa una imagen de Node.js
FROM node:16

# Crea un directorio para la aplicación
WORKDIR /usr/src/app

# Copia los archivos de configuración de la aplicación
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto que tu aplicación utiliza
EXPOSE 8080

# Inicia la aplicación
CMD [ "node", "app.js" ]