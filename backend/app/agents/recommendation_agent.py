from app.database.connection import get_db_connection
from app.llm.ollama_client import generate


def generate_recommendations():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            resource_id,
            recommendation_type,
            recommendation,
            estimated_savings,
            risk_level,
            confidence
        FROM recommendations
        WHERE status = 'pending'
        ORDER BY id;
        """
    )

    rows = cursor.fetchall()

    results = []

    for row in rows:

        (
            recommendation_id,
            resource_id,
            recommendation_type,
            existing_recommendation,
            estimated_savings,
            risk_level,
            confidence
        ) = row

        estimated_savings = float(estimated_savings or 0)
        confidence = float(confidence or 0)

        print("\nRESOURCE")
        print("=" * 60)

        print("Resource:", resource_id)
        print("Optimization:", recommendation_type)
        print("Risk:", risk_level)
        print("Confidence:", confidence, "%")
        print(
            "Estimated savings:",
            round(estimated_savings, 4),
            "USD/month"
        )

        # ------------------------------------------------
        # BUILD LLM PROMPT
        # ------------------------------------------------

        prompt = f"""
You are an AWS Cloud Cost Optimization Agent.

Analyze the following AWS resource:

Resource ID: {resource_id}
Optimization type: {recommendation_type}
Estimated monthly savings: ${estimated_savings:.4f}
Risk level: {risk_level}
Confidence: {confidence}%

Existing analysis:
{existing_recommendation}

Generate a concise recommendation for a cloud monitoring dashboard.

Rules:
- Do not invent AWS metrics.
- Do not invent costs.
- Do not claim an action was executed.
- Clearly explain what should be done.
- Mention the estimated savings when relevant.
- Mention the risk level.
- If the recommendation is NO_ACTION, clearly say that no action is required.
- Keep the response under 100 words.
"""

        print("\nGenerating LLM recommendation...")

        try:

            llm_recommendation = generate(prompt)

        except Exception as e:

            print("LLM ERROR:", e)

            llm_recommendation = existing_recommendation

        # ------------------------------------------------
        # DETERMINE ACTION
        # ------------------------------------------------

        if recommendation_type == "STOP_INSTANCE":
            action = "STOP"

        elif recommendation_type == "DOWNSIZE_INSTANCE":
            action = "DOWNSIZE"

        elif recommendation_type == "MONITOR":
            action = "MONITOR"

        elif recommendation_type == "INVESTIGATE_OVERUTILIZATION":
            action = "INVESTIGATE"

        else:
            action = "NO_ACTION"

        # ------------------------------------------------
        # PRINT RESULT
        # ------------------------------------------------

        print("\nLLM RECOMMENDATION")
        print("-" * 60)
        print(llm_recommendation)

        print("\nACTION:", action)

        results.append({
            "recommendation_id": recommendation_id,
            "resource_id": resource_id,
            "recommendation_type": recommendation_type,
            "action": action,
            "recommendation": llm_recommendation,
            "estimated_savings": estimated_savings,
            "risk_level": risk_level,
            "confidence": confidence
        })

    cursor.close()
    conn.close()

    return results


if __name__ == "__main__":

    print("\nLLM RECOMMENDATION AGENT")
    print("=" * 60)

    results = generate_recommendations()

    print("\n" + "=" * 60)
    print("LLM recommendation generation completed.")
    print("Recommendations:", len(results))
