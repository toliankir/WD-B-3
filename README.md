*Chat script information!!!*
First of all, set variables in top of this file according to your environment
values.
Copy "chat" script file to /etc/init.d folder, you may need root permissions for it.

Now you can run Chat Service.
For running service run command "service chat start"
For stop - "service chat stop"
For restart - "service chat restart"
Got getting information about service state - "service chat state"

Also you may not copy chat script file to /etc/init.d folder, you may run it
directly from chat project folder. For example "./chat start"

*-----------------------------------------------*
*Run 'npm install' in project folder.*

*Copy .env.example as .env. In .env file set your database filename and http server listening port if you don't want use default values.*

*Run 'npm run start' to start application.*

*Application available on http://localhost:3000*
