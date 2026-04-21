class HeuristicEngine:
    @staticmethod
    def evaluate(resource_data: dict) -> tuple[float, str]:
        """
        Evaluates URM resource data using rule-based heuristics.
        Returns: (waste_score, waste_tier)
        """
        score = 0.0
        r_type = resource_data.get("type", "")
        status = resource_data.get("status", "")
        cpu = resource_data.get("cpu_avg", 100.0)
        
        # 1. Zombie Volume Check
        if r_type == "EBS" and status == "Unattached":
            score += 100.0
            
        # 2. Idle EC2 Check
        elif r_type == "EC2":
            if status == "stopped":
                score += 50.0
            elif cpu is not None and cpu < 5.0:
                score += 80.0
                
        # 3. Orphaned RDS Snapshot Check
        elif r_type == "RDS_Snapshot" and status == "Orphaned":
            score += 90.0

        # 4. Idle ALB Check
        elif r_type == "ALB" and status == "Idle":
            score += 95.0
        
        # Determine Tier
        if score >= 90:
            tier = "CRITICAL"
        elif score >= 60:
            tier = "HIGH"
        elif score >= 30:
            tier = "MEDIUM"
        else:
            tier = "LOW"
            
        return score, tier
