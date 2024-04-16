from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from app import scraper

app = Flask(__name__)
CORS(app, origins=["chrome-extension://fkdmdfhfheecaenmflnakpnkpcgpgebo"])

@app.route('/scrape', methods=['POST', 'OPTIONS'], strict_slashes=False)
def scrape():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = 'chrome-extension://fkdmdfhfheecaenmflnakpnkpcgpgebo'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Max-Age'] = '3600' 
        response.status_code = 200 
        return response
    elif request.method == 'POST':
        data = request.json
        links = data['links']
        results = scraper.scrape_links(links)
        return jsonify(results), 200 
