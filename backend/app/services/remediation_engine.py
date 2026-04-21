import networkx as nx
from typing import List, Dict
import structlog
from app.services.ai_remediation_agent import AIRemediationAgent

logger = structlog.get_logger()

class RemediationEngine:
    def __init__(self):
        self.dependency_graph = nx.DiGraph()
        self.ai_remediation = AIRemediationAgent()
        
    def build_graph(self, resources: List[dict]):
        """
        Builds a dependency graph to prevent unsafe deletions.
        Edges represent dependencies (e.g., EC2 -> EBS).
        """
        self.dependency_graph.clear()
        for r in resources:
            self.dependency_graph.add_node(r['resource_id'], type=r['type'])
            # Mock Dependency resolution (In prod, infer from AWS tags/associations)
            if r['type'] == 'EBS' and r.get('attached_to'):
                self.dependency_graph.add_edge(r['attached_to'], r['resource_id'])
                
    def is_safe_to_remediate(self, resource_id: str) -> bool:
        """
        Uses BFS traversal to check if deleting this resource breaks dependencies.
        """
        if resource_id not in self.dependency_graph:
            return True
            
        dependents = list(self.dependency_graph.successors(resource_id))
        if dependents:
            logger.warning(f"Unsafe remediation: {resource_id} has dependents {dependents}")
            return False
            
        return True
        
    async def generate_remediation(self, resource_id: str, issue_details: str) -> str:
        """
        Generates Terraform code using the AI agent, wrapped with safety checks.
        """
        is_safe = self.is_safe_to_remediate(resource_id)
        if not is_safe:
            return "# REMEDIATION BLOCKED: Dependency Graph violation. This resource has active dependents."
            
        # Delegate to existing LangChain agent to generate the specific fix
        return await self.ai_remediation.generate_terraform_fix(
            cloud_provider="AWS",
            vulnerability=issue_details,
            resource_id=resource_id,
            context="Zero-touch FinOps action."
        )

remediation_engine = RemediationEngine()
