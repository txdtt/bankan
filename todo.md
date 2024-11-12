IndexedDB para armazenar offline, MongoDB ou Sqlite para armazenar no servidor

Permitir usuários de usarem o site sem estarem logados, gerando uma conta anônima
com um ID. Toda conta, anônima ou criada pelo usuário, terá uma ID que será usada
para criar grupos, convites de amizade etc.

Sistema de criação de conta

Sistema de login usando autenticação JWT ou PASETO ou OAuth

Frontend deve utilizar JWT para autenticar modificação de colunas tasks

Stack a ser utilizada:
    - Go (Gin - Routing; GORM - ORM)
    - MongoDB 
    - HTMX

Go: Manages data storage, logic, and HTML templates for task and column CRUD 
operations.
HTMX: Handles UI updates by injecting server-rendered HTML into the DOM for 
tasks and columns, managing most CRUD operations.
TS: Manages drag-and-drop functionality, handling events that HTMX doesn’t 
natively support.

Example Flow: Moving a Task with Drag-and-Drop

    Drag-and-Drop Event (TS): Detects when a task is dropped into a new column.
    DOM Update (TS): Moves the task element in the DOM for immediate feedback.
    Database Update (HTMX): TS triggers an hx-put request to update the task's 
    position on the server.
