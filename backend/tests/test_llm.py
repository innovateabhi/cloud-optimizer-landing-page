from app.llm.ollama_client import generate


prompt = """
You are an AWS cloud cost optimization assistant.

Explain why stopping an unused EC2 instance can reduce AWS costs.

Give a short answer suitable for a cloud monitoring dashboard.
"""


result = generate(prompt)

print("\nLLM RESULT")
print("=" * 60)
print(result)
