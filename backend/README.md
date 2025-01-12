# How to run

- Create virtual environment
  
    ```sh
    python3 -m venv .venv
    ```

- Activate venv
  
    ```sh
    source .venv/bin/activate
    ```

- Install requirements

    ```sh
    pip install -r requirements.txt
    ```

- Create a file named `run.sh` and add the following content to it:

    ```sh
    export ENV="dev"
    export SECRET_KEY="secure-secret-key"
    export CORS_ALLOWED_ORIGINS="http://localhost:3000,http://example.com"

    python3 manage.py runserver $@
    ```

- Note: If you do not set the ENV variable, the default value is `prod`.

- Make `run.sh` file make a file executable

    ```sh
    chmod +x ./run.sh
    ```

- Note: By default, the Django server runs on port 8000. If you want to run it on a different port, pass the port number at the end of the command.

    ```sh
    chmod +x ./run.sh <port-number>
    ```

- Run backend server

    ```sh
    ./run.sh
    ```

# Generating OpenAPI Schema

    ```sh
    python3 manage.py spectacular --validate --color --file schema.yml
    ```