# Habitica dicord bot

A discord bot that listens for [Habitica](https://habitica.com) webhooks and sends the info to a discord channel

# Installation and usage
 
## Prerequisites 
- Discord bot token with privileged gateway intents. You can follow this [guide](https://www.writebots.com/discord-bot-token/) to obtain it 
- Docker installed on your computer. "But I want to install locally" don't care watch [this](https://www.youtube.com/watch?v=J0NuOlA2xDc). You can follow this [guide](https://docs.docker.com/get-docker/) to get docker on your OS 

## Deployment

Rename ``.env.example`` to ``.env``
```bash
cp .env.example .env
```
Fill with your data. For obtaining your ``userId`` you can use a webhook tester like [this](https://typedwebhook.tools). Put the URL that the web gives you in your webhook section in the [Habitica settings](https://habitica.com/user/settings/site). Make any action like complete a task and in the webhook tester search for the field ``"userID"`` in the ``"task"`` key in the JSON response.

Start the container

```bash
docker compose up -d
```

Invite the bot to your server. You can use this invite link example ``https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=2147601408&scope=applications.commands.permissions.update%20bot%20applications.commands`` replace ``CLIENT_ID`` with your client ID. Execute the command ``/channel`` and select which channel you want the bot to send the messages to.

Then you need to go to your [Habitica settings](https://habitica.com/user/settings/site) and add a webhook URL, if you are hosting locally the format will be ``http://<your-ip>/webhook.`` If you are using a reverse proxy like NGINX (Highly recommended because the webhook may not be sent to an insecure URL) you can use this example config

```conf
location /webhook {
	proxy_pass http://localhost:1111;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection 'upgrade';
	proxy_set_header Host $host;
	proxy_cache_bypass $http_upgrade;
	gzip on;
}
```
In this case the URL would look like this ``https://<your-domain>/webhook.``

As I said I highly recommend configuring an SSL certificate with [Lest's encrypt](https://www.digitalocean.com/community/tutorials/how-to-use-certbot-standalone-mode-to-retrieve-let-s-encrypt-ssl-certificates-on-ubuntu-16-04), for example 

And you are all set. Feel free to fork, pull request and translate the app to your language

# Special thanks to my girlfriend [AileeNyx](https://github.com/AileeNyx) who helped me a lot, made the icons for the embeds and gave me most of the ideas. I love you babygirl


