<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```


### Extra: Tener Nest CLI instalado


```
npm i -g @nestjs/cli
```

## Ejecutar en desarrollo

1. Clonar repositorio
```
  git clone https://github.com/KevinMondragonDev/backendSustentabilidad.git
```


2. Dentro del directorio, instalamos las dependencias

```
pnpm install
```


3. Levantar la base de datos con el proyecto en Docker (Dockerizar)

```
docker-compose up -d
```



## Este Proyecto utiliza un __.env__

```
JWT_SECRET='Secreto'
PORT=3002
DB_PASSWORD=root
DB_NAME=SustabilidadDB
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres


```



## Manera de hacer despliegue 

1. Crear el archivo ``` .env ```
2. Llenar las variables de entorno de prod
3. Crear la imagen 
```

 docker-compose -f docker-compose.prod.yaml --env-file .env up --build

```

4. recargar la imagen si ya la tenias 
```
 docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```

* Nest


## STACK Utilizado


* Posgrest
* Docker / Docker Compose
* Nest
