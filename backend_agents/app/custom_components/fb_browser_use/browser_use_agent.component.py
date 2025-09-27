import json
import logging
import time
import asyncio
from typing import Any, Dict, Optional
import yaml

from langflow.custom import Component
from langflow.inputs import StrInput, SecretStrInput, FloatInput, IntInput, BoolInput, DataInput, \
    MultilineInput, MessageTextInput, DropdownInput, FileInput
from langflow.io import Output
from langflow.schema import Data


class BrowserUseAgentComponent(Component):
    display_name = "Browser Use Agent"
    description = "Run automated tests using Browser Use agent with AI-powered browser automation"
    documentation: str = "Execute test scenarios using Browser Use agent with support for multiple LLM providers"
    icon = "browser"
    name = "BrowserUseAgent"

    inputs = [
        DropdownInput(
            name="llm_provider",
            display_name="LLM Provider",
            info="Choose the LLM provider for the browser agent",
            options=["openai", "anthropic"],
            value="openai",
            required=True,
        ),
        SecretStrInput(
            name="api_key",
            display_name="LLM API Key",
            info="API key for the selected LLM provider",
            required=True,
        ),
        DropdownInput(
            name="model_name",
            display_name="Model Name",
            info="Choose the specific model",
            value="claude-sonnet-4-20250514",
            options=[
                # Anthropic
                "claude-sonnet-4-20250514",
                "claude-3-7-sonnet-20250219",
                # OpenAI
                "gpt-4.1",
                "gpt-4o",
                "gpt-4o-mini",
                # xAI
                "grok-code-fast-1",
                "grok-4-fast-reasoning",
                # Google
                "gemini-2.5-flash",
                "gemini-2.5-flash-lite",
                "gemini-2.0-flash",
                "gemini-2.0-flash-lite",
            ],
        ),
        MultilineInput(
            name="system_prompt",
            display_name="System Prompt",
            info="System instructions for the browser agent",
            tool_mode=True,
            value="""<role>You are an expert web automation testing agent specializing in executing test scenarios with precision and providing comprehensive feedback.</role>

<core_objectives>
- Execute browser automation tests following Given-When-Then methodology
- Provide detailed observations and outcomes for each action
- Ensure comprehensive test coverage and accurate result reporting
- Handle errors gracefully and provide actionable debugging information
</core_objectives>

<execution_guidelines>
<navigation>
- Wait for pages to fully load before proceeding
- Verify successful navigation by checking page title or key elements
- Handle redirects and dynamic content appropriately
</navigation>

<interactions>
- Use explicit waits for elements to become visible/clickable
- Verify element states before and after interactions
- Provide clear descriptions of what elements you're interacting with
- Handle dynamic content, modals, and pop-ups appropriately
</interactions>

<validation>
- Capture screenshots at key verification points
- Extract and validate specific content when checking results
- Verify expected outcomes match actual results
- Document any discrepancies or unexpected behaviors
</validation>
</execution_guidelines>

<error_handling>
- If an element is not found, try alternative selectors or wait longer
- If a page doesn't load, refresh and retry once
- If authentication fails, provide clear error details
- If unexpected pop-ups appear, handle them appropriately
- Always explain what went wrong and what was attempted
</error_handling>

<reporting_format>
<stage_mapping>
- Given: Initial setup, navigation, and preconditions
- When: User actions, interactions, and state changes
- Then: Validations, verifications, and outcome checks
</stage_mapping>

<action_documentation>
For each action, provide:
- Clear description of what you're doing
- Element identifiers used (ID, class, text content)
- Expected outcome vs actual outcome
- Any observations about page state or content
</action_documentation>

<final_output>
Structure your final result as JSON matching this schema:
{
  "test_id": "test-identifier",
  "status": "pass|fail|error",
  "summary": "Concise summary of test execution",
  "execution_time_ms": number,
  "start_timestamp": "ISO timestamp",
  "end_timestamp": "ISO timestamp",
  "stages": [
    {
      "stage": "Given|When|Then",
      "description": "Stage description",
      "actions": [
        {
          "action": "Specific action taken",
          "outcome": "success|failure",
          "details": "Detailed explanation"
        }
      ],
      "observations": "What was observed",
      "status": "pass|fail"
    }
  ]
}
</final_output>
</reporting_format>

<quality_standards>
- Be thorough but efficient in your testing approach
- Provide actionable feedback for any failures
- Maintain consistency in element selection strategies
- Document the testing process for future reference
- Ensure reproducible test execution
</quality_standards>""",
            required=False,
        ),
        MultilineInput(
            name="test_spec",
            display_name="Test Specification",
            info="Test specification file (YAML format) or test data",
            required=True,
        ),
        MessageTextInput(
            name="session_id",
            display_name="Session ID",
            info="Session ID for test tracking",
            value="",
            required=False,
        ),
        SecretStrInput(
            name="observability_api_key",
            display_name="Observability API Key (Optional)",
            info="API key for Laminar observability platform",
            required=False,
        ),
        FloatInput(
            name="temperature",
            display_name="Temperature",
            info="Controls randomness in LLM responses (0.0-1.0)",
            value=0.1,
            required=False,
        ),
        IntInput(
            name="max_steps",
            display_name="Max Steps",
            info="Maximum number of agent steps",
            value=100,
            required=False,
        ),
        IntInput(
            name="step_timeout",
            display_name="Step Timeout (seconds)",
            info="Timeout for each agent step",
            value=90.0,
            required=False,
        ),
        BoolInput(
            name="headless",
            display_name="Headless Mode",
            info="Run browser in headless mode",
            value=True,
        ),
        BoolInput(
            name="verbose",
            display_name="Verbose Logging",
            info="Enable detailed logging",
            value=True,
        ),
        BoolInput(
            name="flash_mode",
            display_name="Flash Mode",
            info="Enable flash mode for faster execution (skips LLM thinking)",
            value=False,
        ),
        StrInput(
            name="browser_size",
            display_name="Browser Window Size",
            info="Browser window size (e.g., '1280x720')",
            value="1280x720",
            required=False,
        ),
    ]

    outputs = [
        Output(display_name="Test Result", name="test_result", method="run_test"),
        Output(display_name="Success", name="success", method="get_success"),
    ]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.test_response = None
        self.test_success = False
        self.agent_result = None

        # Set up logging
        self.logger = logging.getLogger(f"{self.__class__.__name__}_{id(self)}")
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)

    def _setup_logging(self):
        """Set up logging level based on verbose setting"""
        if hasattr(self, 'verbose'):
            self.logger.setLevel(logging.INFO if self.verbose else logging.ERROR)

    def _debug_log(self, message: str, level: str = "INFO"):
        """Custom logging function with configurable log level"""
        self._setup_logging()

        level_mapping = {
            "DEBUG": logging.DEBUG,
            "INFO": logging.INFO,
            "WARNING": logging.WARNING,
            "WARN": logging.WARNING,
            "ERROR": logging.ERROR,
            "CRITICAL": logging.CRITICAL
        }

        log_level = level_mapping.get(level.upper(), logging.INFO)
        self.logger.log(log_level, message)

        if level in ["ERROR", "CRITICAL"] or (hasattr(self, 'verbose') and self.verbose):
            self.log(f"[{level}] {message}")

    def _check_dependencies(self):
        """Check if required dependencies are available"""
        import sys
        import importlib.util
        
        self._debug_log(f"Python path: {sys.path[:3]}...", "INFO")
        
        # Check browser_use package
        try:
            import browser_use
            self._debug_log(f"browser_use package found at: {browser_use.__file__}", "INFO")
            self._debug_log(f"browser_use version: {getattr(browser_use, '__version__', 'unknown')}", "INFO")
        except ImportError as e:
            self._debug_log(f"browser_use import failed: {str(e)}", "ERROR")
            # Check if package is installed using importlib
            spec = importlib.util.find_spec("browser_use")
            if spec is None:
                raise ImportError(
                    "browser-use package is not installed. "
                    "Please install it: pip install browser-use"
                )
            else:
                self._debug_log(f"browser_use spec found but import failed: {spec}", "ERROR")
                raise ImportError(f"browser_use import error: {str(e)}")
        
        # Check playwright package
        try:
            import playwright
            self._debug_log(f"playwright package found at: {playwright.__file__}", "INFO")
        except ImportError as e:
            self._debug_log(f"playwright import failed: {str(e)}", "WARN")
            # This is optional, so we won't fail the check
            self._debug_log("playwright not found but continuing - may be installed separately", "WARN")
        
        # Test specific browser_use imports
        try:
            from browser_use import Agent
            self._debug_log("Successfully imported Agent from browser_use", "INFO")
        except ImportError as e:
            self._debug_log(f"Failed to import Agent: {str(e)}", "ERROR")
            raise ImportError(f"Cannot import Agent from browser_use: {str(e)}")
            
        try:
            from browser_use import ChatOpenAI
            self._debug_log("Successfully imported ChatOpenAI from browser_use", "INFO")
        except ImportError as e:
            self._debug_log(f"Failed to import ChatOpenAI: {str(e)}", "ERROR")
            raise ImportError(f"Cannot import ChatOpenAI from browser_use: {str(e)}")
            
        try:
            from browser_use import ChatAnthropic
            self._debug_log("Successfully imported ChatAnthropic from browser_use", "INFO")
        except ImportError as e:
            self._debug_log(f"Failed to import ChatAnthropic: {str(e)}", "ERROR")
            raise ImportError(f"Cannot import ChatAnthropic from browser_use: {str(e)}")
            
        try:
            from browser_use import BrowserProfile
            self._debug_log("Successfully imported BrowserProfile from browser_use", "INFO")
        except ImportError as e:
            self._debug_log(f"Failed to import BrowserProfile: {str(e)}", "ERROR")
            raise ImportError(f"Cannot import BrowserProfile from browser_use: {str(e)}")
            
        self._debug_log("All browser_use dependencies check passed", "INFO")

    def _setup_observability(self):
        """Setup observability if API key is provided"""
        if hasattr(self, 'observability_api_key') and self.observability_api_key:
            try:
                from lmnr import Laminar, Instruments
                
                Laminar.initialize(
                    project_api_key=self.observability_api_key,
                    disabled_instruments={Instruments.BROWSER_USE}
                )
                self._debug_log("Observability configured with Laminar", "INFO")
            except ImportError:
                self._debug_log("Laminar package not found, skipping observability setup", "WARN")
            except Exception as e:
                self._debug_log(f"Failed to setup observability: {str(e)}", "WARN")

    def _create_llm_instance(self):
        """Create LLM instance based on provider"""
        try:
            self._debug_log(f"Creating LLM instance for provider: {self.llm_provider}", "INFO")
            
            if self.llm_provider == "openai":
                from browser_use import ChatOpenAI
                llm = ChatOpenAI(
                    model=self.model_name,
                    api_key=self.api_key,
                    temperature=self.temperature
                )
                self._debug_log("ChatOpenAI instance created successfully", "INFO")
            elif self.llm_provider == "anthropic":
                from browser_use import ChatAnthropic
                llm = ChatAnthropic(
                    model=self.model_name,
                    api_key=self.api_key,
                    temperature=self.temperature
                )
                self._debug_log("ChatAnthropic instance created successfully", "INFO")
            else:
                raise ValueError(f"Unsupported LLM provider: {self.llm_provider}")

            self._debug_log(f"LLM instance created: {self.llm_provider} - {self.model_name}", "INFO")
            return llm

        except ImportError as e:
            error_msg = f"Import error for {self.llm_provider} LLM: {str(e)}. Ensure browser-use is properly installed."
            self._debug_log(error_msg, "ERROR")
            raise Exception(error_msg)
        except Exception as e:
            error_str = str(e)
            if "Pydantic" in error_str and "TypeVar" in error_str:
                error_msg = f"Pydantic compatibility issue: {error_str}. Try: pip install 'pydantic>=2.0.0,<2.10.0'"
            else:
                error_msg = f"Error creating LLM instance: {error_str}"
            self._debug_log(error_msg, "ERROR")
            raise Exception(error_msg)

    def _parse_test_spec(self, test_spec: Any) -> Dict[str, Any]:
        """Parse and validate test specification"""
        try:
            self._debug_log("Parsing test specification...", "INFO")

            # Handle Data object
            if hasattr(test_spec, 'data'):
                data = test_spec.data
            else:
                data = test_spec

            # Handle string data (YAML or JSON)
            if isinstance(data, str):
                try:
                    # Try YAML first
                    parsed_data = yaml.safe_load(data)
                except yaml.YAMLError:
                    try:
                        # Fallback to JSON
                        parsed_data = json.loads(data)
                    except json.JSONDecodeError:
                        raise ValueError("Test spec must be valid YAML or JSON")
            else:
                parsed_data = data

            if not isinstance(parsed_data, dict):
                raise ValueError("Test specification must be a dictionary")

            # Validate required fields
            required_fields = ['test_id', 'app_url', 'scenarios']
            for field in required_fields:
                if field not in parsed_data:
                    raise ValueError(f"Missing required field in test spec: {field}")

            self._debug_log(f"Test spec validation passed: {parsed_data.get('test_id')}", "INFO")
            return parsed_data

        except Exception as e:
            self._debug_log(f"Test spec parsing failed: {str(e)}", "ERROR")
            raise

    def _create_browser_profile(self):
        """Create browser profile configuration"""
        try:
            from browser_use import BrowserProfile
            self._debug_log("BrowserProfile imported successfully", "INFO")

            # Parse browser size
            width, height = 1280, 720
            if hasattr(self, 'browser_size') and self.browser_size:
                try:
                    width, height = map(int, self.browser_size.split('x'))
                except ValueError:
                    self._debug_log(f"Invalid browser size format: {self.browser_size}, using default", "WARN")

            browser_profile = BrowserProfile(
                headless=self.headless,
                window_size={'width': width, 'height': height},
                minimum_wait_page_load_time=0.5,
                wait_between_actions=0.5,
            )

            self._debug_log(f"Browser profile created: {width}x{height}, headless={self.headless}", "INFO")
            return browser_profile

        except ImportError as e:
            error_msg = f"Import error for BrowserProfile: {str(e)}. Ensure browser-use is properly installed."
            self._debug_log(error_msg, "ERROR")
            raise Exception(error_msg)
        except Exception as e:
            error_msg = f"Error creating browser profile: {str(e)}"
            self._debug_log(error_msg, "ERROR")
            raise Exception(error_msg)

    def _generate_test_task(self, test_spec: Dict[str, Any]) -> str:
        """Generate task description from test specification"""
        try:
            task_parts = []
            
            # Add app URL
            task_parts.append(f"Navigate to: {test_spec['app_url']}")
            
            # Add scenarios
            for i, scenario in enumerate(test_spec.get('scenarios', []), 1):
                scenario_name = scenario.get('name', f'Scenario {i}')
                task_parts.append(f"\nScenario {i}: {scenario_name}")
                
                for j, step in enumerate(scenario.get('steps', []), 1):
                    step_type = step.get('type', 'Step')
                    description = step.get('description', '')
                    task_parts.append(f"  {step_type} {j}: {description}")

            # Add output format instruction
            task_parts.append(f"\n\nProvide output in the following JSON format:")
            task_parts.append(json.dumps(self._get_output_schema(), indent=2))

            task = '\n'.join(task_parts)
            self._debug_log(f"Generated task from test spec", "INFO")
            return task

        except Exception as e:
            error_msg = f"Error generating test task: {str(e)}"
            self._debug_log(error_msg, "ERROR")
            raise Exception(error_msg)

    def _get_output_schema(self) -> Dict[str, Any]:
        """Get the output schema for test results"""
        return {
            "test_id": "unique-test-id-123",
            "status": "pass|fail|error",
            "summary": "Test completion summary",
            "execution_time_ms": 4500,
            "start_timestamp": "2025-09-26T12:05:00Z",
            "end_timestamp": "2025-09-26T12:05:00Z",
            "stages": [
                {
                    "stage": "Given|When|Then",
                    "description": "Step description",
                    "actions": [
                        {
                            "action": "browser action taken",
                            "outcome": "success|failure",
                            "details": "Additional details or error messages"
                        }
                    ],
                    "observations": "What was observed during this stage",
                    "status": "pass|fail"
                }
            ]
        }

    async def _run_browser_agent(self, llm, browser_profile, task: str) -> Any:
        """Run the browser agent with the given task"""
        try:
            from browser_use import Agent
            self._debug_log("Agent imported successfully", "INFO")

            self._debug_log("Creating browser agent...", "INFO")

            # Create agent with configuration
            agent_kwargs = {
                'task': task,
                'llm': llm,
                'browser_profile': browser_profile,
            }

            # Add optional parameters
            if hasattr(self, 'system_prompt') and self.system_prompt:
                agent_kwargs['extend_system_message'] = self.system_prompt
                self._debug_log("Added system prompt to agent", "INFO")

            if hasattr(self, 'flash_mode') and self.flash_mode:
                agent_kwargs['flash_mode'] = True
                self._debug_log("Enabled flash mode", "INFO")

            agent = Agent(**agent_kwargs)
            self._debug_log("Agent instance created successfully", "INFO")

            self._debug_log("Starting agent execution...", "INFO")
            
            # Run agent with timeout and max steps
            result = await agent.run(
                max_steps=self.max_steps,
                # step_timeout=self.step_timeout  # Uncomment if supported by browser-use
            )

            self._debug_log("Agent execution completed successfully", "INFO")
            return result

        except ImportError as e:
            error_msg = f"Import error for Agent: {str(e)}. Ensure browser-use is properly installed."
            self._debug_log(error_msg, "ERROR")
            raise Exception(error_msg)
        except Exception as e:
            error_msg = f"Error running browser agent: {str(e)}"
            self._debug_log(error_msg, "ERROR")
            raise Exception(error_msg)

    def _parse_agent_result(self, history: Any, test_spec: Dict[str, Any], start_time: float) -> Dict[str, Any]:
        """Parse agent history into the expected output format"""
        try:
            end_time = time.time()
            execution_time = int((end_time - start_time) * 1000)
            
            self._debug_log("Parsing agent history result...", "INFO")
            
            # Extract information from AgentHistoryList
            try:
                # Get execution details
                visited_urls = history.urls() if hasattr(history, 'urls') else []
                action_names = history.action_names() if hasattr(history, 'action_names') else []
                extracted_content = history.extracted_content() if hasattr(history, 'extracted_content') else []
                errors = history.errors() if hasattr(history, 'errors') else []
                
                # Check completion status
                is_done = history.is_done() if hasattr(history, 'is_done') else False
                is_successful = history.is_successful() if hasattr(history, 'is_successful') else None
                has_errors = history.has_errors() if hasattr(history, 'has_errors') else False
                
                # Get final result
                final_result = history.final_result() if hasattr(history, 'final_result') else None
                
                # Get execution duration
                total_duration = history.total_duration_seconds() if hasattr(history, 'total_duration_seconds') else execution_time / 1000
                
                self._debug_log(f"Agent execution summary: done={is_done}, successful={is_successful}, errors={has_errors}", "INFO")
                
                # Try to extract structured output if available
                structured_output = None
                if hasattr(history, 'structured_output') and history.structured_output:
                    structured_output = history.structured_output
                    self._debug_log("Found structured output from agent", "INFO")
                
                # If we have structured output that matches our schema, use it
                if structured_output and isinstance(structured_output, dict):
                    if 'test_id' in structured_output and 'status' in structured_output:
                        self._debug_log("Using structured output from agent", "INFO")
                        return structured_output
                
                # Try to parse final result as JSON
                if final_result:
                    try:
                        if isinstance(final_result, str):
                            parsed_final = json.loads(final_result)
                            if isinstance(parsed_final, dict) and 'test_id' in parsed_final:
                                self._debug_log("Successfully parsed JSON from final result", "INFO")
                                return parsed_final
                    except (json.JSONDecodeError, TypeError):
                        pass
                
                # Create structured result from agent history
                status = "pass"
                if has_errors or not is_done:
                    status = "fail"
                elif is_successful is False:
                    status = "fail"
                
                # Build stages from action history
                stages = []
                actions_list = history.model_actions() if hasattr(history, 'model_actions') else []
                
                # Group actions into logical stages
                current_stage = {
                    "stage": "Given",
                    "description": "Initial navigation and setup",
                    "actions": [],
                    "observations": "",
                    "status": "pass"
                }
                
                for i, action in enumerate(actions_list):
                    action_name = action.get('action_name', 'unknown_action') if isinstance(action, dict) else str(action)
                    
                    # Determine stage type based on action
                    if i == 0 or 'goto' in action_name.lower() or 'navigate' in action_name.lower():
                        stage_type = "Given"
                    elif 'click' in action_name.lower() or 'type' in action_name.lower() or 'fill' in action_name.lower():
                        stage_type = "When"
                    else:
                        stage_type = "Then"
                    
                    # Create new stage if type changed
                    if current_stage["stage"] != stage_type and current_stage["actions"]:
                        stages.append(current_stage)
                        current_stage = {
                            "stage": stage_type,
                            "description": f"{stage_type} stage actions",
                            "actions": [],
                            "observations": "",
                            "status": "pass"
                        }
                    
                    current_stage["stage"] = stage_type
                    
                    # Add action to current stage
                    action_entry = {
                        "action": action_name,
                        "outcome": "success",
                        "details": str(action) if action else "No details available"
                    }
                    
                    # Check for errors in this action
                    if i < len(errors) and errors[i] is not None:
                        action_entry["outcome"] = "failure"
                        action_entry["details"] = str(errors[i])
                        current_stage["status"] = "fail"
                    
                    current_stage["actions"].append(action_entry)
                
                # Add the last stage
                if current_stage["actions"]:
                    stages.append(current_stage)
                
                # Add observations from extracted content
                if extracted_content:
                    for stage in stages:
                        if not stage["observations"]:
                            stage["observations"] = "Content extracted: " + str(extracted_content[0])[:100] + "..."
                            break
                
                # Build summary
                summary_parts = []
                if is_done:
                    summary_parts.append("Test execution completed")
                if visited_urls:
                    summary_parts.append(f"Visited {len(visited_urls)} URL(s)")
                if action_names:
                    summary_parts.append(f"Executed {len(action_names)} action(s)")
                if has_errors:
                    summary_parts.append("Some errors encountered")
                
                summary = ". ".join(summary_parts) if summary_parts else "Browser agent execution completed"
                
                structured_result = {
                    "test_id": test_spec.get('test_id', 'unknown'),
                    "status": status,
                    "summary": summary,
                    "execution_time_ms": int(total_duration * 1000),
                    "start_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(start_time)),
                    "end_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(end_time)),
                    "stages": stages if stages else [{
                        "stage": "Execution",
                        "description": "Browser agent execution",
                        "actions": [{
                            "action": "agent.run()",
                            "outcome": "success" if status == "pass" else "failure",
                            "details": summary
                        }],
                        "observations": "Agent completed execution",
                        "status": status
                    }]
                }
                
                # Add metadata about the execution
                if visited_urls:
                    structured_result["visited_urls"] = visited_urls
                if final_result:
                    structured_result["final_result"] = str(final_result)
                
                self._debug_log(f"Created structured result from agent history with {len(stages)} stages", "INFO")
                return structured_result
                
            except Exception as e:
                self._debug_log(f"Error extracting from agent history: {str(e)}", "WARN")
                # Fallback to basic result
                pass
            
            # Final fallback: create basic structured result
            fallback_result = {
                "test_id": test_spec.get('test_id', 'unknown'),
                "status": "pass" if self.test_success else "fail",
                "summary": f"Test execution completed. History object: {type(history).__name__}",
                "execution_time_ms": execution_time,
                "start_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(start_time)),
                "end_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(end_time)),
                "stages": [{
                    "stage": "Execution",
                    "description": "Browser agent execution",
                    "actions": [{
                        "action": "agent.run()",
                        "outcome": "success" if self.test_success else "failure",
                        "details": str(history)
                    }],
                    "observations": "Agent completed execution",
                    "status": "pass" if self.test_success else "fail"
                }]
            }
            
            self._debug_log("Created fallback structured result", "INFO")
            return fallback_result

        except Exception as e:
            error_msg = f"Error parsing agent result: {str(e)}"
            self._debug_log(error_msg, "ERROR")
            raise Exception(error_msg)

    def run_test(self) -> Data:
        """Main method to run browser test"""
        try:
            start_time = time.time()

            # Check dependencies
            self._check_dependencies()

            # Setup observability
            self._setup_observability()

            # Parse test specification
            test_spec = self._parse_test_spec(self.test_spec)

            # Create LLM instance
            llm = self._create_llm_instance()

            # Create browser profile
            browser_profile = self._create_browser_profile()

            # Generate task from test spec
            task = self._generate_test_task(test_spec)

            # Run browser agent
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                history = loop.run_until_complete(
                    self._run_browser_agent(llm, browser_profile, task)
                )
                self._debug_log(f"History object received: {type(history).__name__}", "INFO")
                
                # Determine success based on history
                if hasattr(history, 'is_successful'):
                    self.test_success = history.is_successful() if history.is_successful() is not None else True
                elif hasattr(history, 'is_done'):
                    self.test_success = history.is_done()
                else:
                    self.test_success = True  # Assume success if we got a result
                    
                # Check for errors
                if hasattr(history, 'has_errors') and history.has_errors():
                    self.test_success = False
                    
            finally:
                loop.close()

            # Parse and structure result
            structured_result = self._parse_agent_result(history, test_spec, start_time)

            # Store results
            self.test_response = history
            self.agent_result = structured_result

            elapsed_time = time.time() - start_time

            self._debug_log(f"🎉 Browser test completed successfully in {elapsed_time:.2f}s!", "INFO")

            return Data(data=structured_result)

        except Exception as e:
            # Store failure state
            self.test_success = False

            error_msg = f"Failed to run browser test: {str(e)}"
            self._debug_log(error_msg, "ERROR")

            # Return error information
            error_result = {
                "test_id": "error",
                "status": "error",
                "summary": error_msg,
                "execution_time_ms": 0,
                "start_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "end_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "stages": [
                    {
                        "stage": "Error",
                        "description": "Test execution failed",
                        "actions": [
                            {
                                "action": "component.run_test()",
                                "outcome": "failure",
                                "details": error_msg
                            }
                        ],
                        "observations": "Component error occurred",
                        "status": "fail"
                    }
                ]
            }

            return Data(data=error_result)

    def get_success(self) -> Data:
        """Get test execution success status"""
        return Data(data={"success": self.test_success})