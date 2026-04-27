from flask import Flask, request, jsonify
import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

vault_db = {}

@app.route('/lock', methods=['POST'])
def lock_item():
    data = request.json
    vault_id = str(len(vault_db) + 1000)
    
    vault_db[vault_id] = {
        "secret": data['secret'],
        "target_date": data['target_date'],
        "event_trigger": data['event_trigger']
    }
    
    return jsonify({"id": vault_id, "status": "locked"})

@app.route('/unlock/<vault_id>', methods=['GET'])
def unlock_item(vault_id):
    item = vault_db.get(vault_id)
    
    if not item:
        return jsonify({"error": "Vault not found"}), 404
    
    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    
    if current_date >= item['target_date']:
        return jsonify({"status": "unlocked", "secret": item['secret']})
    
    return jsonify({
        "status": "locked", 
        "message": f"Waiting for condition: {item['event_trigger']}"
    })

if __name__ == '__main__':
    app.run(port=5000)
