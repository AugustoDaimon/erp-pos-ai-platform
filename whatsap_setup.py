import requests
import base64
from PIL import Image
import io

BASE_URL = "http://localhost:8080" 
GLOBAL_API_KEY = "meu_token_secreto" 
INSTANCE_NAME = "Whatsapp_BOT_Daimon"
URL_NGROK = "https://uxoriously-schizomycetous-ola.ngrok-free.dev/webhook"

headers = {
    "apikey": GLOBAL_API_KEY,
    "Content-Type": "application/json"
}

def create_instance():
    create_url = f"{BASE_URL}/instance/create"
    create_payload = {
        "instanceName": INSTANCE_NAME, 
        "token": "daimon123", 
        "integration": "WHATSAPP-BAILEYS"
    }

    try:
        requests.post(create_url, json=create_payload, headers=headers)
        
        print("Buscando QR Code...")
        connect_url = f"{BASE_URL}/instance/connect/{INSTANCE_NAME}"
        response = requests.get(connect_url, headers=headers)
        response.raise_for_status() 
        
        dados = response.json()

        qrcode_base64 = dados.get("base64")
        if qrcode_base64 and "," in qrcode_base64:
            base64_data = qrcode_base64.split(",")[1]
            img_data = base64.b64decode(base64_data)
            image = Image.open(io.BytesIO(img_data))
            image.show()
            print("Conexão efetuada com sucesso! Escaneie a imagem.")
        else:
            print("A instância já parece estar conectada (QR Code não retornado).")

    except Exception as e:
        print(f"Ocorreu um erro na criação/conexão: {e}")

def listen_messages():
    url = f"{BASE_URL}/webhook/set/{INSTANCE_NAME}"
    
    payload = {
        "webhook": {
            "enabled": True,
            "url": URL_NGROK,
            "webhook_by_events": False,
            "events": ["MESSAGES_UPSERT"]
        }
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        print("Configuração de Webhook:", response.json())
    except Exception as e:
        print(f"Erro no webhook: {e}")

create_instance()
input("Após escanear o QR Code, pressione Enter para configurar o Webhook...")
listen_messages()