from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import pandas as pd
import json
import random
import threading
import os
from app.utils.preprocessing import load_ml_assets, preprocess_input

# Try to import scapy
try:
    from scapy.all import sniff, IP, TCP, UDP
    SCAPY_AVAILABLE = True
except ImportError:
    SCAPY_AVAILABLE = False

router = APIRouter(prefix="/api/live", tags=["live"])

# Load ML assets
xgb_model, scaler, feature_cols = load_ml_assets()

class RealTimeSniffer:
    def __init__(self):
        self.stop_event = threading.Event()
        self.packet_queue = []
        self.thread = None

    def packet_callback(self, pkt):
        if IP in pkt:
            try:
                # Basic real features
                proto_name = "TCP" if TCP in pkt else ("UDP" if UDP in pkt else "OTHER")
                sbytes = len(pkt)
                sttl = pkt[IP].ttl
                
                # Prepare feature dict with defaults for all model features
                input_data = {col: 0 for col in feature_cols}
                input_data['sbytes'] = sbytes
                input_data['sttl'] = sttl
                input_data['dur'] = 0.001
                
                # Preprocess and Predict
                processed_df = preprocess_input(input_data, scaler, feature_cols)
                pred = xgb_model.predict(processed_df)[0]
                prob = float(xgb_model.predict_proba(processed_df)[0].max())
                
                payload = {
                    "id": random.getrandbits(32),
                    "timestamp": pd.Timestamp.now().strftime("%H:%M:%S"),
                    "proto": proto_name,
                    "service": "-",
                    "state": "LIVE",
                    "sbytes": sbytes,
                    "dbytes": 0,
                    "result": "Attack" if pred == 1 else "Normal",
                    "confidence": round(prob * 100, 2)
                }
                self.packet_queue.append(payload)
                if len(self.packet_queue) > 10: self.packet_queue.pop(0)
            except Exception:
                pass

    def start(self):
        self.stop_event.clear()
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()

    def _run(self):
        try:
            sniff(prn=self.packet_callback, store=0, stop_filter=lambda x: self.stop_event.is_set())
        except Exception as e:
            print(f"Sniffer Error: {e}")

    def stop(self):
        self.stop_event.set()

sniffer = RealTimeSniffer()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Check if we can use real sniffing
    active_sniffing = SCAPY_AVAILABLE
    if active_sniffing:
        sniffer.start()

    try:
        while True:
            if active_sniffing and sniffer.packet_queue:
                data = sniffer.packet_queue.pop(0)
                await websocket.send_text(json.dumps(data))
            else:
                # Fallback to simulation if real sniffing fails or no packets
                dataset_path = "../dataset/UNSW_NB15_testing-set.csv"
                if os.path.exists(dataset_path):
                    df = pd.read_csv(dataset_path)
                    row = df.sample(n=1).iloc[0].to_dict()
                    processed_df = preprocess_input(row, scaler, feature_cols)
                    pred = xgb_model.predict(processed_df)[0]
                    prob = float(xgb_model.predict_proba(processed_df)[0].max())
                    
                    payload = {
                        "id": random.getrandbits(32),
                        "timestamp": pd.Timestamp.now().strftime("%H:%M:%S"),
                        "proto": str(row.get('proto', 'TCP')),
                        "service": str(row.get('service', 'dns')),
                        "state": "SIMULATED",
                        "sbytes": int(row.get('sbytes', 0)),
                        "dbytes": int(row.get('dbytes', 0)),
                        "result": "Attack" if pred == 1 else "Normal",
                        "confidence": round(prob * 100, 2)
                    }
                    await websocket.send_text(json.dumps(payload))
                
            await asyncio.sleep(2)
            
    except WebSocketDisconnect:
        if active_sniffing: sniffer.stop()
    except Exception as e:
        print(f"WS Error: {e}")
