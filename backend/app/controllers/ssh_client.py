# backend/app/controllers/ssh_client.py

import paramiko
from paramiko import SSHException, AuthenticationException
from typing import Optional

class SSHClientManager:
    """
    SSH Client Manager for handling secure connections,
    command execution, and file uploads to remote servers.
    """

    def __init__(self, host: str, username: str, key_path: str, port: int = 22):
        self.host = host
        self.username = username
        self.key_path = key_path
        self.port = port
        self.client: Optional[paramiko.SSHClient] = None
        self.sftp: Optional[paramiko.SFTPClient] = None

    def connect(self):
        """Establish an SSH connection using the provided credentials."""
        try:
            self.client = paramiko.SSHClient()
            self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self.client.connect(
                hostname=self.host,
                username=self.username,
                key_filename=self.key_path,
                port=self.port,
                look_for_keys=False,
                allow_agent=False
            )
            self.sftp = self.client.open_sftp()
        except AuthenticationException as e:
            raise Exception(f"Authentication failed: {str(e)}")
        except SSHException as e:
            raise Exception(f"SSH connection failed: {str(e)}")
        except Exception as e:
            raise Exception(f"Failed to connect via SSH: {str(e)}")

    def execute_command(self, command: str) -> str:
        """
        Execute a command on the remote server.
        Returns the combined output (stdout + stderr).
        """
        if not self.client:
            raise Exception("SSH client is not connected.")
        
        stdin, stdout, stderr = self.client.exec_command(command)
        output = stdout.read().decode().strip()
        error = stderr.read().decode().strip()

        if error:
            # TODO: Log error cleanly to deployment logs
            return f"Error: {error}"
        
        return output

    def upload_file(self, local_path: str, remote_path: str):
        """
        Upload a file to the remote server.
        """
        if not self.sftp:
            raise Exception("SFTP session is not established.")
        
        self.sftp.put(local_path, remote_path)

    def close_connection(self):
        """Close the SSH and SFTP sessions."""
        if self.sftp:
            self.sftp.close()
        if self.client:
            self.client.close()

# TODO:
# - Add optional timeout/retry logic for commands.
# - Implement error logging into /deployments/logs/ (success/failure details).
# - Expand with async versions (optional later for multiple deployments).
# - Add a DeploymentManager wrapper to orchestrate multiple server deployments.
