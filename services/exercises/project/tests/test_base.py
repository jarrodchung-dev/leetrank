import json
import unittest

from project.tests.base import BaseTestCase


class TestBaseBlueprint(BaseTestCase):
    
    def test_ping(self):
        """Ensures the /ping route behaves as expected."""
        response = self.client.get(
            "/base/ping",
            headers={"Authorization": "Bearer test"}
        )
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn("pong!", data["message"])
        self.assertIn("success", data["status"])
    
    def test_ping_no_header(self):
        """Ensure error is thrown if "Authorization" header is empty."""
        response = self.client.get("/base/ping")
        data = json.loads(response.data.decode())
        self.assertIn("Provide a valid auth token.", data["message"])
        self.assertIn("error", data["status"])


if __name__ == "__main__":
    unittest.main()