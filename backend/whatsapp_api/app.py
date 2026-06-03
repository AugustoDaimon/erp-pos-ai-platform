from flask import Flask, request, jsonify
import requests
import os
import unicodedata

app = Flask(__name__)

BASE_URL = os.environ.get("EVOLUTION_API_URL", "http://localhost:8080")
INSTANCE_NAME = os.environ.get("INSTANCE_NAME", "Whatsapp_BOT_Daimon")
GLOBAL_API_KEY = os.environ.get("API_KEY", "meu_token_secreto")

headers = {
    "apikey": GLOBAL_API_KEY,
    "Content-Type": "application/json"
}

MOCK_NUMBERS_EMPLOYEES = {"5511999999999", "5511888888888"}

known_senders = set()
lid_mapping = {}

def normalize_name(name):
    if not name:
        return "Cliente"
    nfkd = unicodedata.normalize('NFKD', name)
    return u"".join([c for c in nfkd if not unicodedata.combining(c)])

def fetch_contact_number(remote_jid):
    url = f"{BASE_URL}/chat/findContacts/{INSTANCE_NAME}"
    payload = {"where": {"id": remote_jid}}
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            dados = response.json()
            if isinstance(dados, list):
                for contato in dados:
                    if contato.get('id') == remote_jid:
                        num = contato.get('remoteJid', contato.get('number', ''))
                        return num.split('@')[0] if num else None
            elif isinstance(dados, dict):
                num = dados.get('remoteJid', dados.get('number', ''))
                return num.split('@')[0] if num else None
        return None
    except Exception:
        return None

def send_text(remote_jid, mensagem):
    url = f"{BASE_URL}/message/sendText/{INSTANCE_NAME}"
    payload = {
        "number": remote_jid, 
        "text": mensagem,     
        "delay": 1200,
        "presence": "composing"
    }
    try:
        resposta = requests.post(url, json=payload, headers=headers, timeout=10)
        if resposta.status_code == 201:
            print(f"[ENVIO DIRETO PYTHON] Mensagem enviada com sucesso para {remote_jid}")
        else:
            print(f"[ERRO NO ENVIO DIRETO] {resposta.text}")
    except Exception as e:
        print(f"[FATAL] Erro ao enviar mensagem direta: {e}")

def enviar_para_n8n(rota, payload_dados):
    n8n_url = f"http://n8n:5678/webhook/{rota}" 
    try:
        requests.post(n8n_url, json=payload_dados, timeout=5)
        print(f"[ROTEAMENTO] Dados enviados com sucesso para a rota: /{rota}")
    except Exception as e:
        print(f"[ERRO N8N] Falha ao enviar para o n8n na rota {rota}: {e}")

@app.route('/webhook', methods=['POST'])
def receber_mensagem():
    dados = request.json
    evento = dados.get("event")
    
    if evento == "messages.upsert":
        mensagem_obj = dados.get("data", {}).get("message", {})
        texto = mensagem_obj.get("conversation") or mensagem_obj.get("extendedTextMessage", {}).get("text")
        
        key_data = dados.get("data", {}).get("key", {})
        remote_jid = key_data.get("remoteJid")
        from_me = key_data.get("fromMe")
        sender_pn = key_data.get("senderPn")
        
        nome_bruto = dados.get("data", {}).get("pushName", "Cliente")
        nome_limpo = normalize_name(nome_bruto)

        if texto and remote_jid and not from_me:
            print(f"\n[RECEBIDO] MENSAGEM: {texto}")
            
            if sender_pn:
                numero_real = sender_pn.split('@')[0]
            elif "@lid" in remote_jid:
                if remote_jid in lid_mapping:
                    numero_real = lid_mapping[remote_jid]
                else:
                    numero_real = fetch_contact_number(remote_jid)
                    if numero_real:
                        lid_mapping[remote_jid] = numero_real
            else:
                numero_real = remote_jid.split('@')[0]

            if numero_real in MOCK_NUMBERS_EMPLOYEES:
                tipo_cliente = "funcionario"
            elif remote_jid in known_senders:
                tipo_cliente = "conhecido"
            else:
                known_senders.add(remote_jid)
                tipo_cliente = "novo"

            payload_n8n = {
                "remote_jid": remote_jid,
                "numero_real": numero_real,
                "nome_cliente": nome_limpo,
                "texto_mensagem": texto,
                "tipo_cliente": tipo_cliente
            }

            print(f"[SISTEMA] Disparando Webhook Único | Tipo identificado: {tipo_cliente.upper()}")
            
            enviar_para_n8n("entrada-whatsapp", payload_n8n)

    return jsonify({"status": "success"}), 200

@app.route('/n8n/enviar-mensagem', methods=['POST'])
def receber_comando_n8n():
    dados = request.json
    
    numero_destino = dados.get("numero")
    texto_mensagem = dados.get("texto")
    
    if not numero_destino or not texto_mensagem:
        print("[ERRO] Pedido do n8n incompleto. Faltando número ou texto.")
        return jsonify({"erro": "Parâmetros 'numero' e 'texto' são obrigatórios"}), 400

    print(f"\n[COMANDO N8N] Solicitando envio para {numero_destino}")
    print(f"[MENSAGEM] {texto_mensagem}")
    
    try:
        if "@" not in numero_destino:
            numero_destino = f"{numero_destino}@s.whatsapp.net"
            
        send_text(numero_destino, texto_mensagem)
        
        return jsonify({"status": "sucesso", "mensagem": "Comando repassado para Evolution API"}), 200
        
    except Exception as e:
        print(f"[ERRO NO REPASSE] {e}")
        return jsonify({"status": "erro", "detalhe": str(e)}), 500

if __name__ == '__main__':
    print("\n[START] Webhook Roteador Iniciado...", flush=True)
    app.run(host='0.0.0.0', port=5000)