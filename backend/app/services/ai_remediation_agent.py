import structlog

logger = structlog.get_logger()


class AIRemediationAgent:
    """
    AI Remediation Agent that generates Terraform remediation scripts.
    Falls back to template-based generation when LLM is unavailable.
    """
    def __init__(self):
        self.llm = None
        self.chain = None
        try:
            from langchain.prompts import PromptTemplate
            from langchain_openai import ChatOpenAI
            from langchain_core.output_parsers import StrOutputParser

            self.llm = ChatOpenAI(temperature=0, model="gpt-4-turbo-preview")
            self.remediation_prompt = PromptTemplate(
                input_variables=["cloud_provider", "vulnerability", "resource_id", "context"],
                template="""You are a Senior Cloud Security Architect and DevOps Engineer.
Your task is to generate an exact Terraform script to automatically remediate a cloud vulnerability.

VULNERABILITY DETAILS:
- Cloud Provider: {cloud_provider}
- Vulnerability: {vulnerability}
- Resource ID: {resource_id}
- Additional Context: {context}

REQUIREMENTS:
1. Output ONLY valid Terraform HCL code. No markdown formatting blocks (like ```hcl), no explanations, no greetings.
2. The code must perfectly target the specified resource to close the vulnerability.
3. Ensure zero-trust security best practices are enforced.
4. If a specific provider block is needed, include it.

TERRAFORM CODE:"""
            )
            self.chain = self.remediation_prompt | self.llm | StrOutputParser()
            logger.info("AI Remediation Agent initialized with LLM")
        except Exception as e:
            logger.warning(f"LLM unavailable, using template fallback: {e}")

    async def generate_terraform_fix(self, cloud_provider: str, vulnerability: str, resource_id: str, context: str) -> str:
        """
        Runs the LangChain agent to generate the Terraform remediation script.
        Falls back to template if LLM is unavailable.
        """
        if self.chain:
            try:
                terraform_code = await self.chain.ainvoke({
                    "cloud_provider": cloud_provider,
                    "vulnerability": vulnerability,
                    "resource_id": resource_id,
                    "context": context
                })
                return terraform_code.strip()
            except Exception as e:
                logger.error(f"LLM call failed: {e}")

        # Template fallback
        return f"""# Auto-Generated Remediation Plan
# Provider: {cloud_provider}
# Resource: {resource_id}
# Issue: {vulnerability}

resource "null_resource" "remediation_{resource_id.replace('-', '_')}" {{
  provisioner "local-exec" {{
    command = "echo 'Remediation for {vulnerability} on {resource_id}'"
  }}
}}

# NOTE: This is a template. Configure your LLM (OPENAI_API_KEY) for AI-generated Terraform."""


# Singleton instance
ai_remediation_agent = AIRemediationAgent()
