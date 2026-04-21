import json
import structlog

logger = structlog.get_logger()


class AIRecommendation:
    """Structured AI recommendation output."""
    def __init__(self, issue, recommendation, terraform_code, estimated_savings, priority, confidence, reasoning):
        self.issue = issue
        self.recommendation = recommendation
        self.terraform_code = terraform_code
        self.estimated_savings = estimated_savings
        self.priority = priority
        self.confidence = confidence
        self.reasoning = reasoning

    def model_dump(self):
        return {
            "issue": self.issue,
            "recommendation": self.recommendation,
            "terraform_code": self.terraform_code,
            "estimated_savings": self.estimated_savings,
            "priority": self.priority,
            "confidence": self.confidence,
            "reasoning": self.reasoning,
        }


class AIEngine:
    def __init__(self):
        self.llm = None
        self.chain = None
        try:
            from langchain.prompts import PromptTemplate
            from langchain_openai import ChatOpenAI
            from langchain.output_parsers import PydanticOutputParser
            from pydantic import BaseModel, Field

            class AIRecPydantic(BaseModel):
                issue: str = Field(description="Short description of the identified issue")
                recommendation: str = Field(description="Detailed recommendation to resolve the issue")
                terraform_code: str = Field(description="Terraform destroy or modify script to optimize cost while maintaining a 0% risk profile")
                estimated_savings: str = Field(description="Estimated monthly savings as a string (e.g. '$120')")
                priority: str = Field(description="HIGH | MEDIUM | LOW")
                confidence: float = Field(description="Confidence score from 0.0 to 1.0 (or 0-100 mapped to 0.0-1.0)")
                reasoning: str = Field(description="Reasoning block explaining the decision")

            self.llm = ChatOpenAI(temperature=0.1, model="gpt-4-turbo-preview")
            self.parser = PydanticOutputParser(pydantic_object=AIRecPydantic)
            self.prompt = PromptTemplate(
                template="""You are a CloudPulse Pro AI Agent. Analyze this AWS resource: {resource_data}. 
Generate a Terraform destroy or modify script to optimize cost while maintaining a 0% risk profile. 
Include a Reasoning block explaining the decision, an Estimated Monthly Savings figure, and a Confidence Score (0-100).

HEURISTIC DATA:
Score: {heuristic_score}
Tier: {heuristic_tier}

{format_instructions}
""",
                input_variables=["resource_data", "heuristic_score", "heuristic_tier"],
                partial_variables={"format_instructions": self.parser.get_format_instructions()}
            )
            self.chain = self.prompt | self.llm | self.parser
            logger.info("AI Engine initialized with LLM")
        except Exception as e:
            logger.warning(f"LLM unavailable for AI Engine, using heuristic fallback: {e}")

    async def analyze_resource(self, resource_data: dict, heuristic_score: float, heuristic_tier: str) -> dict:
        if self.chain:
            try:
                result = await self.chain.ainvoke({
                    "resource_data": json.dumps(resource_data),
                    "heuristic_score": heuristic_score,
                    "heuristic_tier": heuristic_tier
                })
                return result.model_dump()
            except Exception as e:
                logger.error(f"AI Engine LLM failure: {e}")

        return self._heuristic_fallback(resource_data, heuristic_score, heuristic_tier)

    def _heuristic_fallback(self, resource_data: dict, score: float, tier: str) -> dict:
        return {
            "issue": f"Automated Heuristic Detection: {resource_data.get('type')} anomaly",
            "recommendation": "Review resource usage",
            "terraform_code": f"# Manual review required for {resource_data.get('resource_id')}",
            "estimated_savings": "Unknown",
            "priority": "HIGH" if score >= 60 else "MEDIUM",
            "confidence": 0.5,
            "reasoning": "Fell back to rule-based engine due to AI unavailability."
        }

ai_engine = AIEngine()
