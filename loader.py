import os, re, yaml
from pathlib import Path
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

def load_agents(path="agent_config.yaml"):
    raw = Path(path).read_text()
    def sub(m):
        val = os.getenv(m.group(1))
        if not val:
            raise RuntimeError(f"Missing env var: {m.group(1)}")
        return val
    return yaml.safe_load(re.sub(r"\$\{(\w+)\}", sub, raw))["agents"]