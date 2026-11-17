from flask import Flask
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for frontend during development
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    from app.routes.dashboard import dashboard_bp
    app.register_blueprint(dashboard_bp)

    return app

app = create_app()

if __name__ == "__main__":
    print("=" * 60)
    print(" Cloud Optimizer Backend API Server (Multi-Agent FinOps)")
    print(" Running at http://127.0.0.1:5000")
    print(" API Documentation endpoints: /api/health, /api/dashboard/summary")
    print("=" * 60)
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
