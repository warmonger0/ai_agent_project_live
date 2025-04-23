# backend/app/controllers/test_deployment_handler.py

from deployment_handler import DeploymentHandler
import os
import json
from datetime import datetime


# Connection Info
HOST = "127.0.0.1"
USERNAME = os.getlogin()
KEY_PATH = os.path.expanduser("~/.ssh/localhost_rsa")  # Same as before
PORT = 22

# Deployment Paths
LOCAL_APP_PATH = "deployments/last_build/dummy_app/app.py"
REMOTE_APP_PATH = "/tmp/deployed_app_v2.py"  # Deploy to a new file for clarity
RUN_COMMAND = "python3 /tmp/deployed_app_v2.py"

def test_full_deployment():
    deployer = DeploymentHandler(
        host=HOST,
        username=USERNAME,
        key_path=KEY_PATH,
        port=PORT
    )

    result = deployer.deploy_application(
        local_path=LOCAL_APP_PATH,
        remote_path=REMOTE_APP_PATH,
        run_command=RUN_COMMAND
    )

    print("Deployment Result:")
    print(result)

if __name__ == "__main__":
    test_full_deployment()

