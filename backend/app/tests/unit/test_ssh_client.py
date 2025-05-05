# tests/unit/test_ssh_client.py

import pytest
from unittest.mock import patch, MagicMock
from backend.app.controllers.ssh_client import SSHClientManager

# Dummy connection details
HOST = "dummy_host"
USERNAME = "dummy_user"
KEY_PATH = "/path/to/dummy_key"

@pytest.fixture
def ssh_client_manager():
    return SSHClientManager(host=HOST, username=USERNAME, key_path=KEY_PATH)

@patch('backend.app.controllers.ssh_client.paramiko.SSHClient')
def test_connect_success(mock_ssh_client, ssh_client_manager):
    mock_instance = mock_ssh_client.return_value
    ssh_client_manager.connect()
    mock_instance.connect.assert_called_once_with(
        hostname=HOST,
        username=USERNAME,
        key_filename=KEY_PATH,
        port=22,
        look_for_keys=False,
        allow_agent=False
    )

@patch('backend.app.controllers.ssh_client.paramiko.SSHClient')
def test_execute_command_success(mock_ssh_client, ssh_client_manager):
    mock_instance = mock_ssh_client.return_value
    mock_instance.exec_command.return_value = (None, MagicMock(), MagicMock())
    mock_stdout = mock_instance.exec_command.return_value[1]
    mock_stderr = mock_instance.exec_command.return_value[2]
    mock_stdout.read.return_value = b"Command output"
    mock_stderr.read.return_value = b""

    ssh_client_manager.client = mock_instance  # Pretend already connected
    output = ssh_client_manager.execute_command("ls")
    assert output == "Command output"

@patch('backend.app.controllers.ssh_client.paramiko.SSHClient')
def test_upload_file_success(mock_ssh_client, ssh_client_manager):
    mock_instance = mock_ssh_client.return_value
    mock_sftp = MagicMock()
    mock_instance.open_sftp.return_value = mock_sftp

    ssh_client_manager.client = mock_instance
    ssh_client_manager.sftp = mock_sftp
    ssh_client_manager.upload_file("local_path.txt", "remote_path.txt")

    mock_sftp.put.assert_called_once_with("local_path.txt", "remote_path.txt")

@patch('backend.app.controllers.ssh_client.paramiko.SSHClient')
def test_connection_failure(mock_ssh_client, ssh_client_manager):
    mock_instance = mock_ssh_client.return_value
    mock_instance.connect.side_effect = Exception("Connection failed")

    with pytest.raises(Exception, match="Failed to connect via SSH: Connection failed"):
        ssh_client_manager.connect()
