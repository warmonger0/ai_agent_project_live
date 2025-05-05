import os
import json
from datetime import datetime
from app.controllers.ssh_client import SSHClientManager
from app.db.session import get_db_session  # ✅ For memory tracking
from app.db.tasks import add_memory_entry  # ✅ Memory ledger log
from typing import Dict

class DeploymentHandler:
    def __init__(self, host: str, username: str, key_path: str, port: int = 22):
        self.host = host
        self.username = username
        self.key_path = key_path
        self.port = port

    def deploy_application(self, local_path: str, remote_path: str, run_command: str) -> Dict[str, str]:
        """
        Full deployment orchestration:
        1. Connect to server.
        2. Upload file.
        3. Execute command.
        4. Save deployment result log.
        5. Write to memory ledger.
        6. Return clean result dict.
        """
        ssh_manager = SSHClientManager(
            host=self.host,
            username=self.username,
            key_path=self.key_path,
            port=self.port
        )
        
        try:
            ssh_manager.connect()
            ssh_manager.upload_file(local_path=local_path, remote_path=remote_path)
            output = ssh_manager.execute_command(run_command)

            result = {
                "status": "success",
                "message": output
            }

        except Exception as e:
            result = {
                "status": "failure",
                "message": str(e)
            }

        finally:
            ssh_manager.close_connection()
            self.save_deployment_log(result)
            self.write_to_memory_ledger(result, remote_path, run_command)

        return result

    def save_deployment_log(self, result: dict):
        """
        Save deployment result to a timestamped log file inside /deployments/logs/.
        """
        logs_dir = "deployments/logs"
        os.makedirs(logs_dir, exist_ok=True)

        timestamp = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
        log_filename = f"{logs_dir}/deployment_{timestamp}.log"

        with open(log_filename, "w") as log_file:
            json.dump(result, log_file, indent=4)

        print(f"Deployment log saved to: {log_filename}")

    def write_to_memory_ledger(self, result: dict, remote_path: str, command: str):
        """
        Add deployment result to memory ledger.
        """
        db = get_db_session()
        context = "deployment"
        message = f"Deployment {result['status'].upper()} — Command: `{command}` | Remote Path: `{remote_path}` | Output: {result['message']}"
        add_memory_entry(db, context, f"{self.host}:{remote_path}", message)
