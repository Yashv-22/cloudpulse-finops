import random

class MockMultiCloudEngine:
    @staticmethod
    def get_multi_cloud_data():
        """
        Simulates data collection across AWS, GCP, and Azure for arbitrage and dashboard visualization.
        """
        return {
            "spend_trends": {
                "aws": [random.randint(1000, 1500) for _ in range(7)],
                "gcp": [random.randint(500, 900) for _ in range(7)],
                "azure": [random.randint(800, 1200) for _ in range(7)]
            },
            "arbitrage_opportunities": [
                {
                    "resource": "EC2 m5.large (AWS)",
                    "aws_cost": 70.08,
                    "gcp_equivalent": "e2-standard-2 (GCP)",
                    "gcp_cost": 48.91,
                    "savings_percent": 30.2,
                    "recommendation": "Migrate workload from AWS us-east-1 to GCP us-central1"
                },
                {
                    "resource": "RDS db.r5.xlarge (AWS)",
                    "aws_cost": 340.50,
                    "azure_equivalent": "Standard_E4s_v3 (Azure)",
                    "azure_cost": 290.10,
                    "savings_percent": 14.8,
                    "recommendation": "Migrate database to Azure SQL Database"
                }
            ],
            "greenops": {
                "total_carbon_g": random.randint(100, 300),
                "regional_intensity": {
                    "us-east-1": "High (450g CO2/kWh)",
                    "eu-north-1": "Low (12g CO2/kWh)"
                },
                "suggestion": "Migrate batch processing from us-east-1 to eu-north-1 to reduce carbon footprint by 95%."
            },
            "zombie_resources": {
                "unattached_ebs": random.randint(5, 20),
                "idle_elbs": random.randint(1, 5),
                "orphaned_snapshots": random.randint(20, 100)
            },
            "compliance_index": 68
        }
