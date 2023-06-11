#!/bin/bash

echo "Automate Deploy Persona API..."
echo $SSH_KEY_2022_08_17
cd ~/desktop/projects/oracle-cloud-keys
ssh opc@146.56.145.39 -i ssh-key-2022-08-17.key << EOF
if [ -d "persona" ]; then
    cd persona
    if [ -d "persona-backend" ]; then
        cd persona-backend
        cd persona-api
        git pull origin main
        npm run build
        # npm start
        pm2 delete persona-api
        pm2 start "npm start" --name persona-api
        pm2 list
    fi
else
    echo "persona folder doesn't exist"
    mkdir persona
    cd persona
    mkdir persona-backend
    cd persona-backend
    mkdir persona-api
    cd persona-api
    git remote add origin https://github.com/gonnabea/Persona-API
    git pull origin main
    npm i
    npm run build
    npm start
fi
# cd persona/persona-backend/persona-api
# git pull origin main
# npm run build
# pm2 start "npm start" --name persona-api
