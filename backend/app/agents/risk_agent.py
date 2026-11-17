from app.database.connection import get_db_connection


def calculate_risk():

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get pending recommendations
    cursor.execute(
        """
        SELECT
            id,
            resource_id,
            recommendation_type,
            estimated_savings,
            risk_level,
            confidence
        FROM recommendations
        WHERE status = 'pending'
        ORDER BY id;
        """
    )

    recommendations = cursor.fetchall()

    results = []

    for row in recommendations:

        (
            recommendation_id,
            resource_id,
            recommendation_type,
            estimated_savings,
            current_risk,
            current_confidence
        ) = row

        print("\nRESOURCE")
        print("-" * 60)
        print("Resource:", resource_id)
        print("Recommendation:", recommendation_type)
        print("Estimated savings:", estimated_savings)

        # ------------------------------------------------
        # RISK CALCULATION
        # ------------------------------------------------

        if recommendation_type == "STOP_INSTANCE":

            risk_level = "HIGH"
            confidence = 70

        elif recommendation_type == "DOWNSIZE_INSTANCE":

            risk_level = "MEDIUM"
            confidence = 80

        elif recommendation_type == "INVESTIGATE_OVERUTILIZATION":

            risk_level = "MEDIUM"
            confidence = 85

        elif recommendation_type == "MONITOR":

            risk_level = "LOW"
            confidence = 90

        else:

            risk_level = "LOW"
            confidence = 95

        # ------------------------------------------------
        # UPDATE DATABASE
        # ------------------------------------------------

        cursor.execute(
            """
            UPDATE recommendations
            SET
                risk_level = %s,
                confidence = %s
            WHERE id = %s
            """,
            (
                risk_level,
                confidence,
                recommendation_id
            )
        )

        results.append({
            "recommendation_id": recommendation_id,
            "resource_id": resource_id,
            "recommendation_type": recommendation_type,
            "risk_level": risk_level,
            "confidence": confidence
        })

        print("Risk level:", risk_level)
        print("Confidence:", confidence, "%")

    conn.commit()

    cursor.close()
    conn.close()

    return results


if __name__ == "__main__":

    print("\nRISK AGENT")
    print("=" * 60)

    results = calculate_risk()

    print("\n" + "=" * 60)
    print("Risk analysis completed.")
    print("Recommendations analyzed:", len(results))
