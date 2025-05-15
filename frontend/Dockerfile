# Étape 1 : build du frontend
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : serveur nginx pour servir les fichiers statiques
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
