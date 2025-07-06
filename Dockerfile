# ──────────────────────────────────────────────────────────────
#  1) Imagen base : Node 18 LTS
# ──────────────────────────────────────────────────────────────
FROM node:18

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# ──────────────────────────────────────────────────────────────
#  2) Copiamos SOLO los manifests de npm
#     (para que la cache de Docker se use si no cambian)
# ──────────────────────────────────────────────────────────────
COPY package*.json ./

# ──────────────────────────────────────────────────────────────
#  3) Instalación EXACTA según package-lock.json
#    • npm ci  →  ignora ^ ~ etc. y clava las versiones
#    • --omit=dev  →  excluye dependencias de desarrollo
# ──────────────────────────────────────────────────────────────
RUN npm ci --omit=dev

# ──────────────────────────────────────────────────────────────
#  4) Copiamos el resto del código fuente
# ──────────────────────────────────────────────────────────────
COPY . .

# ──────────────────────────────────────────────────────────────
#  5) Puerto que expone la app  (GraphQL escucha en 9090)
#    • Debe coincidir con el container_port del task-definition
# ──────────────────────────────────────────────────────────────
EXPOSE 9090

# ──────────────────────────────────────────────────────────────
#  6) Comando de arranque
# ──────────────────────────────────────────────────────────────
CMD ["node", "src/index.js"]
