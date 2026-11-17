from datetime import datetime

from app.aws.client import get_ec2_client
from app.database.connection import get_db_connection


def execute_approved_actions():

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get actions that have been explicitly approved
    cursor.execute(
        """
        SELECT
            id,
            resource_id,
            action_type,
            reason,
            risk_level
        FROM actions
        WHERE action_status = 'approved'
        ORDER BY id;
        """
    )

    actions = cursor.fetchall()

    results = []

    for row in actions:

        (
            action_id,
            resource_id,
            action_type,
            reason,
            risk_level
        ) = row

        print("\nACTION")
        print("=" * 60)

        print("Action ID:", action_id)
        print("Resource:", resource_id)
        print("Action:", action_type)
        print("Risk:", risk_level)

        # ------------------------------------------------
        # SAFETY CHECK
        # ------------------------------------------------

        if risk_level == "HIGH":

            print("HIGH RISK ACTION")

            print(
                "Execution requires explicit approval."
            )

        # ------------------------------------------------
        # EC2 CLIENT
        # ------------------------------------------------

        ec2 = get_ec2_client()

        try:

            # --------------------------------------------
            # STOP EC2
            # --------------------------------------------

            if action_type == "STOP":

                print("Stopping EC2 instance...")

                response = ec2.stop_instances(
                    InstanceIds=[resource_id]
                )

                new_state = response["StoppingInstances"][0][
                    "CurrentState"
                ]["Name"]

                print("New state:", new_state)

            # --------------------------------------------
            # START EC2
            # --------------------------------------------

            elif action_type == "START":

                print("Starting EC2 instance...")

                response = ec2.start_instances(
                    InstanceIds=[resource_id]
                )

                new_state = response["StartingInstances"][0][
                    "CurrentState"
                ]["Name"]

                print("New state:", new_state)

            # --------------------------------------------
            # REBOOT EC2
            # --------------------------------------------

            elif action_type == "REBOOT":

                print("Rebooting EC2 instance...")

                ec2.reboot_instances(
                    InstanceIds=[resource_id]
                )

                new_state = "rebooting"

            # --------------------------------------------
            # UNSUPPORTED ACTION
            # --------------------------------------------

            else:

                print(
                    "Unsupported action:",
                    action_type
                )

                cursor.execute(
                    """
                    UPDATE actions
                    SET action_status = 'failed',
                        executed_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                    """,
                    (action_id,)
                )

                results.append({
                    "action_id": action_id,
                    "resource_id": resource_id,
                    "status": "failed"
                })

                continue

            # ------------------------------------------------
            # SUCCESS
            # ------------------------------------------------

            cursor.execute(
                """
                UPDATE actions
                SET
                    action_status = 'executed',
                    executed_at = CURRENT_TIMESTAMP
                WHERE id = %s
                """,
                (action_id,)
            )

            results.append({
                "action_id": action_id,
                "resource_id": resource_id,
                "action": action_type,
                "status": "executed"
            })

            print("Status: EXECUTED")

        except Exception as e:

            print("Execution failed:", e)

            cursor.execute(
                """
                UPDATE actions
                SET
                    action_status = 'failed',
                    executed_at = CURRENT_TIMESTAMP
                WHERE id = %s
                """,
                (action_id,)
            )

            results.append({
                "action_id": action_id,
                "resource_id": resource_id,
                "action": action_type,
                "status": "failed",
                "error": str(e)
            })

    conn.commit()

    cursor.close()
    conn.close()

    return results


if __name__ == "__main__":

    print("\nEXECUTION AGENT")
    print("=" * 60)

    results = execute_approved_actions()

    print("\n" + "=" * 60)
    print("Execution completed.")
    print("Actions processed:", len(results))
