from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / ".forgejo" / "workflows" / "control-gateway-secret-bootstrap.yml"


class ControlGatewayBootstrapContractTest(unittest.TestCase):
    def test_bootstrap_has_no_secret_input(self):
        text = WORKFLOW.read_text()
        self.assertIn("request_id:", text)
        self.assertNotIn("gateway_token:", text.lower())
        self.assertNotIn("vercel_token", text.lower())

    def test_bootstrap_is_exact_vault_role_and_path(self):
        text = WORKFLOW.read_text()
        self.assertIn("VAULT_ROLE: tayoca-control-gateway-bootstrap", text)
        self.assertIn("VAULT_AUDIENCE: vault://tayoca/control-gateway-bootstrap", text)
        self.assertIn("VAULT_PATH: temitayo/staging/platform-tools/n8n/tayoca-control-gateway", text)

    def test_bootstrap_stages_before_any_vercel_change(self):
        text = WORKFLOW.read_text()
        self.assertIn('state\": \"staged\"', text)
        self.assertIn("vercel_changed=no; runtime_changed=no", text)
        self.assertNotIn("VERCEL_EDIT_PROJECT_ENV", text)
        self.assertNotIn("VERCEL_GET_PROJECT_ENV", text)
        self.assertIn("VERCEL_FILTER_PROJECT_ENVS", text)
        self.assertIn('"decrypt": "false"', text)

    def test_composio_key_is_secret_backed(self):
        text = WORKFLOW.read_text()
        self.assertIn("COMPOSIO_API_KEY: ${{ secrets.COMPOSIO_API_KEY }}", text)
        self.assertIn("set +x", text)


if __name__ == "__main__":
    unittest.main()
