.:: API-REST UCPCAF ::.
================================================

A continuación se detalla la instalación de la aplicación desde cero.
## Requisitos mínimos:

- Sistema operativo __DEBIAN Jessie(8)__

## A. INSTALACIÓN DE DEPENDENCIAS

Puede omitirse esta sección si ya se tienen instaladas las dependencias: git, nvm, node, postgres

### 1. Instalación de GIT

    $ sudo apt-get update
    $ sudo apt-get install git

Verificar la instalación de GIT

    $ git --version

### 2. Instalación de Node Version Manager NVM

Instalar requisitos previos

    $ sudo apt-get update
    $ sudo apt-get install build-essential libssl-dev
    $ sudo apt-get install curl
    $ sudo apt-get install ca-certificates

Instalar nvm

    $ curl https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash

Una vez finalizada reiniciar la terminal para verificar la instalación

    $ nvm --version

### 3. Instalación de Node v6.9.0 LTS

    $ nvm install 6.9.0
    $ nvm use 6.9.0

Verificar la instalación

    $ node --version

### 4. Instalación de dependencias globales para base de datos via npm

    $ npm install -g sequelize sequelize-cli
    $ npm install -g pg pg-hstore

### 5. Instalación de SGBD

#### 5.1 PostgreSql

    $ sudo apt-get install postgresql-9.4 postgresql-client-9.4

#### 5.1.1 Creación de la base de datos

    Cambio al usuario root

        $ sudo su

    Acceso al usuario postgres    

        $ su postgres

    Acceso a linea de comandos de postgres

        $ psql

    Cambio de contraseña desde linea de comandos de postgres

        # ALTER ROLE [miUsuario] PASSWORD '[miSuperPassword]';

    Reiniciar el servicio desde el usuario de la maquina virtual ([miUsuarioSistema])

        $ sudo /etc/init.d/postgresql restart

    Creando la base de datos

        $ sudo su
        $ su postgres
        $ su psql
        # CREATE DATABASE [miBD];

    Lista las bases de datos existentes, verificar si [miDB] esta en la lista.

        # \l
        # \q

#### 5.2 MySql

    $ sudo apt-get install mysql-server

#### 5.2.1 Creación de la base de datos

Ingresar la contraseña establecida al instalar mysql.

    $ mysql -u root -p

Crear un nuevo usuario

    create user '[miUsuarioDB]'@'localhost' identified by '[miContraseña]';

Crear la base de datos

    create database [miBD];

Verificar la creacion de la base de datos

    show databases;

Otorgar privilegios al usuario

    GRANT ALL PRIVILEGES ON [miBD].* TO [miUsuarioDB]@localhost;

Verificar la asignación de privilegios

    show grants for dev@localhost;

## B. INSTALACIÓN DEL BACKEND

### 1. Iniciando el servidor backend

Clonar el proyecto backend

      $ git clone git@gitlab.geo.gob.bo:agetic/ucpcaf-backend.git

Ingresar al directorio donde se clono el backend

      $ cd ucpcaf-backend

##### Renombrar los archivos ejemplo de configuración, quitando de los mismos la palabra ".sample".
```

___src/config.development.sample.js___
___src/config.production.sample.js___
___src/config.test.sample.js___
___config/config.sample.js___
```

##### Para modificar las credenciales de acceso a la base de datos, consumo de la API de Notificaciones, Correo, LDAP, tiempo de vida de token, rutas de acceso backend, ruta de acceso frontend, uso de la validacion de peticiones, modificar los valores de los siguientes archivos.

```
___config/config.js___          | migraciones y población de datos (Solo datos de acceso a la base de datos).

___src/config.development.js___ | entorno de desarrollo.

___src/config.production.js___  | entorno de producción.

___src/config.test.js___        | entorno de tésting
```


Instalar las dependencias del proyecto

      $ npm run instalar

Poblar la base de datos (__Solo para DESARROLLO__)

      $ npm run setup

Ejecutar la aplicación

      $ npm start

Extra: Ejecución de los test unitarios

      $ npm run test


## C. INSTALACIÓN EN LA MAQUINA VIRTUAL DE TEST

### 1. Instalación de Supervisor

Es un sistema cliente/servidor que permite a sus usuarios monitorear y controlar una serie de procesos en sistemas operativos tipo UNIX.

      $ sudo apt-get install supervisor

Crear el archivo de configuración para iniciar el proceso

      $ sudo nano /etc/supervisor/conf.d/ucpcaf-backend.conf

Añadir al archivo lo siguiente:

        [program:ucpcaf-backend]
        command=/home/[miUsuarioSistema]/.nvm/versions/node/v6.9.0/bin/node /home/[miUsuarioSistema]/ucpcaf-backend/index.js
        directory=/home/[miUsuarioSistema]/ucpcaf-backend
        process_name=ucpcaf-backend
        autostart=true
        autorestart=true
        environment=NODE_ENV=production
        stdout_logfile=/home/[miUsuarioSistema]/ucpcaf-backend/ucpcaf-backend-out.log
        stderr_logfile=/home/[miUsuarioSistema]/ucpcaf-backend/ucpcaf-backend-error.log
        user=[miUsuarioSistema]



Ingresar a la consola del supervisor

       $ sudo supervisorctl

Una vez en la consola actualizar la lista de configuraciones e iniciar el servidor

       supervisor> reread
       supervisor> update
       supervisor> start ucpcaf-backend
       supervisor> status
       ucpcaf-backend                  RUNNING    pid 11413, uptime 0:08:41

Para visualizar el log del backend

       supervisor> tail ucpcaf-backend stderr

Extra: Si se presenta el error /usr/bin/env: node: No existe el fichero o el directorio se debe crear los siguientes enlaces simbólicos:

        ln -s /home/[miUsuarioSistema]/.nvm/versions/node/v6.9.0/bin/node  /usr/bin/nodejs
        ln -s /usr/bin/nodejs /usr/bin/node

#### * Extra

Si se presenta algun error relacionado con el uso de "libfontconfig0" por parte de phantom.js, instalar el mismo con:

      $ sudo apt-get install libfontconfig1-dev

Si se presenta el error "Can't find Python executable python", instalar python con:

      $ sudo apt-get install python

Para el comando __npm run startdev__  se debe instalar previamente nodemon con :

      $ npm install -g nodemon

## REGISTRO Y ACTUALIZACIÓN DE USUARIO

Donde:
- [usuario] = Usuario a registrar en la api.
- [fechaInicio] = Fecha desde cuando puede acceder a los datos YYYY-MM-DD
- [fechaFin] = Fecha hasta cuando puede acceder a los datos YYYY-MM-DD
- [entorno] = Entorno de ejecución de la aplicación.

### Registro

Ejecutar el comando

    NODE_ENV=[entorno] npm run registrar [usuario] [fechaInicio] [fechaFin]

### Actualizacion (valido solo para las fechas)

Ejecutar el comando

    NODE_ENV=[entorno] npm run actualizar [usuario] [fechaInicio] [fechaFin]
