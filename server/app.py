from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from flask_cors import CORS # type: ignore

# Load environment variables from .env file
load_dotenv(override=True)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Disable CORS

@app.route('/create_note', methods=['POST'])
def create_note():
  data = request.json
  filename = data.get('filename')
  content = data.get('content')

  print (f"Filename: {filename}")
  print (f"Content: {content}")
  
  if not filename or not content:
    return jsonify({"error": "Filename and content are required"}), 400

  vault_path = os.getenv('OBSIDIAN_VAULT_PATH')
  if not vault_path:
    return jsonify({"error": "OBSIDIAN_VAULT_PATH environment variable is not set"}), 500

  file_path = os.path.join(vault_path, filename)

  print(f"Writing to file: {file_path}")
  
  try:
    with open(file_path, 'w') as file:
      file.write(content)
      print(f"Note created with content: {content}")
    return jsonify({"message": "Note created successfully"}), 201
  except Exception as e:
    return jsonify({"error": str(e)}), 500
  
@app.route('/status', methods=['GET'])
def status():
  return jsonify({"status": "Server is running"}), 200

if __name__ == '__main__':
  port = int(os.getenv('PORT', 5050))
  print(f"OBSIDIAN_VAULT_PATH: {os.getenv('OBSIDIAN_VAULT_PATH')}")
  print(f"PORT: {os.getenv('PORT', 5050)}")
  app.run(host='0.0.0.0', port=port)