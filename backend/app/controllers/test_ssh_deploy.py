# backend/app/controllers/test_ssh_deploy.py

from ssh_client import SSHClientManager
import os

# SSH connection info for localhost
HOST = "127.0.0.1"
USERNAME = os.getlogin()  # Gets your current username automatically
KEY_PATH = os.path.expanduser("~/.ssh/localhost_rsa")
PORT = 22

# Paths
LOCAL_APP_PATH = "deployments/last_build/dummy_app/app.py"
REMOTE_APP_PATH = "/tmp/deployed_app.py"  # Upload location on localhost

def simulate_local_deployment():
    ssh_manager = SSHClientManager(host=HOST, username=USERNAME, key_path=KEY_PATH, port=PORT)

    try:
        print("Connecting to localhost SSH...")
        ssh_manager.connect()

        print(f"Uploading {LOCAL_APP_PATH} to {REMOTE_APP_PATH}...")
        ssh_manager.upload_file(local_path=LOCAL_APP_PATH, remote_path=REMOTE_APP_PATH)

        print("Running uploaded app remotely...")
        output = ssh_manager.execute_command(f"python3 {REMOTE_APP_PATH}")

        print("Command Output:")
        print(output)

    except Exception as e:
        print(f"Deployment simulation failed: {e}")
    finally:
        ssh_manager.close_connection()
        print("SSH connection closed.")

if __name__ == "__main__":
    simulate_local_deployment()
